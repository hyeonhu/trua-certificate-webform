import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "상장 PDF 자동 제작 MVP",
  description: "A/B 상장 PDF를 동시에 생성하고 이메일로 발송하는 MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
