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

function getDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
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

// ── Step indicator ─────────────────────────────────────
function StepIndicator({ step, labels }: { step: number; labels: [string, string] }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {labels.map((label, i) => {
        const stepNum = i + 1;
        const isActive = step === stepNum;
        const isCompleted = step > stepNum;
        return (
          <div key={label} className="flex items-center gap-3 flex-1">
            {i > 0 && (
              <div
                className={`h-px flex-1 transition-colors ${
                  isCompleted || isActive ? "bg-crust" : "bg-espresso/15"
                }`}
              />
            )}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-crust text-cream"
                    : isCompleted
                      ? "bg-crust/20 text-crust"
                      : "bg-espresso/10 text-espresso/40"
                }`}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-espresso" : isCompleted ? "text-espresso/60" : "text-espresso/40"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────
interface OrderFormProps {
  defaultTab?: TabType;
  settings: Settings;
}

export function OrderForm({ defaultTab = "preorder", settings }: OrderFormProps) {
  const { items, totalQuantity, totalCents, clear } = useCart();

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [step, setStep] = useState(1);
  const [deliveryData, setDeliveryData] = useState<Omit<DeliveryFormData, "items">>({
    name: "",
    email: "",
    phone: "",
    deliveryDate: getDatePlusDays(2),
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

  // ── Step 1 validation ──────────────────────────────
  function canContinue(): boolean {
    if (totalQuantity === 0) return false;
    if (activeTab === "preorder") {
      return !!(deliveryData.name && deliveryData.email && deliveryData.phone);
    }
    return !!(
      wholesaleData.businessName &&
      wholesaleData.contactName &&
      wholesaleData.email &&
      wholesaleData.phone &&
      wholesaleData.businessType
    );
  }

  function handleContinue() {
    setFormError("");
    if (totalQuantity === 0) {
      setFormError("Please add items to your cart first.");
      return;
    }
    if (!canContinue()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setStep(2);
    // Scroll form back into view
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  }

  // ── Submit ─────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

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
          setStep(1);
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

  // ── Terminal states ────────────────────────────────
  if (submitState === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone/60 max-w-2xl mx-auto">
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
      <div className="bg-white rounded-2xl shadow-sm border border-stone/60 max-w-2xl mx-auto">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-red-800 font-semibold mb-3">
            Something went wrong. Please try again or email{" "}
            <a href="mailto:zach@brekkiebakery.com" className="underline">
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

  const stepLabels: [string, string] = isWholesale
    ? ["Business Info", "Delivery Details"]
    : ["Your Info", "Delivery Details"];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs — pill/segment control */}
      <div className="inline-flex bg-stone/50 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("preorder");
            setStep(1);
            setFormError("");
          }}
          className={
            activeTab === "preorder"
              ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer"
              : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer"
          }
        >
          Preorder
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("wholesale");
            setStep(1);
            setFormError("");
          }}
          className={
            activeTab === "wholesale"
              ? "bg-espresso text-cream rounded-lg px-6 py-3 font-semibold cursor-pointer"
              : "text-espresso/60 hover:text-espresso px-6 py-3 cursor-pointer"
          }
        >
          Wholesale
        </button>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone/60 p-6 md:p-8">
        {preordersClosed ? (
          <div className="text-center py-8">
            <p className="text-espresso/60 text-lg">
              Preorders are currently closed. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <StepIndicator step={step} labels={stepLabels} />

            {/* ─── STEP 1: Cart + Contact ─── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <CartSummary
                  hidePrices={isWholesale}
                  maxQty={isWholesale ? 100 : 20}
                />

                {activeTab === "preorder" ? (
                  <>
                    <div className="border-t border-espresso/10 pt-5">
                      <h3 className="font-display text-base text-espresso mb-4">Contact Information</h3>
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Name"
                          type="text"
                          required
                          autoComplete="name"
                          value={deliveryData.name}
                          onChange={(e) => updateDelivery("name", e.target.value)}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-t border-espresso/10 pt-5">
                      <h3 className="font-display text-base text-espresso mb-4">Business Information</h3>
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Business Name"
                          type="text"
                          required
                          autoComplete="organization"
                          value={wholesaleData.businessName}
                          onChange={(e) => updateWholesale("businessName", e.target.value)}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Contact Name"
                            type="text"
                            required
                            autoComplete="name"
                            value={wholesaleData.contactName}
                            onChange={(e) => updateWholesale("contactName", e.target.value)}
                          />
                          <Select
                            label="Business Type"
                            required
                            options={businessTypeOptions}
                            value={wholesaleData.businessType}
                            onChange={(e) => updateWholesale("businessType", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formError && (
                  <p className="text-sm text-red-500 text-center">{formError}</p>
                )}

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full bg-crust hover:bg-crust-light text-cream"
                  disabled={totalQuantity === 0}
                  onClick={handleContinue}
                >
                  {totalQuantity === 0 ? "Add items to continue" : "Continue to Delivery"}
                </Button>
              </div>
            )}

            {/* ─── STEP 2: Delivery + Submit ─── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Compact order summary */}
                <div className="rounded-lg bg-cream/50 border border-espresso/10 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-espresso/60">
                    {totalQuantity} {totalQuantity === 1 ? "loaf" : "loaves"}
                    {!isWholesale && <> &mdash; ${(totalCents / 100).toFixed(2)}</>}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-crust font-medium hover:underline cursor-pointer"
                  >
                    Edit order
                  </button>
                </div>

                <h3 className="font-display text-base text-espresso">Delivery Details</h3>

                {activeTab === "preorder" ? (
                  <div className="flex flex-col gap-4">
                    <AddressInput
                      value={deliveryData.address}
                      onChange={(addr) => updateDelivery("address", addr)}
                      prefix="shipping "
                    />
                    <Input
                      label="Preferred Delivery Date"
                      type="date"
                      required
                      min={getDatePlusDays(2)}
                      value={deliveryData.deliveryDate}
                      onChange={(e) => updateDelivery("deliveryDate", e.target.value)}
                    />
                    <Textarea
                      label="Special Instructions"
                      placeholder="Buzzer code, leave at door, dietary notes, etc."
                      value={deliveryData.specialInstructions}
                      onChange={(e) => updateDelivery("specialInstructions", e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
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
                      onChange={(e) => updateWholesale("specialInstructions", e.target.value)}
                    />
                  </div>
                )}

                {formError && (
                  <p className="text-sm text-red-500 text-center">{formError}</p>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-crust hover:bg-crust-light text-cream"
                    disabled={submitState === "submitting"}
                  >
                    {submitState === "submitting"
                      ? "Processing..."
                      : activeTab === "preorder"
                        ? `Checkout — $${(totalCents / 100).toFixed(2)}`
                        : "Submit Inquiry"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormError("");
                    }}
                    className="text-sm text-espresso/50 hover:text-espresso transition-colors cursor-pointer text-center"
                  >
                    &larr; Back
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
