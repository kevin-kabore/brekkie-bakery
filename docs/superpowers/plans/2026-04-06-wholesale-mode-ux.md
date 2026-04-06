# Wholesale Mode UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the preorder/wholesale toggle above the product catalog so it controls the entire page experience — hiding prices, changing CTAs, and showing a wholesale info banner.

**Architecture:** Add `mode` state (`"preorder" | "wholesale"`) to the existing `CartContext`. The toggle moves from `OrderForm` into `Products`. All mode-dependent components (`ProductCard`, `CartBar`, `CartSummary`, `OrderForm`) read `mode` from context instead of props/local state.

**Tech Stack:** Next.js, React Context, Tailwind CSS, TypeScript

---

### Task 1: Add `mode` to CartContext

**Files:**
- Modify: `src/context/CartContext.tsx`

This is the foundation — all other tasks depend on it.

- [ ] **Step 1: Add mode state and setter to CartContext**

In `src/context/CartContext.tsx`, add mode to the state, context value, and provider:

```tsx
// Add to CartState interface (line 13)
interface CartState {
  items: Record<string, number>;
  mode: "preorder" | "wholesale";
}

// Update initialState (line 17)
const initialState: CartState = { items: {}, mode: "preorder" };

// Add actions (line 20, add to CartAction union)
  | { type: "SET_MODE"; mode: "preorder" | "wholesale" };

// Add reducer case (inside cartReducer, before default)
    case "SET_MODE":
      return { ...state, mode: action.mode };

// Add to CartContextValue interface (line 63)
  mode: "preorder" | "wholesale";
  setMode: (mode: "preorder" | "wholesale") => void;

// Add to value useMemo return (line 98, after clear)
      mode: state.mode,
      setMode: (m) => dispatch({ type: "SET_MODE", mode: m }),
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build 2>&1 | head -30`
Expected: Build succeeds (new context fields are additive, no consumers break)

- [ ] **Step 3: Commit**

```bash
git add src/context/CartContext.tsx
git commit -m "feat: add mode state to CartContext for preorder/wholesale toggle"
```

---

### Task 2: Add toggle and wholesale banner to Products component

**Files:**
- Modify: `src/components/Products.tsx`

- [ ] **Step 1: Import useCart and add mode toggle + banner**

Replace the contents of `src/components/Products.tsx` with:

```tsx
"use client";

import { ProductCard } from "@/components/ProductCard";
import { Snowflake, Refrigerator, Timer, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const { mode, setMode } = useCart();
  const isWholesale = mode === "wholesale";

  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-14">
          <div className="w-12 h-px bg-stone mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-3">
            Our Flavors
          </h2>
          <p className="text-espresso/50 text-center mb-4">
            Protein-packed banana bread, baked in small batches in NYC.
          </p>
          <p className="inline-flex items-center gap-1 bg-label-navy text-white font-semibold text-sm px-5 py-2.5 rounded-full">
            <span className="font-bold text-base">12g</span> of protein in every slice
          </p>
        </div>

        {/* Freshness & shelf life */}
        <div className="mb-14 rounded-2xl border border-stone/60 bg-cream-dark/40 px-6 py-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-sage/15 text-sage flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">21-Day Shelf Life</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  Stays fresh at room temperature, unopened
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-crust/10 text-crust flex items-center justify-center">
                <Refrigerator className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">Refrigerate After Opening</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  For best texture, enjoy within 1 month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-label-blue/10 text-label-blue flex items-center justify-center">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-espresso text-sm">Freeze Up to 3 Months</p>
                <p className="text-espresso/50 text-xs mt-0.5">
                  Sealed in a resealable freezer bag for lasting freshness
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mode toggle — Preorder / Wholesale */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex bg-stone/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode("preorder")}
              className={
                mode === "preorder"
                  ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer transition-colors"
                  : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer transition-colors"
              }
            >
              Preorder
            </button>
            <button
              type="button"
              onClick={() => setMode("wholesale")}
              className={
                mode === "wholesale"
                  ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer transition-colors"
                  : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer transition-colors"
              }
            >
              Wholesale
            </button>
          </div>

          {/* Wholesale info banner */}
          {isWholesale && (
            <div className="mt-4 max-w-2xl w-full rounded-xl bg-stone/30 border border-stone/60 px-5 py-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-espresso/50 shrink-0 mt-0.5" />
              <p className="text-sm text-espresso/60">
                Wholesale pricing available upon request. Select items you&apos;re interested in
                and a team member will reach out within 1–2 business days.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the toggle renders in dev**

Run: `npm run dev`
Open http://localhost:3000, scroll to "Our Flavors" section. Confirm:
- Toggle pill appears below the shelf-life row
- Clicking "Wholesale" shows the info banner
- Clicking "Preorder" hides the banner

- [ ] **Step 3: Commit**

```bash
git add src/components/Products.tsx
git commit -m "feat: add preorder/wholesale toggle and info banner above product catalog"
```

---

### Task 3: Hide prices and change button text on ProductCard

**Files:**
- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: Read mode from context and conditionally render**

In `src/components/ProductCard.tsx`, add `mode` to the `useCart` destructure (line 15) and conditionally hide price + change button text:

```tsx
// Line 15: add mode
const { items, increment, decrement, mode } = useCart();
const isWholesale = mode === "wholesale";
```

Replace the price `<span>` (lines 56-58) with:

```tsx
          {!isWholesale && (
            <span className="shrink-0 text-crust font-bold text-lg">
              {priceDisplay}
            </span>
          )}
