import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trua-certificate-webform-20260504.vercel.app";
const siteTitle = "\uD2B8\uB8E8\uC544 \uB9DE\uCDA4 \uC0C1\uC7A5 \uC81C\uC791";
const siteDescription =
  "\uD2B8\uB8E8\uC544 \uC6A9\uB3C8 \uC0C1\uC7A5 \uBB38\uAD6C\uB97C \uC9C1\uC811 \uC791\uC131\uD558\uACE0 \uB9DE\uCDA4 \uC0C1\uC7A5 \uC81C\uC791\uC744 \uC811\uC218\uD558\uC138\uC694.";
const previewImage = "/assets/link-preview.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "\uD2B8\uB8E8\uC544 \uC6A9\uB3C8 \uC0C1\uC7A5",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: previewImage,
        width: 1600,
        height: 1600,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [previewImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
