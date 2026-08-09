import { useEffect, useState, type FormEvent } from "react";
import { listColors, createColor, updateColor, deleteColor } from "@/services/colors";
import { invalidateColorsCache } from "@/hooks/useColors";
import type { ColorOption } from "@/types";

export default function AdminColors() {
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#3A2A1D");
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => listColors().then(setColors);

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setName("");
    setHex("#3A2A1D");
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateColor(editingId, { name, hex });
    } else {
      await createColor({ name, hex });
    }
    invalidateColorsCache();
    reset();
    load();
  };

  const handleEdit = (c: ColorOption) => {
    setEditingId(c.id);
    setName(c.name);
    setHex(c.hex);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette couleur ? Elle sera retirée des produits qui l'utilisent.")) return;
    await deleteColor(id);
    invalidateColorsCache();
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Couleurs</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 mb-8 border border-line dark:border-espresso rounded-sm p-4">
        <div>
          <label className="eyebrow block mb-1.5">Nom</label>
          <input required className="input-lax w-40" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-1.5">Couleur</label>
          <input type="color" className="h-11 w-16 border border-line dark:border-espresso rounded-sm" value={hex} onChange={(e) => setHex(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
        {editingId && (
          <button type="button" onClick={reset} className="text-sm text-espresso/50 dark:text-cream/50">
            Annuler
          </button>
        )}
      </form>

      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <div key={c.id} className="flex items-center gap-2 border border-line dark:border-espresso rounded-sm px-3 py-2">
            <span className="w-5 h-5 rounded-full border border-line" style={{ backgroundColor: c.hex }} />
            <span className="text-sm">{c.name}</span>
            <button onClick={() => handleEdit(c)} className="text-xs text-espresso/50 hover:text-caramel">
              Modifier
            </button>
            <button onClick={() => handleDelete(c.id)} className="text-xs text-clay">
              ×
            </button>
          </div>
        ))}
        {colors.length === 0 && <p className="text-sm text-espresso/50">Aucune couleur pour le moment.</p>}
      </div>
    </div>
  );
}
