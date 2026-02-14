import { StripePattern } from "@/components/ui/StripePattern";

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center bg-cream">
      {/* Background stripes */}
      <StripePattern color="#F0C75E" opacity={0.05} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="font-display text-6xl md:text-8xl text-navy tracking-tight">
          BREKKIE
        </h1>
        <p className="font-script text-3xl md:text-5xl text-coral mt-2">
          Banana Bread
        </p>
        <p className="font-body text-lg text-navy/60 mt-4 uppercase tracking-widest">
          Protein Banana Bread · NYC
        </p>

        <div className="mt-8" />

        <p className="italic text-xl md:text-2xl text-navy/80 max-w-lg text-center font-body">
          Sweet enough for dessert. Smart enough for breakfast.
        </p>

        <a
          href="#order"
          className="mt-8 rounded-full font-semibold transition-colors duration-200 bg-coral text-cream hover:bg-coral/90 px-8 py-4 text-lg"
        >
          ORDER NOW
        </a>
      </div>

      {/* Scroll indicator */}
      <a
        href="#products"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-navy/40 hover:text-navy/70 transition-colors duration-200 cursor-pointer"
        aria-label="Scroll to products"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}
