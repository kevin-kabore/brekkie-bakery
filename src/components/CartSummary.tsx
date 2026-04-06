"use client";

import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";

interface CartSummaryProps {
  maxQty?: number;
}

export function CartSummary({ maxQty = 20 }: CartSummaryProps) {
  const { items, products, totalQuantity, totalCents, increment, decrement, mode } =
    useCart();
  const hidePrices = mode === "wholesale";

  const cartProducts = products.filter((p) => (items[p.id] || 0) > 0);

  if (cartProducts.length === 0) {
    return (
      <div className="rounded-xl border border-stone bg-cream/50 p-6 text-center">
        <p className="text-espresso/50 mb-3">Your cart is empty</p>
        <a
          href="#products"
          className="text-crust font-semibold hover:underline text-sm"
        >
          Browse Flavors
        </a>
      </div>
    );
  }

  const label = totalQuantity === 1 ? "loaf" : "loaves";

  return (
    <div className="rounded-xl border border-stone bg-cream/50 p-4">
      <h3 className="font-display text-lg text-espresso mb-3">Your Order</h3>
      <div className="flex flex-col gap-3">
        {cartProducts.map((product) => {
          const qty = items[product.id];
          const lineCents = qty * product.priceCents;
          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-sm text-espresso flex-1 truncate">
                {product.name}
              </span>
              <QuantityStepper
                quantity={qty}
                onIncrement={() => increment(product.id)}
                onDecrement={() => decrement(product.id)}
                max={maxQty}
                size="sm"
              />
              {!hidePrices && (
                <span className="text-sm font-semibold text-espresso w-20 text-right">
                  ${(lineCents / 100).toFixed(2)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-espresso/10 mt-3 pt-3 flex justify-between items-center">
        <span className="text-sm text-espresso/60">
          {totalQuantity} {label}
        </span>
        {!hidePrices && (
          <span className="font-semibold text-espresso">
            ${(totalCents / 100).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
