import { cookies } from "next/headers";

export const ADMIN_COOKIE = "troa-admin-auth";

export function isAdminPasswordEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdminAuthed() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === password;
}
