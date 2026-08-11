import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSettings } from "@/services/settings";
import type { StoreSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/services/settings";

interface SettingsContextValue {
  settings: StoreSettings;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  const refresh = async () => {
    const s = await getSettings();
    setSettings(s);
  };

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}