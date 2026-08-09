import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAllProductsAdmin, updateProduct, deleteProduct } from "@/services/products";
import type { Product } from "@/types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => listAllProductsAdmin().then((p) => { setProducts(p); setLoading(false); });

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (p: Product) => {
    await updateProduct(p.id, { active: !p.active });
    load();
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Supprimer "${p.name}" ?`)) return;
    await deleteProduct(p.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Produits</h1>
        <Link to="/admin/produits/nouveau" className="btn-primary">+ Nouveau produit</Link>
      </div>

      {loading ? (
        <p className="text-sm">Chargement…</p>
      ) : (
        <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-14 h-16 bg-sand dark:bg-espresso/40 rounded-sm overflow-hidden shrink-0">
                {p.photos[0] && <img src={p.photos[0].url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-espresso/50 dark:text-cream/50">
                  {p.price.toLocaleString("fr-FR")} FCFA · {p.colors.reduce((s, c) => s + c.stock, 0)} en stock
                  {p.featured ? " · Mis en avant" : ""}
                </p>
              </div>
              <button
                onClick={() => toggleActive(p)}
                className={`text-xs px-2.5 py-1 rounded-sm border ${p.active ? "border-caramel text-caramel" : "border-line dark:border-espresso text-espresso/40 dark:text-cream/40"}`}
              >
                {p.active ? "Actif" : "Inactif"}
              </button>
              <Link to={`/admin/produits/${p.id}`} className="text-xs uppercase tracking-wide hover:text-caramel">
                Modifier
              </Link>
              <button onClick={() => handleDelete(p)} className="text-xs uppercase tracking-wide text-clay hover:opacity-70">
                Supprimer
              </button>
            </div>
          ))}
          {products.length === 0 && <p className="p-6 text-sm text-espresso/50">Aucun produit.</p>}
        </div>
      )}
    </div>
  );
}
