# Brekkie Bakery — Build Prompts

> Copy-paste each prompt into a new Claude Code session (or sequentially in the same session).
> Verify each checkpoint before continuing to the next prompt.

---

## Prompt 1: Setup + Scaffold + Assets

```
Read /Users/kevin.kabore/Desktop/brekkie-bakery/BRIEF.md for full project context.

You are building the Brekkie Bakery website — a single-page Next.js site for a NYC protein banana bread brand. The project directory is /Users/kevin.kabore/Desktop/brekkie-bakery/ and already contains 3 label PDFs and a BRIEF.md.

Do the following steps IN ORDER:

### 1. Initialize Next.js project

cd /Users/kevin.kabore/Desktop/brekkie-bakery
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

If the directory already has files, answer "yes" to proceed — the scaffold will work around the existing PDFs.

### 2. Convert label PDFs to web images

mkdir -p public/images

# Convert each PDF to high-res PNG (4x native resolution = 2208px wide)
sips -s format png --resampleWidth 2208 "Brekkie chocolate chip.pdf" --out public/images/label-classic-full.png
sips -s format png --resampleWidth 2208 "Brekkie Blueberry.pdf" --out public/images/label-blueberry-full.png
sips -s format png --resampleWidth 2208 "Brekkie Walnut.pdf" --out public/images/label-walnut-full.png

After converting, check the dimensions of the output PNGs with `sips -g pixelHeight -g pixelWidth public/images/label-classic-full.png`. They should be around 2208 x ~868.

Now crop to the RIGHT HALF (the branding side with "Brekkie / Banana Bread / flavor name"). The labels are wrap-around: left half = nutrition facts, right half = brand art.

# Crop: keep only the right ~50% of each image
# Adjust cropOffset if the brand side doesn't start exactly at the midpoint
sips --cropToHeightWidth 868 1104 --cropOffset 0 1104 public/images/label-classic-full.png --out public/images/classic-chocolate-chip.png
sips --cropToHeightWidth 868 1104 --cropOffset 0 1104 public/images/label-blueberry-full.png --out public/images/blueberry-chocolate-chip.png
sips --cropToHeightWidth 868 1104 --cropOffset 0 1104 public/images/label-walnut-full.png --out public/images/walnut-chocolate-chip.png

IMPORTANT: After cropping, visually inspect the output. Read the cropped PNGs to verify the branding (not nutrition facts) is showing. If the crop is wrong, adjust the cropOffset X value (try 1000, 1150, etc.) until the brand side is captured.

### 3. Set up Tailwind v4 theme

Replace the generated CSS file (likely src/app/globals.css) with a Tailwind v4 configuration. In Tailwind v4, use the CSS-first @theme directive:

File: tailwind.css (at project root, or wherever the CSS entry lives)

@import "tailwindcss";

@theme {
  --color-navy: #1B2A4A;
  --color-navy-light: #2A3F6E;
  --color-coral: #D4845E;
  --color-golden: #F0C75E;
  --color-sage: #9CB5A0;
  --color-lavender: #B8A0CC;
  --color-olive: #A4AD7B;
  --color-cream: #FEFCF3;

  --font-display: var(--font-lilita), cursive;
  --font-script: var(--font-pacifico), cursive;
  --font-body: var(--font-inter), system-ui, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
}

This enables utilities like text-navy, bg-cream, font-display, font-script throughout the app.

### 4. Set up root layout with fonts

File: src/app/layout.tsx

Load three Google Fonts via next/font/google:
- Inter (body) — subsets: ["latin"], variable: "--font-inter"
- Lilita_One (display) — weight: "400", subsets: ["latin"], variable: "--font-lilita"
- Pacifico (script) — weight: "400", subsets: ["latin"], variable: "--font-pacifico"

Apply all three CSS variables to the <html> className.
Set <body> className to "bg-cream text-navy font-body antialiased".

Metadata:
- title: "Brekkie | Protein Banana Bread - NYC"
- description: "Sweet enough for dessert. Smart enough for breakfast. 12g protein banana bread, baked in small batches in New York City."
- openGraph: title, description, url (https://brekkiebakery.com), siteName "Brekkie", type "website"

### 5. Create constants and types

File: src/lib/constants.ts
- NAV_LINKS: Products (#products), Why Brekkie (#why), Our Story (#story), Order (#order)
- PRODUCTS array with 3 items, each having: id, name, calories, allergens, image path, accentColor, stripeColor
  - Classic: accentColor #F0C75E (golden), stripeColor #F0C75E
  - Blueberry: accentColor #B8A0CC (lavender), stripeColor #3B4D7A (navy blue)
  - Walnut: accentColor #9CB5A0 (sage), stripeColor #9CB5A0
- CONTACT: email "zach@brekkiebakery.com", address "Brekkie LLC, 1580 Park Ave, New York, NY 10029"

File: src/types/index.ts
- Product interface (id, name, calories, allergens, image, accentColor, stripeColor)
- PreorderFormData (name, email, phone, classicQty, blueberryQty, walnutQty, pickupDate, specialInstructions)
- WholesaleFormData (businessName, contactName, email, phone, businessType, classicQty, blueberryQty, walnutQty, deliveryAddress, frequency, specialInstructions)

### 6. Create environment files

File: .env.local
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/PLACEHOLDER/exec

File: .env.example
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

Add .env.local to .gitignore if not already there.

### 7. Create utility hook and components

File: src/hooks/useInView.ts
A "use client" hook wrapping IntersectionObserver. Returns { ref, isInView }. Triggers once when element enters viewport (threshold: 0.1). Used for scroll-triggered fade-in animations.

File: src/components/ui/StripePattern.tsx
An SVG component that renders repeating vertical stripes. Props: color (string), opacity (number, default 0.1), className. Used as decorative backgrounds throughout the site.

File: src/components/ui/Button.tsx
Thin wrapper around <button>. Props: variant ("primary" | "secondary" | "outline"), size ("sm" | "md" | "lg"), plus standard ButtonHTMLAttributes. Primary variant: bg-coral text-cream hover:bg-coral/90. Rounded-full or rounded-lg.

File: src/components/ui/Input.tsx
Thin wrapper around <input> with a <label>. Props: label (string), error (string), plus standard InputHTMLAttributes. Styled with brand colors, focus ring in coral.

File: src/components/ui/Select.tsx
Same pattern as Input but for <select>. Props: label, options array, error.

File: src/components/ui/Textarea.tsx
Same pattern as Input but for <textarea>.

### 8. Git init and push

git init
git add .
git commit -m "Initial Next.js scaffold with assets and theme"
git remote add origin https://github.com/kevin-kabore/brekkie-bakery.git
git branch -M main
git push -u origin main

If the remote already exists, skip the remote add. If main already exists on remote, force may be needed (ask me first).

### 9. Verify

Run `npm run dev` and confirm:
- The dev server starts at localhost:3000
- No TypeScript or build errors
- The page loads with the cream background and navy text
- The 3 cropped label PNGs exist and look correct (brand side showing, not nutrition facts)

Tell me what you see and list any issues.
```

