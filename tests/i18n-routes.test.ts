import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  getLocalizedPath,
  isLocale,
  locales
} from "@/lib/i18n/config";
import { mainRoutes } from "@/lib/i18n/routes";

describe("i18n routing", () => {
  it("uses Korean and English with Korean as the default", () => {
    expect(locales).toEqual(["ko", "en"]);
    expect(defaultLocale).toBe("ko");
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("jp")).toBe(false);
  });

  it("maps every main route to both localized URLs", () => {
    for (const route of mainRoutes) {
      const expectedSlug = route.slug === "/" ? "" : route.slug;

      expect(getLocalizedPath("ko", route.slug)).toBe(`/ko${expectedSlug}`);
      expect(getLocalizedPath("en", route.slug)).toBe(`/en${expectedSlug}`);
    }
  });

  it("normalizes the home slug without a double slash", () => {
    expect(getLocalizedPath("ko", "/")).toBe("/ko");
    expect(getLocalizedPath("en", "/")).toBe("/en");
  });
});
