"use client";

import { useInView } from "@/hooks/useInView";

const FEATURES = [
  {
    icon: "\uD83D\uDCAA",
    title: "12g Protein",
    text: "Every serving packs 12 grams of protein to fuel your morning \u2014 or your afternoon, or your midnight snack.",
  },
  {
    icon: "\uD83C\uDF3F",
    title: "All Natural",
    text: "Everything intentional. Nothing artificial. Just real ingredients you can pronounce, baked into something extraordinary.",
  },
  {
    icon: "\uD83C\uDFE0",
    title: "Small Batch",
    text: "Baked in small batches in New York City. Because good things take time, and great things take a little more.",
  },
];

function FeatureBlock({
  icon,
  title,
  text,
  delay,
}: {
  icon: string;
  title: string;
  text: string;
  delay: string;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: delay }}
    >
      <p className="text-5xl text-center">{icon}</p>
      <h3 className="font-display text-2xl text-navy mt-4 text-center">
        {title}
      </h3>
      <p className="text-navy/70 text-center mt-2">{text}</p>
    </div>
  );
}

export function WhyBrekkie() {
  return (
    <section id="why" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-navy mb-16">
          Why Brekkie?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, i) => (
            <FeatureBlock
              key={feature.title}
              icon={feature.icon}
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
