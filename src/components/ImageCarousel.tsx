"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** Optional per-index object-position overrides (default: "center center") */
  positions?: (string | undefined)[];
}

export function ImageCarousel({ images, alt, positions }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const count = images.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + count) % count);
    },
    [count]
  );

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 40) {
      goTo(delta > 0 ? current + 1 : current - 1);
    }
  }

  return (
    <div
      className="group/carousel relative aspect-[4/3] overflow-hidden bg-cream-dark"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-400 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              className="object-cover"
              style={positions?.[i] ? { objectPosition: positions[i] } : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrows — desktop only, appear on hover */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm text-espresso/70 hover:text-espresso hover:bg-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer shadow-md"
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="10 12 6 8 10 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm text-espresso/70 hover:text-espresso hover:bg-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer shadow-md"
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 4 10 8 6 12" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === current
                  ? "w-5 bg-white shadow-sm"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`View photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
