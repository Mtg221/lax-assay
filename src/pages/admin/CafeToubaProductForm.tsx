import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCafeToubaProduct, createCafeToubaProduct, updateCafeToubaProduct } from "@/services/cafeToubaProducts";
import { uploadImage } from "@/lib/cloudinary";
import type { CafeToubaProduct } from "@/types";

export default function AdminCafeToubaProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "nouveau";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [format, setFormat] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [stock, setStock] = useState(0);
  const [active, setActive] = useState(true);
  const [badge, setBadge] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    getCafeToubaProduct(id).then((p) => {
      if (!p) return;
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setFormat(p.format);
      setImageUrl(p.imageUrl);
      setImagePublicId(p.imagePublicId);
      setStock(p.stock);
      setActive(p.active);
      setBadge(p.badge || "");
    });
  }, [id, isEdit]);

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, "laxassaye/cafe-touba");
      setImageUrl(result.url);
      setImagePublicId(result.publicId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Omit<CafeToubaProduct, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      price,
      format,
      imageUrl,
      imagePublicId,
      stock,
      active,
      badge: badge || undefined,
    };
    try {
      if (isEdit && id) {
        await updateCafeToubaProduct(id, payload);
      } else {
        await createCafeToubaProduct(payload);
      }
      navigate("/admin/cafe-touba/produits");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl mb-6">{isEdit ? "Modifier le café" : "Nouveau café"}</h1>

      <input required placeholder="Nom" className="input-lax" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea required placeholder="Description" rows={4} className="input-lax" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div>
        <label className="eyebrow block mb-2">Prix (FCFA)</label>
        <input required type="number" min={0} className="input-lax" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div>
        <label className="eyebrow block mb-2">Format (ex: 250g, 500g, 1kg)</label>
        <input required placeholder="250g" className="input-lax" value={format} onChange={(e) => setFormat(e.target.value)} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} disabled={uploading} />
        {uploading && <p className="text-xs mt-2">Envoi en cours…</p>}
        {imageUrl && (
          <div className="mt-3 w-full max-w-sm aspect-video rounded-sm overflow-hidden border border-line dark:border-espresso">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="eyebrow block mb-2">Stock</label>
        <input type="number" min={0} className="input-lax" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Badge (optionnel)</label>
        <input placeholder="Ex: Populaire, Nouveau" className="input-lax" value={badge} onChange={(e) => setBadge(e.target.value)} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Actif
        </label>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}