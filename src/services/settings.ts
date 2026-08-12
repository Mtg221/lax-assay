import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StoreSettings } from "@/types";

const DOC_PATH = ["settings", "store"] as const;

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Laxassaye",
  logoUrl: "",
  whatsappNumber: "",
  socialLinks: {},
  heroSlogan: "L'élégance, une écharpe à la fois.",
  heroImageUrl: "",
  cafeToubaHeroImageUrl: "",
  aboutText: "Laxassaye crée des écharpes intemporelles, pensées pour durer et se transmettre.",
  freeShippingEnabled: false,
  freeShippingZoneIds: [],
};

export async function getSettings(): Promise<StoreSettings> {
  const snap = await getDoc(doc(db, ...DOC_PATH));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<StoreSettings>) };
}

export async function saveSettings(data: Partial<StoreSettings>) {
  return setDoc(doc(db, ...DOC_PATH), data, { merge: true });
}
