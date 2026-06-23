import { ShowcaseLandingPage } from "@/components/showcase/ShowcaseLandingPage";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

type ShowcasePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { locale } = await params;

  return <ShowcaseLandingPage locale={toShowcaseLocale(locale)} />;
}

function toShowcaseLocale(locale: string): ShowcaseLocale {
  return locale === "ko" ? "ko" : "en";
}
