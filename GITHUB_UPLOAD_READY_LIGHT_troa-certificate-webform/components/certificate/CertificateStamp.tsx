import type { HTMLAttributes } from "react";
import { getStampStyle } from "@/lib/certificate-layout";
import { getStampById } from "@/lib/stamps";
import type { CertificateFormData, TemplateConfig, TemplateVariant } from "@/lib/types";
import type { CertificateRenderMode } from "@/components/certificate/CertificateTextField";

interface Props {
  data: CertificateFormData;
  config: TemplateConfig;
  variant: TemplateVariant;
  mode: CertificateRenderMode;
  active?: boolean;
  error?: boolean;
  offsetPrint?: boolean;
  boxProps?: HTMLAttributes<HTMLDivElement>;
}

export function CertificateStamp({ data, config, variant, mode, active = false, error = false, offsetPrint = mode === "print", boxProps }: Props) {
  const variantConfig = config.variants[variant];
  const layout = variantConfig.fields.stamp;
  const stamp = getStampById(data.stamp);
  const visible = mode === "print" ? layout.visibleInPrint : layout.visibleInPreview;

  if (!visible || (mode === "print" && !stamp)) return null;

  const offsetX = offsetPrint ? variantConfig.globalOffsetXmm : 0;
  const offsetY = offsetPrint ? variantConfig.globalOffsetYmm : 0;
  const style = {
    ...getStampStyle(layout, offsetX, offsetY),
    ...(mode === "print"
      ? {}
      : {
          outline: active ? "1px solid #d97706" : error ? "1px solid #ef4444" : "1px dashed rgba(120,113,108,.65)",
          background: "rgba(255,255,255,.18)",
        }),
    ...(boxProps?.style ?? {}),
  };

  return (
    <div {...boxProps} className={["stamp-box", boxProps?.className].filter(Boolean).join(" ")} data-field-box="stamp" style={style}>
      {stamp ? (
        <img data-field="stamp" src={stamp.src} alt={stamp.label} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      ) : mode === "print" ? null : (
        <div data-field="stamp" style={{ width: "100%", font: "10px sans-serif", color: "#78716c", textAlign: "center" }}>
          {layout.placeholder}
        </div>
      )}
    </div>
  );
}
