import { useEffect, useState } from "react";
import { listColors } from "@/services/colors";
import type { ColorOption } from "@/types";

let cache: ColorOption[] | null = null;

export function useColors() {
  const [colors, setColors] = useState<ColorOption[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    listColors()
      .then((c) => {
        cache = c;
        setColors(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const byId = (id: string) => colors.find((c) => c.id === id);

  return { colors, byId, loading };
}

export function invalidateColorsCache() {
  cache = null;
}
