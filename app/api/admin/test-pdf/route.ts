import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "이 버전은 Google Sheets 제출용이라 서버 PDF 생성 기능을 사용하지 않습니다.",
    },
    { status: 410 },
  );
}
