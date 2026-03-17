"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AddressInput, formatAddress } from "@/components/ui/AddressInput";
import { BUSINESS_TYPES, FREQUENCIES } from "@/lib/constants";
import type { AddressData, DeliveryFormData, Product, Settings, WholesaleFormData } from "@/types";

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

function buildInitialItems(products: Product[]): Record<string, number> {
  const items: Record<string, number> = {};
  for (const p of products) {
    items[p.id] = 0;
  }
  return items;
}

const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
  value: type.toLowerCase(),
  label: type,
}));

interface OrderFormProps {
  defaultTab?: TabType;
  products: Product[];
  settings: Settings;
}

export function OrderForm({ defaultTab = "preorder", products, settings }: OrderFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData>({
    name: "",
    email: "",
    phone: "",
    items: buildInitialItems(products),
    deliveryDate: "",
    address: { ...emptyAddress },
    specialInstructions: "",
  });
  const [wholesaleData, setWholesaleData] = useState<WholesaleFormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    items: buildInitialItems(products),
    address: { ...emptyAddress },
    frequency: "one-time",
    specialInstructions: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  function updateDelivery<K extends keyof DeliveryFormData>(
    field: K,
    value: DeliveryFormData[K]
  ) {
    setDeliveryData((prev) => ({ ...prev, [field]: value }));
  }

  function updateWholesale<K extends keyof WholesaleFormData>(
    field: K,
    value: WholesaleFormData[K]
  ) {
    setWholesaleData((prev) => ({ ...prev, [field]: value }));
  }

  function updateItem(
    tab: "preorder" | "wholesale",
    productId: string,
    qty: number
  ) {
    const clamped = Math.max(0, Math.min(tab === "preorder" ? 20 : 100, qty));
    if (tab === "preorder") {
      setDeliveryData((prev) => ({
        ...prev,
        items: { ...prev.items, [productId]: clamped },
      }));
    } else {
      setWholesaleData((prev) => ({
        ...prev,
        items: { ...prev.items, [productId]: clamped },
      }));
    }
  }

  const currentItems = activeTab === "preorder" ? deliveryData.items : wholesaleData.items;
  const totalQty = Object.values(currentItems).reduce((sum, q) => sum + q, 0);
  const totalCents = activeTab === "preorder"
    ? products.reduce((sum, p) => sum + (currentItems[p.id] || 0) * p.priceCents, 0)
    : 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (totalQty === 0) {
      setFormError("Please select at least one flavor.");
      return;
    }

    if (activeTab === "preorder" && !settings.preordersOpen) {
      setFormError("Preorders are currently closed. Check back soon!");
      return;
    }

    setSubmitState("submitting");

    try {
      if (activeTab === "preorder") {
        // Stripe checkout flow
        const payload = {
          name: deliveryData.name,
          email: deliveryData.email,
          phone: deliveryData.phone,
          items: deliveryData.items,
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

        // Redirect to Stripe Checkout
        window.location.href = result.url;
        return;
      } else {
        // Wholesale: direct submission (no payment)
        const payload = {
          formType: "wholesale",
          ...wholesaleData,
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
        setTimeout(() => {
          setSubmitState("idle");
          setWholesaleData({
            businessName: "",
            contactName: "",
            email: "",
            phone: "",
            businessType: "",
            items: buildInitialItems(products),
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

                <fieldset>
                  <legend className="text-sm font-medium text-navy mb-1">
                    How many would you like?
                  </legend>
                  <p className="text-xs text-navy/50 mb-3">
                    {settings.globalRemaining} loaves available this batch
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Input
                        key={product.id}
                        label={product.name}
                        type="number"
                        min={0}
                        max={20}
                        value={deliveryData.items[product.id] || 0}
                        onChange={(e) =>
                          updateItem("preorder", product.id, Number(e.target.value))
                        }
                      />
                    ))}
                  </div>
                </fieldset>

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

                {totalQty > 0 && (
                  <div className="text-right text-navy font-semibold">
                    {totalQty} {totalQty === 1 ? "loaf" : "loaves"} &mdash; ${(totalCents / 100).toFixed(2)}
                  </div>
                )}
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

                <fieldset>
                  <legend className="text-sm font-medium text-navy mb-2">
                    Quantity (loaves)
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Input
                        key={product.id}
                        label={product.name}
                        type="number"
                        min={0}
                        max={100}
                        value={wholesaleData.items[product.id] || 0}
                        onChange={(e) =>
                          updateItem("wholesale", product.id, Number(e.target.value))
                        }
                      />
                    ))}
                  </div>
                </fieldset>

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
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting"
                ? "Processing..."
                : activeTab === "preorder"
                  ? totalCents > 0
                    ? `Checkout — $${(totalCents / 100).toFixed(2)}`
                    : "Select items to continue"
                  : "Submit Inquiry"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
