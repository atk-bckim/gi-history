import type { Metadata } from "next";
import "./globals.css";

const siteName = "AI Copilot Guide";
const siteDescription =
  "A bilingual Korean and English guide for GitHub Copilot, Microsoft Copilot, and agentic AI workflows.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-copilot-guide.local"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  alternates: {
    canonical: "/ko",
    languages: {
      ko: "/ko",
      en: "/en"
    }
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    siteName,
    title: siteName,
    description: siteDescription,
    url: "/ko"
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
