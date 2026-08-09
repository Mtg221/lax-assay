import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/services/settings";
import { uploadImage } from "@/lib/cloudinary";
import { listAllProductsAdmin, updateProduct } from "@/services/products";
import type { StoreSettings, Product } from "@/types";

export default function AdminHomepage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
    listAllProductsAdmin().then(setProducts);
  }, []);

  const handleHeroUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, "laxassaye/hero");
      setSettings((s) => ({ ...s, heroImageUrl: result.url, heroImagePublicId: result.publicId }));
    } finally {
      setUploading(false);
    }
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

  const toggleFeatured = async (p: Product) => {
    await updateProduct(p.id, { featured: !p.featured });
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Homepage</h1>

      <form onSubmit={handleSave} className="space-y-5 mb-12">
        <div>
          <label className="eyebrow block mb-2">Slogan (hero)</label>
          <input className="input-lax" value={settings.heroSlogan} onChange={(e) => setSettings({ ...settings, heroSlogan: e.target.value })} />
        </div>

        <div>
          <label className="eyebrow block mb-2">Image du hero</label>
          <input type="file" accept="image/*" onChange={(e) => handleHeroUpload(e.target.files?.[0])} disabled={uploading} />
          {settings.heroImageUrl && <img src={settings.heroImageUrl} alt="" className="mt-3 w-full max-w-sm aspect-video object-cover rounded-sm" />}
        </div>

        <div>
          <label className="eyebrow block mb-2">Texte "À propos"</label>
          <textarea rows={4} className="input-lax" value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>

      <div>
        <label className="eyebrow block mb-3">Produits mis en avant</label>
        <div className="border border-line dark:border-espresso rounded-sm divide-y divide-line dark:divide-espresso">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-3 p-3 text-sm">
              <input type="checkbox" checked={p.featured} onChange={() => toggleFeatured(p)} />
              {p.name}
            </label>
          ))}
          {products.length === 0 && (
            <p className="p-4 text-sm text-espresso/50">
              Aucun produit. <Link to="/admin/produits/nouveau" className="text-caramel">Créer un produit</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
