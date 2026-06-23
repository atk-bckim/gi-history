import type { MetadataRoute } from "next";
import { lessons } from "@/lib/content/registry";
import { getLocalizedPath, locales, type Locale } from "@/lib/i18n/config";
import { mainRoutes } from "@/lib/i18n/routes";

const siteUrl = "https://ai-copilot-guide.local";

const showcaseRoutes = [
  "/showcase/agent-control-room",
  "/showcase/agentic-workflow-control-room",
  "/showcase/digital-twin",
  "/showcase/semiconductor",
  "/showcase/semiconductor-design-explorer"
];

function toAbsoluteUrl(locale: Locale, slug: string): string {
  return `${siteUrl}${getLocalizedPath(locale, slug)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const launchRoutes = Array.from(
    new Set([
      ...mainRoutes.map((route) => route.slug),
      ...lessons.map((lesson) => lesson.slug),
      ...showcaseRoutes
    ])
  );

  return launchRoutes.flatMap((slug) =>
    locales.map((locale) => ({
      url: toAbsoluteUrl(locale, slug),
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [
            alternateLocale,
            toAbsoluteUrl(alternateLocale, slug)
          ])
        )
      }
    }))
  );
}
