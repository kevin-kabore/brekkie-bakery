import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate formType
    if (!body.formType || !["preorder", "wholesale"].includes(body.formType)) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    // Validate email
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes("PLACEHOLDER")) {
      // During development, just log and return success
      console.log("Order received (Google Script not configured):", JSON.stringify(body, null, 2));
      return NextResponse.json({ success: true, message: "Order logged (Google Script pending setup)" });
    }

    // Forward to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Script responded with ${response.status}`);
    }

    return NextResponse.json({ success: true, message: "Order submitted successfully" });
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}
