import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { effectivePrice } from "@/services/products";
import { optimizedUrl } from "@/lib/cloudinary";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColors } from "@/hooks/useColors";

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { byId } = useColors();
  const cover = product.photos[0]?.url;
  const price = effectivePrice(product);
  const onPromo = price < product.price;
  const totalStock = product.colors.reduce((s, c) => s + c.stock, 0);

  return (
    <Link to={`/produit/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand dark:bg-espresso/40 rounded-sm">
        {cover ? (
          <img
            src={optimizedUrl(cover, 600)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-silk"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-espresso/30">Laxassaye</div>
        )}
        {onPromo && (
          <span className="absolute top-3 left-3 bg-espresso text-cream text-[10px] uppercase tracking-widest2 px-2.5 py-1 rounded-sm">
            Promo
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute inset-0 bg-ink/50 flex items-center justify-center text-cream text-xs uppercase tracking-widest2">
            {t.product.outOfStock}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm">{product.name}</h3>
          <div className="flex gap-1 mt-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.colorId}
                className="w-3 h-3 rounded-full border border-line dark:border-espresso"
                style={{ backgroundColor: byId(c.colorId)?.hex || "#cccccc" }}
              />
            ))}
          </div>
        </div>
        <div className="text-right text-sm shrink-0">
          {onPromo && <div className="line-through text-espresso/40 dark:text-cream/40 text-xs">{product.price.toLocaleString("fr-FR")} {t.common.fcfa}</div>}
          <div className="font-semibold">{price.toLocaleString("fr-FR")} {t.common.fcfa}</div>
        </div>
      </div>
    </Link>
  );
}
