import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { listActiveProducts } from "@/services/products";
import type { Product } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Shop() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listActiveProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-lax py-16">
      <p className="eyebrow mb-2">Laxassaye</p>
      <h1 className="font-display text-4xl mb-12">Boutique</h1>

      {loading ? (
        <p className="text-sm text-espresso/50 dark:text-cream/50">{t.common.loading}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-espresso/50 dark:text-cream/50">Aucun produit disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
