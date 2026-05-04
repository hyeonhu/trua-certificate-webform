import { existsSync } from "fs";
import path from "path";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const config = await getSiteConfig();
  const desktopExists = existsSync(path.join(process.cwd(), "public", config.home.desktopBannerSrc.replace(/^\//, "")));
  const mobileExists = existsSync(path.join(process.cwd(), "public", config.home.mobileBannerSrc.replace(/^\//, "")));

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-stone-950">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-8">
        <div className="overflow-hidden rounded-md border border-stone-300 bg-white shadow-sm">
          {mobileExists && <img src={config.home.mobileBannerSrc} alt="" className="block w-full object-cover sm:hidden" />}
          {desktopExists && <img src={config.home.desktopBannerSrc} alt="" className="hidden w-full object-cover sm:block" />}
          {!desktopExists && !mobileExists && <img src="/assets/상장용지.jpg" alt="" className="h-[360px] w-full object-cover opacity-80" />}
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm font-bold tracking-[0.24em] text-amber-700">{config.home.eyebrow}</div>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{config.home.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">{config.home.description}</p>

          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Link href="/create" className="flex-1 rounded-md bg-stone-950 px-6 py-4 text-center text-lg font-black text-white shadow-sm">
              {config.home.primaryButtonLabel}
            </Link>
            <a href={config.home.purchaseUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-md border border-stone-300 bg-white px-6 py-4 text-center text-lg font-black">
              {config.home.purchaseButtonLabel}
            </a>
          </div>
          <p className="mt-5 text-xs text-stone-500">{config.home.imageHelpText}</p>
        </div>
      </section>
    </main>
  );
}
