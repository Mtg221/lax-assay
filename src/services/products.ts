import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

const COL = "products";

export async function listActiveProducts(): Promise<Product[]> {
  const q = query(collection(db, COL), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function listFeaturedProducts(): Promise<Product[]> {
  const q = query(collection(db, COL), where("active", "==", true), where("featured", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function listAllProductsAdmin(): Promise<Product[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const d = await getDoc(doc(db, COL, id));
  return d.exists() ? ({ id: d.id, ...d.data() } as Product) : null;
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, COL, id));
}

export function effectivePrice(product: Product, colorId?: string): number {
  const colorEntry = colorId ? product.colors.find((c) => c.colorId === colorId) : undefined;
  const base = colorEntry?.priceOverride ?? product.price;
  const promo = product.promotion;
  if (!promo || !promo.active) return base;
  const now = new Date();
  if (promo.startDate && now < new Date(promo.startDate)) return base;
  if (promo.endDate && now > new Date(promo.endDate)) return base;
  return Math.max(0, base - promo.discountAmount);
}
