"use client";

import { ProductCard } from "@/components/ProductCard";
import { Snowflake, Refrigerator, Timer } from "lucide-react";
import type { Product } from "@/types";

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-14">
          <div className="w-12 h-px bg-stone mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-3">
            Our Flavors
          </h2>
          <p className="text-espresso/50 text-center mb-4">
            Protein-packed banana bread, baked in small batches in NYC.
          </p>
          <p className="inline-flex items-center gap-1 bg-label-navy text-white font-semibold text-sm px-5 py-2.5 rounded-full">
            <span className="font-bold text-base">12g</span> of protein in every slice
          </p>
        </div>

        {/* Freshness & shelf life — above products to frame value before price */}
        <div className="mb-14 rounded-2xl border border-stone/60 bg-cream-dark/40 px-6 py-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-sage/15 text-sage flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">21-Day Shelf Life</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  Stays fresh at room temperature, unopened
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-crust/10 text-crust flex items-center justify-center">
                <Refrigerator className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">Refrigerate After Opening</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  For best texture, enjoy within 1 month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-label-blue/10 text-label-blue flex items-center justify-center">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">Freeze Up to 3 Months</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  Sealed in a resealable freezer bag for lasting freshness
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
