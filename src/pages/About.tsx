import { useEffect, useState } from "react";
import { getSettings, DEFAULT_SETTINGS } from "@/services/settings";
import type { StoreSettings } from "@/types";

export default function About() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setSettings);
    document.title = "À propos — Laxassaye";
  }, []);

  return (
    <div className="container-lax py-24 max-w-2xl mx-auto">
      <p className="eyebrow mb-3">Depuis Dakar</p>
      <h1 className="font-display text-4xl mb-8">L'histoire Laxassaye</h1>
      <p className="text-espresso/80 dark:text-cream/80 leading-relaxed text-lg whitespace-pre-line">{settings.aboutText}</p>
    </div>
  );
}
