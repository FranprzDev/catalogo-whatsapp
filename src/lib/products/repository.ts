import { getSql } from "../db";
import { DEFAULT_SETTINGS, type Product, type StoreSettings } from "../types";
import { SAMPLE_PRODUCTS } from "../sample-data";
import { validateCurrency, type ProductInput } from "../validators/product.validator";

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: string | number;
  category: string;
  sizes: string[] | null;
  image: string;
  active: boolean;
  created_at: string | Date;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    sizes: row.sizes ?? [],
    image: row.image,
    active: row.active,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  };
}

export async function listActiveProducts(): Promise<Product[]> {
  const rows = (await getSql()`
    select id, name, description, price, category, sizes, image, active, created_at
    from products where active = true order by created_at desc
  `) as ProductRow[];
  return rows.map(toProduct);
}

export async function listAllProducts(): Promise<Product[]> {
  const rows = (await getSql()`
    select id, name, description, price, category, sizes, image, active, created_at
    from products order by created_at desc
  `) as ProductRow[];
  return rows.map(toProduct);
}

export async function countProducts(): Promise<number> {
  const rows = (await getSql()`select count(*)::int as total from products`) as { total: number }[];
  return rows[0]?.total ?? 0;
}

export async function createProduct(input: ProductInput): Promise<void> {
  await getSql()`
    insert into products (name, description, price, category, sizes, image, active)
    values (${input.name.trim()}, ${input.description.trim()}, ${input.price},
            ${input.category.trim()}, ${input.sizes}, ${input.image}, ${input.active})
  `;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await getSql()`
    update products
    set name = ${input.name.trim()}, description = ${input.description.trim()},
        price = ${input.price}, category = ${input.category.trim()}, sizes = ${input.sizes},
        image = ${input.image}, active = ${input.active}, updated_at = now()
    where id = ${id}
  `;
}

export async function deleteProduct(id: string): Promise<void> {
  await getSql()`delete from products where id = ${id}`;
}

export async function insertSampleProducts(): Promise<void> {
  for (const sample of SAMPLE_PRODUCTS) {
    await createProduct(sample);
  }
}

interface SettingsRow {
  store_name: string;
  whatsapp_number: string;
  currency: string;
}

export async function getSettings(): Promise<StoreSettings> {
  const rows = (await getSql()`
    select store_name, whatsapp_number, currency from settings where id = 1
  `) as SettingsRow[];
  const row = rows[0];
  if (!row) {
    return DEFAULT_SETTINGS;
  }
  return {
    storeName: row.store_name,
    whatsappNumber: row.whatsapp_number,
    currency: validateCurrency(row.currency) ? row.currency : DEFAULT_SETTINGS.currency,
  };
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  await getSql()`
    insert into settings (id, store_name, whatsapp_number, currency)
    values (1, ${settings.storeName.trim()}, ${settings.whatsappNumber.trim()}, ${settings.currency})
    on conflict (id) do update
    set store_name = excluded.store_name,
        whatsapp_number = excluded.whatsapp_number,
        currency = excluded.currency,
        updated_at = now()
  `;
}

export async function hasAdminCredentials(): Promise<boolean> {
  const rows = (await getSql()`
    select exists(select 1 from admin_credentials where id = 1) as exists
  `) as { exists: boolean }[];
  return rows[0]?.exists ?? false;
}

export async function createAdminCredentials(passwordHash: string): Promise<void> {
  await getSql()`
    insert into admin_credentials (id, password_hash) values (1, ${passwordHash})
    on conflict (id) do nothing
  `;
}

export async function getAdminPasswordHash(): Promise<string | null> {
  const rows = (await getSql()`
    select password_hash from admin_credentials where id = 1
  `) as { password_hash: string }[];
  return rows[0]?.password_hash ?? null;
}
