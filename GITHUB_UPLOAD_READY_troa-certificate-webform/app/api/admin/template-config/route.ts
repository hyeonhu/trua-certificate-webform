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
  const config = (await request.json()) as TemplateConfig;
  const saved = await saveTemplateConfig(config);
  return NextResponse.json(saved);
}