**Checkpoint:** Dev server runs. Cream background visible. Label images look correct. No build errors.

---

## Prompt 2: Build All Components + API Route

```
Read /Users/kevin.kabore/Desktop/brekkie-bakery/BRIEF.md for full project context.

You are continuing the Brekkie Bakery website build. The project is already scaffolded with Next.js, Tailwind v4 theme, fonts, constants, types, utility components, and label images. Now build all section components and the API route.

Read the existing src/lib/constants.ts and src/types/index.ts first so you use the exact data shapes. Read tailwind.css to see the theme tokens available.

Build these components IN ORDER, verifying each renders before moving on:

### 1. Navbar (src/components/Navbar.tsx)

"use client" component (needs scroll listener + mobile menu state).

Desktop layout:
  Left: "BREKKIE" in font-display text-navy
  Center: nav links from NAV_LINKS constant (Products, Why Brekkie, Our Story, Order)
  Right: "ORDER NOW" button (bg-coral text-cream, links to #order)

Mobile layout:
  Left: "BREKKIE" logo
  Right: hamburger icon button
  Menu: full-width dropdown with nav links, slide down animation

Behavior:
  - Sticky top (fixed or sticky positioning, z-50)
  - Transparent initially, then bg-cream/95 backdrop-blur-sm shadow-sm after scrolling past 50px
  - Smooth scroll to sections on link click
  - Close mobile menu after clicking a link

### 2. Hero (src/components/Hero.tsx)

Full viewport height section (min-h-screen). The emotional first impression.

Content (centered, stacked vertically):
  - "BREKKIE" in font-display, text-6xl md:text-8xl, text-navy
  - "Banana Bread" in font-script, text-3xl md:text-5xl, text-coral
  - "Protein Banana Bread" in font-body, text-lg, text-navy/70
  - Spacer
  - Tagline: "Sweet enough for dessert. Smart enough for breakfast." in italic text-xl
  - "ORDER NOW" CTA button (bg-coral text-cream)
  - Optional: the three label images arranged in a slight fan/overlap (rotated -5deg, 0deg, +5deg) below the tagline

Background: cream with a subtle StripePattern in golden (#F0C75E) at ~5% opacity.
Add a subtle scroll-down indicator at the bottom (animated chevron or arrow).

### 3. Products Section (src/components/Products.tsx + src/components/ProductCard.tsx)

Section with id="products". Heading: "Our Flavors" in font-display.

Products.tsx maps over the PRODUCTS array and renders 3 ProductCard components in a responsive grid (1 col mobile, 3 col md+, gap-8).

ProductCard.tsx receives a Product prop. Layout:
  - Top: rounded-t-2xl container with StripePattern background in the flavor's stripeColor. The cropped label PNG centered/overlaid using next/image (with proper width/height/alt).
  - Bottom: white/cream card body with:
    - Flavor name in font-display text-xl
    - "12g Protein" badge (small pill in navy bg, cream text)
    - Calorie count: "{calories} cal per serving"
    - Allergens listed as small pills/tags
  - Hover: scale-[1.02] shadow-lg transition-all duration-300
  - Container: rounded-2xl overflow-hidden shadow-md

### 4. Why Brekkie (src/components/WhyBrekkie.tsx)

Section with id="why". Heading: "Why Brekkie?" in font-display.

Three feature blocks in a responsive grid (1 col mobile, 3 col md+):

1. "12g Protein" — Icon: a protein/muscle emoji or simple SVG icon. Text: "Every serving packs 12 grams of protein to fuel your morning — or your afternoon, or your midnight snack."
2. "All Natural" — Icon: leaf emoji or SVG. Text: "Everything intentional. Nothing artificial. Just real ingredients you can pronounce, baked into something extraordinary."
3. "Small Batch" — Icon: oven/heart emoji or SVG. Text: "Baked in small batches in New York City. Because good things take time, and great things take a little more."

Each block:
  - Large icon/emoji centered at top
  - Bold heading in font-display
  - Description text in font-body text-navy/70
  - Fade-in animation via useInView hook

### 5. Our Story (src/components/OurStory.tsx)

Section with id="story". Heading: "Our Story" in font-display.

Clean text layout, max-w-2xl mx-auto, centered:

Story copy (2-3 paragraphs):
"It started in a small Chelsea apartment with a simple question: why can't breakfast taste like dessert AND fuel your day?

We were tired of choosing between flavor and function. Protein bars that tasted like cardboard. Pastries loaded with sugar and empty calories. There had to be a better way.

So we started baking. Batch after batch, we refined our recipe until we landed on something special — a banana bread that's rich, moist, and packed with 12 grams of protein. No artificial anything. Just real ingredients, real flavor, and a real good reason to look forward to breakfast."

Closing sign-off in font-script text-coral text-2xl:
"everything intentional. nothing artificial."

Use useInView for fade-in animation.

### 6. Order Section (src/components/OrderSection.tsx + src/components/OrderForm.tsx)

OrderSection.tsx: Section with id="order". Heading: "Place Your Order" in font-display. Wraps OrderForm.

OrderForm.tsx: "use client" — this is the most complex component.

Two tabs: "Preorder" and "Wholesale"
  - Active tab: bg-navy text-cream rounded-t-lg
  - Inactive tab: bg-transparent text-navy border-b-2 border-navy/20

State:
  - activeTab: "preorder" | "wholesale"
  - Separate form data state for each tab (using the types from src/types/index.ts)
  - submitState: "idle" | "submitting" | "success" | "error"

PREORDER TAB FIELDS:
  - Name (text, required)
  - Email (email, required)
  - Phone (tel, required)
  - Flavor quantities in a row:
    - Classic Chocolate Chip (number 0-20, default 0)
    - Blueberry Chocolate Chip (number 0-20, default 0)
    - Walnut Chocolate Chip (number 0-20, default 0)
  - Preferred Pickup Date (date, required, min=tomorrow)
  - Special Instructions (textarea, optional)

WHOLESALE TAB FIELDS:
  - Business Name (text, required)
  - Contact Name (text, required)
  - Email (email, required)
  - Phone (tel, required)
  - Business Type (select: Bodega, Cafe, Gym, Office, Restaurant, Other — required)
  - Flavor quantities in a row (number 0-100 each, labeled as "loaves"):
    - Classic, Blueberry, Walnut
  - Delivery Address (textarea, required)
  - Order Frequency (select: One-time, Weekly, Biweekly, Monthly — required)
  - Special Instructions (textarea, optional)

VALIDATION:
  - HTML5 required/type/pattern for basic validation
  - Custom check on submit: at least one flavor quantity must be > 0
  - Show inline error if no flavors selected

SUBMISSION:
  - On submit, POST to /api/order with { formType: activeTab, ...formData }
  - Show loading spinner in button while submitting
  - Success: green checkmark + "Order received! We'll be in touch shortly."
  - Error: red message + "Something went wrong. Please try again or email zach@brekkiebakery.com"
  - Reset form on success after 3 seconds

STYLING:
  - Form container: bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto
  - Submit button: bg-coral text-cream, full width at bottom
  - Use the ui/Input, ui/Select, ui/Textarea, ui/Button components

### 7. Footer (src/components/Footer.tsx)

Dark section: bg-navy text-cream.

Three-column layout (stack on mobile):
  Left: "BREKKIE" in font-display + "Banana Bread" in font-script text-coral
  Center: Contact — zach@brekkiebakery.com (mailto link), address
  Right: "Follow Us" — placeholder Instagram and TikTok links (href="#")

Bottom divider line, then: "© 2026 Brekkie LLC. All rights reserved."

### 8. Assemble the page

File: src/app/page.tsx

Import and render all sections in order:
  <Navbar />
  <main>
    <Hero />
    <Products />
    <WhyBrekkie />
    <OurStory />
    <OrderSection />
  </main>
  <Footer />

### 9. API Route (src/app/api/order/route.ts)

POST handler:
  1. Parse JSON body
  2. Validate: formType must be "preorder" or "wholesale", email must contain "@"
  3. Read GOOGLE_SCRIPT_URL from process.env
  4. If not configured, return 500 with "Server configuration error"
  5. POST the body (with added submittedAt timestamp) to the Apps Script URL
  6. Return { success: true } on success
  7. Return { error: "Failed to submit order..." } on failure
  8. Log errors to console for debugging

### 10. Verify

Run `npm run dev` and verify:
  - All 6 sections render correctly
  - Navbar is sticky and changes style on scroll
  - Product cards show the label images
  - Mobile hamburger menu works
  - Order form switches between tabs
  - Form validation works (try submitting empty, try submitting with 0 quantities)
  - Form submission hits the API route (will get a 500 since Apps Script isn't configured yet — that's expected)
  - Footer renders with correct info
  - Scroll animations fire when sections come into view
  - No TypeScript errors, no console errors

Tell me what renders and what needs fixing. Include a screenshot if possible.
```

