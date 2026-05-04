export type TemplateVariant = "A" | "B";

export type FieldKey =
  | "certificateNo"
  | "title"
  | "awardCategory"
  | "recipient"
  | "body"
  | "date"
  | "presenter"
  | "stamp";

export type TextFieldKey = Exclude<FieldKey, "stamp">;

export type AutoSpacingMode = "spaces" | "letterSpacing";

export interface AutoSpacingConfig {
  enabled: boolean;
  mode: AutoSpacingMode;
  stripSpacesBeforeCount: boolean;
  applyPerLine: boolean;
  rules: Record<string, number>;
}

export interface FieldLayout {
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  fontFamily: string;
  fontSizePt: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  required: boolean;
  visibleInPreview: boolean;
  visibleInPrint: boolean;
  placeholder: string;
  helpText: string;
  autoSpacing: AutoSpacingConfig;
}

export interface TemplateVariantConfig {
  name: string;
  globalOffsetXmm: number;
  globalOffsetYmm: number;
  adminBackgroundUrl?: string;
  adminBackgroundOpacity?: number;
  fields: Record<FieldKey, FieldLayout>;
}

export interface TemplateConfig {
  version: string;
  updatedAt: string;
  variants: Record<TemplateVariant, TemplateVariantConfig>;
}

export interface CertificateFormData {
  orderNumber: string;
  email: string;
  certificateNo: string;
  title: string;
  awardCategory: string;
  recipient: string;
  body: string;
  date: string;
  presenter: string;
  stamp: string;
  autoSpacingEnabled?: boolean;
}

export interface StampOption {
  id: string;
  label: string;
  src: string;
}

export interface FieldOverflow {
  variant: TemplateVariant;
  field: FieldKey;
  message: string;
}

export interface ValidationError {
  field: keyof CertificateFormData;
  message: string;
}

export interface RenderedVariant {
  variant: TemplateVariant;
  html: string;
  overflows: FieldOverflow[];
}

export interface OrderRecord {
  createdAt: string;
  orderNumber: string;
  email: string;
  input: CertificateFormData;
  stamp: string;
  pdfAPath: string;
  pdfBPath: string;
  emailStatus: "sent" | "skipped" | "failed";
  emailError?: string;
  templateConfigVersion: string;
}
