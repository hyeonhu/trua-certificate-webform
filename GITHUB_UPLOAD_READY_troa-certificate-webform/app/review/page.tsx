import { ReviewClient } from "@/components/ReviewClient";
import { getTemplateConfig } from "@/lib/template-config";

export default async function ReviewPage() {
  const config = await getTemplateConfig();
  return <ReviewClient initialConfig={config} />;
}
