"use client";

import { useInView } from "@/hooks/useInView";

export function OurStory() {
  const { ref, isInView } = useInView();

  return (
    <section id="story" className="py-24 px-6 bg-espresso text-cream">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="font-display text-8xl text-crust/30 leading-none select-none">
          &ldquo;
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
          Our Story
        </h2>
        <div className="text-lg text-cream/70 leading-relaxed space-y-6">
          <p>
            It started in a small Chelsea apartment with a simple question: why
            can&apos;t breakfast taste like dessert AND fuel your day?
          </p>
          <p>
            We were tired of choosing between flavor and function. Protein bars
            that tasted like cardboard. Pastries loaded with sugar and empty
            calories. There had to be a better way.
          </p>
          <p>
            So we started baking. Batch after batch, we refined our recipe until
            we landed on something special &mdash; a banana bread that&apos;s
            rich, moist, and packed with 12 grams of protein. No artificial
            anything. Just real ingredients, real flavor, and a real good reason
            to look forward to breakfast.
          </p>
        </div>
        <p className="font-accent text-3xl md:text-4xl text-crust mt-12">
          everything intentional. nothing artificial.
        </p>
      </div>
    </section>
  );
}
