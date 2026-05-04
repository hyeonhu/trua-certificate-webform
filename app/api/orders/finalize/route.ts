import { NextResponse } from "next/server";
import { createWebhookSubmission, submitToGoogleSheets } from "@/lib/google-sheets-webhook";
import { getTemplateConfig } from "@/lib/template-config";
import type { CertificateFormData } from "@/lib/types";
import { createOrderNumber, validateCertificateData } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CertificateFormData;
    data.orderNumber = data.orderNumber || createOrderNumber();
    const templateConfig = await getTemplateConfig();
    const validationErrors = validateCertificateData(data, templateConfig);

    if (validationErrors.length) {
      return NextResponse.json({ ok: false, validationErrors, overflows: [] }, { status: 400 });
    }

    const submission = createWebhookSubmission(data, templateConfig);
    const result = await submitToGoogleSheets(submission);

    return NextResponse.json({
      ok: true,
      submission,
      message: result.message,
      webhookStatus: result.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "제출 중 오류가 발생했습니다.";
    return NextResponse.json({ ok: false, validationErrors: [], overflows: [], message }, { status: 500 });
  }
}
