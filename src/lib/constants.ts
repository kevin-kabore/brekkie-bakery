import type { Product } from "@/types";

export const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Why Brekkie", href: "#why" },
  { label: "Our Story", href: "#story" },
  { label: "Order", href: "#order" },
];

export const PRODUCTS: Product[] = [
  {
    id: "classic",
    name: "Classic Chocolate Chip",
    calories: 290,
    allergens: ["Milk", "Eggs", "Wheat", "Soy"],
    image: "/images/classic-chocolate-chip.png",
    accentColor: "#F0C75E",
    stripeColor: "#F0C75E",
  },
  {
    id: "blueberry",
    name: "Blueberry Chocolate Chip",
    calories: 320,
    allergens: ["Milk", "Eggs", "Wheat", "Soy"],
    image: "/images/blueberry-chocolate-chip.png",
    accentColor: "#B8A0CC",
    stripeColor: "#3B4D7A",
  },
  {
    id: "walnut",
    name: "Walnut Chocolate Chip",
    calories: 340,
    allergens: ["Milk", "Eggs", "Wheat", "Soy", "Tree Nuts"],
    image: "/images/walnut-chocolate-chip.png",
    accentColor: "#9CB5A0",
    stripeColor: "#9CB5A0",
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
