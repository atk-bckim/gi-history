import Link from "next/link";
import { Cpu, GraduationCap } from "lucide-react";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

const navItems = [
  { slug: "/paths", ko: "학습 경로", en: "Paths" },
  { slug: "/github-copilot", ko: "GitHub Copilot", en: "GitHub Copilot" },
  { slug: "/agentic-ai", ko: "Agentic AI", en: "Agentic AI" },
  { slug: "/labs", ko: "실습실", en: "Labs" },
  { slug: "/showcase", ko: "쇼케이스", en: "Showcase" },
  { slug: "/resources", ko: "자료실", en: "Resources" }
];

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={getLocalizedPath(locale, "/")}
          className="flex min-w-0 items-center gap-3"
          aria-label="AI Copilot Guide home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-github text-white shadow-sm">
            <Cpu aria-hidden className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold tracking-normal text-ink">
              AI Copilot Guide
            </span>
            <span className="hidden text-xs text-muted sm:block">
              {locale === "ko"
                ? "GitHub Copilot 중심 AI 실무 교육"
                : "Practical AI education centered on GitHub Copilot"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={getLocalizedPath(locale, item.slug)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/70 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
            >
              {item[locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={getLocalizedPath(locale, "/github-copilot")}
            className="hidden items-center gap-2 rounded-md bg-github px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft sm:flex"
          >
            <GraduationCap aria-hidden className="h-4 w-4" />
            {locale === "ko" ? "학습 시작" : "Start"}
          </Link>
          <LocaleToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
