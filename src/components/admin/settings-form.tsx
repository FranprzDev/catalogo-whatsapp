"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSettingsAction } from "@/app/actions";
import { CURRENCIES, type Currency, type StoreSettings } from "@/lib/types";

interface SettingsFormProps {
  initial: StoreSettings;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const [storeName, setStoreName] = useState(initial.storeName);
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const result = await saveSettingsAction({ storeName, whatsappNumber, currency });
    setPending(false);
    setIsError(!result.ok);
    setMessage(result.ok ? "Guardado." : result.error);
    if (result.ok) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
      <label className="text-xs font-semibold text-neutral-700" htmlFor="store-name">
        Nombre de la tienda
      </label>
      <input
        id="store-name"
        type="text"
        value={storeName}
        onChange={(event) => setStoreName(event.target.value)}
        required
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      />
      <label className="text-xs font-semibold text-neutral-700" htmlFor="whatsapp-number">
        Número de WhatsApp
      </label>
      <input
        id="whatsapp-number"
        type="tel"
        value={whatsappNumber}
        onChange={(event) => setWhatsappNumber(event.target.value)}
        placeholder="5493812345678"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      />
      <p className="text-xs text-neutral-500">
        Con código de país, solo números (sin +, espacios ni guiones). Es el número que recibe los pedidos.
      </p>
      <label className="text-xs font-semibold text-neutral-700" htmlFor="currency">
        Moneda
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as Currency)}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      {message ? (
        <p className={`text-xs font-semibold ${isError ? "text-red-600" : "text-green-700"}`}>{message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
