"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { CertificateCanvas } from "@/components/CertificateCanvas";
import { StampPicker } from "@/components/StampPicker";
import type { CertificateFormData, FieldKey, FieldOverflow, TemplateConfig, ValidationError } from "@/lib/types";
import { createOrderNumber, EMPTY_FORM, validateCertificateData } from "@/lib/validation";
import type { SiteConfig, SiteStepConfig } from "@/lib/site-config";

type StepKey = "email" | "autoSpacing" | FieldKey;
type FlowStep = SiteStepConfig & { key: StepKey };

const textFieldKeys = new Set<FieldKey>(["certificateNo", "title", "awardCategory", "recipient", "body", "date", "presenter"]);

function isFieldKey(key: StepKey): key is FieldKey {
  return key !== "email" && key !== "autoSpacing";
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
}

export function CustomerEditor({ initialConfig, siteConfig }: { initialConfig: TemplateConfig; siteConfig: SiteConfig }) {
  const router = useRouter();
  const certificateAreaRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<CertificateFormData>(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");
  const [activeField, setActiveField] = useState<FieldKey | undefined>(undefined);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [overflows, setOverflows] = useState<FieldOverflow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [guidePopupStep, setGuidePopupStep] = useState<FlowStep | null>(null);
  const [showMobileFontNotice, setShowMobileFontNotice] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  const steps = useMemo(() => siteConfig.create.steps as FlowStep[], [siteConfig.create.steps]);
  const flowSteps = useMemo(() => steps.filter((step) => step.key !== "autoSpacing"), [steps]);
  const currentStep = flowSteps[stepIndex] ?? flowSteps[0];
  const autoSpacingStep = steps.find((step) => step.key === "autoSpacing");
  const autoSpacingOn = data.autoSpacingEnabled !== false;

  useEffect(() => {
    const saved = window.localStorage.getItem("certificate-form");
    if (saved) setData({ ...EMPTY_FORM, ...JSON.parse(saved) });
    if (isMobileViewport() && window.sessionStorage.getItem("mobile-font-notice-seen") !== "1") {
      setShowMobileFontNotice(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("certificate-form", JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    const key = currentStep?.key;
    if (key && isFieldKey(key)) setActiveField(key);
    else setActiveField(undefined);
    setShowMobileGuide(false);
  }, [currentStep?.key]);

  const errorFields = useMemo(() => new Set(errors.map((error) => error.field).concat(overflows.map((item) => item.field))), [errors, overflows]);

  const setField = (field: keyof CertificateFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((error) => error.field !== field));
    setOverflows((prev) => prev.filter((item) => item.field !== field));
  };

  const focusStepInput = (step: FlowStep) => {
    if (!isFieldKey(step.key)) return;
    const target = certificateAreaRef.current?.querySelector(`[data-variant="${activeVariant}"] [data-field-box="${step.key}"]`);
    const input = target?.querySelector("textarea, input, [contenteditable='true']") as HTMLTextAreaElement | HTMLInputElement | HTMLElement | null;
    input?.focus({ preventScroll: true });
    if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }
  };

  const scrollToMobileTarget = (step: FlowStep, options: { focus?: boolean } = {}) => {
    if (!isMobileViewport()) return;

    window.setTimeout(() => {
      if (step.key === "stamp") {
        document.getElementById("mobile-stamp-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (isFieldKey(step.key)) {
        const target = certificateAreaRef.current?.querySelector(`[data-variant="${activeVariant}"] [data-field-box="${step.key}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        if (options.focus) {
          focusStepInput(step);
        }
        return;
      }

      certificateAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const canGoNext = () => {
    const key = currentStep.key;
    if (currentStep.optional) return true;
    if (key === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (key === "stamp") return Boolean(data.stamp);
    if (isFieldKey(key)) return Boolean(String(data[key] ?? "").trim());
    return true;
  };

  const showStepError = () => {
    const field = currentStep.key === "email" ? "email" : (currentStep.key as keyof CertificateFormData);
    setErrors([{ field, message: `${currentStep.title}을(를) 입력해주세요.` }]);
  };

  const goToStep = (index: number, showGuide = false) => {
    const nextIndex = Math.min(flowSteps.length - 1, Math.max(0, index));
    const nextStep = flowSteps[nextIndex];
    const nextActiveField = nextStep && isFieldKey(nextStep.key) ? nextStep.key : undefined;
    if (isMobileViewport()) {
      flushSync(() => {
        setStepIndex(nextIndex);
        setActiveField(nextActiveField);
      });
    } else {
      setStepIndex(nextIndex);
      setActiveField(nextActiveField);
    }

    if (nextStep) {
      if (isMobileViewport()) focusStepInput(nextStep);
      scrollToMobileTarget(nextStep, { focus: isFieldKey(nextStep.key) });
      if (showGuide && nextStep.key === "stamp" && isMobileViewport()) setGuidePopupStep(nextStep);
    }
  };

  const nextStep = () => {
    if (!canGoNext()) {
      showStepError();
      scrollToMobileTarget(currentStep);
      return;
    }
    setErrors([]);
    goToStep(stepIndex + 1, true);
  };

  const previousStep = () => {
    setErrors([]);
    goToStep(stepIndex - 1);
  };

  const startReview = () => {
    const nextData = { ...data, orderNumber: data.orderNumber || createOrderNumber() };
    const localErrors = validateCertificateData(nextData, initialConfig);
    setData(nextData);
    setErrors(localErrors);
    if (localErrors.length) {
      const firstErrorIndex = flowSteps.findIndex((step) => step.key === localErrors[0]?.field);
      if (firstErrorIndex >= 0) goToStep(firstErrorIndex);
      return;
    }
    setShowPolicy(true);
  };

  const agreeAndReview = async () => {
    const nextData = { ...data, orderNumber: data.orderNumber || createOrderNumber() };
    setSubmitting(true);
    setOverflows([]);
    try {
      const response = await fetch("/api/orders/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setErrors(result.validationErrors ?? []);
        setOverflows(result.overflows ?? []);
        setShowPolicy(false);
        return;
      }
      window.localStorage.setItem("certificate-form", JSON.stringify(nextData));
      window.sessionStorage.setItem("certificate-review", JSON.stringify(nextData));
      router.push("/review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepControl = () => {
    const key = currentStep.key;

    if (key === "email") {
      return (
        <label className="block">
          <span className="text-sm font-bold text-stone-800">이메일</span>
          <input
            value={data.email}
            onChange={(event) => setField("email", event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-3 text-base outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
            placeholder="customer@example.com"
            inputMode="email"
            autoComplete="email"
          />
        </label>
      );
    }

    if (key === "stamp") {
      return (
        <div>
          <div className="mb-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
            PC에서는 여기서 도장을 선택할 수 있습니다. 모바일에서는 상장 아래 큰 선택 화면에서 골라주세요.
          </div>
          <div className="hidden lg:block">
            <StampPicker value={data.stamp} onChange={(value) => setField("stamp", value)} />
          </div>
        </div>
      );
    }

    if (isFieldKey(key) && textFieldKeys.has(key)) {
      const value = String(data[key] ?? "").trim();
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-bold text-amber-900">상장 위에서 직접 입력</div>
          <p className="mt-2 text-base leading-7 text-stone-800">
            중앙 상장 화면에서 강조된 입력 박스를 눌러 {currentStep.title}을(를) 작성해주세요.
          </p>
          <div className="mt-3 rounded-md bg-white/70 p-3 text-sm leading-6 text-stone-700">
            {value ? <span className="whitespace-pre-line">{value}</span> : <span className="text-stone-500">아직 입력된 내용이 없습니다.</span>}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderActionButton = () =>
    stepIndex === flowSteps.length - 1 ? (
      <button type="button" onClick={startReview} className="rounded-md bg-stone-950 px-4 py-3 font-bold text-white">
        검수하기
      </button>
    ) : (
      <button type="button" onClick={nextStep} className="rounded-md bg-stone-950 px-4 py-3 font-bold text-white">
        확인 / 다음
      </button>
    );

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto grid max-w-[1560px] gap-4 p-3 pb-28 lg:grid-cols-[320px_minmax(0,1fr)_300px] lg:p-5 lg:pb-5">
        <aside className="space-y-3 lg:sticky lg:top-5 lg:h-fit">
          <section className="rounded-md border border-stone-300 bg-white shadow-sm">
            <div className="border-b border-stone-200 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Step {stepIndex + 1} / {flowSteps.length}
              </div>
              <h1 className="mt-1 text-xl font-black">{currentStep.title}</h1>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-stone-700">{currentStep.description}</p>
            </div>
            <div className="p-4">
              {renderStepControl()}
              {(errors.length > 0 || overflows.length > 0) && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                  {errors.map((error) => (
                    <div key={`${error.field}-${error.message}`}>{error.message}</div>
                  ))}
                  {overflows.map((overflow) => (
                    <div key={`${overflow.variant}-${overflow.field}`}>{overflow.message}</div>
                  ))}
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={previousStep} className="rounded-md border border-stone-300 px-3 py-3 font-bold disabled:opacity-40" disabled={stepIndex === 0}>
                  이전
                </button>
                {renderActionButton()}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-amber-300 bg-amber-50 p-4 shadow-sm">
            <div className="text-sm font-black text-amber-950">{autoSpacingStep?.title ?? "자동 자간 조정"}</div>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-700">
              {autoSpacingStep?.description ?? "짧은 문구의 글자 사이를 보기 좋게 자동 조정합니다."}
            </p>
            <button
              type="button"
              onClick={() => setData((prev) => ({ ...prev, autoSpacingEnabled: !autoSpacingOn }))}
              className={`mt-3 flex w-full items-center justify-between rounded-md border px-4 py-3 font-black transition ${
                autoSpacingOn ? "border-amber-500 bg-white text-amber-900" : "border-stone-300 bg-white text-stone-600"
              }`}
            >
              <span>{autoSpacingOn ? "자동 자간 ON" : "자동 자간 OFF"}</span>
              <span className={`h-7 w-12 rounded-full p-1 ${autoSpacingOn ? "bg-amber-500" : "bg-stone-300"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${autoSpacingOn ? "translate-x-5" : ""}`} />
              </span>
            </button>
          </section>
        </aside>

        <section ref={certificateAreaRef} className="min-w-0 rounded-md border border-stone-300 bg-white p-3 shadow-sm lg:p-4">
          <div className="mb-4 flex flex-col gap-3 border-b border-stone-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-amber-700">Certificate</div>
              <h2 className="text-xl font-black">{siteConfig.create.pageTitle}</h2>
              <p className="mt-1 whitespace-pre-line text-base leading-7 text-stone-700">{siteConfig.create.pageDescription}</p>
            </div>
            <div className="flex rounded-md border border-stone-200 bg-stone-50 p-1 lg:hidden">
              {(["A", "B"] as const).map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => setActiveVariant(variant)}
                  className={`rounded px-4 py-2 text-sm font-semibold ${activeVariant === variant ? "bg-stone-950 text-white" : "text-stone-700"}`}
                >
                  {variant}안
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            {(["A", "B"] as const).map((variant) => (
              <div key={variant} className={activeVariant === variant ? "block" : "hidden lg:block"}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold">{variant}안 편집</h3>
                  <span className="text-sm font-medium text-stone-500">{siteConfig.create.aBNotice}</span>
                </div>
                <CertificateCanvas
                  data={data}
                  config={initialConfig}
                  variant={variant}
                  mode="edit"
                  activeField={activeField}
                  errors={errorFields}
                  onChange={setField}
                  onFocusField={(field) => {
                    setActiveVariant(variant);
                    setActiveField(field);
                    const idx = flowSteps.findIndex((step) => step.key === field);
                    if (idx >= 0) setStepIndex(idx);
                  }}
                  onClearActiveField={() => setActiveField(undefined)}
                />
              </div>
            ))}
          </div>

          {currentStep.key === "stamp" && (
            <section id="mobile-stamp-picker" className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 lg:hidden">
              <h3 className="text-lg font-black">도장 선택</h3>
              <p className="mt-1 text-sm leading-6 text-stone-700">도장 이미지를 크게 보고 선택해주세요.</p>
              <div className="mt-3">
                <StampPicker value={data.stamp} onChange={(value) => setField("stamp", value)} size="large" />
              </div>
            </section>
          )}
        </section>

        <aside className="rounded-md border border-amber-300 bg-amber-50 shadow-sm lg:sticky lg:top-5 lg:h-fit">
          <div className="border-b border-amber-200 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-800">Guide</div>
            <h2 className="mt-1 text-xl font-black">{currentStep.title}</h2>
          </div>
          <div className="p-4">
            <p className="whitespace-pre-line text-lg leading-8 text-stone-900">{currentStep.description}</p>
            <ol className="mt-5 space-y-2 text-sm text-stone-700">
              {flowSteps.map((step, index) => (
                <li key={step.key} className={index === stepIndex ? "font-black text-stone-950" : ""}>
                  {index + 1}. {step.title}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[116px] z-30 px-3 lg:hidden">
        <section className="mx-auto max-w-md rounded-md border border-amber-300 bg-amber-50/95 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={() => setShowMobileGuide((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-amber-800">GUIDE</span>
              <span className="block text-base font-black text-stone-950">{currentStep.title}</span>
            </span>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-stone-700">
              {showMobileGuide ? "접기" : "설명 보기"}
            </span>
          </button>
          {showMobileGuide && (
            <div className="border-t border-amber-200 px-4 pb-4 text-base leading-7 text-stone-900">
              <p className="whitespace-pre-line">{currentStep.description}</p>
            </div>
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-300 bg-white/95 p-3 shadow-2xl lg:hidden">
        <button
          type="button"
          onClick={() => setData((prev) => ({ ...prev, autoSpacingEnabled: !autoSpacingOn }))}
          className={`mb-2 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-black ${
            autoSpacingOn ? "border-amber-500 bg-amber-50 text-amber-900" : "border-stone-300 bg-white text-stone-600"
          }`}
        >
          <span>자동 자간 {autoSpacingOn ? "ON" : "OFF"}</span>
          <span className={`h-6 w-11 rounded-full p-1 ${autoSpacingOn ? "bg-amber-500" : "bg-stone-300"}`}>
            <span className={`block h-4 w-4 rounded-full bg-white transition ${autoSpacingOn ? "translate-x-5" : ""}`} />
          </span>
        </button>
        <div className="grid grid-cols-[96px_1fr] gap-2">
          <button type="button" onClick={previousStep} className="rounded-md border border-stone-300 px-3 py-3 font-bold disabled:opacity-40" disabled={stepIndex === 0}>
            이전
          </button>
          {renderActionButton()}
        </div>
      </div>

      {showMobileFontNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 lg:hidden">
          <section className="w-full max-w-sm rounded-md bg-white p-5 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-700">FONT NOTICE</div>
            <h2 className="mt-1 text-2xl font-black">모바일 서체 안내</h2>
            <div className="mt-3 space-y-2 text-base leading-7 text-stone-800">
              <p>모바일 기기에서는 상장 미리보기의 궁서체가 완전히 동일하게 보이지 않을 수 있습니다.</p>
              <p>더 정확한 위치와 서체 느낌을 확인하려면 PC에서 제작하시는 것을 권장드립니다.</p>
              <p className="font-bold text-stone-950">최종 PDF는 기존 자동화 기준의 궁서 폰트로 제작됩니다.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.setItem("mobile-font-notice-seen", "1");
                setShowMobileFontNotice(false);
              }}
              className="mt-5 w-full rounded-md bg-stone-950 px-4 py-3 font-bold text-white"
            >
              확인했습니다
            </button>
          </section>
        </div>
      )}

      {guidePopupStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:hidden">
          <section className="w-full max-w-sm rounded-md bg-white p-5 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-700">다음 입력 안내</div>
            <h2 className="mt-1 text-2xl font-black">{guidePopupStep.title}</h2>
            <p className="mt-3 whitespace-pre-line text-lg leading-8 text-stone-800">{guidePopupStep.description}</p>
            <button
              type="button"
              onClick={() => {
                setGuidePopupStep(null);
                scrollToMobileTarget(guidePopupStep);
              }}
              className="mt-5 w-full rounded-md bg-stone-950 px-4 py-3 font-bold text-white"
            >
              확인
            </button>
          </section>
        </div>
      )}

      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section className="w-full max-w-lg rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-xl font-black">{siteConfig.create.policyTitle}</h2>
            <div className="mt-3 space-y-2 text-base leading-7 text-stone-700">
              {siteConfig.create.policyItems.map((item) => (
                <p key={item} className="whitespace-pre-line">
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowPolicy(false)} className="rounded-md border border-stone-300 px-4 py-3 font-bold">
                {siteConfig.create.policyCancelLabel}
              </button>
              <button type="button" onClick={agreeAndReview} disabled={submitting} className="rounded-md bg-stone-950 px-4 py-3 font-bold text-white disabled:opacity-60">
                {submitting ? "확인 중..." : siteConfig.create.policyAgreeLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
