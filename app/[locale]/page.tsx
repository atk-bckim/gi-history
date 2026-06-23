import { LearningDashboard } from "@/components/home/learning-dashboard";
import type { Locale } from "@/lib/i18n/config";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <LearningDashboard locale={locale} />;
}
