import { AgenticWorkflowControlRoom } from "@/components/showcase/AgenticWorkflowControlRoom";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

export default async function AgentControlRoomPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AgenticWorkflowControlRoom locale={toShowcaseLocale(locale)} />;
}

function toShowcaseLocale(locale: string): ShowcaseLocale {
  return locale === "ko" ? "ko" : "en";
}
