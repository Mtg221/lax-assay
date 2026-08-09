import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

const STORAGE_KEY = "laxassaye-cart";

export interface CartLine {
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  unitPrice: number; // display price only — re-verified at checkout
  quantity: number;
  photoUrl: string;
  maxStock: number;
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  updateQuantity: (productId: string, colorId: string, quantity: number) => void;
  removeLine: (productId: string, colorId: string) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addLine = (line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === line.productId && l.colorId === line.colorId);
      if (existing) {
        return prev.map((l) =>
          l.productId === line.productId && l.colorId === line.colorId
            ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.maxStock) }
            : l
        );
      }
      return [...prev, line];
    });
  };

  const updateQuantity = (productId: string, colorId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId && l.colorId === colorId
            ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
            : l
        )
        .filter((l) => l.quantity > 0)
    );
  };

  const removeLine = (productId: string, colorId: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.colorId === colorId)));
  };

  const clear = () => setLines([]);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0), [lines]);
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, addLine, updateQuantity, removeLine, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
