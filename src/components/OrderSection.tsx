"use client";

import { useEffect, useState } from "react";
import { OrderForm, type TabType } from "@/components/OrderForm";
import type { Product, Settings } from "@/types";

interface OrderSectionProps {
  products: Product[];
  settings: Settings;
}

export function OrderSection({ products, settings }: OrderSectionProps) {
  const [defaultTab, setDefaultTab] = useState<TabType>("preorder");

  useEffect(() => {
    if (window.location.hash === "#wholesale") {
      setDefaultTab("wholesale");
      setTimeout(() => {
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <section id="order" className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-navy mb-4">
          Place Your Order
        </h2>
        <p className="text-center text-navy/60 mb-12">
          Preorder for delivery or inquire about wholesale for your business.
        </p>
        <OrderForm
          defaultTab={defaultTab}
          products={products}
          settings={settings}
        />
      </div>
    </section>
  );
}
