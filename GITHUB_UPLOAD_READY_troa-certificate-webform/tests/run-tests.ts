import assert from "node:assert/strict";
import { applyAutoSpacing } from "../lib/auto-spacing";
import { getFieldBoxStyle, getFieldStyle, getFieldTextStyle, normalizeFontFamily, verticalAlignToJustifyContent } from "../lib/certificate-style";
import type { AutoSpacingConfig } from "../lib/types";
import { validateCertificateData, EMPTY_FORM } from "../lib/validation";

const tests: { name: string; run: () => void }[] = [];

function test(name: string, run: () => void) {
  tests.push({ name, run });
}

const autoSpacingConfig: AutoSpacingConfig = {
  enabled: true,
  mode: "spaces",
  stripSpacesBeforeCount: true,
  applyPerLine: true,
  rules: { "2": 4, "3": 2, "4": 1, default: 0 },
};

const validStamp = "\uAC10\uC0AC\uCD95\uD558";

test("applyAutoSpacing applies two spaces to three Korean characters", () => {
  assert.equal(applyAutoSpacing("\uCD95\uD658\uAC11", autoSpacingConfig), "\uCD95  \uD658  \uAC11");
});

test("applyAutoSpacing applies four spaces to two Korean characters", () => {
  assert.equal(applyAutoSpacing("\uB300\uC0C1", autoSpacingConfig), "\uB300    \uC0C1");
});

test("applyAutoSpacing applies rules per line", () => {
  assert.equal(
    applyAutoSpacing("\uCD5C\uACE0\uC758\n\uC5B4\uBC84\uC774\uC0C1", autoSpacingConfig),
    "\uCD5C  \uACE0  \uC758\n\uC5B4 \uBC84 \uC774 \uC0C1",
  );
});

test("applyAutoSpacing keeps original value when disabled", () => {
  assert.equal(applyAutoSpacing("\uCD95\uD658\uAC11", { ...autoSpacingConfig, enabled: false }), "\uCD95\uD658\uAC11");
});

test("validateCertificateData requires required fields", () => {
  const errors = validateCertificateData(EMPTY_FORM);
  assert.deepEqual(
    new Set(errors.map((error) => error.field)),
    new Set(["email", "title", "recipient", "body", "date", "presenter", "stamp"]),
  );
});

test("validateCertificateData validates email format", () => {
  const errors = validateCertificateData({
    ...EMPTY_FORM,
    orderNumber: "ORDER-1",
    email: "wrong-email",
    title: "\uC0C1\uC7A5",
    recipient: "\uC218\uC0C1\uC790",
    body: "\uBCF8\uBB38",
    date: "2026\uB144 5\uC6D4 2\uC77C",
    presenter: "\uC218\uC5EC\uC790",
    stamp: validStamp,
  });
  assert.equal(errors.some((error) => error.field === "email"), true);
});

test("validateCertificateData accepts valid minimal data", () => {
  const errors = validateCertificateData({
    ...EMPTY_FORM,
    orderNumber: "ORDER-1",
    email: "customer@example.com",
    title: "\uC0C1\uC7A5",
    recipient: "\uC218\uC0C1\uC790",
    body: "\uBCF8\uBB38",
    date: "2026\uB144 5\uC6D4 2\uC77C",
    presenter: "\uC218\uC5EC\uC790",
    stamp: validStamp,
  });
  assert.equal(errors.length, 0);
});

const styleLayout = {
  xMm: 31,
  yMm: 56.9,
  widthMm: 148,
  heightMm: 22.5,
  fontFamily: '"Gungsuh", "궁서", "Batang", serif',
  fontSizePt: 46,
  fontWeight: "700",
  lineHeight: 1.22,
  letterSpacing: 0,
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  required: true,
  visibleInPreview: true,
  visibleInPrint: true,
  placeholder: "상장명",
  helpText: "",
  autoSpacing: autoSpacingConfig,
};

test("normalizeFontFamily keeps Korean font stack valid", () => {
  const normalized = normalizeFontFamily('"\\"Gungsuh\\", \\"\\uAD81\\uC11C\\", \\"Batang\\", serif"');
  assert.equal(normalized.includes("Gungsuh"), true);
  assert.equal(normalized.includes("\uAD81\uC11C"), true);
  assert.equal(normalized.includes("Batang"), true);
  assert.equal(normalized.includes("serif"), true);
});

test("getFieldTextStyle keeps pt font size", () => {
  assert.equal(getFieldTextStyle(styleLayout).fontSize, "46pt");
});

test("getFieldBoxStyle keeps mm coordinates", () => {
  const style = getFieldBoxStyle(styleLayout);
  assert.equal(style.left, "31mm");
  assert.equal(style.top, "56.9mm");
  assert.equal(style.width, "148mm");
  assert.equal(style.height, "22.5mm");
});

test("getFieldStyle does not overwrite box width with text width", () => {
  const style = getFieldStyle(styleLayout);
  assert.equal(style.width, "148mm");
  assert.equal(style.textAlign, "center");
  assert.equal(style.fontSize, "46pt");
});

test("verticalAlignToJustifyContent maps vertical alignment", () => {
  assert.equal(verticalAlignToJustifyContent("top"), "flex-start");
  assert.equal(verticalAlignToJustifyContent("middle"), "center");
  assert.equal(verticalAlignToJustifyContent("bottom"), "flex-end");
});

test("getFieldTextStyle keeps text block width separate", () => {
  const style = getFieldTextStyle(styleLayout);
  assert.equal(style.width, "100%");
  assert.equal(style.textAlign, "center");
});

let failed = 0;

for (const item of tests) {
  try {
    item.run();
    console.log(`PASS ${item.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${item.name}`);
    console.error(error);
  }
}

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log(`\n${tests.length} tests passed.`);
}
