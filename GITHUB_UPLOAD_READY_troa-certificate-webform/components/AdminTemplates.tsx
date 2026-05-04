"use client";

import { useEffect, useState } from "react";
import { CertificateCanvas } from "@/components/CertificateCanvas";
import type { FieldKey, FieldLayout, TemplateConfig, TemplateVariant, TemplateVariantConfig } from "@/lib/types";
import { EMPTY_FORM } from "@/lib/validation";

const fields: FieldKey[] = ["certificateNo", "title", "awardCategory", "recipient", "body", "date", "presenter", "stamp"];

const labels: Record<FieldKey, string> = {
  certificateNo: "\uC0C1\uC7A5 \uBC88\uD638",
  title: "\uC0C1\uC7A5\uBA85",
  awardCategory: "\uC218\uC0C1 \uBD80\uBB38",
  recipient: "\uC218\uC0C1\uC790",
  body: "\uBCF8\uBB38",
  date: "\uB0A0\uC9DC",
  presenter: "\uC218\uC5EC\uC790",
  stamp: "\uB3C4\uC7A5",
};

const text = {
  title: "\uD15C\uD50C\uB9BF \uC124\uC815",
  showBackground: "\uAE30\uC900 \uBC30\uACBD \uBCF4\uAE30",
  showPlaceholders: "\uC785\uB825 \uC804 \uC548\uB0B4\uBB38\uAD6C \uBCF4\uAE30",
  textMode: "\uC0D8\uD50C \uC785\uB825",
  moveMode: "\uC704\uCE58 \uC774\uB3D9",
  copy: "A\uC548 \uC124\uC815\uC744 B\uC548\uC5D0 \uBCF5\uC0AC",
  moveHint: "\uD544\uB4DC\uB97C \uB4DC\uB798\uADF8\uD574\uC11C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  textHint: "\uBC15\uC2A4 \uC548\uC5D0 \uC0D8\uD50C \uBB38\uAD6C\uB97C \uC9C1\uC811 \uC785\uB825\uD574 \uBCF4\uC138\uC694.",
  keyboardHint: "\uBC15\uC2A4 \uC120\uD0DD \uD6C4 \uBC29\uD5A5\uD0A4\uB85C 0.5mm \uC774\uB3D9, Shift+\uBC29\uD5A5\uD0A4\uB85C 2mm \uC774\uB3D9, Alt+\uBC29\uD5A5\uD0A4\uB85C 0.1mm \uBBF8\uC138 \uC774\uB3D9, Ctrl+\uBC29\uD5A5\uD0A4\uB85C \uBC15\uC2A4 \uD06C\uAE30\uB97C \uC870\uC815\uD569\uB2C8\uB2E4.",
  backgroundUrl: "\uAD00\uB9AC\uC790\uC6A9 \uAE30\uC900 \uBC30\uACBD URL",
  backgroundHelp: "\uC608: /assets/reference-a.png. PDF \uCD9C\uB825\uC5D0\uB294 \uD3EC\uD568\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  backgroundOpacity: "\uAE30\uC900 \uBC30\uACBD \uD22C\uBA85\uB3C4",
  fontPreset: "\uC11C\uCCB4",
  customFont: "\uC11C\uCCB4 \uC9C1\uC811 \uC785\uB825",
  fontWeight: "\uAE00\uC790 \uAD75\uAE30",
  align: "\uC815\uB82C",
  verticalAlign: "\uC138\uB85C \uC815\uB82C",
  helpText: "\uC548\uB0B4\uC0AC\uD56D",
  required: "\uD544\uC218",
  preview: "\uBBF8\uB9AC\uBCF4\uAE30",
  print: "\uCD9C\uB825",
  autoSpacing: "\uC790\uB3D9 \uC790\uAC04",
  spacingRules: "\uC790\uB3D9 \uC790\uAC04 \uADDC\uCE59",
  charCount: "\uAE00\uC790 \uC218",
  spaceCount: "\uACF5\uBC31 \uC218",
  addRule: "+ \uADDC\uCE59 \uCD94\uAC00",
  remove: "\uC0AD\uC81C",
  defaultRule: "\uAE30\uBCF8\uAC12",
  centerOnPage: "\uB300\uC9C0 \uAE30\uC900 \uC911\uC559 \uB9DE\uCDA4",
  horizontalCenter: "\uAC00\uB85C \uC911\uC559",
  verticalCenter: "\uC138\uB85C \uC911\uC559",
  bothCenter: "\uAC00\uB85C+\uC138\uB85C",
  save: "\uC800\uC7A5",
  draftSaved: "\uC784\uC2DC\uC800\uC7A5\uB428",
  draftRestored: "\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uC784\uC2DC \uC218\uC815\uAC12\uC744 \uBCF5\uAD6C\uD588\uC2B5\uB2C8\uB2E4.",
  testPdf: "\uD14C\uC2A4\uD2B8 PDF",
  saving: "\uC800\uC7A5 \uC911...",
  saved: "\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  saveFailed: "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  testCreating: "\uD14C\uC2A4\uD2B8 PDF \uC0DD\uC131 \uC911...",
  testFailed: "\uD14C\uC2A4\uD2B8 PDF \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  copied: "A\uC548 \uC124\uC815\uC744 B\uC548\uC5D0 \uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4.",
};

