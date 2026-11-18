"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { cartReducer, type CartAction, type CartItem } from "@/lib/cart";

const STORAGE_KEY = "catalogo-whatsapp-cart";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: string | null) => void;
  setQuantity: (productId: string, size: string | null, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function persist(items: CartItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota): the cart lives in memory only.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);

  // Load the stored cart once after hydration; storage is written on each
  // cart action below, so no persist-on-render effect is needed.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            dispatch({ type: "add", item, quantity: item.quantity });
          }
        }
      }
    } catch {
      // Corrupted storage: start with an empty cart.
    }
  }, []);

  function update(action: CartAction): void {
    persist(cartReducer(items, action));
    dispatch(action);
  }

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item) => update({ type: "add", item }),
      removeItem: (productId, size) => update({ type: "remove", productId, size }),
      setQuantity: (productId, size, quantity) => update({ type: "setQuantity", productId, size, quantity }),
      clear: () => update({ type: "clear" }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
