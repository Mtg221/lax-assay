import { useEffect, useState, type FormEvent } from "react";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/services/settings";
import { listShippingZones } from "@/services/shipping";
import { uploadImage } from "@/lib/cloudinary";
import type { StoreSettings, ShippingZone } from "@/types";

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
    listShippingZones().then(setZones);
  }, []);

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, "laxassaye/logo");
      setSettings((s) => ({ ...s, logoUrl: result.url }));
    } finally {
      setUploading(false);
    }
  };

  const toggleFreeZone = (zoneId: string) => {
    setSettings((s) => ({
      ...s,
      freeShippingZoneIds: s.freeShippingZoneIds.includes(zoneId)
        ? s.freeShippingZoneIds.filter((id) => id !== zoneId)
        : [...s.freeShippingZoneIds, zoneId],
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl mb-8">Paramètres</h1>

      <div>
        <label className="eyebrow block mb-2">Nom de la boutique</label>
        <input className="input-lax" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Logo</label>
        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e.target.files?.[0])} disabled={uploading} />
        {settings.logoUrl && <img src={settings.logoUrl} alt="" className="mt-3 h-14" />}
      </div>

      <div>
        <label className="eyebrow block mb-2">Numéro WhatsApp Business</label>
        <input
          placeholder="Ex : 221771234567 (format international, sans le +)"
          className="input-lax"
          value={settings.whatsappNumber}
          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <input
          placeholder="Instagram (URL)"
          className="input-lax"
          value={settings.socialLinks.instagram || ""}
          onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
        />
        <input
          placeholder="Facebook (URL)"
          className="input-lax"
          value={settings.socialLinks.facebook || ""}
          onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
        />
        <input
          placeholder="TikTok (URL)"
          className="input-lax"
          value={settings.socialLinks.tiktok || ""}
          onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, tiktok: e.target.value } })}
        />
      </div>

      <div className="border border-line dark:border-espresso rounded-sm p-4 space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.freeShippingEnabled} onChange={(e) => setSettings({ ...settings, freeShippingEnabled: e.target.checked })} />
          Activer la livraison gratuite pour certaines zones
        </label>
        {settings.freeShippingEnabled && (
          <div className="space-y-1.5 pl-1">
            {zones.map((z) => (
              <label key={z.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.freeShippingZoneIds.includes(z.id)} onChange={() => toggleFreeZone(z.id)} />
                {z.country} — {z.zone}
              </label>
            ))}
            {zones.length === 0 && <p className="text-xs text-espresso/50">Créez d'abord des zones dans l'onglet "Livraison".</p>}
          </div>
        )}
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
