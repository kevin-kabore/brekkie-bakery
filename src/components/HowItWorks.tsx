"use client";

import { useInView } from "@/hooks/useInView";
import { ShoppingBag, Flame, Truck, type LucideIcon } from "lucide-react";

const STEPS = [
  {
    Icon: ShoppingBag,
    title: "Choose Your Flavors",
    description:
      "Pick from our rotating selection of protein-packed banana bread.",
  },
  {
    Icon: Flame,
    title: "We Bake Fresh",
    description:
      "Your order is baked in small batches the week of delivery.",
  },
  {
    Icon: Truck,
    title: "Delivered to You",
    description:
      "Fresh banana bread arrives at your door across NYC.",
  },
];

function StepCard({
  Icon,
  title,
  description,
  stepNumber,
  delay,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
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
      <div className="w-10 h-10 rounded-full bg-crust text-cream font-bold flex items-center justify-center text-sm">
        {stepNumber}
      </div>
      <div className="w-14 h-14 rounded-2xl bg-golden/15 text-golden flex items-center justify-center mt-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-lg text-espresso mt-4">{title}</h3>
      <p className="text-espresso/60 text-sm mt-2 max-w-xs">{description}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-espresso mb-16">
          How It Works
        </h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connecting dashed lines between steps on desktop */}
          <div className="hidden md:block absolute top-5 left-1/2 -translate-x-1/2 w-[55%] border-t-2 border-dashed border-stone" />
          {STEPS.map((step, i) => (
            <StepCard
              key={step.title}
              Icon={step.Icon}
              title={step.title}
              description={step.description}
              stepNumber={i + 1}
              delay={`${i * 150}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