```

Replace the "Add to Cart" button text (line 90) with:

```tsx
              {isWholesale ? "Add to Inquiry" : "Add to Cart"}
```

- [ ] **Step 2: Verify in dev**

Open http://localhost:3000, toggle to Wholesale:
- Prices disappear from all product cards
- Button says "Add to Inquiry" instead of "Add to Cart"
- Toggle back to Preorder: prices reappear, button says "Add to Cart"

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: hide prices and show 'Add to Inquiry' in wholesale mode"
```

---

### Task 4: Update CartBar for wholesale mode

**Files:**
- Modify: `src/components/CartBar.tsx`

- [ ] **Step 1: Read mode from context and conditionally render**

Replace the contents of `src/components/CartBar.tsx`:

```tsx
"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export function CartBar() {
  const { totalQuantity, totalCents, mode } = useCart();

  if (totalQuantity === 0) return null;

  const label = totalQuantity === 1 ? "loaf" : "loaves";
  const isWholesale = mode === "wholesale";

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none animate-in slide-in-from-bottom">
      <div className="pointer-events-auto w-full md:w-auto md:mb-6 md:rounded-full bg-espresso text-cream shadow-2xl ring-1 ring-cream/10 px-6 py-3 flex items-center justify-between gap-6 md:gap-8">
        <span className="text-sm font-medium flex items-center gap-2">
          <ShoppingBag size={16} />
          {totalQuantity} {label}
        </span>
        {!isWholesale && (
          <span className="font-semibold">
            ${(totalCents / 100).toFixed(2)}
          </span>
        )}
        <a
          href="#order"
          className="bg-crust hover:bg-crust-light text-cream font-semibold px-6 py-2 rounded-full text-sm transition-colors"
        >
          {isWholesale ? "Submit Inquiry" : "Checkout"}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in dev**

Add items to cart, toggle between modes:
- Preorder: shows "3 loaves · $105.00 — Checkout"
- Wholesale: shows "3 loaves — Submit Inquiry" (no price)

- [ ] **Step 3: Commit**

```bash
git add src/components/CartBar.tsx
git commit -m "feat: hide price and show 'Submit Inquiry' in CartBar wholesale mode"
```

---

### Task 5: Update OrderForm to read mode from context (remove internal toggle)

**Files:**
- Modify: `src/components/OrderForm.tsx`
- Modify: `src/components/OrderSection.tsx`

This is the largest task — remove the internal tab state and toggle UI, wire up to context mode.

- [ ] **Step 1: Update OrderForm to use context mode**

In `src/components/OrderForm.tsx`:

Remove the `defaultTab` prop from `OrderFormProps` (line 88) and the `activeTab`/`setActiveTab` state (line 95). Replace with context:

```tsx
// Line 87-89: Remove defaultTab from props
interface OrderFormProps {
  settings: Settings;
}

