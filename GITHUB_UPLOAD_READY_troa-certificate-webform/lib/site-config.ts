import { promises as fs } from "fs";
import path from "path";
import { ensureDataDirs } from "@/lib/template-config";

export interface SiteStepConfig {
  key: string;
  title: string;
  description: string;
  optional?: boolean;
}

export interface SiteConfig {
  home: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButtonLabel: string;
    purchaseButtonLabel: string;
    purchaseUrl: string;
    desktopBannerSrc: string;
    mobileBannerSrc: string;
    imageHelpText: string;
  };
  create: {
    pageTitle: string;
    pageDescription: string;
    aBNotice: string;
    steps: SiteStepConfig[];
    policyTitle: string;
    policyItems: string[];
    policyAgreeLabel: string;
    policyCancelLabel: string;
  };
}

const configPath = path.join(process.cwd(), "data", "site-config.json");

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  home: {
    eyebrow: "TROA CERTIFICATE",
    title: "트루아 용돈 상장",
    description: "주문한 상장 문구를 직접 작성하고, A안/B안 PDF를 바로 받아보세요.",
    primaryButtonLabel: "상장 만들기",
    purchaseButtonLabel: "상장 구매",
    purchaseUrl: process.env.COUPANG_PRODUCT_URL || "https://www.coupang.com/",
    desktopBannerSrc: "/assets/home-banner-desktop.jpg",
    mobileBannerSrc: "/assets/home-banner-mobile.jpg",
    imageHelpText: "PC 배너는 public/assets/home-banner-desktop.jpg, 모바일 배너는 public/assets/home-banner-mobile.jpg 파일을 교체하면 변경됩니다.",
  },
  create: {
    pageTitle: "상장 문구 입력",
    pageDescription: "안내 순서대로 입력하면 A안/B안에 동시에 반영됩니다.",
    aBNotice: "A안/B안 PDF가 모두 제작됩니다.",
    steps: [
      { key: "email", title: "이메일 입력", description: "다운로드에 문제가 생기면 PDF를 받을 수 있는 이메일입니다." },
      { key: "autoSpacing", title: "자동 자간 조정", description: "짧은 문구의 글자 사이를 보기 좋게 자동 조정합니다." },
      { key: "certificateNo", title: "상장 번호", description: "선택 사항입니다.\n입력하지 않으면 최종 출력에서 보이지 않습니다.", optional: true },
      { key: "title", title: "상장명", description: "상장 상단에 들어가는 제목입니다.\n예: 최고의 어버이상, 감사장, 상장" },
      { key: "awardCategory", title: "수상 부문", description: "선택 사항입니다.\n예: 축환갑, 축생신, 대상, 최고상", optional: true },
      { key: "recipient", title: "수상자", description: "상장을 받는 분의 이름 또는 호칭을 적어주세요.\n예: 사랑하는 어머니" },
      { key: "body", title: "본문", description: "본문은 7~8줄, 줄당 25자 내외를 권장합니다.\n엔터 줄바꿈이 그대로 반영됩니다." },
      { key: "date", title: "날짜", description: "상장에 표시될 날짜를 입력해주세요.\n예: 2026년 5월 8일" },
      { key: "presenter", title: "수여자", description: "수여자를 입력해주세요.\n예: 사랑하는 가족 드림" },
      { key: "stamp", title: "도장 선택", description: "상장 하단에 들어갈 도장 디자인을 선택해주세요." },
    ],
    policyTitle: "제작 전 안내 및 동의",
    policyItems: [
      "최종 PDF는 상장 테두리 없이 글자와 도장만 생성됩니다.",
      "구매하신 상장 용지에 인쇄할 때는 실제 크기 100%, 크기 조정 없음으로 출력해주세요.",
      "용지에 맞춤 옵션을 선택하면 위치가 어긋날 수 있습니다.",
      "입력한 문구와 이메일을 확인한 뒤 제작을 진행해주세요.",
    ],
    policyAgreeLabel: "동의하고 검수하기",
    policyCancelLabel: "돌아가기",
  },
};

export async function getSiteConfig(): Promise<SiteConfig> {
  await ensureDataDirs();
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const saved = JSON.parse(raw) as Partial<SiteConfig>;
    return {
      ...DEFAULT_SITE_CONFIG,
      ...saved,
      home: { ...DEFAULT_SITE_CONFIG.home, ...saved.home },
      create: {
        ...DEFAULT_SITE_CONFIG.create,
        ...saved.create,
        steps: saved.create?.steps?.length ? saved.create.steps : DEFAULT_SITE_CONFIG.create.steps,
        policyItems: saved.create?.policyItems?.length ? saved.create.policyItems : DEFAULT_SITE_CONFIG.create.policyItems,
      },
    };
  } catch {
    await saveSiteConfig(DEFAULT_SITE_CONFIG);
    return DEFAULT_SITE_CONFIG;
  }
}

export async function saveSiteConfig(config: SiteConfig) {
  await ensureDataDirs();
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
  return config;
}
