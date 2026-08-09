import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { fr } from "@/i18n/fr";
import { wo } from "@/i18n/wo";
import type { Locale } from "@/types";

const dictionaries = { fr, wo };
const STORAGE_KEY = "laxassaye-locale";

interface LanguageContextValue {
  locale: Locale;
  t: typeof fr;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "wo" ? "wo" : "fr";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = useMemo(() => dictionaries[locale], [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
