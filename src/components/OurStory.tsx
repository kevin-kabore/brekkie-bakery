"use client";

import { useInView } from "@/hooks/useInView";

export function OurStory() {
  const { ref, isInView } = useInView();

  return (
    <section id="story" className="py-20 px-6 bg-white">
      <div
        ref={ref}
        className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="font-display text-4xl md:text-5xl text-navy mb-8">
          Our Story
        </h2>
        <div className="text-lg text-navy/70 leading-relaxed space-y-6">
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
        <p className="font-script text-2xl md:text-3xl text-coral mt-12">
          everything intentional. nothing artificial.
        </p>
      </div>
    </section>
  );
}
