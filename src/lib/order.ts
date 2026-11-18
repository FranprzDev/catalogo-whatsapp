import { cartTotal, type CartItem } from "./cart";
import { formatPrice } from "./money";
import type { Currency } from "./types";

export interface OrderInput {
  storeName: string;
  customerName: string;
  note: string;
  items: CartItem[];
  currency: Currency;
}

export const MIN_PHONE_DIGITS = 8;

/** Keep digits only: wa.me expects an international number with no "+", spaces or dashes. */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw).length >= MIN_PHONE_DIGITS;
}

export function buildOrderMessage(input: OrderInput): string {
  const lines: string[] = [];
  lines.push(`Hola ${input.storeName}! Quiero hacer un pedido:`);
  lines.push("");
  for (const item of input.items) {
    const size = item.size ? ` (talle ${item.size})` : "";
    const subtotal = formatPrice(item.unitPrice * item.quantity, input.currency);
    lines.push(`- ${item.quantity}x ${item.name}${size} - ${subtotal}`);
  }
  lines.push("");
  lines.push(`Total: ${formatPrice(cartTotal(input.items), input.currency)}`);
  lines.push(`Nombre: ${input.customerName.trim()}`);
  if (input.note.trim()) {
    lines.push(`Nota: ${input.note.trim()}`);
  }
  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  const phone = normalizePhone(phoneRaw);
  if (phone.length < MIN_PHONE_DIGITS) {
    throw new Error("Invalid WhatsApp number. Set it in the admin panel first.");
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
