import type { StampOption } from "@/lib/types";

export const STAMP_OPTIONS: StampOption[] = [
  { id: "감사축하", label: "감사축하", src: "/assets/stamps/감사축하.png" },
  { id: "감사해요", label: "감사해요", src: "/assets/stamps/감사해요.png" },
  { id: "사랑해요", label: "사랑해요", src: "/assets/stamps/사랑해요.png" },
  { id: "축하해요", label: "축하해요", src: "/assets/stamps/축하해요.png" },
];

export function getStampById(id: string) {
  return STAMP_OPTIONS.find((stamp) => stamp.id === id);
}
