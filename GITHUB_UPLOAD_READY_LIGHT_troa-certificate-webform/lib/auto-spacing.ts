import type { AutoSpacingConfig } from "@/lib/types";

function applySpacesToLine(line: string, config: AutoSpacingConfig): string {
  const countTarget = config.stripSpacesBeforeCount ? line.replace(/\s/g, "") : line;
  const charCount = Array.from(countTarget).length;
  const spaceCount = config.rules[String(charCount)] ?? config.rules.default ?? 0;

  if (spaceCount <= 0) {
    return line;
  }

  const source = config.stripSpacesBeforeCount ? line.replace(/\s/g, "") : line;
  return Array.from(source).join(" ".repeat(spaceCount));
}

export function applyAutoSpacing(value: string, config: AutoSpacingConfig): string {
  if (!config.enabled || config.mode !== "spaces" || !value) {
    return value;
  }

  if (config.applyPerLine) {
    return value
      .split(/\r?\n/)
      .map((line) => applySpacesToLine(line, config))
      .join("\n");
  }

  return applySpacesToLine(value, config);
}
