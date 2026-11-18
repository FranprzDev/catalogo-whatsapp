"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminSession,
  destroyAdminSession,
  hashPassword,
  isAdminAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import {
  countProducts,
  createAdminCredentials,
  createProduct,
  deleteProduct,
  getAdminPasswordHash,
  hasAdminCredentials,
  insertSampleProducts,
  saveSettings,
  updateProduct,
} from "@/lib/products/repository";
import type { StoreSettings } from "@/lib/types";
import { validateProductInput, type ProductInput } from "@/lib/validators/product.validator";
import { validateAdminPassword, validateSettingsInput } from "@/lib/validators/settings.validator";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh(): void {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function requireAdmin(): Promise<ActionResult | null> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Sesión vencida. Volvé a entrar al panel." };
  }
  return null;
}

export async function setupAdmin(password: string): Promise<ActionResult> {
  const invalid = validateAdminPassword(password);
  if (invalid) {
    return { ok: false, error: invalid };
  }
  if (await hasAdminCredentials()) {
    return { ok: false, error: "La contraseña de administración ya fue creada." };
  }
  await createAdminCredentials(await hashPassword(password));
  await createAdminSession();
  refresh();
  return { ok: true };
}

export async function login(password: string): Promise<ActionResult> {
  const hash = await getAdminPasswordHash();
  if (!hash) {
    return { ok: false, error: "Todavía no se creó la contraseña de administración." };
  }
  if (!(await verifyPassword(password, hash))) {
    // Small delay to slow down brute-force attempts on the single admin password.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ok: false, error: "Contraseña incorrecta." };
  }
  await createAdminSession();
  refresh();
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroyAdminSession();
  refresh();
}

export async function createProductAction(input: ProductInput): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const invalid = validateProductInput(input);
  if (invalid) return { ok: false, error: invalid };
  await createProduct(input);
  refresh();
  return { ok: true };
}

export async function updateProductAction(id: string, input: ProductInput): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const invalid = validateProductInput(input);
  if (invalid) return { ok: false, error: invalid };
  await updateProduct(id, input);
  refresh();
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  await deleteProduct(id);
  refresh();
  return { ok: true };
}

export async function saveSettingsAction(settings: StoreSettings): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const invalid = validateSettingsInput(settings);
  if (invalid) return { ok: false, error: invalid };
  await saveSettings(settings);
  refresh();
  return { ok: true };
}

export async function seedSampleProductsAction(): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if ((await countProducts()) > 0) {
    return { ok: false, error: "Ya hay productos cargados." };
  }
  await insertSampleProducts();
  refresh();
  return { ok: true };
}
