import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAllCafeToubaProductsAdmin, updateCafeToubaProduct, deleteCafeToubaProduct } from "@/services/cafeToubaProducts";
import type { CafeToubaProduct } from "@/types";

export default function AdminCafeToubaProducts() {
  const [products, setProducts] = useState<CafeToubaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => listAllCafeToubaProductsAdmin().then((p) => { setProducts(p); setLoading(false); });

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (p: CafeToubaProduct) => {
    await updateCafeToubaProduct(p.id, { active: !p.active });
    load();
  };

  const handleDelete = async (p: CafeToubaProduct) => {
    if (!confirm(`Supprimer "${p.name}" ?`)) return;
    await deleteCafeToubaProduct(p.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Produits Café Touba</h1>
        <Link to="/admin/cafe-touba/produits/nouveau" className="btn-primary">+ Nouveau café</Link>
      </div>

      {loading ? (
        <p className="text-sm">Chargement…</p>
      ) : (
        <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-14 h-16 bg-sand dark:bg-espresso/40 rounded-sm overflow-hidden shrink-0">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-espresso/50 dark:text-cream/50">
                  {p.format} · {p.price.toLocaleString("fr-FR")} FCFA · Stock: {p.stock}
                  {p.badge && ` · ${p.badge}`}
                </p>
              </div>
              <button
                onClick={() => toggleActive(p)}
                className={`text-xs px-2.5 py-1 rounded-sm border ${p.active ? "border-caramel text-caramel" : "border-line dark:border-espresso text-espresso/40 dark:text-cream/40"}`}
              >
                {p.active ? "Actif" : "Inactif"}
              </button>
              <Link to={`/admin/cafe-touba/produits/${p.id}`} className="text-xs uppercase tracking-wide hover:text-caramel">
                Modifier
              </Link>
              <button onClick={() => handleDelete(p)} className="text-xs uppercase tracking-wide text-clay hover:opacity-70">
                Supprimer
              </button>
            </div>
          ))}
          {products.length === 0 && <p className="p-6 text-sm text-espresso/50">Aucun produit Café Touba.</p>}
        </div>
      )}
    </div>
  );
}