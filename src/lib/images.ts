export interface ProductImages {
  /** Display order: _3 (sliced), _2 (side), _4 (detail) — _1 is too zoomed */
  carousel: string[];
  /** First carousel image (sliced close-up) — used as card default */
  primary: string;
}

export function getProductImages(slug: string): ProductImages {
  const base = `/images/loaves/${slug}`;
  // Order: _3 first (sliced, best framing), then _2, _4. Skip _1 (too zoomed/cropped).
  const carousel = [`${base}_3.jpg`, `${base}_2.jpg`, `${base}_4.jpg`];
  return {
    carousel,
    primary: carousel[0],
  };
}
