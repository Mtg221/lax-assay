import { useEffect, useState } from "react";
import { listOrdersAdmin, setOrderStatus } from "@/services/orders";
import type { Order, OrderStatus } from "@/types";

const statuses: OrderStatus[] = ["En attente", "Confirmée", "Livrée", "Annulée"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => listOrdersAdmin().then(setOrders);

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await setOrderStatus(id, status);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Commandes</h1>

      <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
        {orders.map((o) => (
          <div key={o.id} className="p-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="text-sm font-medium">{o.orderNumber}</p>
                <p className="text-xs text-espresso/50 dark:text-cream/50">
                  {o.customerName} · {o.phone} · {o.zone}, {o.country}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{o.total.toLocaleString("fr-FR")} FCFA</span>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                  className="input-lax py-1.5 w-auto text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-xs uppercase tracking-wide hover:text-caramel">
                  {expanded === o.id ? "Réduire" : "Détails"}
                </button>
              </div>
            </div>

            {expanded === o.id && (
              <div className="mt-4 pt-4 border-t border-line dark:border-espresso text-sm space-y-1">
                <p className="text-xs text-espresso/50 dark:text-cream/50">Adresse : {o.address}</p>
                {o.comment && <p className="text-xs text-espresso/50 dark:text-cream/50">Commentaire : {o.comment}</p>}
                <div className="mt-2 space-y-1">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {it.productName} ({it.colorName}) × {it.quantity}
                      </span>
                      <span>{(it.unitPrice * it.quantity).toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t border-line dark:border-espresso mt-2">
                  <span>Livraison</span>
                  <span>{o.shippingCost.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="p-6 text-sm text-espresso/50">Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}
