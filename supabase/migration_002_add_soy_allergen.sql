-- ============================================================
-- Migration 002: Add Soy back to all product allergens
-- Soy lecithin is present in the chocolate chips per FDA labeling
-- ============================================================

-- Add 'Soy' to every product that doesn't already have it
update products
set allergens = array_append(allergens, 'Soy')
where not ('Soy' = any(allergens));
