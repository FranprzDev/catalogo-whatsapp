import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminSetup } from "@/components/admin/admin-setup";
import { SetupNotice } from "@/components/setup-notice";
import { isAdminAuthenticated } from "@/lib/auth";
import { isAppConfigured } from "@/lib/db";
import { getSettings, hasAdminCredentials, listAllProducts } from "@/lib/products/repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAppConfigured()) {
    return <SetupNotice />;
  }
  if (!(await hasAdminCredentials())) {
    return <AdminSetup />;
  }
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin />;
  }
  const [products, settings] = await Promise.all([listAllProducts(), getSettings()]);
  return <AdminDashboard initialProducts={products} initialSettings={settings} />;
}
