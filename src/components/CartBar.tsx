"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export function CartBar() {
  const { totalQuantity, totalCents } = useCart();

  if (totalQuantity === 0) return null;

  const label = totalQuantity === 1 ? "loaf" : "loaves";

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none animate-in slide-in-from-bottom">
      <div className="pointer-events-auto w-full md:w-auto md:mb-6 md:rounded-full bg-espresso text-cream shadow-2xl ring-1 ring-cream/10 px-6 py-3 flex items-center justify-between gap-6 md:gap-8">
        <span className="text-sm font-medium flex items-center gap-2">
          <ShoppingBag size={16} />
          {totalQuantity} {label}
        </span>
        <span className="font-semibold">
          ${(totalCents / 100).toFixed(2)}
        </span>
        <a
          href="#order"
          className="bg-crust hover:bg-crust-light text-cream font-semibold px-6 py-2 rounded-full text-sm transition-colors"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