**Checkpoint:** All sections visible. Forms work (validation fires, submission hits API). Responsive on mobile. No build errors.

---

## Prompt 3: Polish + Deploy + Domain

```
Read /Users/kevin.kabore/Desktop/brekkie-bakery/BRIEF.md for full project context.

You are finishing the Brekkie Bakery website. All components are built and rendering. Now polish, commit, and deploy.

### 1. Responsive polish

Test the site at these widths and fix any layout issues:
  - 375px (iPhone SE/mini)
  - 768px (iPad)
  - 1024px (small laptop)
  - 1440px (desktop)

Common issues to check:
  - Hero text should scale down on mobile (text-4xl mobile, text-6xl tablet, text-8xl desktop)
  - Product cards should be 1 column on mobile, 3 columns on md+
  - Order form should be single column on mobile
  - Navbar hamburger menu should work on mobile
  - No horizontal scrolling at any width
  - Footer columns stack on mobile
  - Touch targets are at least 44px on mobile

### 2. Create OG image

Create a simple 1200x630px Open Graph image for social sharing. Options:
  a. Use one of the label images as a base
  b. Create a simple HTML-to-image with "Brekkie | Protein Banana Bread" text on cream background

Save to public/og-image.png. If creating from scratch is complex, create a simple placeholder and note it for later replacement.

### 3. Favicon

If there's no favicon yet, create a simple one:
  - Extract or create a small icon from the label art
  - Or create a simple "B" in the navy color (#1B2A4A) as favicon
  - Save to public/favicon.ico (or app/favicon.ico for Next.js App Router)

### 4. Final build check

Run `npm run build` and fix any errors. Common issues:
  - "use client" missing on components that use hooks
  - Image width/height props missing on next/image
  - Unused imports
  - Type errors

Then run `npm run start` and verify the production build works.

### 5. Git commit

Stage all changes and commit:
  git add .
  git commit -m "Complete Brekkie Bakery website - all sections, order forms, responsive"
  git push origin main

### 6. Deploy to Vercel

Install Vercel CLI if not already installed:
  npm i -g vercel

Deploy:
  cd /Users/kevin.kabore/Desktop/brekkie-bakery
  vercel

Follow the prompts:
  - Link to existing project or create new
  - Framework: Next.js (should auto-detect)
  - Keep default settings

Then deploy to production:
  vercel --prod

### 7. Configure environment variable on Vercel

The GOOGLE_SCRIPT_URL needs to be set on Vercel for the order forms to work:
  vercel env add GOOGLE_SCRIPT_URL

When prompted:
  - Value: The user will paste their Apps Script URL after following GOOGLE_APPS_SCRIPT.js setup instructions
  - Environments: Production, Preview, Development

For now, add a placeholder value. The user will update it after deploying the Apps Script.

### 8. Connect domain

Tell the user to:
  1. Go to the Vercel dashboard > project > Settings > Domains
  2. Add brekkiebakery.com
  3. Vercel will show DNS records to configure
  4. At Squarespace (domain registrar):
     - Go to domain settings > DNS
     - Add A record: @ → 76.76.21.21
     - Add CNAME: www → cname.vercel-dns.com
  5. Wait for DNS propagation (usually 5-30 minutes)
  6. Vercel will auto-provision SSL

### 9. Final verification

After deployment, verify:
  - The Vercel preview URL loads the full site
  - All 6 sections render
  - Mobile responsive works
  - Order form submits (will fail gracefully until Apps Script is configured)
  - No console errors in production

Report the Vercel deployment URL and any remaining issues.
```

