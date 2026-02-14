export interface Product {
  id: string;
  name: string;
  calories: number;
  allergens: string[];
  image: string;
  accentColor: string;
  stripeColor: string;
}

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

export interface DeliveryFormData {
  name: string;
  email: string;
  phone: string;
  classicQty: number;
  blueberryQty: number;
  walnutQty: number;
  deliveryDate: string;
  address: AddressData;
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
  address: AddressData;
  frequency: "one-time" | "weekly" | "biweekly" | "monthly";
  specialInstructions: string;
}
