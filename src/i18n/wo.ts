import type { TranslationShape } from "./fr";

// Traduction de base en Wolof. À faire relire par un locuteur natif avant
// mise en production pour affiner le ton et le vocabulaire commercial.
export const wo: TranslationShape = {
  nav: {
    home: "Kër",
    shop: "Bitik",
    about: "Ci sunu mbir",
    cart: "Paanax",
  },
  hero: {
    cta: "Xool coleksioŋ bi",
  },
  home: {
    featured: "Jël bu gën a rafet",
    aboutTitle: "Taariix Laxassaye",
    shopCta: "Xool bitik bi bépp",
  },
  product: {
    material: "Doomu",
    colors: "Melo",
    outOfStock: "Amul ci butik",
    quantity: "Lim",
    addToCart: "Def ci paanax",
    inStock: "Am na",
    chooseColor: "Tann melo",
  },
  cart: {
    title: "Sa paanax",
    empty: "Paanax bi neen la.",
    subtotal: "Wàll-limu",
    total: "Limu bépp",
    checkout: "Yeggali sant bi",
    remove: "Taxaw",
    continueShopping: "Gën a jëfandikoo bitik bi",
  },
  checkout: {
    title: "Yeggali sant bi",
    name: "Tur wi bépp",
    phone: "Nimero telefon",
    whatsapp: "Nimero WhatsApp",
    country: "Réew",
    zone: "Gox",
    address: "Adres",
    comment: "Waxtaan (du wardiku)",
    payment: "Fey bu ñëwee",
    submit: "Dëggal sant bi",
    shipping: "Yóbbu",
    discount: "Wàññi",
    free: "Amul njëg",
  },
  confirmation: {
    title: "Sant bi nekk na",
    thanks: "Jërëjëf ci sa sant bi.",
    orderNumber: "Limero sant bi",
    whatsappCta: "Dëggal ci WhatsApp",
  },
  common: {
    fcfa: "FCFA",
    loading: "Di xaar…",
  },
};
