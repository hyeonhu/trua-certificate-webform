import { AdminTemplates } from "@/components/AdminTemplates";
import { AdminLogin } from "@/components/AdminLogin";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getTemplateConfig } from "@/lib/template-config";

export default async function AdminTemplatesPage() {
  if (!(await isAdminAuthed())) return <AdminLogin />;
  const config = await getTemplateConfig();
  return <AdminTemplates initialConfig={config} />;
}
