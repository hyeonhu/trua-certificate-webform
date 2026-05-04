import type { CertificateFormData, TemplateConfig } from "@/lib/types";
import { getStampById } from "@/lib/stamps";

export interface WebhookSubmission {
  submittedAt: string;
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
  stampLabel: string;
  autoSpacingEnabled: boolean;
  templateConfigVersion: string;
  raw: CertificateFormData;
}

export function createWebhookSubmission(data: CertificateFormData, templateConfig: TemplateConfig): WebhookSubmission {
  const stamp = getStampById(data.stamp);
  return {
    submittedAt: new Date().toISOString(),
    orderNumber: data.orderNumber,
    email: data.email,
    certificateNo: data.certificateNo,
    title: data.title,
    awardCategory: data.awardCategory,
    recipient: data.recipient,
    body: data.body,
    date: data.date,
    presenter: data.presenter,
    stamp: data.stamp,
    stampLabel: stamp?.label ?? data.stamp,
    autoSpacingEnabled: data.autoSpacingEnabled !== false,
    templateConfigVersion: templateConfig.version,
    raw: data,
  };
}

export async function submitToGoogleSheets(payload: WebhookSubmission) {
  const webhookUrl = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      status: "skipped" as const,
      message: "GOOGLE_SCRIPT_WEBHOOK_URL 환경변수가 없어 개발 모드에서는 전송을 건너뜁니다.",
    };
  }

  const url = new URL(webhookUrl);
  if (process.env.GOOGLE_SCRIPT_SECRET) url.searchParams.set("secret", process.env.GOOGLE_SCRIPT_SECRET);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google Sheets 전송 실패: ${response.status} ${text}`);
  }

  return {
    status: "sent" as const,
    message: text || "Google Sheets로 전송되었습니다.",
  };
}
