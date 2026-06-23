import { DigitalTwinCommandCenter } from "@/components/showcase/DigitalTwinCommandCenter";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

type DigitalTwinPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DigitalTwinPage({ params }: DigitalTwinPageProps) {
  const { locale } = await params;

  return <DigitalTwinCommandCenter locale={toShowcaseLocale(locale)} />;
}

function toShowcaseLocale(locale: string): ShowcaseLocale {
  return locale === "ko" ? "ko" : "en";
}
