import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Review } from "@/types";

const COL = "reviews";

export async function listApprovedReviews(): Promise<Review[]> {
  const q = query(collection(db, COL), where("status", "==", "Approuvé"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function listAllReviewsAdmin(): Promise<Review[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function submitReview(data: Omit<Review, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    status: "En attente",
    createdAt: serverTimestamp(),
  });
}

export async function setReviewStatus(id: string, status: Review["status"]) {
  return updateDoc(doc(db, COL, id), { status });
}

export async function deleteReview(id: string) {
  return deleteDoc(doc(db, COL, id));
}
