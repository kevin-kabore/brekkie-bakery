"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { StripePattern } from "@/components/ui/StripePattern";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-white">
      <div className="relative h-48 md:h-56">
        <StripePattern color={product.stripeColor} opacity={0.15} />
        <Image
          src={product.image}
          alt={`${product.name} banana bread label`}
          fill
          className="object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-navy">{product.name}</h3>
        <span className="inline-block bg-blueberry text-cream text-xs font-bold px-3 py-1 rounded-full mt-2">
          12g Protein
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
