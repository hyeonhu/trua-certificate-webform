import { promises as fs } from "fs";
import path from "path";
import type { OrderRecord } from "@/lib/types";
import { ensureDataDirs } from "@/lib/template-config";

function safeName(value: string) {
  return value.replace(/[^\w가-힣-]/g, "_");
}

export async function saveOrderRecord(record: OrderRecord) {
  await ensureDataDirs();
  const target = path.join(process.cwd(), "data", "orders", `${safeName(record.orderNumber)}.json`);
  await fs.writeFile(target, JSON.stringify(record, null, 2), "utf8");
}
