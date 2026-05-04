import type { CSSProperties, HTMLAttributes } from "react";
import { applyAutoSpacing } from "@/lib/auto-spacing";
import { getFieldBoxStyle, getFieldTextStyle } from "@/lib/certificate-layout";
import type { CertificateFormData, TextFieldKey, TemplateConfig, TemplateVariant } from "@/lib/types";

export type CertificateRenderMode = "edit" | "preview" | "print" | "debug" | "admin";

interface Props {
  data: CertificateFormData;
  config: TemplateConfig;
  variant: TemplateVariant;
  field: TextFieldKey;
  mode: CertificateRenderMode;
  editable?: boolean;
  active?: boolean;
  error?: boolean;
  offsetPrint?: boolean;
  showPlaceholder?: boolean;
  className?: string;
  boxProps?: HTMLAttributes<HTMLDivElement>;
  textProps?: HTMLAttributes<HTMLDivElement>;
  onTextChange?: (field: TextFieldKey, value: string) => void;
}

export function CertificateTextField({
  data,
  config,
  variant,
  field,
  mode,
  editable = false,
  active = false,
  error = false,
  offsetPrint = mode === "print",
  showPlaceholder = mode !== "print",
  className,
  boxProps,
  textProps,
  onTextChange,
}: Props) {
  const variantConfig = config.variants[variant];
  const layout = variantConfig.fields[field];
  const rawValue = data[field] ?? "";
  const isEmptyOptional = !layout.required && !rawValue.trim();
  const visible = mode === "print" ? layout.visibleInPrint : layout.visibleInPreview;

  if (!visible || (mode === "print" && isEmptyOptional)) return null;

  const offsetX = offsetPrint ? variantConfig.globalOffsetXmm : 0;
  const offsetY = offsetPrint ? variantConfig.globalOffsetYmm : 0;
  const renderedValue = data.autoSpacingEnabled === false || editable ? rawValue : applyAutoSpacing(rawValue, layout.autoSpacing);
  const hasText = renderedValue.trim().length > 0;
  const text = hasText ? renderedValue : showPlaceholder ? layout.placeholder : "";
  const showEditFrame = mode === "admin" || mode === "debug" || mode === "preview" || editable || active || error;
  const boxStyle = {
    ...getFieldBoxStyle(layout, offsetX, offsetY),
    ...(mode === "print" || !showEditFrame
      ? {}
      : {
          outline: active ? "1px solid #d97706" : error ? "1px solid #ef4444" : "1px dashed rgba(120,113,108,.65)",
          background: editable ? "rgba(255,255,255,.38)" : "rgba(180,180,180,.10)",
        }),
    ...(boxProps?.style ?? {}),
  } satisfies CSSProperties;
  const textStyle = {
    ...getFieldTextStyle(layout),
    color: hasText ? "#000" : "#8b8175",
    minHeight: "1em",
    outline: "none",
    cursor: editable ? "text" : undefined,
    ...(textProps?.style ?? {}),
  } satisfies CSSProperties;
  const editableLineCount = Math.max(1, rawValue.split("\n").length);
  const editableTextHeight = `${editableLineCount * layout.fontSizePt * (layout.lineHeight || 1.4)}pt`;

  return (
    <div
      {...boxProps}
      className={["field-box", className, boxProps?.className].filter(Boolean).join(" ")}
      data-field-box={field}
      style={boxStyle}
    >
      {mode === "debug" && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "-12px",
            font: "10px Arial, sans-serif",
            lineHeight: 1,
            color: "#2563eb",
          }}
        >
          {field}
        </span>
      )}
      {editable ? (
        <textarea
          className={["field-text", textProps?.className].filter(Boolean).join(" ")}
          data-field={field}
          value={rawValue}
          placeholder={layout.placeholder}
          onChange={(event) => onTextChange?.(field, event.target.value)}
          style={{
            ...textStyle,
            height: editableTextHeight,
            maxHeight: "100%",
            resize: "none",
            border: 0,
            background: "transparent",
            outline: "none",
            overflow: "hidden",
            appearance: "none",
          }}
        />
      ) : (
        <div
          {...textProps}
          className={["field-text", textProps?.className].filter(Boolean).join(" ")}
          data-field={field}
          style={textStyle}
        >
          {text}
        </div>
      )}
    </div>
  );
}
