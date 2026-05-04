import type { CSSProperties } from "react";
import type { FieldLayout } from "@/lib/types";

const GUNGSEO_FAMILY = '"Gungsuh", "\uAD81\uC11C", "Noto Serif KR", "Noto Sans KR", serif';
const BATANG_FAMILY = '"Batang", "\uBC14\uD0D5", "Noto Serif KR", "Noto Sans KR", serif';
const DEFAULT_FAMILY = GUNGSEO_FAMILY;

function appendNotoBeforeGenericSerif(fontFamily: string) {
  const parts = fontFamily
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const withoutGeneric = parts.filter((part) => part.toLowerCase() !== "serif");

  if (!withoutGeneric.some((part) => part.includes("Noto Serif KR"))) {
    withoutGeneric.push('"Noto Serif KR"');
  }
  if (!withoutGeneric.some((part) => part.includes("Noto Sans KR"))) {
    withoutGeneric.push('"Noto Sans KR"');
  }

  withoutGeneric.push("serif");
  return withoutGeneric.join(", ");
}

export function normalizeFontFamily(raw?: string) {
  if (!raw?.trim()) return DEFAULT_FAMILY;

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

  const wantsGungseo = cleaned.includes("Gungsuh") || cleaned.includes("\uAD81\uC11C");
  if (wantsGungseo) return GUNGSEO_FAMILY;

  const wantsBatang = cleaned.includes("Batang") || cleaned.includes("\uBC14\uD0D5");
  if (wantsBatang) return BATANG_FAMILY;

  return appendNotoBeforeGenericSerif(cleaned);
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
