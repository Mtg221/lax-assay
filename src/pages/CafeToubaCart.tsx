import { Link, useNavigate } from "react-router-dom";
import { useCafeToubaCart } from "@/contexts/CafeToubaCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { optimizedUrl } from "@/lib/cloudinary";

export default function CafeToubaCart() {
  const { lines, updateQuantity, removeLine, subtotal } = useCafeToubaCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container-lax py-16">
      <h1 className="font-display text-4xl mb-10">{t.cafeTouba.cartTitle}</h1>

      {lines.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-espresso/60 dark:text-cream/60 mb-6">{t.cafeTouba.cartEmpty}</p>
          <Link to="/cafe-touba" className="btn-secondary">
            {t.cafeTouba.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 divide-y divide-line dark:divide-espresso">
            {lines.map((l) => (
              <div key={`${l.productId}-${l.format}`} className="py-6 flex gap-5">
                <div className="w-24 h-28 bg-sand dark:bg-espresso/40 rounded-sm overflow-hidden shrink-0">
                  {l.imageUrl && <img src={optimizedUrl(l.imageUrl, 200)} alt={l.productName} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{l.productName}</p>
                      <p className="text-xs text-espresso/60 dark:text-cream/60 mt-1">{l.format}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      {(l.unitPrice * l.quantity).toLocaleString("fr-FR")} {t.common.fcfa}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-line dark:border-espresso rounded-sm">
                      <button className="w-8 h-8" onClick={() => updateQuantity(l.productId, l.format, l.quantity - 1)}>
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{l.quantity}</span>
                      <button className="w-8 h-8" onClick={() => updateQuantity(l.productId, l.format, l.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeLine(l.productId, l.format)}
                      className="text-xs uppercase tracking-wide text-espresso/50 dark:text-cream/50 hover:text-clay"
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-line dark:border-espresso rounded-sm p-6 h-fit">
            <div className="flex justify-between text-sm mb-3">
              <span>{t.cart.subtotal}</span>
              <span>
                {subtotal.toLocaleString("fr-FR")} {t.common.fcfa}
              </span>
            </div>
            <p className="text-xs text-espresso/50 dark:text-cream/50 mb-6">Frais de livraison calculés à l'étape suivante.</p>
            <button onClick={() => navigate("/cafe-touba/commander")} className="btn-primary w-full">
              {t.cafeTouba.proceedToCheckout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}