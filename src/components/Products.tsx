import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";

export function Products() {
  return (
    <section id="products" className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-navy mb-4">
          Our Flavors
        </h2>
        <p className="text-center text-navy/60 mb-12">
          12g of protein in every serving. Baked fresh in NYC.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
