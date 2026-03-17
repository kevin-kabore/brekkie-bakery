import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { WhyBrekkie } from "@/components/WhyBrekkie";
import { OurStory } from "@/components/OurStory";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import { getProducts, getSettings } from "@/lib/products";
import { CartShell } from "@/components/CartShell";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);

  return (
    <CartShell products={products}>
      <main>
        <Hero />
        <Products products={products} />
        <WhyBrekkie />
        <OurStory />
        <OrderSection products={products} settings={settings} />
      </main>
      <Footer />
    </CartShell>
  );
}
