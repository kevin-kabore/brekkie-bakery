"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { BUSINESS_TYPES, FREQUENCIES } from "@/lib/constants";
import type { PreorderFormData, WholesaleFormData } from "@/types";

type TabType = "preorder" | "wholesale";
type SubmitState = "idle" | "submitting" | "success" | "error";

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

const initialPreorder: PreorderFormData = {
  name: "",
  email: "",
  phone: "",
  classicQty: 0,
  blueberryQty: 0,
  walnutQty: 0,
  pickupDate: "",
  specialInstructions: "",
};

const initialWholesale: WholesaleFormData = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  businessType: "",
  classicQty: 0,
  blueberryQty: 0,
  walnutQty: 0,
  deliveryAddress: "",
  frequency: "one-time",
  specialInstructions: "",
};

const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
  value: type.toLowerCase(),
  label: type,
}));

export function OrderForm() {
  const [activeTab, setActiveTab] = useState<TabType>("preorder");
  const [preorderData, setPreorderData] =
    useState<PreorderFormData>(initialPreorder);
  const [wholesaleData, setWholesaleData] =
    useState<WholesaleFormData>(initialWholesale);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  function updatePreorder<K extends keyof PreorderFormData>(
    field: K,
    value: PreorderFormData[K]
  ) {
    setPreorderData((prev) => ({ ...prev, [field]: value }));
  }

  function updateWholesale<K extends keyof WholesaleFormData>(
    field: K,
    value: WholesaleFormData[K]
  ) {
    setWholesaleData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const data = activeTab === "preorder" ? preorderData : wholesaleData;
    if (
      data.classicQty === 0 &&
      data.blueberryQty === 0 &&
      data.walnutQty === 0
    ) {
      setFormError("Please select at least one flavor.");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: activeTab, ...data }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitState("success");
      setTimeout(() => {
        setSubmitState("idle");
        if (activeTab === "preorder") {
          setPreorderData(initialPreorder);
        } else {
          setWholesaleData(initialWholesale);
        }
      }, 3000);
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
            Order received! We&apos;ll be in touch shortly.
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
              ? "bg-navy text-cream rounded-t-lg px-6 py-3 font-semibold"
              : "bg-transparent text-navy/60 hover:text-navy px-6 py-3 border-b-2 border-navy/20"
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
              ? "bg-navy text-cream rounded-t-lg px-6 py-3 font-semibold"
              : "bg-transparent text-navy/60 hover:text-navy px-6 py-3 border-b-2 border-navy/20"
          }
        >
          Wholesale
        </button>
      </div>

      <div className="bg-white rounded-2xl rounded-tl-none shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {activeTab === "preorder" ? (
            <>
              <Input
                label="Name"
                type="text"
                required
                value={preorderData.name}
                onChange={(e) => updatePreorder("name", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                required
                value={preorderData.email}
                onChange={(e) => updatePreorder("email", e.target.value)}
              />
              <Input
                label="Phone"
                type="tel"
                required
                value={preorderData.phone}
                onChange={(e) => updatePreorder("phone", e.target.value)}
              />

              <fieldset>
                <legend className="text-sm font-medium text-navy mb-2">
                  How many would you like?
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Classic Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={preorderData.classicQty}
                    onChange={(e) =>
                      updatePreorder("classicQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Blueberry Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={preorderData.blueberryQty}
                    onChange={(e) =>
                      updatePreorder("blueberryQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Walnut Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={preorderData.walnutQty}
                    onChange={(e) =>
                      updatePreorder("walnutQty", Number(e.target.value))
                    }
                  />
                </div>
              </fieldset>

              <Input
                label="Preferred Pickup Date"
                type="date"
                required
                min={getTomorrowDate()}
                value={preorderData.pickupDate}
                onChange={(e) => updatePreorder("pickupDate", e.target.value)}
              />
              <Textarea
                label="Special Instructions"
                placeholder="Any dietary notes, delivery preferences, etc."
                value={preorderData.specialInstructions}
                onChange={(e) =>
                  updatePreorder("specialInstructions", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <Input
                label="Business Name"
                type="text"
                required
                value={wholesaleData.businessName}
                onChange={(e) =>
                  updateWholesale("businessName", e.target.value)
                }
              />
              <Input
                label="Contact Name"
                type="text"
                required
                value={wholesaleData.contactName}
                onChange={(e) =>
                  updateWholesale("contactName", e.target.value)
                }
              />
              <Input
                label="Email"
                type="email"
                required
                value={wholesaleData.email}
                onChange={(e) => updateWholesale("email", e.target.value)}
              />
              <Input
                label="Phone"
                type="tel"
                required
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

              <fieldset>
                <legend className="text-sm font-medium text-navy mb-2">
                  Quantity (loaves)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Classic"
                    type="number"
                    min={0}
                    max={100}
                    value={wholesaleData.classicQty}
                    onChange={(e) =>
                      updateWholesale("classicQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Blueberry"
                    type="number"
                    min={0}
                    max={100}
                    value={wholesaleData.blueberryQty}
                    onChange={(e) =>
                      updateWholesale("blueberryQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Walnut"
                    type="number"
                    min={0}
                    max={100}
                    value={wholesaleData.walnutQty}
                    onChange={(e) =>
                      updateWholesale("walnutQty", Number(e.target.value))
                    }
                  />
                </div>
              </fieldset>

              <Textarea
                label="Delivery Address"
                required
                value={wholesaleData.deliveryAddress}
                onChange={(e) =>
                  updateWholesale("deliveryAddress", e.target.value)
                }
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
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "Submitting..." : "Submit Order"}
          </Button>
        </form>
      </div>
    </div>
  );
}
