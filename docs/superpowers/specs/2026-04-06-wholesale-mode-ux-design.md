# Wholesale Mode UX Redesign

**Date:** 2026-04-06
**Status:** Approved

## Problem

The preorder/wholesale toggle is buried inside the order form at the bottom of the page. Wholesale visitors see retail prices throughout the product catalog before reaching the toggle. Wholesale prices should not be displayed — pricing is handled via inquiry.

## Solution

Move the mode toggle above the product catalog so it controls the entire shopping experience. When wholesale is active: hide prices, show an info banner, and change all CTAs from shopping language to inquiry language.

## Design Decisions

### 1. Mode Toggle — Below Benefits Row, Above Product Cards

- Move the toggle out of `OrderForm` and into the `Products` component, positioned between the shelf-life/refrigerate/protein row and the product grid
- Pill toggle styled consistently with existing design (`bg-espresso/text-cream` for active, `text-espresso/60` for inactive)
- Labels: "Preorder" and "Wholesale"
- Default: Preorder
- URL hash `#wholesale` auto-selects wholesale mode (preserve existing behavior from `OrderSection`)
- Toggle state lifted to `CartShell` context so `Products`, `ProductCard`, `CartBar`, `CartSummary`, and `OrderForm` can all react

### 2. Wholesale Info Banner

- Renders directly below the toggle when wholesale mode is active
- Soft background matching site palette (e.g., `bg-stone/50`)
- Copy: "Wholesale pricing available upon request. Select items you're interested in and a team member will reach out within 1-2 business days."
- Not dismissable — contextual to the mode, disappears when switching back to preorder

### 3. Product Cards in Wholesale Mode

- Price (`$35` in top-right) is hidden — not rendered
- "Add to Cart" button text changes to "Add to Inquiry"
- All other card content unchanged: image carousel, name, calories, protein, allergens, best seller badge, quantity stepper

### 4. Sticky Cart Bar in Wholesale Mode

- Price/total removed — shows "3 loaves" instead of "3 loaves · $105.00"
- "Checkout" button text changes to "Submit Inquiry"
- Bar still appears/disappears based on cart having items

### 5. Order Form in Wholesale Mode

- Toggle removed from the form (now lives above the catalog)
- Form receives the active mode from context instead of managing its own `activeTab` state
- Wholesale-specific fields remain: business name, contact name, business type, email, phone, billing address, order frequency, special instructions
- "Submit Inquiry" button text already implemented
- `CartSummary` already hides prices via `hidePrices` prop — no change needed

### 6. Unchanged

- Retail preorder flow untouched
- Wholesale API route (`/api/order`) unchanged
- Stripe checkout route (`/api/checkout`) unchanged
- Supabase schema unchanged
- No new pages or routes

## State Architecture

The mode toggle state currently lives as `activeTab` inside `OrderForm`. It needs to be lifted to `CartShell` (which already provides `CartContext`) so all components can access it:

- `CartShell` → adds `mode` ("preorder" | "wholesale") and `setMode` to context
- `Products` → renders the toggle and banner, reads `mode` from context
- `ProductCard` → reads `mode` to conditionally hide price and change button text
- `CartBar` → reads `mode` to hide price and change button text
- `OrderForm` → reads `mode` from context instead of managing `activeTab` internally
- `CartSummary` → derives `hidePrices` from `mode` instead of receiving it as a prop

## Files to Modify

1. `src/components/CartShell.tsx` — add `mode`/`setMode` to cart context, handle `#wholesale` hash detection
2. `src/components/Products.tsx` — render mode toggle and wholesale banner
3. `src/components/ProductCard.tsx` — conditionally hide price, change button text
4. `src/components/CartBar.tsx` — conditionally hide price, change button text
5. `src/components/OrderForm.tsx` — remove internal toggle, read mode from context
6. `src/components/OrderSection.tsx` — remove hash detection (moved to CartShell)
7. `src/components/CartSummary.tsx` — derive `hidePrices` from context mode
