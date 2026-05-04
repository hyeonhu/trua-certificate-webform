"use client";

import { useState } from "react";
import type { SiteConfig } from "@/lib/site-config";

export function AdminSiteSettings({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [message, setMessage] = useState("");

  const updateHome = (patch: Partial<SiteConfig["home"]>) => {
    setConfig((prev) => ({ ...prev, home: { ...prev.home, ...patch } }));
  };

  const updateCreate = (patch: Partial<SiteConfig["create"]>) => {
    setConfig((prev) => ({ ...prev, create: { ...prev.create, ...patch } }));
  };

  const updateStep = (index: number, patch: Partial<SiteConfig["create"]["steps"][number]>) => {
    setConfig((prev) => ({
      ...prev,
      create: {
        ...prev.create,
        steps: prev.create.steps.map((step, itemIndex) => (itemIndex === index ? { ...step, ...patch } : step)),
      },
    }));
  };

  const updatePolicyItem = (index: number, value: string) => {
    setConfig((prev) => ({
      ...prev,
      create: {
        ...prev.create,
        policyItems: prev.create.policyItems.map((item, itemIndex) => (itemIndex === index ? value : item)),
      },
    }));
  };

  const save = async () => {
    setMessage("저장 중...");
    const response = await fetch("/api/admin/site-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setMessage(response.ok ? "저장되었습니다." : "저장에 실패했습니다.");
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] p-5">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 rounded-md border border-stone-300 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-black">사이트 문구/이미지 설정</h1>
          <p className="mt-1 text-sm text-stone-600">첫 페이지, 배너 이미지, 고객 단계별 안내 문구를 수정합니다.</p>
        </header>

        <section className="rounded-md border border-stone-300 bg-white p-4 shadow-sm">
          <h2 className="font-black">첫 페이지</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input label="상단 작은 문구" value={config.home.eyebrow} onChange={(value) => updateHome({ eyebrow: value })} />
            <Input label="메인 제목" value={config.home.title} onChange={(value) => updateHome({ title: value })} />
            <Input label="상장 만들기 버튼" value={config.home.primaryButtonLabel} onChange={(value) => updateHome({ primaryButtonLabel: value })} />
            <Input label="상장 구매 버튼" value={config.home.purchaseButtonLabel} onChange={(value) => updateHome({ purchaseButtonLabel: value })} />
            <Input label="쿠팡 상품 링크" value={config.home.purchaseUrl} onChange={(value) => updateHome({ purchaseUrl: value })} />
            <Input label="PC 배너 이미지 경로" value={config.home.desktopBannerSrc} onChange={(value) => updateHome({ desktopBannerSrc: value })} />
            <Input label="모바일 배너 이미지 경로" value={config.home.mobileBannerSrc} onChange={(value) => updateHome({ mobileBannerSrc: value })} />
            <Input label="이미지 교체 안내 문구" value={config.home.imageHelpText} onChange={(value) => updateHome({ imageHelpText: value })} />
          </div>
          <Textarea label="설명 문구" value={config.home.description} onChange={(value) => updateHome({ description: value })} />
        </section>

        <section className="mt-4 rounded-md border border-stone-300 bg-white p-4 shadow-sm">
          <h2 className="font-black">상장 만들기 페이지</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input label="페이지 제목" value={config.create.pageTitle} onChange={(value) => updateCreate({ pageTitle: value })} />
            <Input label="A/B 안내 문구" value={config.create.aBNotice} onChange={(value) => updateCreate({ aBNotice: value })} />
          </div>
          <Textarea label="페이지 설명" value={config.create.pageDescription} onChange={(value) => updateCreate({ pageDescription: value })} />

          <div className="mt-5 space-y-3">
            <h3 className="font-bold">단계별 안내</h3>
            {config.create.steps.map((step, index) => (
              <div key={step.key} className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 md:grid-cols-[180px_1fr]">
                <Input label={`${index + 1}. 제목`} value={step.title} onChange={(value) => updateStep(index, { title: value })} />
                <Textarea label="설명" value={step.description} onChange={(value) => updateStep(index, { description: value })} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-md border border-stone-300 bg-white p-4 shadow-sm">
          <h2 className="font-black">운영 정책 동의 문구</h2>
          <Input label="모달 제목" value={config.create.policyTitle} onChange={(value) => updateCreate({ policyTitle: value })} />
          <div className="mt-3 space-y-2">
            {config.create.policyItems.map((item, index) => (
              <Input key={index} label={`문구 ${index + 1}`} value={item} onChange={(value) => updatePolicyItem(index, value)} />
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Input label="취소 버튼" value={config.create.policyCancelLabel} onChange={(value) => updateCreate({ policyCancelLabel: value })} />
            <Input label="동의 버튼" value={config.create.policyAgreeLabel} onChange={(value) => updateCreate({ policyAgreeLabel: value })} />
          </div>
        </section>

        {message && <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-900">{message}</div>}
        <button type="button" onClick={save} className="mt-4 rounded-md bg-stone-950 px-5 py-3 font-bold text-white">
          저장
        </button>
      </div>
    </main>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-stone-600">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-stone-600">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-20 w-full resize-none rounded border border-stone-300 px-3 py-2 text-sm" />
    </label>
  );
}
