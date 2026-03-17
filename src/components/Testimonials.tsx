"use client";

import { Star } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    quote:
      "Best banana bread I've ever had. The protein is a bonus — I'd eat this even without it.",
    name: "Sarah M.",
    title: "Chelsea",
  },
  {
    quote:
      "We stock Brekkie at our cafe and it sells out every single week. Customers love it.",
    name: "James K.",
    title: "Cafe Owner",
  },
  {
    quote:
      "Finally, a breakfast that tastes amazing and keeps me full until lunch. Game changer.",
    name: "Alex R.",
    title: "Fitness Instructor",
  },
];

function TestimonialCard({
  quote,
  name,
  title,
  delay,
}: {
  quote: string;
  name: string;
  title: string;
  delay: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-8 border border-stone/60 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className="fill-golden text-golden" />
        ))}
      </div>
      <p className="text-espresso/70 italic text-base leading-relaxed mt-4">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="border-t border-stone mt-6 pt-4">
        <p className="font-semibold text-espresso text-sm">{name}</p>
        <p className="text-espresso/50 text-xs">{title}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-cream-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-espresso mb-16">
          What People Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              quote={t.quote}
              name={t.name}
              title={t.title}
              delay={i * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
