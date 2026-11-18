"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProductAction, updateProductAction } from "@/app/actions";
import { compressImage } from "@/lib/image-compress";
import type { Product } from "@/lib/types";
import type { ProductInput } from "@/lib/validators/product.validator";
import { ProductImage } from "../store/product-image";

interface ProductFormProps {
  initial: Product | null;
  onDone: () => void;
}

function parseSizes(raw: string): string[] {
  return raw
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}

export function ProductForm({ initial, onDone }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [sizes, setSizes] = useState(initial?.sizes.join(", ") ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageUrl, setImageUrl] = useState(initial && !initial.image.startsWith("data:") ? initial.image : "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await compressImage(file);
      setImage(dataUrl);
      setImageUrl("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo procesar la imagen.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input: ProductInput = {
      name,
      description,
      price: Number(price),
      category,
      sizes: parseSizes(sizes),
      image: imageUrl.trim() ? imageUrl.trim() : image,
      active,
    };
    setPending(true);
    setError(null);
    const result = initial
      ? await updateProductAction(initial.id, input)
      : await createProductAction(input);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
    onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4"
    >
      <h3 className="text-sm font-bold">{initial ? "Editar producto" : "Nuevo producto"}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="product-name" className="text-xs font-semibold text-neutral-700">
            Nombre
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="product-price" className="text-xs font-semibold text-neutral-700">
            Precio
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="product-category" className="text-xs font-semibold text-neutral-700">
            Categoría
          </label>
          <input
            id="product-category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Ej. Remeras"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="product-sizes" className="text-xs font-semibold text-neutral-700">
            Talles (separados por coma)
          </label>
          <input
            id="product-sizes"
            type="text"
            value={sizes}
            onChange={(event) => setSizes(event.target.value)}
            placeholder="S, M, L, XL"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="product-description" className="text-xs font-semibold text-neutral-700">
          Descripción
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-neutral-700">Foto</span>
        <div className="flex items-start gap-3">
          <ProductImage src={image} alt="Vista previa" className="h-20 w-20 rounded-lg object-cover" />
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              aria-label="Subir foto"
              className="text-xs text-neutral-600 file:mr-2 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
            />
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                if (event.target.value.trim()) setImage("");
              }}
              placeholder="...o pegá una URL https de imagen"
              aria-label="URL de imagen"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <p className="text-xs text-neutral-500">
              Las fotos subidas se comprimen solas a WebP para que la tienda cargue rápido.
            </p>
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
          className="h-4 w-4"
        />
        Visible en el catálogo
      </label>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? "Guardando..." : initial ? "Guardar cambios" : "Agregar producto"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