**Checkpoint:** Site deployed to Vercel. All sections work. Domain instructions provided. Google Apps Script setup instructions in GOOGLE_APPS_SCRIPT.js ready for user to follow.

---

## Post-Build: Google Apps Script Setup

After the site is deployed, follow the instructions in `GOOGLE_APPS_SCRIPT.js` to connect order forms to the existing Brekkie Orders spreadsheet:

1. Open the spreadsheet: https://docs.google.com/spreadsheets/d/17vLCTk0o8A5Bn_csZFjJH3NBYYBKooOXFOV3KtmGJ9c/edit
2. Go to Extensions > Apps Script
3. Paste the contents of `GOOGLE_APPS_SCRIPT.js`
4. Run `testSetup` to authorize and verify
5. Deploy as a Web App (Execute as: Me, Who has access: Anyone)
6. Copy the Web App URL
7. Update the `GOOGLE_SCRIPT_URL` env var on Vercel: `vercel env rm GOOGLE_SCRIPT_URL` then `vercel env add GOOGLE_SCRIPT_URL`
8. Redeploy: `vercel --prod`
9. Test both forms end-to-end

**How weekly tabs work:**
- Orders are written to a tab named "Week of Mon DD" (e.g. "Week of Feb 10")
- A new tab is auto-created each Monday
- Online orders have Sales Agent = "Online"
- Field sales team orders (Fahiye, Ay, etc.) can be entered directly into the same sheet
- Columns: Date, Type, Name/Business, Address, Phone, Email, Contact, Sales Agent, Classic, Blueberry, Walnut, Total Loaves, Frequency, Status, Notes
