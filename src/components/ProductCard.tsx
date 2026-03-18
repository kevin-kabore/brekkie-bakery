"use client";

import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getProductImages } from "@/lib/images";
import { ShoppingBag, Award } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, increment, decrement } = useCart();
  const qty = items[product.id] || 0;
  const priceDisplay = `$${(product.priceCents / 100).toFixed(2)}`;
  const images = getProductImages(product.slug);

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-stone/80 hover:border-crust/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className="h-[3px]"
        style={{ backgroundColor: product.accentColor }}
      />

      <div className="relative">
        <ImageCarousel images={images.carousel} alt={`${product.name} banana bread`} />
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-golden text-espresso text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            <Award size={14} />
            Best Seller
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-xl text-espresso">{product.name}</h3>
          <span className="shrink-0 text-crust font-semibold text-lg">
            {priceDisplay}
          </span>
        </div>

        <p className="text-espresso/50 text-sm">
          {product.proteinGrams}g Protein &middot; {product.calories} cal per slice
        </p>
        <p className="text-espresso/40 text-xs">
          12 slices per loaf &middot; Free delivery
        </p>

        <div className="flex flex-wrap gap-1 mt-2 mb-4">
          {product.allergens.map((allergen) => (
            <span
              key={allergen}
              className="text-[11px] bg-stone/60 text-espresso/50 px-2 py-0.5 rounded-full"
            >
              {allergen}
            </span>
          ))}
        </div>

        {qty === 0 ? (
          <button
            type="button"
            onClick={() => increment(product.id)}
            className="w-full bg-crust hover:bg-crust-light text-cream font-semibold py-3 rounded-full transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            Add to Cart
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
