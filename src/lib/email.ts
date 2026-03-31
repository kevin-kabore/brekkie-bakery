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
    from: "Brekkie Bakery Orders <zack@brekkiebakery.com>",
    to: TEAM_EMAILS,
    subject: `New Order ${data.orderNumber} - ${totalLoaves} loaves, $${totalDollars}`,
    html,
  });
}
