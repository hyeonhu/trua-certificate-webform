import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "이 버전은 PDF 다운로드 대신 Google Sheets 제출만 처리합니다.",
    },
    { status: 410 },
  );
}
