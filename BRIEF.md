# Brekkie Bakery — Project Brief

> Persistent reference for any Claude Code session building this site.

---

## Brand

**Name:** Brekkie
**Product:** Protein Banana Bread (3 flavors)
**Location:** New York City
**Tagline:** "Sweet enough for dessert. Smart enough for breakfast."
**Secondary taglines:** "everything intentional. nothing artificial." · "baked in small batches"
**Contact:** zach@brekkiebakery.com
**Address:** Brekkie LLC, 1580 Park Ave, New York, NY 10029
**Domain:** brekkiebakery.com

---

## Brand Story

> Started in a small Chelsea apartment with a simple question: why can't breakfast taste like dessert AND fuel your day?
>
> We set out to create something that didn't exist — a banana bread that's rich enough to satisfy your sweet tooth, packed with 12g of protein to power your morning, and made with nothing artificial. Every loaf is baked in small batches right here in New York City, using only intentional ingredients.
>
> What started as a passion project quickly became a neighborhood obsession. From Chelsea kitchens to bodegas across the city, Brekkie is proving that you don't have to choose between delicious and nutritious.

---

## Products

| Flavor | Calories | Protein | Weight | Allergens |
|--------|----------|---------|--------|-----------|
| Classic Chocolate Chip | 290 | 12g | 4oz (113g) | Milk, Eggs, Wheat, Soy |
| Blueberry Chocolate Chip | 320 | 12g | 4oz (113g) | Milk, Eggs, Wheat, Soy |
| Walnut Chocolate Chip | 340 | 12g | 4oz (113g) | Milk, Eggs, Wheat, Soy, Tree Nuts |

**No prices displayed on site.**

---

## Color Palette (from product labels)

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#1B2A4A` | "Brekkie" logotype, primary text |
| Coral/Salmon | `#D4845E` | "Banana Bread" script, CTAs |
| Golden Yellow | `#F0C75E` | Classic Choc Chip stripe accent |
| Sage Green | `#9CB5A0` | Walnut stripe accent |
| Navy Blue | `#3B4D7A` | Blueberry stripe accent |
| Lavender | `#B8A0CC` | "nothing artificial" badge, Blueberry accent |
| Olive | `#A4AD7B` | "everything intentional" badge |
| Cream | `#FEFCF3` | Background |

---

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Display ("Brekkie") | Lilita One | cursive |
| Script ("Banana Bread") | Pacifico | cursive |
| Body / UI | Inter | system-ui, sans-serif |

All loaded via `next/font/google`.

---

## Site Structure (Single Page, Smooth Scroll)

1. **Navbar** — Sticky. Logo + section links + "Order Now" CTA. Hamburger on mobile.
2. **Hero** — Full viewport. Brand name, tagline, CTA, subtle stripe pattern background.
3. **Products** — 3 flavor cards with label imagery, calories, protein badge, allergens.
4. **Why Brekkie** — 3 selling points: 12g Protein, All Natural, Small Batch.
5. **Our Story** — Brand origin narrative.
6. **Order** — Two-tab form:
   - **Preorder** (customers): Name, email, phone, flavor quantities, pickup date, notes.
   - **Wholesale** (businesses): Business info, flavor quantities (loaves), delivery address, frequency, notes.
7. **Footer** — Contact, social links, copyright.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Animations:** CSS-only (IntersectionObserver for scroll reveals)
- **Form backend:** Google Sheets via Apps Script (proxied through Next.js API route). Orders go into weekly tabs ("Week of Mon DD") in a specific spreadsheet.
- **Hosting:** Vercel
- **Repo:** github.com/kevin-kabore/brekkie-bakery

---

## Accounts & Infrastructure

| Service | Details |
|---------|---------|
| GitHub | github.com/kevin-kabore/brekkie-bakery |
| Vercel | kevin-optoinvestcs-projects |
| Domain | brekkiebakery.com (registered at Squarespace, DNS pointed to Vercel) |
| Google Sheets | Spreadsheet ID: `17vLCTk0o8A5Bn_csZFjJH3NBYYBKooOXFOV3KtmGJ9c`. Weekly tabs auto-created by Apps Script. |

---

## Assets

Label PDFs in `/Users/kevin.kabore/Desktop/brekkie-bakery/`:
- `Brekkie chocolate chip.pdf`
- `Brekkie Blueberry.pdf`
- `Brekkie Walnut.pdf`

These are vector Illustrator files (552x217pt). Convert to PNG at 4x resolution (2208px wide) using `sips`, then crop to the brand-side half for product cards.

---

## API Route: POST /api/order

Proxies form submissions to Google Apps Script. Hides the Apps Script URL, enables server-side validation.

**Preorder payload:**
```json
{
  "formType": "preorder",
  "name": "...", "email": "...", "phone": "...",
  "classicQty": 2, "blueberryQty": 1, "walnutQty": 0,
  "pickupDate": "2026-02-20",
  "specialInstructions": "..."
}
```

**Wholesale payload:**
```json
{
  "formType": "wholesale",
  "businessName": "...", "contactName": "...", "email": "...", "phone": "...",
  "businessType": "Bodega",
  "classicQty": 10, "blueberryQty": 5, "walnutQty": 5,
  "deliveryAddress": "...",
  "frequency": "weekly",
  "specialInstructions": "..."
}
```

---

## Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `GOOGLE_SCRIPT_URL` | `.env.local` + Vercel | Google Apps Script Web App URL |

---

## File Structure

```
brekkie-bakery/
├── .env.local / .env.example
├── next.config.ts
├── package.json / tsconfig.json
├── tailwind.css                    # Tailwind v4 theme (colors, fonts)
├── public/images/                  # 6 PNGs (3 full labels, 3 cropped)
├── src/app/
│   ├── layout.tsx                  # Fonts, metadata, body
│   ├── page.tsx                    # Assembles all sections
│   └── api/order/route.ts          # POST → Google Apps Script
├── src/components/
│   ├── Navbar.tsx, Hero.tsx, Products.tsx, ProductCard.tsx
│   ├── WhyBrekkie.tsx, OurStory.tsx, OrderSection.tsx, OrderForm.tsx
│   ├── Footer.tsx
│   └── ui/ (Button, Input, Select, Textarea, StripePattern)
├── src/hooks/useInView.ts
├── src/lib/constants.ts, validators.ts
└── src/types/index.ts
```

~27 code files total.
