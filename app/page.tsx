import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default async function RootPage() {
  const cookieStore = await cookies();
  const preferredLocale = cookieStore.get("ai-copilot-guide-locale")?.value;
  const locale = preferredLocale && isLocale(preferredLocale)
    ? preferredLocale
    : defaultLocale;

  redirect(`/${locale}`);
}
