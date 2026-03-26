-- Migration: Update prices and sort order
-- Date: 2026-03-25
-- Changes:
--   1. Prices: Classic/Blueberry/Walnut → $35, Coconut Walnut/Double Chocolate/Raspberry WC → $38
--   2. Sort order: Best sellers (Coconut Walnut, Double Chocolate) moved to positions 2 & 3

BEGIN;

-- Prices
UPDATE products SET price_cents = 3500 WHERE slug = 'classic';
UPDATE products SET price_cents = 3500 WHERE slug = 'blueberry';
UPDATE products SET price_cents = 3500 WHERE slug = 'walnut';
UPDATE products SET price_cents = 3800 WHERE slug = 'coconut-walnut';
UPDATE products SET price_cents = 3800 WHERE slug = 'double-chocolate';
UPDATE products SET price_cents = 3800 WHERE slug = 'raspberry-white-choc';

-- Sort order: Classic, Coconut Walnut (best seller), Double Chocolate (best seller), Blueberry, Walnut, Raspberry WC
UPDATE products SET sort_order = 1 WHERE slug = 'classic';
UPDATE products SET sort_order = 2 WHERE slug = 'coconut-walnut';
UPDATE products SET sort_order = 3 WHERE slug = 'double-chocolate';
UPDATE products SET sort_order = 4 WHERE slug = 'blueberry';
UPDATE products SET sort_order = 5 WHERE slug = 'walnut';
UPDATE products SET sort_order = 6 WHERE slug = 'raspberry-white-choc';

COMMIT;
