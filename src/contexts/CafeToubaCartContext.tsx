import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

const STORAGE_KEY = "laxassaye-cafe-touba-cart";

export interface CafeToubaCartLine {
  productId: string;
  productName: string;
  format: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
}

interface CafeToubaCartContextValue {
  lines: CafeToubaCartLine[];
  addLine: (line: CafeToubaCartLine) => void;
  updateQuantity: (productId: string, format: string, quantity: number) => void;
  removeLine: (productId: string, format: string) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CafeToubaCartContext = createContext<CafeToubaCartContextValue | null>(null);

export function CafeToubaCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CafeToubaCartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CafeToubaCartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addLine = (line: CafeToubaCartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === line.productId && l.format === line.format);
      if (existing) {
        return prev.map((l) =>
          l.productId === line.productId && l.format === line.format
            ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.maxStock) }
            : l
        );
      }
      return [...prev, line];
    });
  };

  const updateQuantity = (productId: string, format: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId && l.format === format
            ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
            : l
        )
        .filter((l) => l.quantity > 0)
    );
  };

  const removeLine = (productId: string, format: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.format === format)));
  };

  const clear = () => setLines([]);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0), [lines]);
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CafeToubaCartContext.Provider value={{ lines, addLine, updateQuantity, removeLine, clear, subtotal, itemCount }}>
      {children}
    </CafeToubaCartContext.Provider>
  );
}

export function useCafeToubaCart() {
  const ctx = useContext(CafeToubaCartContext);
  if (!ctx) throw new Error("useCafeToubaCart must be used within CafeToubaCartProvider");
  return ctx;
}