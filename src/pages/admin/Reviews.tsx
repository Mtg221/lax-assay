import { useEffect, useState } from "react";
import { listAllReviewsAdmin, setReviewStatus, deleteReview } from "@/services/reviews";
import type { Review } from "@/types";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () => listAllReviewsAdmin().then(setReviews);

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: Review["status"]) => {
    await setReviewStatus(id, status);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await deleteReview(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Avis</h1>
      <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                {r.customerName} — {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>
              <p className="text-sm text-espresso/70 dark:text-cream/70 mt-1">{r.comment}</p>
              <p className="text-xs text-espresso/40 dark:text-cream/40 mt-1">{r.status}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {r.status !== "Approuvé" && (
                <button onClick={() => handleStatus(r.id, "Approuvé")} className="text-xs px-2 py-1 border border-caramel text-caramel rounded-sm">
                  Approuver
                </button>
              )}
              {r.status !== "Refusé" && (
                <button onClick={() => handleStatus(r.id, "Refusé")} className="text-xs px-2 py-1 border border-line dark:border-espresso rounded-sm">
                  Refuser
                </button>
              )}
              <button onClick={() => handleDelete(r.id)} className="text-xs text-clay">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="p-6 text-sm text-espresso/50">Aucun avis pour le moment.</p>}
      </div>
    </div>
  );
}
