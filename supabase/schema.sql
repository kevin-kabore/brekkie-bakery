-- ============================================================
-- Brekkie Bakery — Supabase Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price_cents integer not null default 4999,
  wholesale_price_cents integer not null default 2999,
  image_url text,
  calories integer not null default 0,
  protein_grams integer not null default 12,
  allergens text[] not null default '{}',
  description text not null default '',
  accent_color text not null default '#F0C75E',
  stripe_color text not null default '#F0C75E',
  inventory_remaining integer,
  max_inventory integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  stripe_session_id text unique,
  stripe_payment_intent text,
  order_type text not null check (order_type in ('preorder', 'wholesale')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address jsonb,
  items jsonb not null,
  total_cents integer not null default 0,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  delivery_date text,
  special_instructions text,
  synced_to_sheets boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SETTINGS (single row)
-- ============================================================
create table if not exists settings (
  id integer primary key default 1 check (id = 1),
  global_loaf_limit integer not null default 80,
  global_remaining integer not null default 80,
  preorders_open boolean not null default true,
  current_batch_start date not null default current_date,
  updated_at timestamptz not null default now()
);

-- Insert default settings row
insert into settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- RPC: Reserve inventory (atomic)
-- ============================================================
create or replace function reserve_inventory(p_items jsonb, p_total_qty integer)
returns boolean
language plpgsql
security definer
as $$
declare
  v_remaining integer;
  v_item record;
begin
  -- Lock settings row
  select global_remaining into v_remaining
  from settings
  where id = 1
  for update;

  -- Check global inventory
  if v_remaining < p_total_qty then
    return false;
  end if;

  -- Check and decrement per-product inventory
  for v_item in select * from jsonb_each_text(p_items) loop
    declare
      v_product_remaining integer;
    begin
      select inventory_remaining into v_product_remaining
      from products
      where id = v_item.key::uuid
      for update;

      -- If product has per-item inventory limit
      if v_product_remaining is not null then
        if v_product_remaining < v_item.value::integer then
          return false;
        end if;

        update products
        set inventory_remaining = inventory_remaining - v_item.value::integer
        where id = v_item.key::uuid;
      end if;
    end;
  end loop;

  -- Decrement global
  update settings
  set global_remaining = global_remaining - p_total_qty,
      updated_at = now()
  where id = 1;

  return true;
end;
$$;

-- ============================================================
-- RPC: Restore inventory (on expired checkout)
-- ============================================================
create or replace function restore_inventory(p_items jsonb, p_total_qty integer)
returns void
language plpgsql
security definer
as $$
declare
  v_item record;
begin
  -- Restore per-product inventory
  for v_item in select * from jsonb_each_text(p_items) loop
    update products
    set inventory_remaining = inventory_remaining + v_item.value::integer
    where id = v_item.key::uuid
      and inventory_remaining is not null;
  end loop;

  -- Restore global
  update settings
  set global_remaining = least(global_remaining + p_total_qty, global_loaf_limit),
      updated_at = now()
  where id = 1;
end;
$$;

-- ============================================================
-- RLS Policies
-- ============================================================
alter table products enable row level security;
alter table settings enable row level security;
alter table orders enable row level security;

-- Products: publicly readable
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- Settings: publicly readable
create policy "Settings are viewable by everyone"
  on settings for select
  using (true);

-- Orders: service-role only (no public access)
-- API routes use the service_role key which bypasses RLS

-- ============================================================
-- SEED DATA: 6 products
-- ============================================================
insert into products (name, slug, price_cents, wholesale_price_cents, image_url, calories, protein_grams, allergens, description, accent_color, stripe_color, sort_order)
values
  (
    'Classic Chocolate Chip',
    'classic',
    4999, 2999,
    '/images/classic-chocolate-chip.png',
    290, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy'],
    'Our original protein-packed banana bread with premium chocolate chips.',
    '#F0C75E', '#F0C75E',
    1
  ),
  (
    'Blueberry Chocolate Chip',
    'blueberry',
    4999, 2999,
    '/images/blueberry-chocolate-chip.png',
    320, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy'],
    'Wild blueberries meet rich chocolate chips in our most popular flavor.',
    '#B8A0CC', '#3B4D7A',
    2
  ),
  (
    'Walnut Chocolate Chip',
    'walnut',
    4999, 2999,
    '/images/walnut-chocolate-chip.png',
    340, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy', 'Tree Nuts'],
    'Crunchy walnuts paired with chocolate chips for the ultimate texture.',
    '#9CB5A0', '#9CB5A0',
    3
  ),
  (
    'Coconut Walnut',
    'coconut-walnut',
    4999, 2999,
    null,
    330, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy', 'Tree Nuts', 'Coconut'],
    'Tropical coconut flakes with crunchy walnuts. A new island-inspired twist.',
    '#E8D5B7', '#E8D5B7',
    4
  ),
  (
    'Double Chocolate',
    'double-chocolate',
    4999, 2999,
    null,
    310, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy'],
    'For the serious chocolate lover — cocoa banana bread loaded with chocolate chips.',
    '#8B6F5E', '#5C4033',
    5
  ),
  (
    'Raspberry & White Choc',
    'raspberry-white-choc',
    4999, 2999,
    null,
    300, 12,
    array['Milk', 'Eggs', 'Wheat', 'Soy'],
    'Tart raspberries with creamy white chocolate. Our brightest flavor yet.',
    '#E8A0B4', '#C4587A',
    6
  )
on conflict (slug) do nothing;
