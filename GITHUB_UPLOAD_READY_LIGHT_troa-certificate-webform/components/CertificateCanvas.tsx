"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { CertificatePage } from "@/components/certificate/CertificatePage";
import type { CertificateFormData, FieldKey, FieldLayout, TemplateConfig, TemplateVariant, TextFieldKey } from "@/lib/types";

const textFields: TextFieldKey[] = ["certificateNo", "title", "awardCategory", "recipient", "body", "date", "presenter"];
const MM_TO_PX = 96 / 25.4;

interface Props {
  data: CertificateFormData;
  config: TemplateConfig;
  variant: TemplateVariant;
  mode: "edit" | "review" | "admin";
  adminInteractionMode?: "move" | "text";
  errors?: Set<string>;
  activeField?: FieldKey;
  showBorder?: boolean;
  mobileOverview?: boolean;
  onChange?: (field: keyof CertificateFormData, value: string) => void;
  onFocusField?: (field: FieldKey) => void;
  onClearActiveField?: () => void;
  onLayoutChange?: (variant: TemplateVariant, field: FieldKey, patch: Partial<FieldLayout>) => void;
}

export function CertificateCanvas({
  data,
  config,
  variant,
  mode,
  adminInteractionMode = "move",
  errors,
  activeField,
  showBorder = true,
  mobileOverview = false,
  onChange,
  onFocusField,
  onClearActiveField,
  onLayoutChange,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ field: FieldKey; startX: number; startY: number; x: number; y: number } | null>(null);
  const resizeRef = useRef<{ field: FieldKey; startX: number; startY: number; width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const variantConfig = config.variants[variant];

  useEffect(() => {
    const updateScale = () => {
      if (!outerRef.current || !pageRef.current) return;
      const outerWidth = outerRef.current.clientWidth;
      const pageWidth = pageRef.current.offsetWidth;
      const pageHeight = pageRef.current.offsetHeight;
      if (!outerWidth || !pageWidth || !pageHeight) return;
      const widthScale = outerWidth / pageWidth;
      const overviewScale =
        mobileOverview && window.matchMedia("(max-width: 1023px)").matches
          ? (window.innerHeight * 0.52) / pageHeight
          : 1;
      setScale(Math.min(1, Math.max(0.18, Math.min(widthScale, overviewScale))));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (outerRef.current) observer.observe(outerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [variant, mode, mobileOverview]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!onLayoutChange) return;
      const drag = dragRef.current;
      const resize = resizeRef.current;

      if (drag) {
        const dxMm = (event.clientX - drag.startX) / scale / MM_TO_PX;
        const dyMm = (event.clientY - drag.startY) / scale / MM_TO_PX;
        onLayoutChange(variant, drag.field, {
          xMm: Number((drag.x + dxMm).toFixed(1)),
          yMm: Number((drag.y + dyMm).toFixed(1)),
        });
      }

      if (resize) {
        const dxMm = (event.clientX - resize.startX) / scale / MM_TO_PX;
        const dyMm = (event.clientY - resize.startY) / scale / MM_TO_PX;
        onLayoutChange(variant, resize.field, {
          widthMm: Math.max(5, Number((resize.width + dxMm).toFixed(1))),
          heightMm: Math.max(5, Number((resize.height + dyMm).toFixed(1))),
        });
      }
    };
    const up = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onLayoutChange, scale, variant]);

  const nudgeField = (field: FieldKey, layout: FieldLayout, event: Pick<KeyboardEvent | ReactKeyboardEvent, "key" | "altKey" | "shiftKey" | "ctrlKey" | "metaKey" | "preventDefault">) => {
    if (mode !== "admin" || adminInteractionMode !== "move" || !onLayoutChange) return;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;

    event.preventDefault();
    const step = event.altKey ? 0.1 : event.shiftKey ? 2 : 0.5;
    const sign = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";

    if (event.ctrlKey || event.metaKey) {
      onLayoutChange(
        variant,
        field,
        horizontal
          ? { widthMm: Math.max(5, Number((layout.widthMm + sign * step).toFixed(1))) }
          : { heightMm: Math.max(5, Number((layout.heightMm + sign * step).toFixed(1))) },
      );
      return;
    }

    onLayoutChange(variant, field, horizontal ? { xMm: Number((layout.xMm + sign * step).toFixed(1)) } : { yMm: Number((layout.yMm + sign * step).toFixed(1)) });
  };

  const handleAdminKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, field: FieldKey, layout: FieldLayout) => {
    nudgeField(field, layout, event);
  };

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (mode !== "admin" || adminInteractionMode !== "move" || !activeField) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      nudgeField(activeField, variantConfig.fields[activeField], event);
    };

    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [activeField, adminInteractionMode, mode, onLayoutChange, variant, variantConfig.fields]);

  const getFieldBoxProps = (field: FieldKey) => {
    const layout = variantConfig.fields[field];
    const props: Record<string, unknown> = {
      tabIndex: mode === "admin" && adminInteractionMode === "move" ? 0 : undefined,
      "data-field-control": true,
      style: { zIndex: field === activeField ? 24 : 10, cursor: mode === "admin" && adminInteractionMode === "move" ? "move" : undefined },
      onPointerDown: (event: PointerEvent) => {
        onFocusField?.(field);
        if (mode !== "admin" || adminInteractionMode !== "move") return;
        event.preventDefault();
        (event.currentTarget as HTMLElement).focus();
        dragRef.current = { field, startX: event.clientX, startY: event.clientY, x: layout.xMm, y: layout.yMm };
      },
      onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => handleAdminKeyDown(event, field, layout),
    };
    return props;
  };

  const renderResizeHandle = (field: FieldKey, layout: FieldLayout) => {
    if (mode !== "admin" || adminInteractionMode !== "move" || activeField !== field) return null;
    return (
      <button
        key={`resize-${field}`}
        type="button"
        aria-label="박스 크기 조절"
        className="absolute z-30 h-[4mm] w-[4mm] rounded-sm border border-sky-700 bg-sky-500 shadow-sm"
        style={{
          left: `${layout.xMm + layout.widthMm - 2}mm`,
          top: `${layout.yMm + layout.heightMm - 2}mm`,
          cursor: "nwse-resize",
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onFocusField?.(field);
          resizeRef.current = { field, startX: event.clientX, startY: event.clientY, width: layout.widthMm, height: layout.heightMm };
        }}
      />
    );
  };

  const pageMode = mode === "review" ? "print" : mode;
  const editableField =
    mode === "edit" && activeField && textFields.includes(activeField as TextFieldKey)
      ? (activeField as TextFieldKey)
      : mode === "admin" && adminInteractionMode === "text" && textFields.includes(activeField as TextFieldKey)
        ? (activeField as TextFieldKey)
        : null;

  return (
    <div ref={outerRef} className="w-full overflow-x-hidden">
      <div style={{ width: `${210 * scale}mm`, maxWidth: "100%", height: `${297 * scale}mm`, minHeight: "120mm", margin: "0 auto", overflow: "hidden" }}>
        <div
          ref={pageRef}
          className="shadow-xl shadow-stone-300/60"
          style={{ width: "210mm", height: "297mm", transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}
          onPointerDown={(event) => {
            if (mode !== "edit") return;
            const target = event.target as HTMLElement;
            if (!target.closest("[data-field-control='true']")) onClearActiveField?.();
          }}
        >
          <CertificatePage
            data={data}
            config={config}
            variant={variant}
            mode={pageMode}
            activeField={activeField}
            errors={errors}
            showBorder={showBorder}
            editableField={editableField}
            onTextChange={(field, value) => onChange?.(field, value)}
            onFocusField={onFocusField}
            getFieldBoxProps={getFieldBoxProps}
          />
          {textFields.map((field) => renderResizeHandle(field, variantConfig.fields[field]))}
          {renderResizeHandle("stamp", variantConfig.fields.stamp)}
        </div>
      </div>
    </div>
  );
}
