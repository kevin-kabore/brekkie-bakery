import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session, supabase);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutExpired(session, supabase);
      break;
    }
    default:
      // Unhandled event type — acknowledge it
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServerClient>
) {
  const meta = session.metadata;
  if (!meta?.order_number) {
    console.error("Webhook: missing order metadata on session", session.id);
    return;
  }

  const items: Record<string, number> = JSON.parse(meta.items_json);

  // Fetch product names for the order record
  const productIds = Object.keys(items);
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price_cents")
    .in("id", productIds);

  const productMap = new Map(products?.map((p) => [p.id, p]) ?? []);

  // Build items array for order record
  const orderItems = Object.entries(items).map(([productId, qty]) => {
    const product = productMap.get(productId);
    return {
      productId,
      productName: product?.name ?? "Unknown",
      slug: product?.slug ?? "unknown",
      quantity: qty,
      priceCents: product?.price_cents ?? 0,
    };
  });

  // Insert order into Supabase
  const { error: insertErr } = await supabase.from("orders").insert({
    order_number: meta.order_number,
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    order_type: "order",
    customer_name: meta.customer_name,
    customer_email: session.customer_email ?? "",
    customer_phone: meta.customer_phone,
    delivery_address: meta.delivery_address_json
      ? JSON.parse(meta.delivery_address_json)
      : null,
    items: orderItems,
    total_cents: session.amount_total ?? 0,
    status: "confirmed",
    delivery_date: meta.delivery_date,
    special_instructions: meta.special_instructions || null,
    synced_to_sheets: false,
  });

  if (insertErr) {
    console.error("Failed to insert order:", insertErr);
  }

  // Sync to Google Sheets (fire-and-forget)
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl && !scriptUrl.includes("PLACEHOLDER")) {
    // Build flavorQuantities map from slug → qty
    const flavorQuantities: Record<string, number> = {};
    for (const item of orderItems) {
      flavorQuantities[item.slug] = item.quantity;
    }

    try {
      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          formType: "order",
          name: meta.customer_name,
          email: session.customer_email ?? "",
          phone: meta.customer_phone,
          deliveryAddress: meta.delivery_address,
          deliveryDate: meta.delivery_date,
          specialInstructions: meta.special_instructions,
          orderNumber: meta.order_number,
          totalCents: session.amount_total ?? 0,
          status: "Confirmed",
          flavorQuantities,
          submittedAt: new Date().toISOString(),
        }),
        redirect: "manual",
      });

      // Mark synced
      await supabase
        .from("orders")
        .update({ synced_to_sheets: true })
        .eq("order_number", meta.order_number);
    } catch (sheetErr) {
      console.error("Failed to sync to Google Sheets:", sheetErr);
    }
  }
}

async function handleCheckoutExpired(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServerClient>
) {
  const meta = session.metadata;
  if (!meta?.items_json || !meta?.total_qty) return;

  // Idempotency: check that no order was created for this session
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existingOrder) {
    // Order was completed before expiry event arrived — don't restore
    return;
  }

  const items: Record<string, number> = JSON.parse(meta.items_json);
  const totalQty = parseInt(meta.total_qty, 10);

  const { error } = await supabase.rpc("restore_inventory", {
    p_items: items,
    p_total_qty: totalQty,
  });

  if (error) {
    console.error("Failed to restore inventory:", error);
  }
}
