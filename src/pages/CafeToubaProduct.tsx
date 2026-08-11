import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCafeToubaProduct } from "@/services/cafeToubaProducts";
import { optimizedUrl } from "@/lib/cloudinary";
import { useCafeToubaCart } from "@/contexts/CafeToubaCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CafeToubaProduct as CafeToubaProductType } from "@/types";

export default function CafeToubaProduct() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addLine } = useCafeToubaCart();

  const [product, setProduct] = useState<CafeToubaProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCafeToubaProduct(id).then((p) => {
      setProduct(p);
      setLoading(false);
      if (p) {
        document.title = `${p.name} — Laxassaye`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", p.description.slice(0, 155));
      }
    });
  }, [id]);

  if (loading) return <div className="container-lax py-24 text-sm">{t.common.loading}</div>;
  if (!product) return <div className="container-lax py-24">Produit introuvable.</div>;

  const maxStock = product.stock;

  const handleAdd = () => {
    if (maxStock === 0) return;
    addLine({
      productId: product.id,
      productName: product.name,
      format: product.format,
      unitPrice: product.price,
      quantity,
      imageUrl: product.imageUrl,
      maxStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-lax py-14 grid lg:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="aspect-[4/5] bg-sand dark:bg-espresso/40 overflow-hidden rounded-sm">
          {product.imageUrl && (
            <img
              src={optimizedUrl(product.imageUrl, 1000)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <p className="eyebrow mb-2">Laxassaye — Café Touba</p>
        <h1 className="font-display text-4xl mb-4">{product.name}</h1>
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl font-semibold">
            {product.price.toLocaleString("fr-FR")} {t.common.fcfa}
          </span>
          <span className="text-sm text-espresso/60 dark:text-cream/60">/{product.format}</span>
        </div>

        {product.badge && (
          <span className="inline-block bg-caramel text-cream text-xs uppercase tracking-widest2 px-2.5 py-1 rounded-sm mb-4">
            {product.badge}
          </span>
        )}

        <p className="text-sm text-espresso/70 dark:text-cream/70 leading-relaxed mb-6">{product.description}</p>

        <div className="mb-8">
          <p className="eyebrow mb-3">{t.cafeTouba.format}</p>
          <p className="text-sm font-medium">{product.format}</p>
        </div>

        <div className="mb-8">
          <p className="eyebrow mb-3">{t.cafeTouba.stock}</p>
          {maxStock === 0 ? (
            <p className="text-xs text-clay mt-3 uppercase tracking-wide">{t.cafeTouba.outOfStock}</p>
          ) : (
            <p className="text-xs text-espresso/50 dark:text-cream/50 mt-3">
              {t.cafeTouba.inStock} — {maxStock}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <p className="eyebrow">{t.product.quantity}</p>
          <div className="flex items-center border border-line dark:border-espresso rounded-sm">
            <button className="w-9 h-9" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={maxStock === 0}>
              −
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button className="w-9 h-9" onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))} disabled={maxStock === 0}>
              +
            </button>
          </div>
        </div>

        <button onClick={handleAdd} disabled={maxStock === 0} className="btn-primary w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed">
          {added ? t.cafeTouba.added : t.cafeTouba.addToCart}
        </button>

        <Link to="/cafe-touba" className="block mt-8 text-sm text-espresso/60 dark:text-cream/60 hover:text-caramel">
          ← {t.cafeTouba.backToShop}
        </Link>
      </div>
    </div>
  );
}