import type { AutoSpacingConfig, FieldKey, FieldLayout, TemplateConfig, TemplateVariantConfig } from "@/lib/types";
import { CERTIFICATE_BORDER_SRC } from "@/lib/assets";

const offSpacing: AutoSpacingConfig = {
  enabled: false,
  mode: "spaces",
  stripSpacesBeforeCount: true,
  applyPerLine: true,
  rules: { default: 0 },
};

const awardSpacing: AutoSpacingConfig = {
  enabled: true,
  mode: "spaces",
  stripSpacesBeforeCount: true,
  applyPerLine: true,
  rules: { "2": 4, "3": 2, "4": 1, "5": 0, default: 0 },
};

const help: Record<FieldKey, string> = {
  certificateNo: "\uC0C1\uC7A5 \uBC88\uD638\uB294 \uC120\uD0DD \uC0AC\uD56D\uC785\uB2C8\uB2E4. \uC785\uB825\uD558\uC9C0 \uC54A\uC73C\uBA74 \uCD9C\uB825\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  title: "\uC0C1\uC7A5 \uC0C1\uB2E8\uC5D0 \uB4E4\uC5B4\uAC00\uB294 \uC81C\uBAA9\uC785\uB2C8\uB2E4. \uC608: \uCD5C\uACE0\uC758 \uC5B4\uBC84\uC774\uC0C1, \uAC10\uC0AC\uC7A5",
  awardCategory: "\uC218\uC0C1 \uBD80\uBB38\uC740 \uC120\uD0DD \uC0AC\uD56D\uC785\uB2C8\uB2E4. \uC608: \uCD95\uD658\uAC11, \uB300\uC0C1, \uCD5C\uACE0\uC0C1",
  recipient: "\uC0C1\uC7A5\uC744 \uBC1B\uB294 \uBD84\uC758 \uC774\uB984 \uB610\uB294 \uD638\uCE6D\uC744 \uC801\uC5B4\uC8FC\uC138\uC694.",
  body: "\uBCF8\uBB38\uC740 7~8\uC904, \uC904\uB2F9 25\uC790 \uB0B4\uC678\uB97C \uAD8C\uC7A5\uD569\uB2C8\uB2E4. \uC5D4\uD130 \uC904\uBC14\uAFC8\uC774 \uADF8\uB300\uB85C \uBC18\uC601\uB429\uB2C8\uB2E4.",
  date: "\uC0C1\uC7A5\uC5D0 \uD45C\uC2DC\uB420 \uB0A0\uC9DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694. \uC608: 2025\uB144 5\uC6D4 8\uC77C",
  presenter: "\uC218\uC5EC\uC790\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694. \uC608: \uC0AC\uB791\uD558\uB294 \uC544\uB4E4 \uC62C\uB9BC",
  stamp: "\uC0C1\uC7A5 \uD558\uB2E8\uC5D0 \uB4E4\uC5B4\uAC08 \uB3C4\uC7A5 \uB514\uC790\uC778\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.",
};

function field(partial: Partial<FieldLayout>): FieldLayout {
  return {
    xMm: 30,
    yMm: 30,
    widthMm: 150,
    heightMm: 16,
    fontFamily: '"Gungsuh", "\uAD81\uC11C", "Batang", serif',
    fontSizePt: 20,
    fontWeight: "400",
    lineHeight: 1.35,
    letterSpacing: 0,
    textAlign: "center",
    verticalAlign: "middle",
    required: false,
    visibleInPreview: true,
    visibleInPrint: true,
    placeholder: "",
    helpText: "",
    autoSpacing: offSpacing,
    ...partial,
  };
}

function variantConfig(name: string, shiftX = 0, shiftY = 0): TemplateVariantConfig {
  return {
    name,
    globalOffsetXmm: 0,
    globalOffsetYmm: 0,
    adminBackgroundUrl: CERTIFICATE_BORDER_SRC,
    adminBackgroundOpacity: 0.45,
    fields: {
      certificateNo: field({
        xMm: 30 + shiftX,
        yMm: 34 + shiftY,
        widthMm: 150,
        heightMm: 9,
        fontSizePt: 11,
        textAlign: "center",
        placeholder: "\uC81C 2026 - 0319 \uD638",
        helpText: help.certificateNo,
      }),
      title: field({
        xMm: 31 + shiftX,
        yMm: 55 + shiftY,
        widthMm: 148,
        heightMm: 28,
        fontSizePt: 31,
        fontWeight: "700",
        lineHeight: 1.22,
        required: true,
        placeholder: "\uC0C1\uC7A5\uBA85",
        helpText: help.title,
      }),
      awardCategory: field({
        xMm: 44 + shiftX,
        yMm: 89 + shiftY,
        widthMm: 122,
        heightMm: 13,
        fontSizePt: 18,
        fontWeight: "700",
        placeholder: "\uC218\uC0C1 \uBD80\uBB38",
        helpText: help.awardCategory,
        autoSpacing: awardSpacing,
      }),
      recipient: field({
        xMm: 40 + shiftX,
        yMm: 109 + shiftY,
        widthMm: 130,
        heightMm: 20,
        fontSizePt: 20,
        fontWeight: "700",
        lineHeight: 1.3,
        required: true,
        placeholder: "\uC218\uC0C1\uC790",
        helpText: help.recipient,
      }),
      body: field({
        xMm: 31 + shiftX,
        yMm: 137 + shiftY,
        widthMm: 148,
        heightMm: 68,
        fontSizePt: 15,
        lineHeight: 1.65,
        required: true,
        placeholder: "\uBCF8\uBB38 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694",
        helpText: help.body,
      }),
      date: field({
        xMm: 43 + shiftX,
        yMm: 218 + shiftY,
        widthMm: 124,
        heightMm: 12,
        fontSizePt: 14,
        required: true,
        placeholder: "2025\uB144 5\uC6D4 8\uC77C",
        helpText: help.date,
      }),
      presenter: field({
        xMm: 45 + shiftX,
        yMm: 238 + shiftY,
        widthMm: 120,
        heightMm: 22,
        fontSizePt: 19,
        fontWeight: "700",
        lineHeight: 1.25,
        required: true,
        placeholder: "\uC218\uC5EC\uC790",
        helpText: help.presenter,
      }),
      stamp: field({
        xMm: 137 + shiftX,
        yMm: 232 + shiftY,
        widthMm: 26,
        heightMm: 26,
        required: true,
        placeholder: "\uB3C4\uC7A5",
        helpText: help.stamp,
      }),
    },
  };
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  version: "mvp-1",
  updatedAt: new Date(0).toISOString(),
  variants: {
    A: variantConfig("A\uC548", 0, 0),
    B: variantConfig("B\uC548", 0, 3),
  },
};
