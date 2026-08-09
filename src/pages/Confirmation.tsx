import { useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSettings } from "@/services/settings";

interface OrderSummary {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; color: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function Confirmation() {
  const { orderNumber: orderNumberParam } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const { t } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const summary = (location.state as OrderSummary | undefined) || null;
  const orderNumber = summary?.orderNumber || orderNumberParam || "";

  useEffect(() => {
    getSettings().then((s) => setWhatsappNumber(s.whatsappNumber));
  }, []);

  const message = summary
    ? [
        "Laxassaye",
        "",
        `Commande : ${summary.orderNumber}`,
        "",
        `Client : ${summary.customerName}`,
        `Téléphone : ${summary.phone}`,
        `Adresse : ${summary.address}`,
        "",
        "Produits :",
        ...summary.items.map((i) => `- ${i.name} (${i.color}) x${i.quantity} — ${(i.unitPrice * i.quantity).toLocaleString("fr-FR")} FCFA`),
        "",
        `Livraison : ${summary.shippingCost === 0 ? "Gratuite" : summary.shippingCost.toLocaleString("fr-FR") + " FCFA"}`,
        `Total : ${summary.total.toLocaleString("fr-FR")} FCFA`,
        "",
        "Paiement : À la livraison",
      ].join("\n")
    : `Laxassaye\n\nCommande : ${orderNumber}\n\nBonjour, je souhaite confirmer ma commande.`;

  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : "";

  return (
    <div className="container-lax py-24 max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-caramel/15 text-caramel flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
      <h1 className="font-display text-3xl mb-3">{t.confirmation.title}</h1>
      <p className="text-espresso/70 dark:text-cream/70 mb-2">{t.confirmation.thanks}</p>
      <p className="eyebrow mb-8">
        {t.confirmation.orderNumber} : <span className="text-espresso dark:text-cream">{orderNumber}</span>
      </p>

      {summary && (
        <div className="text-left border border-line dark:border-espresso rounded-sm p-6 mb-8 text-sm space-y-1">
          {summary.items.map((i, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {i.name} ({i.color}) × {i.quantity}
              </span>
              <span>{(i.unitPrice * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t border-line dark:border-espresso mt-2">
            <span>{t.cart.total}</span>
            <span>{summary.total.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>
      )}

      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
          {t.confirmation.whatsappCta}
        </a>
      )}

      <Link to="/boutique" className="block mt-8 text-sm text-espresso/60 dark:text-cream/60 hover:text-caramel">
        {t.cart.continueShopping}
      </Link>
    </div>
  );
}
