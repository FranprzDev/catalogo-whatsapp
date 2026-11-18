import { describe, expect, it } from "vitest";
import type { CartItem } from "../cart";
import { buildOrderMessage, buildWhatsAppUrl, isValidPhone, normalizePhone } from "../order";

const items: CartItem[] = [
  { productId: "p1", name: "Remera oversize negra", size: "M", unitPrice: 15000, quantity: 2, image: "" },
  { productId: "p2", name: "Jean mom celeste", size: "40", unitPrice: 32000, quantity: 1, image: "" },
];

describe("normalizePhone", () => {
  it("strips everything that is not a digit", () => {
    expect(normalizePhone("+54 9 381 234-5678")).toBe("5493812345678");
  });
});

describe("isValidPhone", () => {
  it("rejects short or empty numbers", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("1234")).toBe(false);
  });
  it("accepts an international-format number", () => {
    expect(isValidPhone("+54 9 381 234-5678")).toBe(true);
  });
});

describe("buildOrderMessage", () => {
  it("includes store, items with sizes, total, name and note", () => {
    const message = buildOrderMessage({
      storeName: "Tienda Luna",
      customerName: "María",
      note: "Retiro por el local",
      items,
      currency: "ARS",
    });
    expect(message).toContain("Hola Tienda Luna!");
    expect(message).toContain("2x Remera oversize negra (talle M)");
    expect(message).toContain("1x Jean mom celeste (talle 40)");
    expect(message).toContain("Total:");
    expect(message).toContain("Nombre: María");
    expect(message).toContain("Nota: Retiro por el local");
  });

  it("omits the note line when empty and the size when missing", () => {
    const message = buildOrderMessage({
      storeName: "Tienda Luna",
      customerName: "María",
      note: "   ",
      items: [{ ...items[1], size: null }],
      currency: "ARS",
    });
    expect(message).not.toContain("Nota:");
    expect(message).not.toContain("talle");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me link with the encoded message", () => {
    const url = buildWhatsAppUrl("+54 9 381 234-5678", "Hola Tienda Luna!\n\nTotal: $62.000");
    expect(url.startsWith("https://wa.me/5493812345678?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe("Hola Tienda Luna!\n\nTotal: $62.000");
  });

  it("throws when the number is missing", () => {
    expect(() => buildWhatsAppUrl("", "hola")).toThrow();
  });
});
