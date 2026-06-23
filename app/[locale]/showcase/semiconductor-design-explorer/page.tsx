import { SemiconductorDesignExplorer } from "@/components/showcase/SemiconductorDesignExplorer";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

type SemiconductorPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SemiconductorPage({
  params
}: SemiconductorPageProps) {
  const { locale } = await params;

  return <SemiconductorDesignExplorer locale={toShowcaseLocale(locale)} />;
}

function toShowcaseLocale(locale: string): ShowcaseLocale {
  return locale === "ko" ? "ko" : "en";
}