const fontOptions = [
  { label: "트루아 고정 서체", value: '"TROA-Certificate", "Noto Serif KR", serif' },
  { label: "\uAD81\uC11C", value: '"Gungsuh", "\uAD81\uC11C", "Batang", serif' },
  { label: "\uAD81\uC11C\uCCB4", value: '"GungsuhChe", "\uAD81\uC11C\uCCB4", "Gungsuh", serif' },
  { label: "\uBC14\uD0D5", value: '"Batang", "\uBC14\uD0D5", serif' },
  { label: "\uBC14\uD0D5\uCCB4", value: '"BatangChe", "\uBC14\uD0D5\uCCB4", "Batang", serif' },
  { label: "\uB9D1\uC740 \uACE0\uB515", value: '"Malgun Gothic", "\uB9D1\uC740 \uACE0\uB515", sans-serif' },
  { label: "\uB178\uD1A0 \uC0B0\uC2A4 KR", value: '"Noto Sans KR", "Noto Sans CJK KR", "Malgun Gothic", sans-serif' },
  { label: "\uB178\uD1A0 \uC138\uB9AC\uD504 KR", value: '"Noto Serif KR", "Noto Serif CJK KR", "Batang", serif' },
  { label: "\uB3CB\uC6C0", value: '"Dotum", "\uB3CB\uC6C0", sans-serif' },
  { label: "\uAD74\uB9BC", value: '"Gulim", "\uAD74\uB9BC", sans-serif' },
  { label: "Times New Roman", value: '"Times New Roman", "Batang", serif' },
  { label: "\uCEE4\uC2A4\uD140 certificate.woff2", value: '"CustomCertificate", "Gungsuh", serif' },
  { label: "\uC9C1\uC811 \uC785\uB825", value: "__custom__" },
];

const sample = {
  ...EMPTY_FORM,
  orderNumber: "ADMIN-TEST",
  email: "test@example.com",
  certificateNo: "\uC81C 2026 - 0319 \uD638",
  title: "\uCD5C\uACE0\uC758 \uC5B4\uBC84\uC774\uC0C1",
  awardCategory: "\uCD95\uD658\uAC11",
  recipient: "\uC0AC\uB791\uD558\uB294 \uC5B4\uBA38\uB2C8",
  body: "\uD55C\uACB0\uAC19\uC740 \uC0AC\uB791\uACFC \uB530\uB73B\uD55C \uB9C8\uC74C\uC73C\uB85C\n\uC6B0\uB9AC \uAC00\uC871\uC744 \uC9C0\uCF1C\uC8FC\uC2E0 \uC740\uD61C\uC5D0\n\uAE4A\uC740 \uAC10\uC0AC\uC640 \uC874\uACBD\uC744 \uB2F4\uC544\n\uC774 \uC0C1\uC7A5\uC744 \uB4DC\uB9BD\uB2C8\uB2E4.",
  date: "2026\uB144 5\uC6D4 2\uC77C",
  presenter: "\uC0AC\uB791\uD558\uB294 \uAC00\uC871 \uC77C\uB3D9",
  stamp: "\uAC10\uC0AC\uCD95\uD558",
};

