import { CURRENCIES, type Currency } from "../types";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  image: string;
  active: boolean;
}

export function validateProductInput(input: ProductInput): string | null {
  if (!input.name.trim()) {
    return "El nombre es obligatorio.";
  }
  if (!Number.isFinite(input.price) || input.price < 0) {
    return "El precio debe ser un número mayor o igual a 0.";
  }
  if (input.image && !input.image.startsWith("data:image/") && !input.image.startsWith("https://")) {
    return "La imagen debe ser una URL https o una foto cargada desde tu dispositivo.";
  }
  return null;
}

export function validateCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}
