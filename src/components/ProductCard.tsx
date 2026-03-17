"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { StripePattern } from "@/components/ui/StripePattern";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isPlaceholder = product.image === PLACEHOLDER_IMAGE;
  const priceDisplay = `$${(product.priceCents / 100).toFixed(2)}`;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-white">
      <div className="relative h-48 md:h-56">
        <StripePattern color={product.stripeColor} opacity={0.15} />
        <Image
          src={product.image}
          alt={`${product.name} banana bread`}
          fill
          className={isPlaceholder ? "object-contain p-4" : "object-contain"}
          {...(isPlaceholder ? { unoptimized: true } : {})}
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-navy">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold text-navy/80">
            {priceDisplay}
          </span>
        </div>
        <span className="inline-block bg-navy text-cream text-xs font-bold px-3 py-1 rounded-full mt-2">
          {product.proteinGrams}g Protein
        </span>
        <p className="text-navy/60 text-sm mt-2">
          {product.calories} cal per serving
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {product.allergens.map((allergen) => (
            <span
              key={allergen}
              className="text-xs bg-navy/10 text-navy/70 px-2 py-0.5 rounded-full"
            >
              {allergen}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
