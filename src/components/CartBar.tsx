"use client";

import { useCart } from "@/context/CartContext";

export function CartBar() {
  const { totalQuantity, totalCents } = useCart();

  if (totalQuantity === 0) return null;

  const label = totalQuantity === 1 ? "loaf" : "loaves";

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none animate-in slide-in-from-bottom">
      <div className="pointer-events-auto w-full md:w-auto md:mb-4 md:rounded-full bg-navy text-cream shadow-xl px-6 py-3 flex items-center justify-between gap-6 md:gap-8">
        <span className="text-sm font-medium">
          {totalQuantity} {label}
        </span>
        <span className="font-semibold">${(totalCents / 100).toFixed(2)}</span>
        <a
          href="#order"
          className="bg-coral hover:bg-coral/90 text-cream font-semibold px-5 py-2 rounded-full text-sm transition-colors"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
