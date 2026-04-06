"use client";

import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getProductImages, getCrossSectionPosition } from "@/lib/images";
import { ShoppingBag, Award } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, increment, decrement, mode } = useCart();
  const isWholesale = mode === "wholesale";
  const qty = items[product.id] || 0;
  const priceRaw = product.priceCents / 100;
  const priceDisplay = `$${priceRaw % 1 === 0 ? priceRaw : priceRaw.toFixed(2)}`;
  const images = getProductImages(product.slug);
  // Only the cross-section image (index 2) needs custom positioning
  const positions = [undefined, undefined, getCrossSectionPosition(product.slug)];

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-stone/80 hover:border-crust/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className="h-[3px]"
        style={{ backgroundColor: product.accentColor }}
      />

      <div className="relative">
        <ImageCarousel images={images.carousel} alt={`${product.name} banana bread`} positions={positions} />
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-golden text-espresso text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            <Award size={14} />
            Best Seller
          </div>
        )}
        {/* Protein seal badge — matches label starburst style */}
        <div className="absolute top-3 right-3 z-10 w-[4.25rem] h-[4.25rem] flex items-center justify-center drop-shadow-lg">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <polygon
              fill="var(--color-label-navy)"
              points="50,0 61,12 75,5 78,21 93,22 88,37 100,48 90,60 96,75 81,78 78,93 63,88 50,100 37,88 22,93 19,78 4,75 10,60 0,48 12,37 7,22 22,21 25,5 39,12"
            />
          </svg>
          <div className="relative flex flex-col items-center justify-center leading-none text-white">
            <span className="text-base font-bold">144g</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Protein</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-display text-xl text-espresso leading-tight">{product.name}</h3>
          {!isWholesale && (
            <span className="shrink-0 text-crust font-bold text-lg">
              {priceDisplay}
            </span>
          )}
        </div>

        <p className="text-espresso/55 text-sm leading-relaxed mt-1">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-espresso/45">
          <span>{product.calories} cal / slice</span>
          <span className="w-1 h-1 rounded-full bg-espresso/20" />
          <span>12 slices per loaf</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.allergens.map((allergen) => (
            <span
              key={allergen}
              className="text-[11px] bg-stone/60 text-espresso/50 px-2 py-0.5 rounded-full"
            >
              {allergen}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          {qty === 0 ? (
            <button
              type="button"
              onClick={() => increment(product.id)}
              className="w-full bg-crust hover:bg-crust-light text-cream font-semibold py-3 rounded-full transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {isWholesale ? "Add to Inquiry" : "Add to Cart"}
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
    </div>
  );
}