// Line 92: Remove defaultTab param
export function OrderForm({ settings }: OrderFormProps) {
  const { items, totalQuantity, totalCents, clear, mode } = useCart();

  // Replace activeTab with mode throughout the component
  // activeTab === "order"    →  mode === "preorder"
  // activeTab === "wholesale" →  mode === "wholesale"
  // isWholesale stays the same logic but uses mode
```

Remove the entire tab toggle UI (lines 301-333 — the `<div className="inline-flex bg-stone/50...">` block).

Replace every `activeTab` reference:
- `activeTab === "order"` → `mode === "preorder"` (lines 142, 176, 184, 292, 361, 485, 551)
- `activeTab === "wholesale"` → `mode === "wholesale"` (lines 160, 261)
- `isWholesale` (line 293) → `const isWholesale = mode === "wholesale";`

Remove the `setActiveTab` calls from tab button `onClick` handlers (already removed since we deleted the toggle).

In the `setActiveTab` calls inside form reset logic (line 306, 321), remove them — mode is now controlled externally.

The `TabType` export is no longer needed. Remove it and the import in `OrderSection.tsx`.

- [ ] **Step 2: Update OrderSection to remove hash detection and tab prop**

Replace the contents of `src/components/OrderSection.tsx`:

```tsx
"use client";

import { OrderForm } from "@/components/OrderForm";
import type { Settings } from "@/types";

interface OrderSectionProps {
  products: unknown;
  settings: Settings;
}

export function OrderSection({ settings }: OrderSectionProps) {
  return (
    <section id="order" className="py-24 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-espresso mb-4">
          Place Your Order
        </h2>
        <p className="text-center text-espresso/60 mb-12">
          Order for shipping or inquire about wholesale for your business.
        </p>
        <OrderForm settings={settings} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update CartSummary to derive hidePrices from context**

In `src/components/CartSummary.tsx`, remove the `hidePrices` prop and read mode from context instead:

```tsx
"use client";

import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";

interface CartSummaryProps {
  maxQty?: number;
}

export function CartSummary({ maxQty = 20 }: CartSummaryProps) {
  const { items, products, totalQuantity, totalCents, increment, decrement, mode } =
    useCart();

  const hidePrices = mode === "wholesale";
  // ... rest of component unchanged
```

Then in `OrderForm.tsx`, update the `CartSummary` usage (line 350-353) to remove the `hidePrices` prop:

```tsx
                <CartSummary
                  maxQty={isWholesale ? 100 : 20}
                />
```

- [ ] **Step 4: Add #wholesale hash detection to CartContext**

In `src/context/CartContext.tsx`, add a `useEffect` inside `CartProvider` to detect the hash on mount:

```tsx
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

// Inside CartProvider, after the useReducer line:
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#wholesale") {
      dispatch({ type: "SET_MODE", mode: "wholesale" });
    }
  }, []);
```

- [ ] **Step 5: Verify full flow in dev**

Run: `npm run dev`

Test these scenarios:
1. Default load → Preorder mode, prices visible, "Add to Cart", "Checkout" in cart bar
2. Click Wholesale toggle → prices hidden, "Add to Inquiry", "Submit Inquiry" in cart bar, info banner visible
3. Add items in wholesale → scroll to order form → form shows wholesale fields (business name etc.), no internal toggle
4. Submit wholesale inquiry → success message
5. Switch back to preorder → prices return, cart bar shows price, form shows retail fields
6. Visit `http://localhost:3000/#wholesale` → auto-selects wholesale mode
7. Visit `http://localhost:3000` → defaults to preorder

- [ ] **Step 6: Verify build**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds with no type errors

- [ ] **Step 7: Commit**

```bash
git add src/components/OrderForm.tsx src/components/OrderSection.tsx src/components/CartSummary.tsx src/context/CartContext.tsx
git commit -m "feat: remove internal order form toggle, wire all components to context mode"
```

---

### Task 6: Final cleanup and verification

**Files:**
- Potentially: `src/components/OrderForm.tsx` (remove unused TabType export if still present)

- [ ] **Step 1: Check for dead code**

Search for any remaining references to `TabType`, `defaultTab`, or `activeTab`:

```bash
grep -rn "TabType\|defaultTab\|activeTab" src/
```

Remove any found. These should all be gone after Task 5.

- [ ] **Step 2: Full build verification**

Run: `npx next build`
Expected: Clean build, no errors or warnings

- [ ] **Step 3: Commit cleanup if needed**

```bash
git add -A
git commit -m "chore: remove dead TabType/activeTab references"
```
