"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setupAdmin } from "@/app/actions";

export function AdminSetup() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await setupAdmin(password);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Creá tu contraseña de administración</h1>
      <p className="text-sm text-neutral-600">
        Es la primera vez que entrás al panel. Esta contraseña protege la carga de productos.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Contraseña (mínimo 8 caracteres)"
          aria-label="Contraseña"
          required
          minLength={8}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        <input
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Repetí la contraseña"
          aria-label="Repetir contraseña"
          required
          minLength={8}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Crear contraseña y entrar"}
        </button>
      </form>
    </main>
  );
}
