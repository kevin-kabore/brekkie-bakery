"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-14">
          <div className="w-12 h-px bg-stone mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-3">
            Our Flavors
          </h2>
          <p className="text-espresso/50 text-center">
            12g of protein per slice. 12 slices per loaf. Ships in 3–5 business days.
          </p>
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
