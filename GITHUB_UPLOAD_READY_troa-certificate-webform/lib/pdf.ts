import type { CertificateFormData, FieldOverflow, TemplateConfig, TemplateVariant } from "@/lib/types";

export async function detectOverflows(_data: CertificateFormData, _templateConfig: TemplateConfig): Promise<FieldOverflow[]> {
  return [];
}

export async function generatePdf(_data: CertificateFormData, _templateConfig: TemplateConfig, _variant: TemplateVariant): Promise<string> {
  throw new Error("이 버전은 Google Sheets 제출용이라 서버 PDF 생성을 사용하지 않습니다.");
}