const adminDraftKey = "admin-template-config-draft";

function numberInput(label: string, value: number, onChange: (value: number) => void, step = 0.5) {
  return (
    <label className="block text-xs font-medium text-stone-600">
      {label}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
      />
    </label>
  );
}

export function AdminTemplates({ initialConfig }: { initialConfig: TemplateConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [variant, setVariant] = useState<TemplateVariant>("A");
  const [field, setField] = useState<FieldKey>("title");
  const [showBorder, setShowBorder] = useState(true);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [interactionMode, setInteractionMode] = useState<"move" | "text">("move");
  const [sampleData, setSampleData] = useState(sample);
  const [message, setMessage] = useState("");
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const variantConfig = config.variants[variant];
  const layout = variantConfig.fields[field];

  useEffect(() => {
    const draft = window.localStorage.getItem(adminDraftKey);
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft) as { savedAt: string; config: TemplateConfig };
      const draftTime = new Date(parsed.savedAt).getTime();
      const serverTime = new Date(initialConfig.updatedAt).getTime();
      if (draftTime > serverTime) {
        setConfig(parsed.config);
        setMessage(text.draftRestored);
      }
    } catch {
      window.localStorage.removeItem(adminDraftKey);
    }
  }, [initialConfig.updatedAt]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      window.localStorage.setItem(adminDraftKey, JSON.stringify({ savedAt, config }));
      setDraftSavedAt(new Date(savedAt).toLocaleTimeString());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [config]);

  const updateLayout = (targetVariant: TemplateVariant, targetField: FieldKey, patch: Partial<FieldLayout>) => {
    setConfig((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [targetVariant]: {
          ...prev.variants[targetVariant],
          fields: {
            ...prev.variants[targetVariant].fields,
            [targetField]: {
              ...prev.variants[targetVariant].fields[targetField],
              ...patch,
            },
          },
        },
      },
    }));
  };

  const updateVariant = (patch: Partial<TemplateVariantConfig>) => {
    setConfig((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [variant]: { ...prev.variants[variant], ...patch },
      },
    }));
  };

  const save = async () => {
    setMessage(text.saving);
    const response = await fetch("/api/admin/template-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const saved = await response.json();
    setConfig(saved);
    window.localStorage.removeItem(adminDraftKey);
    setMessage(response.ok ? text.saved : text.saveFailed);
  };

  const testPdf = async () => {
    setMessage(text.testCreating);
    const response = await fetch("/api/admin/test-pdf", { method: "POST" });
    const result = await response.json();
    setMessage(response.ok ? `\uD14C\uC2A4\uD2B8 PDF \uC0DD\uC131 \uC644\uB8CC: ${result.pdfAPath}, ${result.pdfBPath}` : text.testFailed);
  };

  const copyAToB = () => {
    setConfig((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        B: {
          ...prev.variants.B,
          fields: JSON.parse(JSON.stringify(prev.variants.A.fields)),
          adminBackgroundUrl: prev.variants.A.adminBackgroundUrl,
          adminBackgroundOpacity: prev.variants.A.adminBackgroundOpacity,
        },
      },
    }));
    setMessage(text.copied);
  };

  const updateSample = (targetField: keyof typeof sample, value: string) => {
    setSampleData((prev) => ({ ...prev, [targetField]: value }));
  };

  const centerSelectedField = (axis: "x" | "y" | "both") => {
    const patch: Partial<FieldLayout> = {};
    if (axis === "x" || axis === "both") {
      patch.xMm = Number(((210 - layout.widthMm) / 2).toFixed(1));
    }
    if (axis === "y" || axis === "both") {
      patch.yMm = Number(((297 - layout.heightMm) / 2).toFixed(1));
    }
    updateLayout(variant, field, patch);
  };

  const spacingRuleEntries = Object.entries(layout.autoSpacing.rules)
    .filter(([key]) => key !== "default")
    .sort(([a], [b]) => Number(a) - Number(b));

  const updateSpacingRule = (oldKey: string, nextKey: string, nextValue: number) => {
    const rules = { ...layout.autoSpacing.rules };
    delete rules[oldKey];
    if (nextKey.trim()) {
      rules[nextKey.trim()] = Math.max(0, nextValue);
    }
    updateLayout(variant, field, { autoSpacing: { ...layout.autoSpacing, rules } });
  };

  const addSpacingRule = () => {
    const numericKeys = spacingRuleEntries.map(([key]) => Number(key)).filter(Number.isFinite);
    const nextKey = String((numericKeys.length ? Math.max(...numericKeys) : 1) + 1);
    updateLayout(variant, field, {
      autoSpacing: {
        ...layout.autoSpacing,
        rules: { ...layout.autoSpacing.rules, [nextKey]: 0 },
      },
    });
  };

  const removeSpacingRule = (key: string) => {
    const rules = { ...layout.autoSpacing.rules };
    delete rules[key];
    updateLayout(variant, field, { autoSpacing: { ...layout.autoSpacing, rules } });
  };

  return (
    <main className="grid min-h-screen gap-4 p-3 lg:grid-cols-[220px_minmax(0,1fr)_340px] lg:p-5">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-bold">{text.title}</h1>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["A", "B"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setVariant(item)}
              className={`rounded-md px-3 py-2 font-semibold ${variant === item ? "bg-stone-950 text-white" : "border border-stone-300 bg-white"}`}
            >
              {item}\uC548
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showBorder} onChange={(event) => setShowBorder(event.target.checked)} />
          {text.showBackground}
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showPlaceholders} onChange={(event) => setShowPlaceholders(event.target.checked)} />
          {text.showPlaceholders}
        </label>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setInteractionMode("text")}
            className={`rounded px-2 py-2 text-sm font-semibold ${interactionMode === "text" ? "bg-white shadow-sm" : "text-stone-600"}`}
          >
            {text.textMode}
          </button>
          <button
            type="button"
            onClick={() => setInteractionMode("move")}
            className={`rounded px-2 py-2 text-sm font-semibold ${interactionMode === "move" ? "bg-white shadow-sm" : "text-stone-600"}`}
          >
            {text.moveMode}
          </button>
        </div>
        <div className="mt-4 space-y-1">
          {fields.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setField(item)}
              className={`w-full rounded px-3 py-2 text-left text-sm ${field === item ? "bg-amber-100 font-semibold" : "hover:bg-stone-100"}`}
            >
              {labels[item]}
            </button>
          ))}
        </div>
        <button type="button" onClick={copyAToB} className="mt-4 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">
          {text.copy}
        </button>
      </aside>

      <section className="min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold">{variant}\uC548 \uC704\uCE58 \uC870\uC815</h2>
          <span className="text-sm text-stone-600">{interactionMode === "text" ? text.textHint : text.moveHint}</span>
        </div>
        {interactionMode === "move" && <div className="mb-2 rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-900">{text.keyboardHint}</div>}
        <CertificateCanvas
          data={showPlaceholders ? EMPTY_FORM : sampleData}
          config={config}
          variant={variant}
          mode="admin"
          adminInteractionMode={interactionMode}
          activeField={field}
          showBorder={showBorder}
          onChange={updateSample}
          onFocusField={setField}
          onLayoutChange={updateLayout}
        />
      </section>

      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-5 lg:h-fit">
        <h2 className="font-bold">{labels[field]} \uC124\uC815</h2>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <label className="block text-xs font-medium text-stone-700">
            {text.backgroundUrl}
            <input
              value={variantConfig.adminBackgroundUrl ?? ""}
              onChange={(event) => updateVariant({ adminBackgroundUrl: event.target.value })}
              placeholder="/assets/reference-a.png"
              className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
            />
          </label>
          <p className="mt-1 text-xs text-stone-600">{text.backgroundHelp}</p>
          <label className="mt-3 block text-xs font-medium text-stone-700">
            {text.backgroundOpacity}: {Math.round((variantConfig.adminBackgroundOpacity ?? 0.45) * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={variantConfig.adminBackgroundOpacity ?? 0.45}
              onChange={(event) => updateVariant({ adminBackgroundOpacity: Number(event.target.value) })}
              className="mt-1 w-full"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {numberInput("\uC67C\uCABD \uC704\uCE58(mm)", layout.xMm, (value) => updateLayout(variant, field, { xMm: value }))}
          {numberInput("\uC704\uCABD \uC704\uCE58(mm)", layout.yMm, (value) => updateLayout(variant, field, { yMm: value }))}
          {numberInput("\uBC15\uC2A4 \uB108\uBE44(mm)", layout.widthMm, (value) => updateLayout(variant, field, { widthMm: value }))}
          {numberInput("\uBC15\uC2A4 \uB192\uC774(mm)", layout.heightMm, (value) => updateLayout(variant, field, { heightMm: value }))}
          {numberInput("\uD3F0\uD2B8 \uD06C\uAE30(pt)", layout.fontSizePt, (value) => updateLayout(variant, field, { fontSizePt: value }), 1)}
          {numberInput("\uD589\uAC04", layout.lineHeight, (value) => updateLayout(variant, field, { lineHeight: value }), 0.05)}
          {numberInput("\uC790\uAC04(mm)", layout.letterSpacing, (value) => updateLayout(variant, field, { letterSpacing: value }), 0.1)}
          {numberInput("\uCD9C\uB825 \uC804\uCCB4 \uC67C\uCABD \uBCF4\uC815(mm)", variantConfig.globalOffsetXmm, (value) => updateVariant({ globalOffsetXmm: value }))}
          {numberInput("\uCD9C\uB825 \uC804\uCCB4 \uC704\uCABD \uBCF4\uC815(mm)", variantConfig.globalOffsetYmm, (value) => updateVariant({ globalOffsetYmm: value }))}
        </div>

        <div className="mt-4 rounded-md border border-sky-200 bg-sky-50 p-3">
          <div className="text-xs font-semibold text-sky-900">{text.centerOnPage}</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => centerSelectedField("x")} className="rounded border border-sky-200 bg-white px-2 py-2 text-xs font-semibold">
              {text.horizontalCenter}
            </button>
            <button type="button" onClick={() => centerSelectedField("y")} className="rounded border border-sky-200 bg-white px-2 py-2 text-xs font-semibold">
              {text.verticalCenter}
            </button>
            <button type="button" onClick={() => centerSelectedField("both")} className="rounded border border-sky-200 bg-white px-2 py-2 text-xs font-semibold">
              {text.bothCenter}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-stone-600">
            {text.fontPreset}
            <select
              value={fontOptions.some((option) => option.value === layout.fontFamily) ? layout.fontFamily : "__custom__"}
              onChange={(event) => {
                if (event.target.value !== "__custom__") {
                  updateLayout(variant, field, { fontFamily: event.target.value });
                }
              }}
              className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
            >
              {fontOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-stone-600">
            {text.customFont}
            <input
              value={layout.fontFamily}
              onChange={(event) => updateLayout(variant, field, { fontFamily: event.target.value })}
              className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-stone-600">
            {text.fontWeight}
            <input value={layout.fontWeight} onChange={(event) => updateLayout(variant, field, { fontWeight: event.target.value })} className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm" />
          </label>
          <label className="block text-xs font-medium text-stone-600">
            {text.align}
            <select value={layout.textAlign} onChange={(event) => updateLayout(variant, field, { textAlign: event.target.value as FieldLayout["textAlign"] })} className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm">
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-stone-600">
            {text.verticalAlign}
            <select value={layout.verticalAlign} onChange={(event) => updateLayout(variant, field, { verticalAlign: event.target.value as FieldLayout["verticalAlign"] })} className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm">
              <option value="top">top</option>
              <option value="middle">middle</option>
              <option value="bottom">bottom</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-stone-600">
            placeholder
            <input value={layout.placeholder} onChange={(event) => updateLayout(variant, field, { placeholder: event.target.value })} className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm" />
          </label>
          <label className="block text-xs font-medium text-stone-600">
            {text.helpText}
            <textarea value={layout.helpText} onChange={(event) => updateLayout(variant, field, { helpText: event.target.value })} className="mt-1 h-20 w-full resize-none rounded border border-stone-300 px-2 py-1.5 text-sm" />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={layout.required} onChange={(event) => updateLayout(variant, field, { required: event.target.checked })} />{text.required}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={layout.visibleInPreview} onChange={(event) => updateLayout(variant, field, { visibleInPreview: event.target.checked })} />{text.preview}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={layout.visibleInPrint} onChange={(event) => updateLayout(variant, field, { visibleInPrint: event.target.checked })} />{text.print}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={layout.autoSpacing.enabled} onChange={(event) => updateLayout(variant, field, { autoSpacing: { ...layout.autoSpacing, enabled: event.target.checked } })} />{text.autoSpacing}</label>
        </div>

        <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
          <div className="text-xs font-semibold text-stone-700">{text.spacingRules}</div>
          <div className="mt-2 grid grid-cols-[1fr_1fr_56px] gap-2 text-xs font-medium text-stone-500">
            <div>{text.charCount}</div>
            <div>{text.spaceCount}</div>
            <div />
          </div>
          <div className="mt-1 space-y-2">
            {spacingRuleEntries.map(([key, value]) => (
              <div key={key} className="grid grid-cols-[1fr_1fr_56px] gap-2">
                <input
                  type="number"
                  min="1"
                  value={key}
                  onChange={(event) => updateSpacingRule(key, event.target.value, Number(value))}
                  className="rounded border border-stone-300 px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(event) => updateSpacingRule(key, key, Number(event.target.value))}
                  className="rounded border border-stone-300 px-2 py-1.5 text-sm"
                />
                <button type="button" onClick={() => removeSpacingRule(key)} className="rounded border border-stone-300 bg-white px-2 text-xs">
                  {text.remove}
                </button>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_1fr_56px] gap-2">
              <div className="rounded border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-600">{text.defaultRule}</div>
              <input
                type="number"
                min="0"
                value={layout.autoSpacing.rules.default ?? 0}
                onChange={(event) =>
                  updateLayout(variant, field, {
                    autoSpacing: {
                      ...layout.autoSpacing,
                      rules: { ...layout.autoSpacing.rules, default: Math.max(0, Number(event.target.value)) },
                    },
                  })
                }
                className="rounded border border-stone-300 px-2 py-1.5 text-sm"
              />
              <div />
            </div>
          </div>
          <button type="button" onClick={addSpacingRule} className="mt-3 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold">
            {text.addRule}
          </button>
        </div>

        {message && <div className="mt-3 rounded bg-stone-100 p-2 text-xs text-stone-700">{message}</div>}
        {draftSavedAt && <div className="mt-2 text-xs text-stone-500">{text.draftSaved}: {draftSavedAt}</div>}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={save} className="rounded-md bg-stone-950 px-3 py-2 font-semibold text-white">{text.save}</button>
          <button type="button" onClick={testPdf} className="rounded-md border border-stone-300 px-3 py-2 font-semibold">{text.testPdf}</button>
        </div>
      </aside>
    </main>
  );
}
