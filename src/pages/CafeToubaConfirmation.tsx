import { useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSettings } from "@/services/settings";

interface CafeToubaOrderSummary {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  neighborhood: string;
  address: string;
  items: { name: string; format: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
}

export default function CafeToubaConfirmation() {
  const { orderNumber: orderNumberParam } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const { t } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const summary = (location.state as CafeToubaOrderSummary | undefined) || null;
  const orderNumber = summary?.orderNumber || orderNumberParam || "";

  useEffect(() => {
    getSettings().then((s) => setWhatsappNumber(s.whatsappNumber));
  }, []);

  const paymentMethodLabels: Record<string, string> = {
    cash_on_delivery: "Paiement à la livraison",
    wave: "Wave",
    orange_money: "Orange Money",
  };

  const message = summary
    ? [
        "Laxassaye — Café Touba",
        "",
        `Commande : ${summary.orderNumber}`,
        "",
        `Client : ${summary.customerName}`,
        `Téléphone : ${summary.phone}`,
        `Ville : ${summary.city}`,
        `Quartier : ${summary.neighborhood || "Non spécifié"}`,
        `Adresse : ${summary.address}`,
        "",
        "Produits :",
        ...summary.items.map((i) => `- ${i.name} (${i.format}) x${i.quantity} — ${(i.unitPrice * i.quantity).toLocaleString("fr-FR")} FCFA`),
        "",
        `Livraison : ${summary.shippingCost.toLocaleString("fr-FR")} FCFA`,
        `Total : ${summary.total.toLocaleString("fr-FR")} FCFA`,
        "",
        `Paiement : ${paymentMethodLabels[summary.paymentMethod] || summary.paymentMethod}`,
      ].join("\n")
    : `Laxassaye — Café Touba\n\nCommande : ${orderNumber}\n\nBonjour, je souhaite confirmer ma commande.`;

  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : "";

  return (
    <div className="container-lax py-24 max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-caramel/15 text-caramel flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
      <h1 className="font-display text-3xl mb-3">{t.cafeTouba.confirmationTitle}</h1>
      <p className="text-espresso/70 dark:text-cream/70 mb-2">{t.cafeTouba.confirmationThanks}</p>
      <p className="eyebrow mb-8">
        {t.confirmation.orderNumber} : <span className="text-espresso dark:text-cream">{orderNumber}</span>
      </p>

      {summary && (
        <div className="text-left border border-line dark:border-espresso rounded-sm p-6 mb-8 text-sm space-y-1">
          {summary.items.map((i, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {i.name} ({i.format}) × {i.quantity}
              </span>
              <span>{(i.unitPrice * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t border-line dark:border-espresso mt-2">
            <span>{t.cart.total}</span>
            <span>{summary.total.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <p className="text-xs text-espresso/50 dark:text-cream/50 mt-2">
            {t.cafeTouba.paymentMethod}: {paymentMethodLabels[summary.paymentMethod] || summary.paymentMethod}
          </p>
        </div>
      )}

      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
          {t.confirmation.whatsappCta}
        </a>
      )}

      <Link to="/cafe-touba" className="block mt-8 text-sm text-espresso/60 dark:text-cream/60 hover:text-caramel">
        {t.cafeTouba.continueShopping}
      </Link>
    </div>
  );
}