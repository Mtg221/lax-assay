import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAllProductsAdmin } from "@/services/products";
import { listOrdersAdmin } from "@/services/orders";
import { listAllReviewsAdmin } from "@/services/reviews";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, pendingReviews: 0 });

  useEffect(() => {
    Promise.all([listAllProductsAdmin(), listOrdersAdmin(), listAllReviewsAdmin()]).then(([products, orders, reviews]) => {
      setStats({
        products: products.length,
        pendingOrders: orders.filter((o) => o.status === "Nouvelle").length,
        pendingReviews: reviews.filter((r) => r.status === "En attente").length,
      });
    });
  }, []);

  const cards = [
    { label: "Produits actifs", value: stats.products, to: "/admin/produits" },
    { label: "Commandes en attente", value: stats.pendingOrders, to: "/admin/commandes" },
    { label: "Avis à valider", value: stats.pendingReviews, to: "/admin/avis" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Tableau de bord</h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="border border-line dark:border-espresso rounded-sm p-6 hover:border-caramel transition-colors">
            <p className="text-3xl font-display">{c.value}</p>
            <p className="text-sm text-espresso/60 dark:text-cream/60 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
