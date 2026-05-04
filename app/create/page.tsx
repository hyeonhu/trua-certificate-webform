import { CustomerEditor } from "@/components/CustomerEditor";
import { getSiteConfig } from "@/lib/site-config";
import { getTemplateConfig } from "@/lib/template-config";

export default async function CreatePage() {
  const config = await getTemplateConfig();
  const siteConfig = await getSiteConfig();
  return <CustomerEditor initialConfig={config} siteConfig={siteConfig} />;
}
