"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";
import { getProductImages } from "@/lib/images";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, increment, decrement } = useCart();
  const qty = items[product.id] || 0;
  const priceDisplay = `$${(product.priceCents / 100).toFixed(2)}`;
  const images = getProductImages(product.slug);

  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      {/* Image with hover crossfade */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={images.hero}
          alt={`${product.name} banana bread`}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Image
          src={images.sliced}
          alt={`${product.name} sliced`}
          fill
          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg text-navy">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold text-navy/80">
            {priceDisplay}
          </span>
        </div>

        <p className="text-navy/50 text-sm">
          {product.proteinGrams}g Protein &middot; {product.calories} cal
        </p>

        <div className="flex flex-wrap gap-1 mt-2 mb-4">
          {product.allergens.map((allergen) => (
            <span
              key={allergen}
              className="text-[11px] bg-navy/5 text-navy/50 px-2 py-0.5 rounded-full"
            >
              {allergen}
            </span>
          ))}
        </div>

        {qty === 0 ? (
          <button
            type="button"
            onClick={() => increment(product.id)}
            className="w-full bg-coral hover:bg-coral/90 text-cream font-semibold py-3 rounded-full transition-colors cursor-pointer text-sm"
          >
            + Add to Cart
          </button>
        ) : (
          <div className="flex justify-center">
            <QuantityStepper
              quantity={qty}
              onIncrement={() => increment(product.id)}
              onDecrement={() => decrement(product.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
