import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-end justify-center bg-espresso">
      {/* Full-bleed background image — vertical crop on mobile, landscape on desktop */}
      <Image
        src="/images/hero-v2.jpg"
        alt="Fresh-baked protein banana bread loaf"
        fill
        priority
        className="object-cover md:hidden"
        sizes="100vw"
      />
      <Image
        src="/images/hero-coconut-final.jpg"
        alt="Fresh-baked coconut walnut protein banana bread loaf"
        fill
        priority
        className="object-cover hidden md:block"
        sizes="100vw"
      />

      {/* Warm gradient overlay — heavier at bottom where text lives */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(44, 24, 16, 0.85) 0%, rgba(44, 24, 16, 0.5) 35%, rgba(44, 24, 16, 0.15) 60%, transparent 80%)",
        }}
      />

      {/* Content — positioned in lower third */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 pb-24 pt-16 animate-[fadeUp_0.8s_ease-out]">
        {/* Decorative line */}
        <div className="flex items-center gap-4">
          <span className="block w-16 md:w-24 h-px bg-cream/30" />
          <span className="text-cream/40 text-lg">~</span>
          <span className="block w-16 md:w-24 h-px bg-cream/30" />
        </div>

        {/* Main heading */}
        <h1
          className="font-display text-7xl md:text-9xl text-cream tracking-tight leading-none"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
        >
          Brekkie
        </h1>

        {/* Accent text */}
        <p className="font-accent text-cream text-4xl md:text-5xl drop-shadow-md">
          Protein Banana Bread
        </p>

        {/* Tagline */}
        <p className="font-body text-xl md:text-2xl text-cream/80 italic max-w-lg">
          Sweet enough for dessert. Smart enough for breakfast.
        </p>

        {/* Decorative line */}
        <div className="flex items-center gap-4">
          <span className="block w-16 md:w-24 h-px bg-cream/30" />
          <span className="text-cream/40 text-lg">~</span>
          <span className="block w-16 md:w-24 h-px bg-cream/30" />
        </div>

        {/* Location */}
        <p className="font-body text-sm uppercase tracking-[0.2em] text-cream/50">
          Baked fresh in NYC
        </p>

        {/* CTA button */}
        <a
          href="#order"
          className="group mt-2 inline-flex items-center gap-2 bg-crust hover:bg-crust-light text-cream rounded-full px-8 py-4 text-lg font-semibold transition-colors duration-200 shadow-lg"
        >
          Order Now
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Scroll indicator */}
      <a
        href="#products"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-cream/40 hover:text-cream/70 transition-colors duration-200 cursor-pointer z-10"
        aria-label="Scroll to products"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}
