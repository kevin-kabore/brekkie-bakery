import type { Product } from "@/types";

export const NAV_LINKS = [
  { label: "Flavors", href: "#products" },
  { label: "How It Works", href: "#how" },
  { label: "Our Story", href: "#story" },
  { label: "Order", href: "#order" },
];

export const PLACEHOLDER_IMAGE = "/images/placeholder-loaf.svg";

/** Fallback products when Supabase is unavailable (original 3 flavors) */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "classic",
    name: "Classic Chocolate Chip",
    slug: "classic",
    priceCents: 4999,
    wholesalePriceCents: 2999,
    calories: 290,
    proteinGrams: 12,
    allergens: ["Milk", "Eggs", "Wheat", "Soy"],
    description: "Our original protein-packed banana bread with premium chocolate chips.",
    image: "/images/loaves/classic_1.jpg",
    accentColor: "#E8B44C",
    stripeColor: "#E8B44C",
    inventoryRemaining: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "blueberry",
    name: "Blueberry Chocolate Chip",
    slug: "blueberry",
    priceCents: 4999,
    wholesalePriceCents: 2999,
    calories: 320,
    proteinGrams: 12,
    allergens: ["Milk", "Eggs", "Wheat", "Soy"],
    description: "Wild blueberries meet rich chocolate chips in our most popular flavor.",
    image: "/images/loaves/blueberry_1.jpg",
    accentColor: "#8FA882",
    stripeColor: "#8FA882",
    inventoryRemaining: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "walnut",
    name: "Walnut Chocolate Chip",
    slug: "walnut",
    priceCents: 4999,
    wholesalePriceCents: 2999,
    calories: 340,
    proteinGrams: 12,
    allergens: ["Milk", "Eggs", "Wheat", "Soy", "Tree Nuts"],
    description: "Crunchy walnuts paired with chocolate chips for the ultimate texture.",
    image: "/images/loaves/walnut_1.jpg",
    accentColor: "#C8703E",
    stripeColor: "#C8703E",
    inventoryRemaining: null,
    isActive: true,
    sortOrder: 3,
  },
];

export const CONTACT = {
  email: "zach@brekkiebakery.com",
  address: "Brekkie LLC, 1580 Park Ave, New York, NY 10029",
  instagram: "https://instagram.com/brekkiebakery",
};

export const BUSINESS_TYPES = [
  "Bodega",
  "Cafe",
  "Gym",
  "Office",
  "Restaurant",
  "Other",
];

export const FREQUENCIES = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];
