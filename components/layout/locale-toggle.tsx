"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { getLocalizedPath, locales, type Locale } from "@/lib/i18n/config";

function swapLocale(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  const rest = locales.includes(segments[0] as Locale)
    ? segments.slice(1)
    : segments;
  const slug = rest.length === 0 ? "/" : `/${rest.join("/")}`;

  return getLocalizedPath(nextLocale, slug);
}

export function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectLocale(nextLocale: Locale) {
    window.localStorage.setItem("ai-copilot-guide-locale", nextLocale);
    document.cookie = `ai-copilot-guide-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.push(swapLocale(pathname, nextLocale));
    });
  }

  return (
    <div
      className="grid grid-cols-2 rounded-md border border-line bg-white/80 p-1 text-xs font-semibold shadow-sm"
      aria-label="Language"
    >
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => selectLocale(option)}
          disabled={isPending}
          className={
            option === locale
              ? "rounded bg-github px-2.5 py-1.5 text-white"
              : "rounded px-2.5 py-1.5 text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
          }
          aria-pressed={option === locale}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
