import { CertificatePage } from "@/components/certificate/CertificatePage";
import { getFontFaceDeclarations } from "@/lib/font-face";
import type { CertificateFormData, TemplateConfig, TemplateVariant } from "@/lib/types";
import type { CertificateRenderMode } from "@/components/certificate/CertificateTextField";
import type { ReactNode } from "react";
import { existsSync, readFileSync } from "fs";
import path from "path";

export type RenderMode = "edit" | "preview" | "print" | "debug";

function debugPayload(templateConfig: TemplateConfig, variant: TemplateVariant, mode: CertificateRenderMode, configHash?: string) {
  return JSON.stringify(
    {
      variant,
      mode,
      configHash,
      fields: templateConfig.variants[variant].fields,
    },
    null,
    2,
  ).replaceAll("</script", "<\\/script");
}

function publicAssetUrl(publicPath: string) {
  const filePath = path.join(process.cwd(), "public", decodeURIComponent(publicPath).replace(/^\//, ""));
  if (!existsSync(filePath)) return publicPath;
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".svg"
          ? "image/svg+xml"
          : "image/png";
  return `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;
}

function resolvePublicAssetSrc(html: string) {
  return html.replace(/src="(\/[^"]+)"/g, (_, src: string) => `src="${publicAssetUrl(src)}"`);
}

export async function renderCertificateHtml(
  data: CertificateFormData,
  templateConfig: TemplateConfig,
  variant: TemplateVariant,
  mode: RenderMode,
  configHash?: string,
) {
  const { renderToStaticMarkup } = (await new Function("moduleName", "return import(moduleName)")("react-dom/server")) as {
    renderToStaticMarkup: (element: ReactNode) => string;
  };
  const body = resolvePublicAssetSrc(renderToStaticMarkup(
    <CertificatePage
      data={data}
      config={templateConfig}
      variant={variant}
      mode={mode}
      showBorder={mode !== "print"}
    />,
  ));

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <style>
    ${getFontFaceDeclarations("pdf")}
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 210mm; min-height: 297mm; background: white; }
  </style>
</head>
<body>
  <script id="template-debug" type="application/json">${debugPayload(templateConfig, variant, mode, configHash)}</script>
  ${body}
</body>
</html>`;
}
