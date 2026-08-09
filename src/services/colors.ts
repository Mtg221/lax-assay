import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ColorOption } from "@/types";

const COL = "colors";

export async function listColors(): Promise<ColorOption[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ColorOption));
}

export async function createColor(data: Omit<ColorOption, "id">) {
  return addDoc(collection(db, COL), data);
}

export async function updateColor(id: string, data: Partial<ColorOption>) {
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteColor(id: string) {
  return deleteDoc(doc(db, COL, id));
}
