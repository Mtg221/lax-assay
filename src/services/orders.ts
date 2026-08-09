import {
  collection,
  doc,
  runTransaction,
  getDocs,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderStatus, Product } from "@/types";
import type { CartLine } from "@/contexts/CartContext";
import { effectivePrice } from "./products";

export interface PlaceOrderInput {
  customerName: string;
  phone: string;
  whatsapp: string;
  country: string;
  zone: string;
  address: string;
  comment?: string;
  shippingCost: number;
  lines: Pick<CartLine, "productId" | "colorId" | "colorName" | "quantity">[];
}

/**
 * Places an order atomically:
 * 1. Re-reads every product server-side (never trusts frontend price/stock).
 * 2. Verifies each color still has enough stock.
 * 3. Computes the real price (including active promotions) at this instant.
 * 4. Decrements stock — never below zero.
 * 5. Allocates a unique sequential order number (LAX-YYYY-NNNNNN) via a counter doc.
 * All of this happens in a single Firestore transaction so concurrent
 * checkouts on low stock can never oversell.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<{ orderNumber: string; orderId: string }> {
  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", `orders-${year}`);
  const orderRef = doc(collection(db, "orders"));

  const result = await runTransaction(db, async (tx) => {
    // --- Read phase ---
    const productRefs = input.lines.map((l) => doc(db, "products", l.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));
    const counterSnap = await tx.get(counterRef);

    const orderItems: Order["items"] = [];
    let subtotal = 0;
    const stockUpdates: { ref: (typeof productRefs)[number]; colors: Product["colors"] }[] = [];

    for (let i = 0; i < input.lines.length; i++) {
      const line = input.lines[i];
      const snap = productSnaps[i];
      if (!snap.exists()) throw new Error(`Produit introuvable (${line.productId}).`);
      const product = { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
      if (!product.active) throw new Error(`${product.name} n'est plus disponible.`);

      const colors = [...product.colors];
      const colorIdx = colors.findIndex((c) => c.colorId === line.colorId);
      if (colorIdx === -1) throw new Error(`Couleur indisponible pour ${product.name}.`);
      if (colors[colorIdx].stock < line.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name} (${line.colorName}).`);
      }

      const unitPrice = effectivePrice(product, line.colorId);
      subtotal += unitPrice * line.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        colorId: line.colorId,
        colorName: line.colorName,
        quantity: line.quantity,
        unitPrice,
      });

      colors[colorIdx] = { ...colors[colorIdx], stock: Math.max(0, colors[colorIdx].stock - line.quantity) };
      stockUpdates.push({ ref: productRefs[i], colors });
    }

    // --- Order number allocation ---
    const nextCount = (counterSnap.exists() ? (counterSnap.data().count as number) : 0) + 1;
    const orderNumber = `LAX-${year}-${String(nextCount).padStart(6, "0")}`;

    // --- Write phase ---
    for (const u of stockUpdates) {
      tx.update(u.ref, { colors: u.colors, updatedAt: serverTimestamp() });
    }
    tx.set(counterRef, { count: nextCount }, { merge: true });

    const total = Math.max(0, subtotal + input.shippingCost);
    tx.set(orderRef, {
      orderNumber,
      customerName: input.customerName,
      phone: input.phone,
      whatsapp: input.whatsapp,
      country: input.country,
      zone: input.zone,
      address: input.address,
      comment: input.comment || "",
      items: orderItems,
      subtotal,
      discount: 0,
      shippingCost: input.shippingCost,
      total,
      status: "En attente" as OrderStatus,
      createdAt: serverTimestamp(),
    });

    return { orderNumber, orderId: orderRef.id };
  });

  return result;
}

export async function listOrdersAdmin(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  return updateDoc(doc(db, "orders", id), { status });
}
