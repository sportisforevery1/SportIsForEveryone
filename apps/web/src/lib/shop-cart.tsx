"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { CartLine } from "@/lib/shop-model";

const STORAGE_KEY = "sife-cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: CartLine["productId"], size: string, quantity: number) => void;
  remove: (productId: CartLine["productId"], size: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(line: CartLine, productId: CartLine["productId"], size: string) {
  return String(line.productId) === String(productId) && line.size === size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add: (line, quantity = 1) => {
        setLines((current) => {
          const index = current.findIndex((item) => sameLine(item, line.productId, line.size));
          if (index >= 0) {
            const next = [...current];
            next[index] = { ...next[index], quantity: next[index].quantity + quantity };
            return next;
          }
          return [...current, { ...line, quantity }];
        });
        setOpen(true);
      },
      setQuantity: (productId, size, quantity) => {
        setLines((current) =>
          current
            .map((line) => (sameLine(line, productId, size) ? { ...line, quantity } : line))
            .filter((line) => line.quantity > 0),
        );
      },
      remove: (productId, size) => {
        setLines((current) => current.filter((line) => !sameLine(line, productId, size)));
      },
      clear: () => setLines([]),
      open,
      setOpen,
    }),
    [lines, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
