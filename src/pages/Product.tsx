import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, effectivePrice } from "@/services/products";
import { optimizedUrl } from "@/lib/cloudinary";
import { useColors } from "@/hooks/useColors";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ColorSwatch from "@/components/ColorSwatch";
import type { Product as ProductType } from "@/types";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { byId } = useColors();
  const { addLine } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [colorId, setColorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((p) => {
      setProduct(p);
      const firstAvailable = p?.colors.find((c) => c.stock > 0);
      setColorId(firstAvailable?.colorId ?? p?.colors[0]?.colorId ?? null);
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

  const selectedColor = product.colors.find((c) => c.colorId === colorId);
  const price = effectivePrice(product, colorId ?? undefined);
  const onPromo = price < product.price;
  const maxStock = selectedColor?.stock ?? 0;

  const handleAdd = () => {
    if (!selectedColor || maxStock === 0) return;
    const colorInfo = byId(selectedColor.colorId);
    addLine({
      productId: product.id,
      productName: product.name,
      colorId: selectedColor.colorId,
      colorName: colorInfo?.name || "",
      colorHex: colorInfo?.hex || "#ccc",
      unitPrice: price,
      quantity,
      photoUrl: product.photos[0]?.url || "",
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
          {product.photos[activePhoto] && (
            <img
              src={optimizedUrl(product.photos[activePhoto].url, 1000)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {product.photos.length > 1 && (
          <div className="flex gap-3 mt-4">
            {product.photos.map((ph, i) => (
              <button
                key={ph.publicId}
                onClick={() => setActivePhoto(i)}
                className={`w-16 h-20 rounded-sm overflow-hidden border ${i === activePhoto ? "border-caramel" : "border-line dark:border-espresso"}`}
              >
                <img src={optimizedUrl(ph.url, 120)} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="eyebrow mb-2">Laxassaye</p>
        <h1 className="font-display text-4xl mb-4">{product.name}</h1>
        <div className="flex items-baseline gap-3 mb-6">
          {onPromo && (
            <span className="line-through text-espresso/40 dark:text-cream/40">
              {product.price.toLocaleString("fr-FR")} {t.common.fcfa}
            </span>
          )}
          <span className="text-2xl font-semibold">
            {price.toLocaleString("fr-FR")} {t.common.fcfa}
          </span>
        </div>

        <p className="text-sm text-espresso/70 dark:text-cream/70 leading-relaxed mb-6">{product.description}</p>
        <p className="text-sm mb-8">
          <span className="eyebrow mr-2">{t.product.material}</span>
          {product.material}
        </p>

        <div className="mb-8">
          <p className="eyebrow mb-3">{t.product.chooseColor}</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => {
              const info = byId(c.colorId);
              return (
                <ColorSwatch
                  key={c.colorId}
                  name={info?.name || "—"}
                  hex={info?.hex || "#ccc"}
                  selected={colorId === c.colorId}
                  available={c.stock > 0}
                  onSelect={() => {
                    setColorId(c.colorId);
                    setQuantity(1);
                  }}
                />
              );
            })}
          </div>
          {maxStock === 0 ? (
            <p className="text-xs text-clay mt-3 uppercase tracking-wide">{t.product.outOfStock}</p>
          ) : (
            <p className="text-xs text-espresso/50 dark:text-cream/50 mt-3">
              {t.product.inStock} — {maxStock}
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
          {added ? "Ajouté ✓" : t.product.addToCart}
        </button>

        <Link to="/boutique" className="block mt-8 text-sm text-espresso/60 dark:text-cream/60 hover:text-caramel">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
