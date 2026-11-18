import { SetupNotice } from "@/components/setup-notice";
import { CatalogClient } from "@/components/store/catalog-client";
import { isAppConfigured } from "@/lib/db";
import { getSettings, listActiveProducts } from "@/lib/products/repository";
import type { Product, StoreSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

interface CatalogData {
  products: Product[];
  settings: StoreSettings;
}

async function loadCatalog(): Promise<CatalogData | null> {
  try {
    const [products, settings] = await Promise.all([listActiveProducts(), getSettings()]);
    return { products, settings };
  } catch {
    return null;
  }
}

function CatalogError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">No se pudo cargar el catálogo</h1>
      <p className="text-sm text-neutral-600">
        Revisá que la base de datos esté accesible y que hayas corrido schema.sql.
      </p>
    </main>
  );
}

export default async function HomePage() {
  if (!isAppConfigured()) {
    return <SetupNotice />;
  }
  const catalog = await loadCatalog();
  if (!catalog) {
    return <CatalogError />;
  }
  return <CatalogClient products={catalog.products} settings={catalog.settings} />;
}
