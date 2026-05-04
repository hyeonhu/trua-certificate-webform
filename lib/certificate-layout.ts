import type { CSSProperties } from "react";
import type { FieldLayout } from "@/lib/types";

export function normalizeFontFamily(raw?: string) {
  if (!raw?.trim()) return '"Noto Serif KR", "Batang", "바탕", serif';

  let cleaned = raw
    .trim()
    .replace(/\\"/g, '"')
    .replace(/\\u([\dA-Fa-f]{4})/g, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)));

  if (
    ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) &&
    cleaned.slice(1, -1).includes(",")
  ) {
    cleaned = cleaned.slice(1, -1);
  }

  if ((cleaned.includes("Gungsuh") || cleaned.includes("궁서")) && !cleaned.includes("Noto Serif KR")) {
    cleaned = `${cleaned}, "Noto Serif KR"`;
  }

  return cleaned;
}

export function verticalAlignToJustifyContent(verticalAlign?: FieldLayout["verticalAlign"]) {
  if (verticalAlign === "middle") return "center";
  if (verticalAlign === "bottom") return "flex-end";
  return "flex-start";
}

export function getPageStyle(): CSSProperties {
  return {
    width: "210mm",
    height: "297mm",
    position: "relative",
    overflow: "hidden",
    background: "white",
    color: "#000",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  };
}

export function getFieldBoxStyle(layout: FieldLayout, offsetX = 0, offsetY = 0): CSSProperties {
  return {
    position: "absolute",
    left: `${layout.xMm + offsetX}mm`,
    top: `${layout.yMm + offsetY}mm`,
    width: `${layout.widthMm}mm`,
    height: `${layout.heightMm}mm`,
    display: "flex",
    flexDirection: "column",
    justifyContent: verticalAlignToJustifyContent(layout.verticalAlign),
    alignItems: "stretch",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  };
}

export function getFieldTextStyle(layout: FieldLayout): CSSProperties {
  return {
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    fontFamily: normalizeFontFamily(layout.fontFamily),
    fontSize: `${layout.fontSizePt}pt`,
    fontWeight: layout.fontWeight || "400",
    lineHeight: String(layout.lineHeight || 1.4),
    letterSpacing: layout.letterSpacing ? `${layout.letterSpacing}mm` : undefined,
    textAlign: layout.textAlign,
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "normal",
    color: "#000",
  };
}

export function getFieldStyle(layout: FieldLayout, offsetX = 0, offsetY = 0): CSSProperties {
  return {
    ...getFieldBoxStyle(layout, offsetX, offsetY),
    ...getFieldTextStyle(layout),
    width: `${layout.widthMm}mm`,
    alignItems: "stretch",
  };
}

export function getStampStyle(layout: FieldLayout, offsetX = 0, offsetY = 0): CSSProperties {
  return {
    position: "absolute",
    left: `${layout.xMm + offsetX}mm`,
    top: `${layout.yMm + offsetY}mm`,
    width: `${layout.widthMm}mm`,
    height: `${layout.heightMm}mm`,
    objectFit: "contain",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  };
}
