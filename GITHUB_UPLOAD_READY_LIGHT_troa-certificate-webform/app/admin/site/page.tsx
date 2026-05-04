import { AdminLogin } from "@/components/AdminLogin";
import { AdminSiteSettings } from "@/components/AdminSiteSettings";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSiteConfig } from "@/lib/site-config";

export default async function AdminSitePage() {
  if (!(await isAdminAuthed())) return <AdminLogin />;
  const config = await getSiteConfig();
  return <AdminSiteSettings initialConfig={config} />;
}
