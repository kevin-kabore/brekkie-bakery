-- Migration 003: Remove Soy from all product allergens
-- Run this in Supabase SQL Editor

update products
set allergens = array_remove(allergens, 'Soy')
where 'Soy' = any(allergens);
