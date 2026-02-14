export interface Product {
  id: string;
  name: string;
  calories: number;
  allergens: string[];
  image: string;
  accentColor: string;
  stripeColor: string;
}

export interface PreorderFormData {
  name: string;
  email: string;
  phone: string;
  classicQty: number;
  blueberryQty: number;
  walnutQty: number;
  pickupDate: string;
  specialInstructions: string;
}

export interface WholesaleFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  classicQty: number;
  blueberryQty: number;
  walnutQty: number;
  deliveryAddress: string;
  frequency: "one-time" | "weekly" | "biweekly" | "monthly";
  specialInstructions: string;
}
