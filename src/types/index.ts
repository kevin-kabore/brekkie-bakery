export interface Product {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  wholesalePriceCents: number;
  calories: number;
  proteinGrams: number;
  allergens: string[];
  description: string;
  image: string;
  accentColor: string;
  stripeColor: string;
  inventoryRemaining: number | null;
  isActive: boolean;
  sortOrder: number;
  isBestSeller?: boolean;
}

/** Row shape from Supabase `products` table */
export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  wholesale_price_cents: number;
  image_url: string | null;
  calories: number;
  protein_grams: number;
  allergens: string[];
  accent_color: string;
  stripe_color: string;
  inventory_remaining: number | null;
  max_inventory: number | null;
  is_active: boolean;
  is_best_seller: boolean;
  sort_order: number;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceCents: number;
}

export interface Settings {
  globalLoafLimit: number;
  globalRemaining: number;
  preordersOpen: boolean;
  currentBatchStart: string;
}

export interface DbSettings {
  global_loaf_limit: number;
  global_remaining: number;
  preorders_open: boolean;
  current_batch_start: string;
}

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

export interface DeliveryFormData {
  name: string;
  email: string;
  phone: string;
  items: Record<string, number>;
  deliveryDate: string;
  address: AddressData;
  specialInstructions: string;
}

export interface WholesaleFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  items: Record<string, number>;
  address: AddressData;
  frequency: "one-time" | "weekly" | "biweekly" | "monthly";
  specialInstructions: string;
}
