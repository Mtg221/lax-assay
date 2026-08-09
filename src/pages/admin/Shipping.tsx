import { useEffect, useState, type FormEvent } from "react";
import { listShippingZones, createShippingZone, updateShippingZone, deleteShippingZone } from "@/services/shipping";
import type { ShippingZone } from "@/types";

export default function AdminShipping() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [country, setCountry] = useState("Sénégal");
  const [zone, setZone] = useState("");
  const [price, setPrice] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => listShippingZones().then(setZones);

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setCountry("Sénégal");
    setZone("");
    setPrice(0);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = { country, zone, price, freeShipping: price === 0 };
    if (editingId) {
      await updateShippingZone(editingId, data);
    } else {
      await createShippingZone(data);
    }
    reset();
    load();
  };

  const handleEdit = (z: ShippingZone) => {
    setEditingId(z.id);
    setCountry(z.country);
    setZone(z.zone);
    setPrice(z.price);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette zone ?")) return;
    await deleteShippingZone(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Livraison</h1>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-3 items-end mb-8 border border-line dark:border-espresso rounded-sm p-4">
        <div>
          <label className="eyebrow block mb-1.5">Pays</label>
          <input required className="input-lax" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-1.5">Zone</label>
          <input required className="input-lax" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Ex : Dakar Plateau" />
        </div>
        <div>
          <label className="eyebrow block mb-1.5">Tarif (FCFA)</label>
          <input required type="number" min={0} className="input-lax" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <button type="submit" className="btn-primary h-11">
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center justify-between p-4 text-sm">
            <span>
              {z.country} — {z.zone}
            </span>
            <div className="flex items-center gap-4">
              <span>{z.price === 0 ? "Gratuite" : `${z.price.toLocaleString("fr-FR")} FCFA`}</span>
              <button onClick={() => handleEdit(z)} className="text-xs text-espresso/50 hover:text-caramel">
                Modifier
              </button>
              <button onClick={() => handleDelete(z.id)} className="text-xs text-clay">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {zones.length === 0 && <p className="p-6 text-sm text-espresso/50">Aucune zone pour le moment.</p>}
      </div>
    </div>
  );
}
