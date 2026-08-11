export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ProductColorStock {
  colorId: string;
  stock: number;
  priceOverride?: number | null; // optional per-color price
}

export interface Promotion {
  active: boolean;
  discountAmount: number; // fixed amount in FCFA
  startDate?: string | null; // ISO date
  endDate?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number; // base price in FCFA
  photos: { url: string; publicId: string }[];
  colors: ProductColorStock[];
  promotion: Promotion | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CafeToubaProduct {
  id: string;
  name: string;
  description: string;
  price: number; // base price in FCFA
  format: string; // e.g., "250g", "500g", "1kg"
  imageUrl: string;
  imagePublicId: string;
  stock: number;
  active: boolean;
  badge?: string; // e.g., "Populaire", "Nouveau"
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  country: string;
  zone: string;
  price: number; // FCFA, 0 if free
  freeShipping: boolean;
}

export type OrderStatus = "Nouvelle" | "Confirmée" | "En préparation" | "Expédiée" | "Livrée" | "Annulée";

export interface OrderItem {
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  quantity: number;
  unitPrice: number; // price actually charged at purchase time
}

export interface CafeToubaOrderItem {
  productId: string;
  productName: string;
  format: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // LAX-2026-000001
  customerName: string;
  phone: string;
  whatsapp: string;
  country: string;
  zone: string;
  address: string;
  comment?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CafeToubaOrder {
  id: string;
  orderNumber: string; // CT-2026-000001
  customerName: string;
  phone: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  address: string;
  comment?: string;
  items: CafeToubaOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "cash_on_delivery" | "wave" | "orange_money";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId?: string | null;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  status: "En attente" | "Approuvé" | "Refusé";
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl: string;
  whatsappNumber: string; // international format, digits only
  socialLinks: { instagram?: string; facebook?: string; tiktok?: string };
  heroSlogan: string;
  heroImageUrl: string;
  heroImagePublicId?: string;
  aboutText: string;
  freeShippingEnabled: boolean;
  freeShippingZoneIds: string[];
}

export type Locale = "fr" | "wo";
