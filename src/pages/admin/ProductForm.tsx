import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "@/services/products";
import { uploadImage } from "@/lib/cloudinary";
import { useColors } from "@/hooks/useColors";
import type { Product, ProductColorStock, Promotion } from "@/types";

const emptyPromotion: Promotion = { active: false, discountAmount: 0, startDate: null, endDate: null };

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "nouveau";
  const navigate = useNavigate();
  const { colors: palette } = useColors();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState(0);
  const [photos, setPhotos] = useState<{ url: string; publicId: string }[]>([]);
  const [colorStocks, setColorStocks] = useState<ProductColorStock[]>([]);
  const [promotion, setPromotion] = useState(emptyPromotion);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    getProduct(id).then((p) => {
      if (!p) return;
      setName(p.name);
      setDescription(p.description);
      setMaterial(p.material);
      setPrice(p.price);
      setPhotos(p.photos);
      setColorStocks(p.colors);
      setPromotion(p.promotion || emptyPromotion);
      setActive(p.active);
      setFeatured(p.featured);
    });
  }, [id, isEdit]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadImage(file);
        setPhotos((prev) => [...prev, result]);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setUploading(false);
    }
  };

  const toggleColor = (colorId: string) => {
    setColorStocks((prev) => {
      const exists = prev.find((c) => c.colorId === colorId);
      if (exists) return prev.filter((c) => c.colorId !== colorId);
      return [...prev, { colorId, stock: 0, priceOverride: null }];
    });
  };

  const updateColorStock = (colorId: string, stock: number) => {
    setColorStocks((prev) => prev.map((c) => (c.colorId === colorId ? { ...c, stock } : c)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      material,
      price,
      photos,
      colors: colorStocks,
      promotion: promotion.active ? promotion : null,
      active,
      featured,
    };
    try {
      if (isEdit && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/produits");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl mb-6">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>

      <input required placeholder="Nom" className="input-lax" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea required placeholder="Description" rows={4} className="input-lax" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input required placeholder="Matière" className="input-lax" value={material} onChange={(e) => setMaterial(e.target.value)} />
      <div>
        <label className="eyebrow block mb-2">Prix (FCFA)</label>
        <input required type="number" min={0} className="input-lax" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Photos</label>
        <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e.target.files)} disabled={uploading} />
        {uploading && <p className="text-xs mt-2">Envoi en cours…</p>}
        <div className="flex flex-wrap gap-3 mt-3">
          {photos.map((ph, i) => (
            <div key={ph.publicId} className="relative w-20 h-24 rounded-sm overflow-hidden border border-line dark:border-espresso">
              <img src={ph.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-cream text-xs rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-2">Couleurs & stock</label>
        <div className="space-y-2">
          {palette.map((c) => {
            const entry = colorStocks.find((cs) => cs.colorId === c.id);
            return (
              <div key={c.id} className="flex items-center gap-3">
                <input type="checkbox" checked={!!entry} onChange={() => toggleColor(c.id)} />
                <span className="w-4 h-4 rounded-full border border-line" style={{ backgroundColor: c.hex }} />
                <span className="text-sm w-28">{c.name}</span>
                {entry && (
                  <input
                    type="number"
                    min={0}
                    placeholder="Stock"
                    className="input-lax w-28 py-1.5"
                    value={entry.stock}
                    onChange={(e) => updateColorStock(c.id, Number(e.target.value))}
                  />
                )}
              </div>
            );
          })}
          {palette.length === 0 && <p className="text-xs text-espresso/50">Ajoutez d'abord des couleurs dans l'onglet "Couleurs".</p>}
        </div>
      </div>

      <div className="border border-line dark:border-espresso rounded-sm p-4 space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={promotion.active} onChange={(e) => setPromotion({ ...promotion, active: e.target.checked })} />
          Promotion active
        </label>
        {promotion.active && (
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="number"
              min={0}
              placeholder="Réduction (FCFA)"
              className="input-lax"
              value={promotion.discountAmount}
              onChange={(e) => setPromotion({ ...promotion, discountAmount: Number(e.target.value) })}
            />
            <input type="date" className="input-lax" value={promotion.startDate || ""} onChange={(e) => setPromotion({ ...promotion, startDate: e.target.value || null })} />
            <input type="date" className="input-lax" value={promotion.endDate || ""} onChange={(e) => setPromotion({ ...promotion, endDate: e.target.value || null })} />
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Actif
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Mis en avant (page d'accueil)
        </label>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
