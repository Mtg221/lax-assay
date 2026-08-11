import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listActiveCafeToubaProducts } from "@/services/cafeToubaProducts";
import { useCafeToubaCart } from "@/contexts/CafeToubaCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { optimizedUrl } from "@/lib/cloudinary";
import type { CafeToubaProduct } from "@/types";
import React from "react";

function CafeToubaProductCard({ product }: { product: CafeToubaProduct }) {
  const { t } = useLanguage();
  const { addLine } = useCafeToubaCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addLine({
      productId: product.id,
      productName: product.name,
      format: product.format,
      unitPrice: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      maxStock: product.stock,
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 1500);
  };

  return (
    <div className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand dark:bg-espresso/40 rounded-sm">
        <img
          src={optimizedUrl(product.imageUrl, 600)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-silk"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-caramel text-cream text-[10px] uppercase tracking-widest2 px-2.5 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-ink/50 flex items-center justify-center text-cream text-xs uppercase tracking-widest2">
            {t.cafeTouba.outOfStock}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Link to={`/cafe-touba/produit/${product.id}`} className="group">
          <h3 className="text-sm group-hover:text-caramel transition-colors">{product.name}</h3>
          <p className="text-xs text-espresso/60 dark:text-cream/60">{product.format}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            {product.price.toLocaleString("fr-FR")} {t.common.fcfa}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            className="btn-primary text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? t.cafeTouba.added : t.cafeTouba.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CafeTouba() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<CafeToubaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listActiveCafeToubaProducts()
      .then((p) => {
        setProducts(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sand via-cream to-caramel/30 dark:from-espresso dark:via-ink dark:to-bark" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="relative h-full container-lax flex flex-col justify-end pb-20">
          <p className="eyebrow text-cream mb-4">Laxassaye</p>
          <h1 className="font-display text-4xl sm:text-6xl text-cream max-w-2xl leading-[1.05] italic">
            {t.cafeTouba.heroTitle}
          </h1>
          <p className="text-cream/90 mt-4 max-w-xl text-base sm:text-lg">
            {t.cafeTouba.heroSubtitle}
          </p>
          <Link to="#produits" className="btn-primary mt-8 w-fit">
            {t.cafeTouba.heroCta}
          </Link>
        </div>
      </section>

      {/* Products */}
      <section id="produits" className="container-lax py-24">
        <div className="mb-12">
          <p className="eyebrow mb-2">Laxassaye</p>
          <h2 className="font-display text-3xl">{t.cafeTouba.ourProducts}</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-sand dark:bg-espresso/40 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-espresso/60 dark:text-cream/60 mb-6">{t.cafeTouba.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <CafeToubaProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="bg-sand/50 dark:bg-espresso/20 py-24">
        <div className="container-lax grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-14 h-14 rounded-full bg-caramel/15 text-caramel flex items-center justify-center mx-auto mb-4 text-xl">☕</div>
            <h3 className="font-display text-xl mb-2">{t.cafeTouba.benefit1Title}</h3>
            <p className="text-espresso/70 dark:text-cream/70 text-sm">{t.cafeTouba.benefit1Desc}</p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full bg-caramel/15 text-caramel flex items-center justify-center mx-auto mb-4 text-xl">🚚</div>
            <h3 className="font-display text-xl mb-2">{t.cafeTouba.benefit2Title}</h3>
            <p className="text-espresso/70 dark:text-cream/70 text-sm">{t.cafeTouba.benefit2Desc}</p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full bg-caramel/15 text-caramel flex items-center justify-center mx-auto mb-4 text-xl">💰</div>
            <h3 className="font-display text-xl mb-2">{t.cafeTouba.benefit3Title}</h3>
            <p className="text-espresso/70 dark:text-cream/70 text-sm">{t.cafeTouba.benefit3Desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}