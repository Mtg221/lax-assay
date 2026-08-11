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
import type { CafeToubaProduct } from "@/types";

const COL = "cafeToubaProducts";

export async function listActiveCafeToubaProducts(): Promise<CafeToubaProduct[]> {
  const q = query(collection(db, COL), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CafeToubaProduct));
}

export async function listAllCafeToubaProductsAdmin(): Promise<CafeToubaProduct[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CafeToubaProduct));
}

export async function getCafeToubaProduct(id: string): Promise<CafeToubaProduct | null> {
  const d = await getDoc(doc(db, COL, id));
  return d.exists() ? ({ id: d.id, ...d.data() } as CafeToubaProduct) : null;
}

export async function createCafeToubaProduct(data: Omit<CafeToubaProduct, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCafeToubaProduct(id: string, data: Partial<CafeToubaProduct>) {
  return updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCafeToubaProduct(id: string) {
  return deleteDoc(doc(db, COL, id));
}