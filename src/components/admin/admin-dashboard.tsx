"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProductAction, logout, seedSampleProductsAction, updateProductAction } from "@/app/actions";
import { formatPrice } from "@/lib/money";
import type { Product, StoreSettings } from "@/lib/types";
import { ProductImage } from "../store/product-image";
import { ProductForm } from "./product-form";
import { SettingsForm } from "./settings-form";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialSettings: StoreSettings;
}

const TABS = [
  { id: "products", label: "Productos" },
  { id: "settings", label: "Configuración" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard({ initialProducts, initialSettings }: AdminDashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("products");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: Promise<{ ok: true } | { ok: false; error: string }>): Promise<void> {
    setError(null);
    const result = await action;
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  function openCreate(): void {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product): void {
    setEditing(product);
    setFormOpen(true);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Panel de administración</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold hover:border-neutral-500"
          >
            Ver catálogo
          </Link>
          <button
            type="button"
            onClick={() => void logout().then(() => router.refresh())}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold hover:border-neutral-500"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === id ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? <p className="mb-3 text-xs font-semibold text-red-600">{error}</p> : null}

      {tab === "products" ? (
        <section className="flex flex-col gap-4">
          {formOpen ? (
            <ProductForm initial={editing} onDone={() => setFormOpen(false)} />
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openCreate}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700"
              >
                + Nuevo producto
              </button>
              {initialProducts.length === 0 ? (
                <button
                  type="button"
                  onClick={() => void run(seedSampleProductsAction())}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
                >
                  Cargar productos de ejemplo
                </button>
              ) : null}
            </div>
          )}

          {initialProducts.length === 0 && !formOpen ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              Todavía no hay productos. Cargá el primero o usá los de ejemplo para probar.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {initialProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                      {!product.active ? (
                        <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-600">
                          oculto
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatPrice(product.price, initialSettings.currency)}
                      {product.category ? ` · ${product.category}` : ""}
                      {product.sizes.length > 0 ? ` · Talles: ${product.sizes.join(", ")}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      void run(updateProductAction(product.id, { ...product, active: !product.active }))
                    }
                    className="rounded-lg border border-neutral-300 px-2 py-1 text-xs font-semibold hover:border-neutral-500"
                  >
                    {product.active ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="rounded-lg border border-neutral-300 px-2 py-1 text-xs font-semibold hover:border-neutral-500"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Borrar "${product.name}"?`)) {
                        void run(deleteProductAction(product.id));
                      }
                    }}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section>
          <SettingsForm initial={initialSettings} />
        </section>
      )}
    </main>
  );
}
