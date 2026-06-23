export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getLocalizedPath(locale: Locale, slug: string): string {
  const normalizedSlug = slug === "/" ? "" : slug.startsWith("/") ? slug : `/${slug}`;
  return `/${locale}${normalizedSlug}`;
}
