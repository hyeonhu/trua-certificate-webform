"use client";

import clsx from "clsx";
import { STAMP_OPTIONS } from "@/lib/stamps";

export function StampPicker({ value, onChange, size = "normal" }: { value: string; onChange: (value: string) => void; size?: "normal" | "large" }) {
  const large = size === "large";

  return (
    <div className="grid grid-cols-2 gap-2">
      {STAMP_OPTIONS.map((stamp) => (
        <button
          key={stamp.id}
          type="button"
          onClick={() => onChange(stamp.id)}
          className={clsx(
            large
              ? "flex flex-col items-center justify-center gap-2 rounded-md border bg-white p-3 text-center text-xs font-bold transition"
              : "flex items-center gap-2 rounded-md border bg-white p-2 text-left text-sm transition",
            value === stamp.id ? "border-amber-600 ring-2 ring-amber-200" : "border-stone-200 hover:border-stone-400",
          )}
        >
          <img src={stamp.src} alt="" className={large ? "h-20 w-20 object-contain" : "h-10 w-10 object-contain"} />
          <span className={large ? "leading-4 text-stone-700" : ""}>{stamp.label}</span>
        </button>
      ))}
    </div>
  );
}
