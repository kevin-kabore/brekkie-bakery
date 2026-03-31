# Order Flow Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix sheets bug, add team email notifications via Resend, and fix auto-focus on step 2 of the order form.

**Architecture:** The Stripe webhook (`route.ts`) is the central integration point — it already handles Supabase inserts and Google Sheets sync. We add a Resend email call in the same fire-and-forget pattern. The Apps Script gets a one-line fix for the formType mismatch. The OrderForm gets a `useEffect` for focus management.

**Tech Stack:** Next.js 16, Stripe webhooks, Resend SDK, Google Apps Script

---

### Task 1: Fix Google Apps Script formType Bug

**Files:**
- Modify: `GOOGLE_APPS_SCRIPT.js:93-101`

- [ ] **Step 1: Update doPost to accept "order" formType**

In `GOOGLE_APPS_SCRIPT.js`, change the `doPost` function's conditional block:

```javascript
    if (data.formType === "preorder" || data.formType === "order") {
      writePreorder(sheet, data);
    } else if (data.formType === "wholesale") {
```

This is a one-line change — add `|| data.formType === "order"` to line 93.

- [ ] **Step 2: Commit**

```bash
git add GOOGLE_APPS_SCRIPT.js
git commit -m "fix: accept 'order' formType in Google Apps Script"
```

**User action after this task:** Copy updated `GOOGLE_APPS_SCRIPT.js` content into Apps Script editor and redeploy.

---

### Task 2: Install Resend and Add Email Helper

**Files:**
- Create: `src/lib/email.ts`
- Modify: `.env.local` (add `RESEND_API_KEY`)
- Modify: `.env.example` (add `RESEND_API_KEY` placeholder)

- [ ] **Step 1: Install resend package**

```bash
npm install resend
```

- [ ] **Step 2: Add RESEND_API_KEY to .env.local**

Append to `.env.local`:

```
# Resend (email notifications)
RESEND_API_KEY=re_j77aJHC7_N1kFKrsCuRFCpde67pbEKk16
```

- [ ] **Step 3: Add RESEND_API_KEY placeholder to .env.example**

Append to `.env.example`:

```
# Resend (email notifications)
RESEND_API_KEY=re_...
```

- [ ] **Step 4: Create src/lib/email.ts**

```typescript
import { Resend } from "resend";

const TEAM_EMAILS = [
  "zack@brekkiebakery.com",
  "hananabdibrahim@gmail.com",
  "Fahiyefarah@gmail.com",
  "ayuubosman221@gmail.com",
  "kevin.s.kabore@gmail.com",
];

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/17vLCTk0o8A5Bn_csZFjJH3NBYYBKooOXFOV3KtmGJ9c/edit";

interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  specialInstructions: string | null;
  items: {
    productName: string;
    quantity: number;
    priceCents: number;
  }[];
  totalCents: number;
}

export async function sendOrderNotification(data: OrderNotificationData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const resend = new Resend(apiKey);

  const totalLoaves = data.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalDollars = (data.totalCents / 100).toFixed(2);

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;">${item.productName}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1B2A4A;">New Order ${data.orderNumber}</h2>
      <p style="font-size:16px;color:#333;">
        <strong>${totalLoaves} loaves</strong> &mdash; <strong>$${totalDollars}</strong>
      </p>

      <h3 style="color:#1B2A4A;margin-top:24px;">Customer</h3>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:4px 0;color:#666;width:100px;">Name</td><td>${data.customerName}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Email</td><td>${data.customerEmail}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Phone</td><td>${data.customerPhone}</td></tr>
      </table>

      <h3 style="color:#1B2A4A;margin-top:24px;">Delivery</h3>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:4px 0;color:#666;width:100px;">Address</td><td>${data.deliveryAddress}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Date</td><td>${data.deliveryDate}</td></tr>
        ${data.specialInstructions ? `<tr><td style="padding:4px 0;color:#666;">Notes</td><td>${data.specialInstructions}</td></tr>` : ""}
      </table>

      <h3 style="color:#1B2A4A;margin-top:24px;">Items</h3>
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px 12px;text-align:left;">Flavor</th>
            <th style="padding:8px 12px;text-align:center;">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <p style="margin-top:24px;">
        <a href="${SHEET_URL}" style="color:#1B2A4A;font-weight:bold;">View in Google Sheets &rarr;</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: "Brekkie Bakery Orders <orders@brekkiebakery.com>",
    to: TEAM_EMAILS,
    subject: `New Order ${data.orderNumber} - ${totalLoaves} loaves, $${totalDollars}`,
    html,
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts .env.example
git commit -m "feat: add Resend email notification helper for team"
```

---

### Task 3: Wire Email Notification into Stripe Webhook

**Files:**
- Modify: `src/app/api/webhook/stripe/route.ts:1-5` (add import)
- Modify: `src/app/api/webhook/stripe/route.ts:102-145` (add email call after Supabase insert)

- [ ] **Step 1: Add import at top of route.ts**

Add after existing imports:

```typescript
import { sendOrderNotification } from "@/lib/email";
```

- [ ] **Step 2: Add email notification call after Supabase insert**

In `handleCheckoutCompleted`, after the Supabase insert error check (after line 105) and before the Google Sheets sync block (line 107), add:

