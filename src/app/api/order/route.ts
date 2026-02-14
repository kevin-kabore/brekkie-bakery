import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate formType
    if (!body.formType || !["delivery", "wholesale"].includes(body.formType)) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    // Validate email
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes("PLACEHOLDER")) {
      console.log("Order received (Google Script not configured):", JSON.stringify(body, null, 2));
      return NextResponse.json({ success: true, message: "Order logged (Google Script pending setup)" });
    }

    // Google Apps Script processes the POST then returns a 302 redirect.
    // The data is already saved by the time we get the redirect.
    // Using redirect: "manual" prevents fetch from following the 302
    // (which would convert POST→GET and fail with 405).
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        ...body,
        submittedAt: new Date().toISOString(),
      }),
      redirect: "manual",
    });

    // 302 = script executed and redirected to response URL (success)
    // 200 = script returned directly (also success)
    if (response.status === 302 || response.ok) {
      return NextResponse.json({ success: true, message: "Order submitted successfully" });
    }

    // Anything else is an actual error
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
