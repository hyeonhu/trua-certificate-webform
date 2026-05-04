import { promises as fs } from "fs";
import path from "path";

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
const isReadonlyDeployment = process.env.VERCEL === "1";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  home: {
    eyebrow: "TROA CERTIFICATE",
    title: "트루아 용돈 상장",
    description: "상장 문구를 직접 작성하고, A안/B안 PDF 제작용 정보를 접수해보세요.",
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
    aBNotice: "A안/B안 정보가 모두 접수됩니다.",
    steps: [
      { key: "email", title: "이메일 입력", description: "완성된 PDF를 받을 이메일입니다." },
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
    policyTitle: "제출 전 안내 및 동의",
    policyItems: [
      "제출한 내용은 스프레드시트로 접수됩니다.",
      "기존 구글 자동화가 접수 내용을 기준으로 PDF 제작과 이메일 발송을 진행합니다.",
      "입력한 문구와 이메일을 확인한 뒤 제출해주세요.",
    ],
    policyAgreeLabel: "동의하고 검수하기",
    policyCancelLabel: "돌아가기",
  },
};

export async function getSiteConfig(): Promise<SiteConfig> {
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
    return DEFAULT_SITE_CONFIG;
  }
}

export async function saveSiteConfig(config: SiteConfig) {
  if (isReadonlyDeployment) {
    throw new Error("Vercel 무료 배포에서는 관리자 저장이 유지되지 않습니다. 로컬에서 수정 후 data/site-config.json을 다시 업로드해주세요.");
  }
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
  return config;
}
