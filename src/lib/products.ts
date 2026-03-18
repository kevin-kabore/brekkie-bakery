import { createBrowserClient } from "@/lib/supabase";
import { FALLBACK_PRODUCTS } from "@/lib/constants";
import type { DbProduct, DbSettings, Product, Settings } from "@/types";

function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    priceCents: row.price_cents,
    wholesalePriceCents: row.wholesale_price_cents,
    calories: row.calories,
    proteinGrams: row.protein_grams,
    allergens: row.allergens,
    description: row.description,
    image: row.image_url || "/images/placeholder-loaf.svg",
    accentColor: row.accent_color,
    stripeColor: row.stripe_color,
    inventoryRemaining: row.inventory_remaining,
    isActive: row.is_active,
    isBestSeller: row.is_best_seller,
    sortOrder: row.sort_order,
  };
}

function toSettings(row: DbSettings): Settings {
  return {
    globalLoafLimit: row.global_loaf_limit,
    globalRemaining: row.global_remaining,
    preordersOpen: row.preorders_open,
    currentBatchStart: row.current_batch_start,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Supabase products fetch failed, using fallback:", error?.message);
      return FALLBACK_PRODUCTS;
    }

    return data.map(toProduct);
  } catch {
    console.warn("Supabase unavailable, using fallback products");
    return FALLBACK_PRODUCTS;
  }
}

const DEFAULT_SETTINGS: Settings = {
  globalLoafLimit: 80,
  globalRemaining: 80,
  preordersOpen: true,
  currentBatchStart: new Date().toISOString().split("T")[0],
};

export async function getSettings(): Promise<Settings> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.warn("Supabase settings fetch failed, using defaults:", error?.message);
      return DEFAULT_SETTINGS;
    }

    return toSettings(data);
  } catch {
    console.warn("Supabase unavailable, using default settings");
    return DEFAULT_SETTINGS;
  }
}