```typescript
  // Send team email notification (fire-and-forget)
  sendOrderNotification({
    orderNumber: meta.order_number,
    customerName: meta.customer_name,
    customerEmail: session.customer_email ?? "",
    customerPhone: meta.customer_phone,
    deliveryAddress: meta.delivery_address ?? "",
    deliveryDate: meta.delivery_date ?? "",
    specialInstructions: meta.special_instructions || null,
    items: orderItems.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      priceCents: item.priceCents,
    })),
    totalCents: session.amount_total ?? 0,
  }).catch((err) => console.error("Failed to send team notification:", err));
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/webhook/stripe/route.ts
git commit -m "feat: send team email notification on new orders via Resend"
```

---

### Task 4: Fix Auto-Focus on Order Form Step 2

**Files:**
- Modify: `src/components/ui/AddressInput.tsx:11-17` (add `autoFocus` prop)
- Modify: `src/components/OrderForm.tsx:3` (add `useEffect` import)
- Modify: `src/components/OrderForm.tsx:96,161-163` (add `useEffect` for focus)
- Modify: `src/components/OrderForm.tsx:482-486,504-508` (pass `autoFocus` to `AddressInput`)

- [ ] **Step 1: Add autoFocus prop to AddressInput**

In `src/components/ui/AddressInput.tsx`, add `autoFocus` to the interface and pass it to the first `Input`:

Change the interface:
```typescript
interface AddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  prefix?: string;
  autoFocus?: boolean;
}
```

Change the function signature:
```typescript
export function AddressInput({ value, onChange, prefix = "", autoFocus }: AddressInputProps) {
```

Add `autoFocus` to the Street Address `Input`:
```typescript
        <Input
          label="Street Address"
          type="text"
          required
          autoFocus={autoFocus}
          autoComplete={`${prefix}street-address`}
```

- [ ] **Step 2: Add useEffect for focus timing in OrderForm**

In `src/components/OrderForm.tsx`, change the import on line 3:

```typescript
import { useState, useEffect, type FormEvent } from "react";
```

After the `const [formError, setFormError]` line (line 116), add:

```typescript
  // Auto-scroll and focus when entering step 2
  useEffect(() => {
    if (step === 2) {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [step]);
```

Then remove the duplicate scroll call from `handleContinue` — change line 161-163 from:
```typescript
    setStep(2);
    // Scroll form back into view
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
```
to:
```typescript
    setStep(2);
```

- [ ] **Step 3: Pass autoFocus to AddressInput in step 2**

In the order tab's AddressInput (around line 482):
```typescript
                    <AddressInput
                      value={deliveryData.address}
                      onChange={(addr) => updateDelivery("address", addr)}
                      prefix="shipping "
                      autoFocus={true}
                    />
```

In the wholesale tab's AddressInput (around line 504):
```typescript
                    <AddressInput
                      value={wholesaleData.address}
                      onChange={(addr) => updateWholesale("address", addr)}
                      prefix="billing "
                      autoFocus={true}
                    />
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/AddressInput.tsx src/components/OrderForm.tsx
git commit -m "fix: auto-focus street address field when entering order step 2"
```

---

### Task 5: Testing & Deployment Walkthrough (User-Guided)

This task requires user interaction — walk through each step together.

- [ ] **Step 5.1: Update Google Apps Script**
  1. Open Apps Script editor: Extensions > Apps Script in the Brekkie Orders spreadsheet
  2. Replace full script content with updated `GOOGLE_APPS_SCRIPT.js`
  3. Deploy > Manage deployments > Edit (pencil icon) > Version: New version > Deploy

- [ ] **Step 5.2: Add Resend API key to Vercel**
  1. Go to Vercel project > Settings > Environment Variables
  2. Add: Key = `RESEND_API_KEY`, Value = `re_j77aJHC7_N1kFKrsCuRFCpde67pbEKk16`
  3. Select all environments (Production, Preview, Development)

- [ ] **Step 5.3: Verify Resend domain (for branded from-address)**
  1. Go to resend.com/domains > Add Domain > `brekkiebakery.com`
  2. Add the DNS records Resend provides (MX, TXT/SPF, DKIM)
  3. Until verified, emails will fail from `orders@brekkiebakery.com` — we can temporarily use `onboarding@resend.dev` as the from address if needed

- [ ] **Step 5.4: Push code and redeploy**
  1. Push to main: `git push origin main`
  2. Vercel auto-deploys from main

- [ ] **Step 5.5: Local test with Stripe CLI (optional)**
  1. Install Stripe CLI if not installed: `brew install stripe/stripe-cli/stripe`
  2. Login: `stripe login`
  3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
  4. Copy the webhook signing secret output and set as `STRIPE_WEBHOOK_SECRET` in `.env.local`
  5. Run `npm run dev`
  6. Place test order with card `4242 4242 4242 4242`, exp `12/34`, CVC `123`
  7. Verify: success page, Google Sheet row, team notification email

- [ ] **Step 5.6: Live smoke test**
  1. After deploy completes, place a small real order on brekkiebakery.com
  2. Verify: Stripe payment, order confirmation page, Google Sheet entry, team email
  3. Check auto-focus works when clicking "Continue to Delivery"
