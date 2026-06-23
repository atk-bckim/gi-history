import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { metadata } from "@/app/layout";

type HeaderConfig = {
  source: string;
  headers: {
    key: string;
    value: string;
  }[];
};

type NextConfigWithHeaders = {
  headers?: () => Promise<HeaderConfig[]>;
};

type SitemapEntry = {
  url: string;
};

describe("production metadata and launch readiness", () => {
  it("defines crawlable bilingual metadata with social previews", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://ai-copilot-guide.local/");
    expect(metadata.title).toEqual({
      default: "AI Copilot Guide",
      template: "%s | AI Copilot Guide"
    });
    expect(metadata.alternates).toMatchObject({
      canonical: "/ko",
      languages: {
        ko: "/ko",
        en: "/en"
      }
    });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "ko_KR",
      alternateLocale: ["en_US"],
      siteName: "AI Copilot Guide"
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image"
    });
  });

  it("ships sitemap and robots metadata routes for every primary localized route", async () => {
    expect(existsSync("app/sitemap.ts")).toBe(true);
    expect(existsSync("app/robots.ts")).toBe(true);

    const sitemapPath = "../app/" + "sitemap.ts";
    const robotsPath = "../app/" + "robots.ts";
    const [{ default: sitemap }, { default: robots }] = await Promise.all([
      import(/* @vite-ignore */ sitemapPath),
      import(/* @vite-ignore */ robotsPath)
    ]) as [
      { default: () => SitemapEntry[] },
      { default: () => unknown }
    ];

    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((entry: SitemapEntry) => entry.url);

    expect(urls).toContain("https://ai-copilot-guide.local/ko");
    expect(urls).toContain("https://ai-copilot-guide.local/en");
    expect(urls).toContain("https://ai-copilot-guide.local/ko/github-copilot/cli");
    expect(urls).toContain("https://ai-copilot-guide.local/en/showcase/digital-twin");
    expect(sitemapEntries.length).toBeGreaterThanOrEqual(26);

    expect(robots()).toMatchObject({
      rules: {
        userAgent: "*",
        allow: "/"
      },
      sitemap: "https://ai-copilot-guide.local/sitemap.xml"
    });
  });

  it("configures baseline security headers for static deployment", async () => {
    const configPath = "../next.config.mjs";
    const { default: nextConfig } = (await import(
      /* @vite-ignore */ configPath
    )) as { default: NextConfigWithHeaders };
    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find(
      (entry: HeaderConfig) => entry.source === "/:path*"
    );

    expect(globalHeaders?.headers).toEqual(
      expect.arrayContaining([
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()"
        }
      ])
    );
  });
});
