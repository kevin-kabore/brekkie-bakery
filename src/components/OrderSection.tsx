"use client";

import { OrderForm } from "@/components/OrderForm";
import type { Settings } from "@/types";

interface OrderSectionProps {
  products: unknown;
  settings: Settings;
}

export function OrderSection({ settings }: OrderSectionProps) {
  return (
    <section id="order" className="py-24 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-espresso mb-4">
          Place Your Order
        </h2>
        <p className="text-center text-espresso/60 mb-12">
          Order for shipping or inquire about wholesale for your business.
        </p>
        <OrderForm settings={settings} />
      </div>
    </section>
  );
}
