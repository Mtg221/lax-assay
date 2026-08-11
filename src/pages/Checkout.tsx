import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { listShippingZones } from "@/services/shipping";
import { useSettings } from "@/contexts/SettingsContext";
import { placeOrder } from "@/services/orders";
import type { ShippingZone } from "@/types";

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
    comment: "",
  });

  useEffect(() => {
    if (lines.length === 0) navigate("/panier");
  }, [lines, navigate]);

  useEffect(() => {
    listShippingZones().then((z) => {
      setZones(z);
      if (z.length) setSelectedZoneId(z[0].id);
    });
  }, []);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const isFreeShipping = settings.freeShippingEnabled && selectedZone && settings.freeShippingZoneIds.includes(selectedZone.id);
  const shippingCost = useMemo(() => {
    if (!selectedZone) return 0;
    if (isFreeShipping || selectedZone.freeShipping) return 0;
    return selectedZone.price;
  }, [selectedZone, isFreeShipping]);

  const total = subtotal + shippingCost;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedZone) {
      setError("Veuillez choisir une zone de livraison.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { orderNumber } = await placeOrder({
        customerName: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        country: selectedZone.country,
        zone: selectedZone.zone,
        address: form.address,
        comment: form.comment,
        shippingCost,
        lines: lines.map((l) => ({
          productId: l.productId,
          colorId: l.colorId,
          colorName: l.colorName,
          quantity: l.quantity,
        })),
      });
      const summary = {
        orderNumber,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: lines.map((l) => ({ name: l.productName, color: l.colorName, quantity: l.quantity, unitPrice: l.unitPrice })),
        subtotal,
        shippingCost,
        total,
      };
      clear();
      navigate(`/confirmation/${orderNumber}`, { state: summary });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-lax py-16 grid lg:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
        <h1 className="font-display text-4xl mb-6">{t.checkout.title}</h1>

        <div className="grid sm:grid-cols-2 gap-5">
          <input required placeholder={t.checkout.name} className="input-lax" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder={t.checkout.phone} className="input-lax" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <input placeholder={`${t.checkout.whatsapp} (${t.checkout.phone.toLowerCase()} si vide)`} className="input-lax" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />

        <div>
          <label className="eyebrow block mb-2">{t.checkout.zone}</label>
          <select required className="input-lax" value={selectedZoneId} onChange={(e) => setSelectedZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.country} — {z.zone}
              </option>
            ))}
          </select>
        </div>

        <textarea required placeholder={t.checkout.address} rows={3} className="input-lax" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea placeholder={t.checkout.comment} rows={2} className="input-lax" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />

        <p className="text-sm text-espresso/60 dark:text-cream/60 pt-2">{t.checkout.payment}</p>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-50">
          {submitting ? t.common.loading : t.checkout.submit}
        </button>
      </form>

      <div className="border border-line dark:border-espresso rounded-sm p-6 h-fit">
        <h2 className="font-display text-xl mb-5">Récapitulatif</h2>
        <div className="space-y-2 text-sm mb-4">
          {lines.map((l) => (
            <div key={`${l.productId}-${l.colorId}`} className="flex justify-between">
              <span className="text-espresso/70 dark:text-cream/70">
                {l.productName} ({l.colorName}) × {l.quantity}
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
            <span>{t.checkout.shipping}</span>
            <span>{shippingCost === 0 ? t.checkout.free : `${shippingCost.toLocaleString("fr-FR")} ${t.common.fcfa}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>{t.cart.total}</span>
            <span>{total.toLocaleString("fr-FR")} {t.common.fcfa}</span>
          </div>
        </div>
        <Link to="/panier" className="block mt-6 text-xs text-espresso/50 dark:text-cream/50 hover:text-caramel">
          ← Modifier le panier
        </Link>
      </div>
    </div>
  );
}
