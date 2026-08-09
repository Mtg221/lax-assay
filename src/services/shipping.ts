import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ShippingZone } from "@/types";

const COL = "shippingZones";

export async function listShippingZones(): Promise<ShippingZone[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ShippingZone));
}

export async function createShippingZone(data: Omit<ShippingZone, "id">) {
  return addDoc(collection(db, COL), data);
}

export async function updateShippingZone(id: string, data: Partial<ShippingZone>) {
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteShippingZone(id: string) {
  return deleteDoc(doc(db, COL, id));
}
