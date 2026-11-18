export const CURRENCIES = ["ARS", "USD", "EUR", "MXN", "CLP", "COP", "PEN", "UYU"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  /** Compressed data URL stored in Postgres, or an external https URL. Empty means no photo. */
  image: string;
  active: boolean;
  createdAt?: Date;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  currency: Currency;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Mi tienda",
  whatsappNumber: "",
  currency: "ARS",
};
