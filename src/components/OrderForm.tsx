"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AddressInput, formatAddress } from "@/components/ui/AddressInput";
import { BUSINESS_TYPES, FREQUENCIES } from "@/lib/constants";
import type { AddressData, DeliveryFormData, WholesaleFormData } from "@/types";

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

const initialDelivery: DeliveryFormData = {
  name: "",
  email: "",
  phone: "",
  classicQty: 0,
  blueberryQty: 0,
  walnutQty: 0,
  deliveryDate: "",
  address: { ...emptyAddress },
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
  address: { ...emptyAddress },
  frequency: "one-time",
  specialInstructions: "",
};

const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
  value: type.toLowerCase(),
  label: type,
}));

export function OrderForm({ defaultTab = "wholesale" }: { defaultTab?: TabType }) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [deliveryData, setDeliveryData] =
    useState<DeliveryFormData>(initialDelivery);
  const [wholesaleData, setWholesaleData] =
    useState<WholesaleFormData>(initialWholesale);
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const data = activeTab === "preorder" ? deliveryData : wholesaleData;
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
      // Flatten address to a single string for the API
      const payload = activeTab === "preorder"
        ? {
            formType: "preorder",
            ...deliveryData,
            deliveryAddress: formatAddress(deliveryData.address),
          }
        : {
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
        if (activeTab === "preorder") {
          setDeliveryData(initialDelivery);
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
                <legend className="text-sm font-medium text-navy mb-2">
                  How many would you like?
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Classic Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={deliveryData.classicQty}
                    onChange={(e) =>
                      updateDelivery("classicQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Blueberry Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={deliveryData.blueberryQty}
                    onChange={(e) =>
                      updateDelivery("blueberryQty", Number(e.target.value))
                    }
                  />
                  <Input
                    label="Walnut Chocolate Chip"
                    type="number"
                    min={0}
                    max={20}
                    value={deliveryData.walnutQty}
                    onChange={(e) =>
                      updateDelivery("walnutQty", Number(e.target.value))
                    }
                  />
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
