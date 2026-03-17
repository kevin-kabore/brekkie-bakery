const ANGLES = [1, 2, 3, 4] as const;

export interface ProductImages {
  hero: string;    // _1 — 3/4 view, card primary
  side: string;    // _2
  sliced: string;  // _3 — sliced close-up, hover reveal
  detail: string;  // _4
  all: string[];
}

export function getProductImages(slug: string): ProductImages {
  const base = `/images/loaves/${slug}`;
  const paths = ANGLES.map((n) => `${base}_${n}.jpg`);
  return {
    hero: paths[0],
    side: paths[1],
    sliced: paths[2],
    detail: paths[3],
    all: paths,
  };
}
