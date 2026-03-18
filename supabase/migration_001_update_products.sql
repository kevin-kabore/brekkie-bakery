-- ============================================================
-- Migration 001: Update products (prices, names, allergens, best seller)
-- Run in Supabase SQL Editor AFTER the initial schema.sql
-- ============================================================

-- 1. Add is_best_seller column
alter table products add column if not exists is_best_seller boolean not null default false;

-- 2. Update Classic Chocolate Chip
update products set
  price_cents = 3850,
  wholesale_price_cents = 2500,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Soy'],
  accent_color = '#E8B44C',
  stripe_color = '#E8B44C'
where slug = 'classic';

-- 3. Update Blueberry Chocolate Chip
update products set
  price_cents = 3950,
  wholesale_price_cents = 2600,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Soy'],
  description = 'Dried blueberries meet rich chocolate chips in our most popular flavor.',
  accent_color = '#8FA882',
  stripe_color = '#8FA882'
where slug = 'blueberry';

-- 4. Update Walnut Chocolate Chip
update products set
  price_cents = 3999,
  wholesale_price_cents = 2600,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Soy', 'Tree Nuts'],
  accent_color = '#C8703E',
  stripe_color = '#C8703E'
where slug = 'walnut';

-- 5. Update Coconut Walnut → Coconut Walnut Chocolate Chip (best seller)
update products set
  name = 'Coconut Walnut Chocolate Chip',
  price_cents = 4199,
  wholesale_price_cents = 2800,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Tree Nuts', 'Coconut'],
  description = 'Toasted coconut and walnuts with chocolate chips for a tropical twist.',
  accent_color = '#E8B44C',
  stripe_color = '#E8B44C',
  is_best_seller = true
where slug = 'coconut-walnut';

-- 6. Update Double Chocolate → Double Chocolate Chocolate Chip (best seller)
update products set
  name = 'Double Chocolate Chocolate Chip',
  price_cents = 4199,
  wholesale_price_cents = 2800,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Soy'],
  description = 'Rich cocoa banana bread loaded with chocolate chips for the ultimate chocolate lover.',
  accent_color = '#4A3428',
  stripe_color = '#4A3428',
  is_best_seller = true
where slug = 'double-chocolate';

-- 7. Update Raspberry White Chocolate
update products set
  name = 'Raspberry White Chocolate',
  price_cents = 4199,
  wholesale_price_cents = 2800,
  allergens = array['Milk', 'Eggs', 'Wheat', 'Soy'],
  description = 'Tart raspberries swirled with creamy white chocolate for a bright, indulgent loaf.',
  accent_color = '#C85A7C',
  stripe_color = '#C85A7C'
where slug = 'raspberry-white-choc';
