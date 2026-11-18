"use client";

import { useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/context/cart-context";
import { cartCount } from "@/lib/cart";
import type { Product, StoreSettings } from "@/lib/types";
import { ProductCard } from "./product-card";

interface CatalogClientProps {
  products: Product[];
  settings: StoreSettings;
}

const ALL_CATEGORIES = "Todo";

export function CatalogClient({ products, settings }: CatalogClientProps) {
  const { items, openCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === ALL_CATEGORIES || product.category === category;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">{settings.storeName}</h1>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
            aria-label="Abrir carrito"
          >
            🛒 Carrito
            {cartCount(items) > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-bold text-white">
                {cartCount(items)}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar prendas..."
            aria-label="Buscar prendas"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          {categories.length > 1 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Categorías">
              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={category === name}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    category === name
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">
            No hay prendas para mostrar{search ? ` con "${search}"` : ""}.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} currency={settings.currency} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        Hecho con{" "}
        <a
          href="https://github.com/FranprzDev/catalogo-whatsapp"
          className="underline hover:text-neutral-600"
          target="_blank"
          rel="noreferrer"
        >
          Catálogo WhatsApp
        </a>
      </footer>

      <CartDrawer settings={settings} />
    </div>
  );
}
