import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `BB-${dateStr}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Only wholesale goes through this route now
    if (body.formType !== "wholesale") {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    // Validate email
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Build flavorQuantities map from items for Google Sheets
    const items: Record<string, number> = body.items || {};

    // For Google Sheets: map product IDs to slugs
    // If items use UUIDs (Supabase), we need to look up slugs
    let flavorQuantities: Record<string, number> = {};

    try {
      const supabase = createServerClient();
      const productIds = Object.keys(items).filter((id) => items[id] > 0);

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id, name, slug, wholesale_price_cents")
          .in("id", productIds);

        if (products) {
          for (const p of products) {
            flavorQuantities[p.slug] = items[p.id] || 0;
          }
        }

        // Build order items for Supabase
        const orderItems = products?.map((p) => ({
          productId: p.id,
          productName: p.name,
          slug: p.slug,
          quantity: items[p.id] || 0,
          priceCents: p.wholesale_price_cents,
        })) ?? [];

        // Insert wholesale order into Supabase (no Stripe)
        await supabase.from("orders").insert({
          order_number: orderNumber,
          stripe_session_id: null,
          stripe_payment_intent: null,
          order_type: "wholesale",
          customer_name: body.businessName || "",
          customer_email: body.email,
          customer_phone: body.phone || null,
          delivery_address: body.address || null,
          items: orderItems,
          total_cents: 0,
          status: "confirmed",
          delivery_date: null,
          special_instructions: body.specialInstructions || null,
          synced_to_sheets: false,
        });
      }
    } catch (supabaseErr) {
      // Non-blocking: log but continue to Google Sheets
      console.error("Supabase wholesale insert failed:", supabaseErr);
    }

    // Google Sheets submission
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes("PLACEHOLDER")) {
      console.log("Wholesale order received (Google Script not configured):", JSON.stringify(body, null, 2));
      return NextResponse.json({ success: true, message: "Order logged (Google Script pending setup)" });
    }

    const sheetsPayload = {
      formType: "wholesale",
      businessName: body.businessName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      deliveryAddress: body.deliveryAddress,
      frequency: body.frequency,
      specialInstructions: body.specialInstructions,
      orderNumber,
      flavorQuantities,
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(sheetsPayload),
      redirect: "manual",
    });

    if (response.status === 302 || response.ok) {
      // Mark synced in Supabase
      try {
        const supabase = createServerClient();
        await supabase
          .from("orders")
          .update({ synced_to_sheets: true })
          .eq("order_number", orderNumber);
      } catch { /* non-blocking */ }

      return NextResponse.json({ success: true, message: "Order submitted successfully" });
    }

    const text = await response.text();
    console.error("Google Script error:", response.status, text.slice(0, 500));
    throw new Error(`Google Script responded with ${response.status}`);
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}
