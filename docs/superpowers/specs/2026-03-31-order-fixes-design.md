# Order Flow Fixes — Design Spec

**Date:** 2026-03-31
**Scope:** Sheets bug, team email notifications, auto-focus fix, testing walkthrough

---

## 1. Sheets Bug Fix

**Root cause:** Webhook sends `formType: "order"` but Apps Script only handles `"preorder"` and `"wholesale"`.

**Fix:** In `GOOGLE_APPS_SCRIPT.js` `doPost()`, treat `"order"` as equivalent to `"preorder"`:

```javascript
if (data.formType === "preorder" || data.formType === "order") {
  writePreorder(sheet, data);
}
```

**Deployment:** User must copy updated script into Google Apps Script editor and redeploy.

---

## 2. Team Email Notifications via Resend

**Trigger:** In `handleCheckoutCompleted()` in `src/app/api/webhook/stripe/route.ts`, after Supabase insert succeeds.

**Recipients (hardcoded array):**
- zack@brekkiebakery.com
- hananabdibrahim@gmail.com
- Fahiyefarah@gmail.com
- ayuubosman221@gmail.com
- kevin.s.kabore@gmail.com

**New file:** `src/lib/email.ts`
- Exports `sendOrderNotification(orderData)` function
- Uses Resend SDK (`resend` npm package)
- Reads `RESEND_API_KEY` env var

**From address:** `orders@brekkiebakery.com` (requires Resend domain verification for brekkiebakery.com). Falls back to `onboarding@resend.dev` during testing.

**Email content:**
- **Subject:** `New Order #BB-XXXXXXXX-XXX - [N] loaves, $[amount]`
- **Body (HTML):**
  - Summary headline: order number, total loaves, total amount
  - Customer details: name, email, phone
  - Delivery: address, date, special instructions
  - Items table: flavor name, quantity for each item ordered
  - Link to Google Sheet

**Error handling:** Fire-and-forget with console.error on failure. Does not block webhook response or affect order status.

**Env vars to add:**
- `RESEND_API_KEY` in `.env.local`, `.env.example`, and Vercel environment variables

---

## 3. Auto-Focus on Order Form Step 2

**File:** `src/components/OrderForm.tsx`

**Change:** Add `useEffect` keyed on `step` state. When `step` changes to 2, focus the first input of the AddressInput component (street address field).

**Implementation:** `AddressInput` component accepts an `autoFocus` prop and passes it to its first `<input>` element. The `OrderForm` passes `autoFocus={step === 2}` to `AddressInput` when rendering step 2.

---

## 4. Testing & Deployment Walkthrough

### Phase 1: Local code changes (done by Claude)
- Fix Apps Script formType
- Add Resend email notification to webhook
- Fix auto-focus
- Add `RESEND_API_KEY` to `.env.local` and `.env.example`

### Phase 2: User actions — Google Apps Script
1. Open Apps Script editor for the Brekkie Orders spreadsheet
2. Replace script content with updated `GOOGLE_APPS_SCRIPT.js`
3. Deploy > Manage deployments > Edit existing > Deploy

### Phase 3: User actions — Resend setup
1. Sign up at resend.dev (if not already)
2. Add domain `brekkiebakery.com` and verify DNS records
3. API key already provided — added to `.env.local`

### Phase 4: User actions — Vercel env vars
1. Go to Vercel project > Settings > Environment Variables
2. Add `RESEND_API_KEY` = the provided key
3. Redeploy

### Phase 5: Local end-to-end test
1. Ensure `.env.local` has `sk_test_*` Stripe key (not live)
2. Run `npm run dev`
3. Place test order using card `4242 4242 4242 4242`, any future expiry, any CVC
4. Verify: order confirmation page shows, Google Sheet gets new row, team gets email notification
5. If Stripe CLI is available: `stripe listen --forward-to localhost:3000/api/webhook/stripe` to forward test webhooks locally

### Phase 6: Live verification
1. Switch back to `sk_live_*` keys in Vercel
2. Redeploy
3. Place a small real order to confirm full flow

---

## Files Changed

| File | Change |
|------|--------|
| `GOOGLE_APPS_SCRIPT.js` | Accept `"order"` formType |
| `src/lib/email.ts` | New — Resend notification helper |
| `src/app/api/webhook/stripe/route.ts` | Call `sendOrderNotification()` after insert |
| `src/components/OrderForm.tsx` | Add `useEffect` focus on step 2 |
| `src/components/ui/AddressInput.tsx` | Accept `autoFocus` prop |
| `.env.local` | Add `RESEND_API_KEY` |
| `.env.example` | Add `RESEND_API_KEY` placeholder |
| `package.json` | Add `resend` dependency |
