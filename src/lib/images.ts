export interface ProductImages {
  /** Display order: _2 (sliced), _3 (cross-section), _1 (top-down) */
  carousel: string[];
  /** First carousel image (sliced) — used as card default */
  primary: string;
}

const IMAGE_MAP: Record<string, [string, string, string]> = {
  classic: ["classic_1.png", "classic_2.png", "classic_3.jpg"],
  blueberry: ["blueberry_1.png", "blueberry_2.png", "blueberry_3.jpg"],
  walnut: ["walnut_1.png", "walnut_2.png", "walnut_3.jpg"],
  "coconut-walnut": ["coconut-walnut_1.png", "coconut-walnut_2.png", "coconut-walnut_3.jpg"],
  "double-chocolate": ["double-chocolate_1.png", "double-chocolate_2.png", "double-chocolate_3.jpg"],
  "raspberry-white-choc": ["raspberry-white-choc_1.jpeg", "raspberry-white-choc_2.png", "raspberry-white-choc_3.jpg"],
};

/**
 * Cross-section (_3) images are portrait with the slice in the upper portion.
 * Custom object-position keeps the loaf centered in the 4:3 crop.
 */
const CROSS_SECTION_POSITION: Record<string, string> = {
  classic: "center 11%",
  blueberry: "center 27%",
  walnut: "center 11%",
  "coconut-walnut": "center 19%",
  "double-chocolate": "center 11%",
  "raspberry-white-choc": "center 25%",
};

export function getCrossSectionPosition(slug: string): string {
  return CROSS_SECTION_POSITION[slug] ?? "center 30%";
}

export function getProductImages(slug: string): ProductImages {
  const files = IMAGE_MAP[slug];
  const carousel = files
    ? files.map((f) => `/images/loaves/${f}`)
    : [`/images/loaves/${slug}_2.png`, `/images/loaves/${slug}_3.jpg`, `/images/loaves/${slug}_1.png`];
  return {
    carousel,
    primary: carousel[0],
  };
}
