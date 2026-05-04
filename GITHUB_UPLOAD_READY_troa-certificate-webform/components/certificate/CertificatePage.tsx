import { CERTIFICATE_BORDER_SRC } from "@/lib/assets";
import { getPageStyle } from "@/lib/certificate-layout";
import type { CertificateFormData, FieldKey, TemplateConfig, TemplateVariant, TextFieldKey } from "@/lib/types";
import { CertificateStamp } from "@/components/certificate/CertificateStamp";
import { CertificateTextField, type CertificateRenderMode } from "@/components/certificate/CertificateTextField";

export const certificateTextFields: TextFieldKey[] = [
  "certificateNo",
  "title",
  "awardCategory",
  "recipient",
  "body",
  "date",
  "presenter",
];

interface Props {
  data: CertificateFormData;
  config: TemplateConfig;
  variant: TemplateVariant;
  mode: CertificateRenderMode;
  activeField?: FieldKey;
  errors?: Set<string>;
  showBorder?: boolean;
  editableField?: TextFieldKey | null;
  onTextChange?: (field: TextFieldKey, value: string) => void;
  onFocusField?: (field: FieldKey) => void;
  getFieldBoxProps?: (field: FieldKey) => Record<string, unknown>;
}

export function CertificatePage({
  data,
  config,
  variant,
  mode,
  activeField,
  errors,
  showBorder = mode !== "print",
  editableField = null,
  onTextChange,
  onFocusField,
  getFieldBoxProps,
}: Props) {
  const variantConfig = config.variants[variant];
  const background = mode === "admin" && variantConfig.adminBackgroundUrl ? variantConfig.adminBackgroundUrl : CERTIFICATE_BORDER_SRC;

  return (
    <main className="certificate-page" data-variant={variant} data-mode={mode} style={getPageStyle()}>
      {showBorder && (
        <img
          src={background}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "210mm",
            height: "297mm",
            objectFit: "cover",
            opacity: mode === "admin" ? variantConfig.adminBackgroundOpacity ?? 0.45 : 1,
            zIndex: 0,
          }}
        />
      )}
      {mode === "edit" && (
        <img
          src="/assets/gold-sticker-placeholder.png"
          alt=""
          style={{ position: "absolute", right: "27mm", bottom: "38mm", width: "24mm", opacity: 0.25, zIndex: 1, pointerEvents: "none" }}
        />
      )}
      {mode === "admin" && (
        <>
          <div style={{ position: "absolute", left: "105mm", top: 0, bottom: 0, width: 0, borderLeft: "1px solid rgba(14,165,233,.6)", zIndex: 3, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "148.5mm", left: 0, right: 0, height: 0, borderTop: "1px solid rgba(14,165,233,.6)", zIndex: 3, pointerEvents: "none" }} />
        </>
      )}
      {certificateTextFields.map((field) => (
        <CertificateTextField
          key={field}
          data={data}
          config={config}
          variant={variant}
          field={field}
          mode={mode}
          active={activeField === field}
          error={errors?.has(field)}
          editable={editableField === field}
          onTextChange={onTextChange}
          boxProps={{
            ...(getFieldBoxProps?.(field) ?? {}),
            onClick: () => onFocusField?.(field),
          }}
        />
      ))}
      <CertificateStamp
        data={data}
        config={config}
        variant={variant}
        mode={mode}
        active={activeField === "stamp"}
        error={errors?.has("stamp")}
        boxProps={{
          ...(getFieldBoxProps?.("stamp") ?? {}),
          onClick: () => onFocusField?.("stamp"),
        }}
      />
    </main>
  );
}
