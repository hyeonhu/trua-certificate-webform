import type { OrderRecord } from "@/lib/types";

export async function sendCertificateEmail(_order: OrderRecord) {
  return {
    status: "skipped" as const,
    error: "이 버전은 이메일 발송 대신 Google Sheets 제출만 처리합니다.",
  };
}
