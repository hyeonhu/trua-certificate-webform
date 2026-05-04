import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getTemplateConfig, saveTemplateConfig } from "@/lib/template-config";
import type { TemplateConfig } from "@/lib/types";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json(await getTemplateConfig());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const config = (await request.json()) as TemplateConfig;
    const saved = await saveTemplateConfig(config);
    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "템플릿 저장 중 오류가 발생했습니다.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
