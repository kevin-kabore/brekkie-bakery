"use client";

import { useInView } from "@/hooks/useInView";
import { Zap, Leaf, ChefHat, type LucideIcon } from "lucide-react";

const FEATURES = [
  {
    Icon: Zap,
    title: "12g Protein",
    text: "Every serving packs 12 grams of protein to fuel your morning — or your afternoon, or your midnight snack.",
  },
  {
    Icon: Leaf,
    title: "All Natural",
    text: "Everything intentional. Nothing artificial. Just real ingredients you can pronounce, baked into something extraordinary.",
  },
  {
    Icon: ChefHat,
    title: "Small Batch",
    text: "Baked in small batches in New York City. Because good things take time, and great things take a little more.",
  },
];

function FeatureCard({
  Icon,
  title,
  text,
  delay,
}: {
  Icon: LucideIcon;
  title: string;
  text: string;
  delay: string;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className="w-16 h-16 rounded-2xl bg-crust/10 text-crust flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-display text-xl text-espresso mt-4">{title}</h3>
      <p className="text-espresso/60 mt-2 max-w-xs">{text}</p>
    </div>
  );
}

export function WhyBrekkie() {
  return (
    <section id="why" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-espresso mb-16">
          The Brekkie Difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              Icon={feature.Icon}
              title={feature.title}
              text={feature.text}
              delay={`${i * 150}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
