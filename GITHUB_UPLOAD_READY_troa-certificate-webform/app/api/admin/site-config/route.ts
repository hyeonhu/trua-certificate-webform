import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSiteConfig, saveSiteConfig, type SiteConfig } from "@/lib/site-config";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json(await getSiteConfig());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const config = (await request.json()) as SiteConfig;
  return NextResponse.json(await saveSiteConfig(config));
}
