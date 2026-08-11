import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCafeToubaCart } from "@/contexts/CafeToubaCartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { placeCafeToubaOrder } from "@/services/cafeToubaOrders";

const SENEGAL_CITIES = [
  "Dakar",
  "Touba",
  "Thiès",
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Louga",
  "Tambacounda",
  "Kolda",
  "Fatick",
  "Kaffrine",
  "Kédougou",
  "Matam",
  "Sédhiou",
];

export default function CafeToubaCheckout() {
  const { lines, subtotal, clear } = useCafeToubaCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    city: "",
    neighborhood: "",
    address: "",
    comment: "",
    paymentMethod: "cash_on_delivery" as "cash_on_delivery" | "wave" | "orange_money",
  });

  const shippingCost = 2000; // Fixed shipping cost for Cafe Touba in Senegal

  useEffect(() => {
    if (lines.length === 0) navigate("/cafe-touba/panier");
  }, [lines, navigate]);

  const total = subtotal + shippingCost;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.city) {
      setError("Veuillez choisir une ville.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { orderNumber } = await placeCafeToubaOrder({
        customerName: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        city: form.city,
        neighborhood: form.neighborhood,
        address: form.address,
        comment: form.comment,
        shippingCost,
        paymentMethod: form.paymentMethod,
        lines: lines.map((l) => ({
          productId: l.productId,
          format: l.format,
          quantity: l.quantity,
        })),
      });
      const summary = {
        orderNumber,
        customerName: form.name,
        phone: form.phone,
        city: form.city,
        neighborhood: form.neighborhood,
        address: form.address,
        items: lines.map((l) => ({ name: l.productName, format: l.format, quantity: l.quantity, unitPrice: l.unitPrice })),
        subtotal,
        shippingCost,
        total,
        paymentMethod: form.paymentMethod,
      };
      clear();
      navigate(`/cafe-touba/confirmation/${orderNumber}`, { state: summary });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-lax py-16 grid lg:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
        <h1 className="font-display text-4xl mb-6">{t.cafeTouba.checkoutTitle}</h1>

        <div className="grid sm:grid-cols-2 gap-5">
          <input required placeholder={t.checkout.name} className="input-lax" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder={t.checkout.phone} className="input-lax" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <input placeholder={`${t.checkout.whatsapp} (${t.checkout.phone.toLowerCase()} si vide)`} className="input-lax" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />

        <div>
          <label className="eyebrow block mb-2">{t.cafeTouba.city}</label>
          <select required className="input-lax" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            <option value="">{t.cafeTouba.selectCity}</option>
            {SENEGAL_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <input placeholder={t.cafeTouba.neighborhood} className="input-lax" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        <textarea required placeholder={t.checkout.address} rows={3} className="input-lax" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea placeholder={t.checkout.comment} rows={2} className="input-lax" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />

        <div className="space-y-3 pt-2">
          <p className="eyebrow mb-2">{t.cafeTouba.paymentMethod}</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="payment" value="cash_on_delivery" checked={form.paymentMethod === "cash_on_delivery"} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as "cash_on_delivery" })} className="w-4 h-4 text-caramel border-line dark:border-espresso" />
              <span className="text-sm">{t.cafeTouba.paymentCashOnDelivery}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer opacity-50">
              <input type="radio" name="payment" value="wave" checked={form.paymentMethod === "wave"} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as "wave" })} className="w-4 h-4 text-caramel border-line dark:border-espresso" disabled />
              <span className="text-sm">{t.cafeTouba.paymentWave} (bientôt)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer opacity-50">
              <input type="radio" name="payment" value="orange_money" checked={form.paymentMethod === "orange_money"} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as "orange_money" })} className="w-4 h-4 text-caramel border-line dark:border-espresso" disabled />
              <span className="text-sm">{t.cafeTouba.paymentOrangeMoney} (bientôt)</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-50">
          {submitting ? t.common.loading : t.cafeTouba.confirmOrder}
        </button>
      </form>

      <div className="border border-line dark:border-espresso rounded-sm p-6 h-fit">
        <h2 className="font-display text-xl mb-5">{t.checkout.summary}</h2>
        <div className="space-y-2 text-sm mb-4">
          {lines.map((l) => (
            <div key={`${l.productId}-${l.format}`} className="flex justify-between">
              <span className="text-espresso/70 dark:text-cream/70">
                {l.productName} ({l.format}) × {l.quantity}
              </span>
              <span>{(l.unitPrice * l.quantity).toLocaleString("fr-FR")}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line dark:border-espresso pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t.cart.subtotal}</span>
            <span>{subtotal.toLocaleString("fr-FR")} {t.common.fcfa}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.cafeTouba.shipping}</span>
            <span>{shippingCost.toLocaleString("fr-FR")} {t.common.fcfa}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>{t.cart.total}</span>
            <span>{total.toLocaleString("fr-FR")} {t.common.fcfa}</span>
          </div>
        </div>
        <Link to="/cafe-touba/panier" className="block mt-6 text-xs text-espresso/50 dark:text-cream/50 hover:text-caramel">
          ← {t.cafeTouba.modifyCart}
        </Link>
      </div>
    </div>
  );
}