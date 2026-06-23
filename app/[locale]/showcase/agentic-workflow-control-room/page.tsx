import { AgenticWorkflowControlRoom } from "@/components/showcase/AgenticWorkflowControlRoom";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

type AgenticPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AgenticPage({
  params
}: AgenticPageProps) {
  const { locale } = await params;

  return <AgenticWorkflowControlRoom locale={toShowcaseLocale(locale)} />;
}

function toShowcaseLocale(locale: string): ShowcaseLocale {
  return locale === "ko" ? "ko" : "en";
}
