import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { formatAddress } from "@/components/ui/AddressInput";
import type { AddressData } from "@/types";

interface CheckoutBody {
  name: string;
  email: string;
  phone: string;
  items: Record<string, number>;
  deliveryDate: string;
  address: AddressData;
  specialInstructions: string;
}

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `BB-${dateStr}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Name and valid email required" }, { status: 400 });
    }
    if (!body.deliveryDate) {
      return NextResponse.json({ error: "Delivery date required" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Fetch active products to validate items and get prices
    const { data: dbProducts, error: productsErr } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (productsErr || !dbProducts) {
      console.error("Failed to fetch products:", productsErr);
      return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Build validated line items and calculate total qty
    const lineItems: { productId: string; name: string; qty: number; priceCents: number }[] = [];
    let totalQty = 0;

    for (const [productId, qty] of Object.entries(body.items)) {
      if (qty <= 0) continue;
      const product = productMap.get(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${productId} not found or inactive` },
          { status: 400 }
        );
      }
      lineItems.push({
        productId,
        name: product.name,
        qty,
        priceCents: product.price_cents,
      });
      totalQty += qty;
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    // Reserve inventory atomically
    const itemsMap: Record<string, number> = {};
    for (const li of lineItems) {
      itemsMap[li.productId] = li.qty;
    }

    const { data: reserved, error: reserveErr } = await supabase.rpc(
      "reserve_inventory",
      { p_items: itemsMap, p_total_qty: totalQty }
    );

    if (reserveErr) {
      console.error("Inventory reservation error:", reserveErr);
      return NextResponse.json({ error: "Failed to check inventory" }, { status: 500 });
    }

    if (!reserved) {
      return NextResponse.json(
        { error: "Not enough inventory available. Please reduce your order." },
        { status: 409 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Build Stripe Checkout Session
    const stripeLineItems = lineItems.map((li) => ({
      price_data: {
        currency: "usd",
        product_data: { name: li.name },
        unit_amount: li.priceCents,
      },
      quantity: li.qty,
    }));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.email,
      line_items: stripeLineItems,
      metadata: {
        order_number: orderNumber,
        customer_name: body.name,
        customer_phone: body.phone,
        delivery_date: body.deliveryDate,
        delivery_address: formatAddress(body.address),
        delivery_address_json: JSON.stringify(body.address),
        special_instructions: body.specialInstructions || "",
        items_json: JSON.stringify(itemsMap),
        total_qty: String(totalQty),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
