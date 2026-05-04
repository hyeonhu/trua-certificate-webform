import { STAMP_OPTIONS } from "./stamps";
import type { CertificateFormData, FieldKey, TemplateConfig, ValidationError } from "@/lib/types";

export const EMPTY_FORM: CertificateFormData = {
  orderNumber: "",
  email: "",
  certificateNo: "",
  title: "",
  awardCategory: "",
  recipient: "",
  body: "",
  date: "",
  presenter: "",
  stamp: "",
  autoSpacingEnabled: true,
};

const fieldLabels: Record<keyof CertificateFormData, string> = {
  orderNumber: "주문번호",
  email: "이메일",
  certificateNo: "상장 번호",
  title: "상장명",
  awardCategory: "수상 부문",
  recipient: "수상자",
  body: "본문",
  date: "날짜",
  presenter: "수여자",
  stamp: "도장",
  autoSpacingEnabled: "자동 자간",
};

export function createOrderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${now.getTime().toString().slice(-6)}`;
  return `TROA-${stamp}`;
}

export function validateCertificateData(data: CertificateFormData, templateConfig?: TemplateConfig): ValidationError[] {
  const errors: ValidationError[] = [];
  const requiredFields: (keyof CertificateFormData)[] = ["email", "title", "recipient", "body", "date", "presenter", "stamp"];

  for (const field of requiredFields) {
    if (!String(data[field] ?? "").trim()) {
      errors.push({ field, message: `${fieldLabels[field]}은(는) 필수입니다.` });
    }
  }

  const email = data.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "이메일 형식을 확인해주세요." });
  }

  if (data.stamp && !STAMP_OPTIONS.some((stamp) => stamp.id === data.stamp)) {
    errors.push({ field: "stamp", message: "도장을 다시 선택해주세요." });
  }

  if (templateConfig) {
    const layoutRequired = new Set<FieldKey>();
    (["A", "B"] as const).forEach((variant) => {
      Object.entries(templateConfig.variants[variant].fields).forEach(([field, layout]) => {
        if (layout.required && field !== "stamp" && field !== "certificateNo" && field !== "awardCategory") {
          layoutRequired.add(field as FieldKey);
        }
      });
    });

    layoutRequired.forEach((field) => {
      if (field !== "stamp" && !String(data[field] ?? "").trim() && !errors.some((error) => error.field === field)) {
        errors.push({ field, message: `${fieldLabels[field]}은(는) 필수입니다.` });
      }
    });
  }

  return errors;
}
