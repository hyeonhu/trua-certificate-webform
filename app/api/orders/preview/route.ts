import { NextResponse } from "next/server";
import { getTemplateConfig } from "@/lib/template-config";
import type { CertificateFormData } from "@/lib/types";
import { validateCertificateData } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CertificateFormData;
    const templateConfig = await getTemplateConfig();
    const validationErrors = validateCertificateData(data, templateConfig);

    if (validationErrors.length) {
      return NextResponse.json({ ok: false, validationErrors, overflows: [], variants: [] }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      validationErrors: [],
      overflows: [],
      variants: [{ variant: "A" }, { variant: "B" }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "미리보기 검수 중 오류가 발생했습니다.";
    return NextResponse.json({ ok: false, validationErrors: [], overflows: [], variants: [], message }, { status: 500 });
  }
}
