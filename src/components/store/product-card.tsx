"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/money";
import type { Currency, Product } from "@/lib/types";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
  currency: Currency;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null);

  function handleAdd(): void {
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      unitPrice: product.price,
      image: product.image,
    });
    openCart();
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <ProductImage
        src={product.image}
        alt={product.name}
        className="aspect-square w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>
          <p className="whitespace-nowrap text-sm font-bold">{formatPrice(product.price, currency)}</p>
        </div>
        {product.description ? (
          <p className="line-clamp-2 text-xs text-neutral-600">{product.description}</p>
        ) : null}
        {product.sizes.length > 0 ? (
          <div className="flex flex-wrap gap-1" role="group" aria-label="Talles">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                  selectedSize === size
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-auto rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
