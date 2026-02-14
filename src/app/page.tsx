import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { WhyBrekkie } from "@/components/WhyBrekkie";
import { OurStory } from "@/components/OurStory";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <WhyBrekkie />
        <OurStory />
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
