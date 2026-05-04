"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CertificateCanvas } from "@/components/CertificateCanvas";
import type { CertificateFormData, FieldOverflow, TemplateConfig, ValidationError } from "@/lib/types";
import { EMPTY_FORM } from "@/lib/validation";

export function ReviewClient({ initialConfig }: { initialConfig: TemplateConfig }) {
  const router = useRouter();
  const [data, setData] = useState<CertificateFormData | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [overflows, setOverflows] = useState<FieldOverflow[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("certificate-review") || window.localStorage.getItem("certificate-form");
    if (saved) setData({ ...EMPTY_FORM, ...JSON.parse(saved) });
    else router.replace("/create");
  }, [router]);

  const errorFields = useMemo(() => new Set(errors.map((error) => error.field).concat(overflows.map((item) => item.field))), [errors, overflows]);

  const backToEdit = () => {
    if (!data) return;
    window.localStorage.setItem("certificate-form", JSON.stringify(data));
    window.sessionStorage.setItem("certificate-review", JSON.stringify(data));
    router.push("/create");
  };

  const submit = async () => {
    if (!data) return;
    setStatus("submitting");
    setMessage("입력하신 내용을 접수중입니다.");

    const response = await fetch("/api/orders/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const text = await response.text();
    let result;
    try {
      result = text ? JSON.parse(text) : { ok: false, message: "서버 응답이 비어 있습니다. 다시 시도해주세요." };
    } catch {
      result = { ok: false, message: "서버 응답을 읽지 못했습니다. 다시 시도해주세요." };
    }

    if (!response.ok || !result.ok) {
      setErrors(result.validationErrors ?? []);
      setOverflows(result.overflows ?? []);
      setStatus("idle");
      setMessage(result.message ?? "수정이 필요한 항목이 있습니다.");
      return;
    }

    setStatus("done");
    setMessage(result.webhookStatus === "sent" ? "접수가 완료되었습니다. 이메일로 완성 파일이 발송됩니다." : result.message ?? "접수가 완료되었습니다. 이메일로 완성 파일이 발송됩니다.");
  };

  if (!data) return <main className="p-6">검수 데이터를 불러오는 중입니다.</main>;

  return (
    <main className="min-h-screen bg-[#f6f3ee] p-3 pb-24 lg:p-6">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-3 rounded-md border border-stone-300 bg-white p-4 shadow-sm lg:mb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-amber-700">Final Review</div>
              <h1 className="mt-1 text-2xl font-black">최종 검수</h1>
              <p className="mt-2 text-base leading-7 text-stone-700">
                아래 미리보기는 위치 확인용입니다. 내용을 확인한 뒤 제출하면 완성 파일이 이메일로 발송됩니다.
              </p>
            </div>
            <div className="hidden flex-wrap gap-2 lg:flex">
              <button type="button" onClick={backToEdit} className="rounded-md border border-stone-300 bg-white px-4 py-2 font-semibold">
                수정하기
              </button>
              <button type="button" onClick={submit} disabled={status === "submitting"} className="rounded-md bg-stone-950 px-4 py-2 font-semibold text-white disabled:opacity-60">
                {status === "submitting" ? "제출 중..." : status === "done" ? "다시 제출하기" : "제출하기"}
              </button>
            </div>
          </div>
        </header>

        <section className="mb-3 grid gap-3 lg:mb-4">
          <div className="rounded-md border border-amber-300 bg-amber-50 p-4">
            <div className="text-sm font-bold text-amber-900">이메일 확인</div>
            <div className="mt-1 break-all text-xl font-bold text-stone-950">{data.email}</div>
            <p className="mt-2 text-base leading-7 text-stone-700">완성된 상장 PDF를 받을 이메일입니다.</p>
          </div>
        </section>

        {(message || errors.length > 0 || overflows.length > 0) && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-base leading-7 text-amber-900">
            {message && <div>{message}</div>}
            {errors.map((error) => (
              <div key={`${error.field}-${error.message}`}>{error.message}</div>
            ))}
            {overflows.map((overflow) => (
              <div key={`${overflow.variant}-${overflow.field}`}>{overflow.message}</div>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {(["A", "B"] as const).map((variant) => (
            <section key={variant} className="rounded-md border border-stone-300 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-bold">{variant}안 위치 검수</h2>
                <span className="text-xs font-semibold text-stone-500">미리보기용</span>
              </div>
              <CertificateCanvas data={data} config={initialConfig} variant={variant} mode="review" errors={errorFields} showBorder mobileOverview />
            </section>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[110px_1fr] gap-2 border-t border-stone-300 bg-white/95 p-3 shadow-2xl lg:hidden">
        <button type="button" onClick={backToEdit} className="rounded-md border border-stone-300 bg-white px-3 py-3 font-bold">
          수정하기
        </button>
        <button type="button" onClick={submit} disabled={status === "submitting"} className="rounded-md bg-stone-950 px-3 py-3 font-bold text-white disabled:opacity-60">
          {status === "submitting" ? "제출 중..." : status === "done" ? "다시 제출하기" : "제출하기"}
        </button>
      </div>
    </main>
  );
}
