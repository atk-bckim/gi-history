import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = Record<Locale, string>;

export type SourceRef = {
  id: string;
  title: string;
  url: string;
  publisher: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  level: "intro" | "intermediate" | "advanced";
  durationMinutes: number;
  tools: string[];
  outcomes: LocalizedText[];
  sourceRefIds: string[];
  updatedAt: string;
};

export type GlossaryTerm = {
  id: string;
  term: LocalizedText;
  definition: LocalizedText;
  learnerNotes: LocalizedText;
  related: string[];
  keywords: string[];
};

export type ResourceItem = {
  title: LocalizedText;
  description: LocalizedText;
  actions: LocalizedText[];
  sourceRefIds?: string[];
};

export type ResourceSection = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  items: ResourceItem[];
};
