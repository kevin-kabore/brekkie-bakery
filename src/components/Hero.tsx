import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center bg-cream">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-cream) 0%, var(--color-cream-dark) 100%)",
        }}
      />

      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-espresso) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
        {/* Top decorative line */}
        <div className="flex items-center gap-4 text-espresso/20">
          <span className="block w-16 md:w-24 h-px bg-espresso/20" />
          <span className="text-espresso/30 text-lg">~</span>
          <span className="block w-16 md:w-24 h-px bg-espresso/20" />
        </div>

        {/* Accent text */}
        <p className="font-accent text-crust text-2xl md:text-3xl">
          Protein Banana Bread
        </p>

        {/* Main heading */}
        <h1 className="font-display text-7xl md:text-9xl text-espresso tracking-tight leading-none">
          Brekkie
        </h1>

        {/* Tagline */}
        <p className="font-body text-xl md:text-2xl text-espresso/70 italic max-w-lg">
          Sweet enough for dessert. Smart enough for breakfast.
        </p>

        {/* Bottom decorative line */}
        <div className="flex items-center gap-4 text-espresso/20">
          <span className="block w-16 md:w-24 h-px bg-espresso/20" />
          <span className="text-espresso/30 text-lg">~</span>
          <span className="block w-16 md:w-24 h-px bg-espresso/20" />
        </div>

        {/* Location */}
        <p className="font-body text-sm uppercase tracking-[0.2em] text-espresso/50">
          Baked fresh in NYC
        </p>

        {/* CTA button */}
        <a
          href="#order"
          className="group mt-2 inline-flex items-center gap-2 bg-crust hover:bg-crust-light text-cream rounded-full px-8 py-4 text-lg font-semibold transition-colors duration-200"
        >
          Order Now
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Scroll indicator */}
      <a
        href="#products"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-espresso/30 hover:text-espresso/60 transition-colors duration-200 cursor-pointer"
        aria-label="Scroll to products"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}
