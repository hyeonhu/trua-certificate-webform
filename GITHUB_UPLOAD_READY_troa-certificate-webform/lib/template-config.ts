import { promises as fs } from "fs";
import { createHash } from "crypto";
import path from "path";
import { DEFAULT_TEMPLATE_CONFIG } from "@/lib/default-template-config";
import type { FieldLayout, TemplateConfig, TemplateVariantConfig } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const configPath = path.join(dataDir, "template-config.json");
const isReadonlyDeployment = process.env.VERCEL === "1";

export async function ensureDataDirs() {
  if (isReadonlyDeployment) return;
  await fs.mkdir(path.join(dataDir, "orders"), { recursive: true });
  await fs.mkdir(path.join(dataDir, "generated"), { recursive: true });
}

export async function getTemplateConfig(): Promise<TemplateConfig> {
  try {
    const raw = await fs.readFile(configPath, "utf8");
    return mergeTemplateConfig(JSON.parse(raw) as Partial<TemplateConfig>);
  } catch {
    return DEFAULT_TEMPLATE_CONFIG;
  }
}

export async function saveTemplateConfig(config: TemplateConfig): Promise<TemplateConfig> {
  if (isReadonlyDeployment) {
    throw new Error("Vercel 무료 배포에서는 관리자 저장이 유지되지 않습니다. 로컬에서 수정 후 data/template-config.json을 다시 업로드해주세요.");
  }
  await ensureDataDirs();
  const next: TemplateConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
    version: config.version || `config-${Date.now()}`,
  };
  await fs.writeFile(configPath, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export function getTemplateConfigHash(config: TemplateConfig) {
  return createHash("sha256").update(JSON.stringify(config)).digest("hex").slice(0, 12);
}

function mergeFieldLayout(base: FieldLayout, saved?: Partial<FieldLayout>): FieldLayout {
  return {
    ...base,
    ...saved,
    autoSpacing: {
      ...base.autoSpacing,
      ...saved?.autoSpacing,
      rules: {
        ...base.autoSpacing.rules,
        ...(saved?.autoSpacing?.rules ?? {}),
      },
    },
  };
}

function mergeVariantConfig(base: TemplateVariantConfig, saved?: Partial<TemplateVariantConfig>): TemplateVariantConfig {
  const fields = { ...base.fields };
  for (const key of Object.keys(base.fields) as (keyof typeof base.fields)[]) {
    fields[key] = mergeFieldLayout(base.fields[key], saved?.fields?.[key]);
  }

  return {
    ...base,
    ...saved,
    fields,
  };
}

function mergeTemplateConfig(saved: Partial<TemplateConfig>): TemplateConfig {
  return {
    ...DEFAULT_TEMPLATE_CONFIG,
    ...saved,
    variants: {
      A: mergeVariantConfig(DEFAULT_TEMPLATE_CONFIG.variants.A, saved.variants?.A),
      B: mergeVariantConfig(DEFAULT_TEMPLATE_CONFIG.variants.B, saved.variants?.B),
    },
  };
}
