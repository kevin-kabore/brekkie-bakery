"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AddressInput, formatAddress } from "@/components/ui/AddressInput";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/context/CartContext";
import { BUSINESS_TYPES, FREQUENCIES } from "@/lib/constants";
import type { AddressData, DeliveryFormData, Settings, WholesaleFormData } from "@/types";

export type TabType = "preorder" | "wholesale";
type SubmitState = "idle" | "submitting" | "success" | "error";

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

const emptyAddress: AddressData = {
  street: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
};

const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
  value: type.toLowerCase(),
  label: type,
}));

interface OrderFormProps {
  defaultTab?: TabType;
  settings: Settings;
}

export function OrderForm({ defaultTab = "preorder", settings }: OrderFormProps) {
  const { items, totalQuantity, totalCents, clear } = useCart();

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [deliveryData, setDeliveryData] = useState<Omit<DeliveryFormData, "items">>({
    name: "",
    email: "",
    phone: "",
    deliveryDate: "",
    address: { ...emptyAddress },
    specialInstructions: "",
  });
  const [wholesaleData, setWholesaleData] = useState<Omit<WholesaleFormData, "items">>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    address: { ...emptyAddress },
    frequency: "one-time",
    specialInstructions: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  function updateDelivery<K extends keyof Omit<DeliveryFormData, "items">>(
    field: K,
    value: Omit<DeliveryFormData, "items">[K]
  ) {
    setDeliveryData((prev) => ({ ...prev, [field]: value }));
  }

  function updateWholesale<K extends keyof Omit<WholesaleFormData, "items">>(
    field: K,
    value: Omit<WholesaleFormData, "items">[K]
  ) {
    setWholesaleData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (totalQuantity === 0) {
      setFormError("Please add items to your cart first.");
      return;
    }

    if (activeTab === "preorder" && !settings.preordersOpen) {
      setFormError("Preorders are currently closed. Check back soon!");
      return;
    }

    setSubmitState("submitting");

    try {
      if (activeTab === "preorder") {
        const payload = {
          name: deliveryData.name,
          email: deliveryData.email,
          phone: deliveryData.phone,
          items,
          deliveryDate: deliveryData.deliveryDate,
          address: deliveryData.address,
          specialInstructions: deliveryData.specialInstructions,
        };

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setFormError(result.error || "Not enough inventory available. Please reduce your order.");
            setSubmitState("idle");
            return;
          }
          throw new Error(result.error || "Checkout failed");
        }

        window.location.href = result.url;
        return;
      } else {
        const payload = {
          formType: "wholesale",
          ...wholesaleData,
          items,
          deliveryAddress: formatAddress(wholesaleData.address),
        };

        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Submission failed");
        }

        setSubmitState("success");
        clear();
        setTimeout(() => {
          setSubmitState("idle");
          setWholesaleData({
            businessName: "",
            contactName: "",
            email: "",
            phone: "",
            businessType: "",
            address: { ...emptyAddress },
            frequency: "one-time",
            specialInstructions: "",
          });
        }, 3000);
      }
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">&#10003;</div>
          <p className="text-green-800 font-semibold text-lg">
            {activeTab === "wholesale"
              ? "Inquiry received! We'll be in touch shortly."
              : "Order received! We'll be in touch shortly."}
          </p>
        </div>
      </div>
    );
  }

  if (submitState === "error") {
    return (
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-red-800 font-semibold mb-3">
            Something went wrong. Please try again or email{" "}
            <a
              href="mailto:zach@brekkiebakery.com"
              className="underline"
            >
              zach@brekkiebakery.com
            </a>
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSubmitState("idle")}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const preordersClosed = !settings.preordersOpen && activeTab === "preorder";
  const isWholesale = activeTab === "wholesale";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex">
        <button
          type="button"
          onClick={() => {
            setActiveTab("preorder");
            setFormError("");
          }}
          className={
            activeTab === "preorder"
              ? "bg-navy text-cream rounded-t-lg px-6 py-3 font-semibold cursor-pointer"
              : "bg-transparent text-navy/60 hover:text-navy px-6 py-3 border-b-2 border-navy/20 cursor-pointer"
          }
        >
          Preorder
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("wholesale");
            setFormError("");
          }}
          className={
            activeTab === "wholesale"
              ? "bg-navy text-cream rounded-t-lg px-6 py-3 font-semibold cursor-pointer"
              : "bg-transparent text-navy/60 hover:text-navy px-6 py-3 border-b-2 border-navy/20 cursor-pointer"
          }
        >
          Wholesale
        </button>
      </div>

      <div className="bg-white rounded-2xl rounded-tl-none shadow-lg p-6 md:p-8">
        {preordersClosed ? (
          <div className="text-center py-8">
            <p className="text-navy/60 text-lg">
              Preorders are currently closed. Check back soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Cart summary at top */}
            <CartSummary
              hidePrices={isWholesale}
              maxQty={isWholesale ? 100 : 20}
            />

            {activeTab === "preorder" ? (
              <>
                <Input
                  label="Name"
                  type="text"
                  required
                  autoComplete="name"
                  value={deliveryData.name}
                  onChange={(e) => updateDelivery("name", e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={deliveryData.email}
                  onChange={(e) => updateDelivery("email", e.target.value)}
                />
                <Input
                  label="Phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={deliveryData.phone}
                  onChange={(e) => updateDelivery("phone", e.target.value)}
                />

                <AddressInput
                  value={deliveryData.address}
                  onChange={(addr) => updateDelivery("address", addr)}
                  prefix="shipping "
                />

                <Input
                  label="Preferred Delivery Date"
                  type="date"
                  required
                  min={getTomorrowDate()}
                  value={deliveryData.deliveryDate}
                  onChange={(e) => updateDelivery("deliveryDate", e.target.value)}
                />
                <Textarea
                  label="Special Instructions"
                  placeholder="Buzzer code, leave at door, dietary notes, etc."
                  value={deliveryData.specialInstructions}
                  onChange={(e) =>
                    updateDelivery("specialInstructions", e.target.value)
                  }
                />
              </>
            ) : (
              <>
                <Input
                  label="Business Name"
                  type="text"
                  required
                  autoComplete="organization"
                  value={wholesaleData.businessName}
                  onChange={(e) =>
                    updateWholesale("businessName", e.target.value)
                  }
                />
                <Input
                  label="Contact Name"
                  type="text"
                  required
                  autoComplete="name"
                  value={wholesaleData.contactName}
                  onChange={(e) =>
                    updateWholesale("contactName", e.target.value)
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={wholesaleData.email}
                  onChange={(e) => updateWholesale("email", e.target.value)}
                />
                <Input
                  label="Phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={wholesaleData.phone}
                  onChange={(e) => updateWholesale("phone", e.target.value)}
                />
                <Select
                  label="Business Type"
                  required
                  options={businessTypeOptions}
                  value={wholesaleData.businessType}
                  onChange={(e) =>
                    updateWholesale("businessType", e.target.value)
                  }
                />

                <AddressInput
                  value={wholesaleData.address}
                  onChange={(addr) => updateWholesale("address", addr)}
                  prefix="billing "
                />

                <Select
                  label="Order Frequency"
                  required
                  options={FREQUENCIES}
                  value={wholesaleData.frequency}
                  onChange={(e) =>
                    updateWholesale(
                      "frequency",
                      e.target.value as WholesaleFormData["frequency"]
                    )
                  }
                />
                <Textarea
                  label="Special Instructions"
                  placeholder="Any special requirements or notes..."
                  value={wholesaleData.specialInstructions}
                  onChange={(e) =>
                    updateWholesale("specialInstructions", e.target.value)
                  }
                />
              </>
            )}

            {formError && (
              <p className="text-sm text-red-500 text-center">{formError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitState === "submitting" || totalQuantity === 0}
            >
              {submitState === "submitting"
                ? "Processing..."
                : activeTab === "preorder"
                  ? totalCents > 0
                    ? `Checkout — $${(totalCents / 100).toFixed(2)}`
                    : "Add items to continue"
                  : totalQuantity > 0
                    ? "Submit Inquiry"
                    : "Add items to continue"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
