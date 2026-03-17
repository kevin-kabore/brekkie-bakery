import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch {
    redirect("/");
  }

  if (session.payment_status !== "paid") {
    redirect("/");
  }

  const meta = session.metadata;
  const lineItems = session.line_items?.data ?? [];
  const totalFormatted = session.amount_total
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : "";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-navy mb-2">
          Order Confirmed!
        </h1>

        {meta?.order_number && (
          <p className="text-navy/60 mb-6">
            Order #{meta.order_number}
          </p>
        )}

        <div className="border-t border-navy/10 pt-6 mb-6">
          <div className="space-y-3 text-left">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-navy"
              >
                <span>
                  {item.description}{" "}
                  <span className="text-navy/50">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  ${((item.amount_total ?? 0) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {totalFormatted && (
            <div className="flex justify-between mt-4 pt-4 border-t border-navy/10 font-semibold text-navy">
              <span>Total</span>
              <span>{totalFormatted}</span>
            </div>
          )}
        </div>

        {meta?.delivery_date && (
          <p className="text-sm text-navy/60 mb-2">
            Delivery date: {meta.delivery_date}
          </p>
        )}

        {session.customer_email && (
          <p className="text-sm text-navy/60 mb-6">
            Receipt sent to {session.customer_email}
          </p>
        )}

        <Link
          href="/"
          className="inline-block bg-navy text-cream px-6 py-3 rounded-full font-semibold hover:bg-navy/90 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
