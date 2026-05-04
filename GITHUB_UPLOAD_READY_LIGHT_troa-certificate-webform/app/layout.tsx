import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "트루아 맞춤 상장 제작",
  description: "트루아 용돈 상장 문구를 직접 작성하고 맞춤 상장 제작을 접수하세요.",
  openGraph: {
    title: "트루아 맞춤 상장 제작",
    description: "트루아 용돈 상장 문구를 직접 작성하고 맞춤 상장 제작을 접수하세요.",
    images: ["/assets/home-banner-desktop.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
