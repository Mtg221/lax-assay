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
import type { CafeToubaOrder, CafeToubaOrderItem, CafeToubaProduct, OrderStatus } from "@/types";

export interface PlaceCafeToubaOrderInput {
  customerName: string;
  phone: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  address: string;
  comment?: string;
  shippingCost: number;
  paymentMethod: "cash_on_delivery" | "wave" | "orange_money";
  lines: Pick<CafeToubaOrderItem, "productId" | "format" | "quantity">[];
}

/**
 * Places a Cafe Touba order atomically:
 * 1. Re-reads every product server-side (never trusts frontend price/stock).
 * 2. Verifies each product still has enough stock.
 * 3. Computes the real price at this instant.
 * 4. Decrements stock — never below zero.
 * 5. Allocates a unique sequential order number (CT-YYYY-NNNNNN) via a counter doc.
 * All of this happens in a single Firestore transaction.
 */
export async function placeCafeToubaOrder(input: PlaceCafeToubaOrderInput): Promise<{ orderNumber: string; orderId: string }> {
  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", `cafeToubaOrders-${year}`);
  const orderRef = doc(collection(db, "cafeToubaOrders"));

  const result = await runTransaction(db, async (tx) => {
    // --- Read phase ---
    const productRefs = input.lines.map((l) => doc(db, "cafeToubaProducts", l.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));
    const counterSnap = await tx.get(counterRef);

    const orderItems: CafeToubaOrder["items"] = [];
    let subtotal = 0;
    const stockUpdates: { ref: (typeof productRefs)[number]; stock: number }[] = [];

    for (let i = 0; i < input.lines.length; i++) {
      const line = input.lines[i];
      const snap = productSnaps[i];
      if (!snap.exists()) throw new Error(`Produit introuvable (${line.productId}).`);
      const product = { id: snap.id, ...(snap.data() as Omit<CafeToubaProduct, "id">) };
      if (!product.active) throw new Error(`${product.name} n'est plus disponible.`);

      if (product.stock < line.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name} (${line.format}).`);
      }

      const unitPrice = product.price;
      subtotal += unitPrice * line.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        format: line.format,
        quantity: line.quantity,
        unitPrice,
      });

      stockUpdates.push({ ref: productRefs[i], stock: Math.max(0, product.stock - line.quantity) });
    }

    // --- Order number allocation ---
    const nextCount = (counterSnap.exists() ? (counterSnap.data().count as number) : 0) + 1;
    const orderNumber = `CT-${year}-${String(nextCount).padStart(6, "0")}`;

    // --- Write phase ---
    for (const u of stockUpdates) {
      tx.update(u.ref, { stock: u.stock, updatedAt: serverTimestamp() });
    }
    tx.set(counterRef, { count: nextCount }, { merge: true });

    const total = Math.max(0, subtotal + input.shippingCost);
    tx.set(orderRef, {
      orderNumber,
      customerName: input.customerName,
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      city: input.city,
      neighborhood: input.neighborhood,
      address: input.address,
      comment: input.comment || "",
      items: orderItems,
      subtotal,
      shippingCost: input.shippingCost,
      total,
      paymentMethod: input.paymentMethod,
      status: "Nouvelle" as OrderStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { orderNumber, orderId: orderRef.id };
  });

  return result;
}

export async function listCafeToubaOrdersAdmin(): Promise<CafeToubaOrder[]> {
  const q = query(collection(db, "cafeToubaOrders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CafeToubaOrder));
}

export async function setCafeToubaOrderStatus(id: string, status: OrderStatus) {
  return updateDoc(doc(db, "cafeToubaOrders", id), { status, updatedAt: serverTimestamp() });
}