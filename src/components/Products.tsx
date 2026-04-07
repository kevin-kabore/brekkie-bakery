"use client";

import { ProductCard } from "@/components/ProductCard";
import { Snowflake, Refrigerator, Timer, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const { mode, setMode } = useCart();
  const isWholesale = mode === "wholesale";

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

        {/* Mode toggle — Preorder / Wholesale */}
        <div id="order-mode" className="scroll-mt-24 flex flex-col items-center mb-8">
          <div role="group" aria-label="Order mode" className="inline-flex bg-stone/50 rounded-lg p-1">
            <button
              type="button"
              aria-pressed={mode === "preorder"}
              onClick={() => setMode("preorder")}
              className={
                mode === "preorder"
                  ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer transition-colors"
                  : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer transition-colors"
              }
            >
              Preorder
            </button>
            <button
              type="button"
              aria-pressed={mode === "wholesale"}
              onClick={() => setMode("wholesale")}
              className={
                mode === "wholesale"
                  ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer transition-colors"
                  : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer transition-colors"
              }
            >
              Wholesale
            </button>
          </div>

          {/* Wholesale info banner */}
          <div aria-live="polite">
          {isWholesale && (
            <div className="mt-4 max-w-2xl w-full rounded-xl bg-stone/30 border border-stone/60 px-5 py-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-espresso/50 shrink-0 mt-0.5" />
              <p className="text-sm text-espresso/60">
                Wholesale pricing available upon request. Select items you&apos;re interested in
                and a team member will reach out within 1–2 business days.
              </p>
            </div>
          )}
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
