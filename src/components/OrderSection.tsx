"use client";

import { useEffect, useState } from "react";
import { OrderForm, type TabType } from "@/components/OrderForm";

export function OrderSection() {
  const [defaultTab, setDefaultTab] = useState<TabType>("wholesale");

  useEffect(() => {
    if (window.location.hash === "#wholesale") {
      setDefaultTab("wholesale");
      // Scroll to order section after a brief delay for render
      setTimeout(() => {
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <section id="order" className="py-20 px-6 bg-cream-blue">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-navy mb-4">
          Place Your Order
        </h2>
        <p className="text-center text-navy/60 mb-12">
          Preorder for personal pickup or inquire about wholesale for your
          business.
        </p>
        <OrderForm defaultTab={defaultTab} />
      </div>
    </section>
  );
}
