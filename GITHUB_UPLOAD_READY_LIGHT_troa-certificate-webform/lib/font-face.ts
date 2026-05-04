import { existsSync } from "fs";
import path from "path";

function publicFontUrl(filename: string, target: "browser" | "pdf") {
  if (target === "browser") return `/fonts/${filename}`;

  const filePath = path.join(process.cwd(), "public", "fonts", filename);
  if (!existsSync(filePath)) return "";
  return `file:///${filePath.replaceAll("\\", "/")}`;
}

function fontFace(family: string, filename: string, target: "browser" | "pdf", format = "truetype", weight = "100 900") {
  const src = publicFontUrl(filename, target);
  if (!src) return "";
  return `
    @font-face {
      font-family: "${family}";
      src: url("${src}") format("${format}");
      font-weight: ${weight};
      font-style: normal;
      font-display: block;
    }
  `;
}

export function getFontFaceDeclarations(target: "browser" | "pdf" = "browser") {
  return `
    ${fontFace("Noto Sans KR", "NotoSansKR-VF.ttf", target)}
    ${fontFace("Noto Serif KR", "NotoSerifKR-VF.ttf", target)}
    ${fontFace("TROA-Certificate", "NotoSerifKR-VF.ttf", target)}
    ${fontFace("Batang", "Batang.ttc", target, "truetype", "400")}
    ${fontFace("바탕", "Batang.ttc", target, "truetype", "400")}
  `;
}
