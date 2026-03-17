"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type { Product } from "@/types";

// ── State ──────────────────────────────────────────────
interface CartState {
  items: Record<string, number>; // productId → qty
}

const initialState: CartState = { items: {} };

// ── Actions ────────────────────────────────────────────
type CartAction =
  | { type: "SET_QUANTITY"; productId: string; qty: number }
  | { type: "INCREMENT"; productId: string }
  | { type: "DECREMENT"; productId: string }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_QUANTITY": {
      const qty = Math.max(0, action.qty);
      if (qty === 0) {
        const { [action.productId]: _, ...rest } = state.items;
        return { items: rest };
      }
      return { items: { ...state.items, [action.productId]: qty } };
    }
    case "INCREMENT":
      return {
        items: {
          ...state.items,
          [action.productId]: (state.items[action.productId] || 0) + 1,
        },
      };
    case "DECREMENT": {
      const current = state.items[action.productId] || 0;
      if (current <= 1) {
        const { [action.productId]: _, ...rest } = state.items;
        return { items: rest };
      }
      return { items: { ...state.items, [action.productId]: current - 1 } };
    }
    case "REMOVE": {
      const { [action.productId]: _, ...rest } = state.items;
      return { items: rest };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

// ── Context value ──────────────────────────────────────
interface CartContextValue {
  items: Record<string, number>;
  products: Product[];
  totalQuantity: number;
  totalCents: number;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ───────────────────────────────────────────
export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = Object.values(state.items).reduce(
      (sum, q) => sum + q,
      0
    );
    const totalCents = products.reduce(
      (sum, p) => sum + (state.items[p.id] || 0) * p.priceCents,
      0
    );

    return {
      items: state.items,
      products,
      totalQuantity,
      totalCents,
      increment: (id) => dispatch({ type: "INCREMENT", productId: id }),
      decrement: (id) => dispatch({ type: "DECREMENT", productId: id }),
      setQuantity: (id, qty) =>
        dispatch({ type: "SET_QUANTITY", productId: id, qty }),
      remove: (id) => dispatch({ type: "REMOVE", productId: id }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
