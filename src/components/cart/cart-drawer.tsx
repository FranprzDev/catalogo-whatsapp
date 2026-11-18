"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { cartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { buildOrderMessage, buildWhatsAppUrl, isValidPhone } from "@/lib/order";
import type { StoreSettings } from "@/lib/types";
import { ProductImage } from "../store/product-image";

interface CartDrawerProps {
  settings: StoreSettings;
}

export function CartDrawer({ settings }: CartDrawerProps) {
  const { items, isOpen, closeCart, setQuantity, removeItem, clear } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  function handleCheckout(): void {
    if (items.length === 0) {
      setError("El carrito está vacío.");
      return;
    }
    if (!customerName.trim()) {
      setError("Escribí tu nombre para el pedido.");
      return;
    }
    if (!isValidPhone(settings.whatsappNumber)) {
      setError("La tienda todavía no configuró su número de WhatsApp.");
      return;
    }
    const message = buildOrderMessage({
      storeName: settings.storeName,
      customerName,
      note,
      items,
      currency: settings.currency,
    });
    window.open(buildWhatsAppUrl(settings.whatsappNumber, message), "_blank", "noopener");
    clear();
    setCustomerName("");
    setNote("");
    setError(null);
    closeCart();
  }

  return (
    <div className="fixed inset-0 z-30" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-black/40"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-base font-bold">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="rounded-full p-2 text-lg leading-none hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-500">
              Todavía no agregaste prendas.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={`${item.productId}::${item.size ?? ""}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.name}
                      {item.size ? <span className="text-neutral-500"> · Talle {item.size}</span> : null}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatPrice(item.unitPrice, settings.currency)} c/u
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Restar uno"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-neutral-300 text-sm leading-none hover:border-neutral-500"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Sumar uno"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-neutral-300 text-sm leading-none hover:border-neutral-500"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size)}
                        className="ml-auto text-xs text-red-600 underline hover:text-red-800"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold">
                    {formatPrice(item.unitPrice * item.quantity, settings.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-200 px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold">{formatPrice(cartTotal(items), settings.currency)}</span>
          </div>
          <label className="mb-2 block text-xs font-semibold text-neutral-700" htmlFor="customer-name">
            Tu nombre
          </label>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Ej. María"
            className="mb-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <label className="mb-2 block text-xs font-semibold text-neutral-700" htmlFor="customer-note">
            Nota (opcional)
          </label>
          <textarea
            id="customer-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej. Retiro por el local"
            rows={2}
            className="mb-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          {error ? <p className="mb-2 text-xs font-semibold text-red-600">{error}</p> : null}
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
          >
            Pedir por WhatsApp
          </button>
          <p className="mt-2 text-center text-xs text-neutral-500">
            Se abre WhatsApp con tu pedido ya escrito. No necesitás pagar nada acá.
          </p>
        </div>
      </aside>
    </div>
  );
}
