import { glossaryTerms, lessons, sourceRefs } from "@/lib/content/registry";

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getSourceRefs(ids: string[]) {
  const byId = new Map(sourceRefs.map((source) => [source.id, source]));
  return ids.flatMap((id) => {
    const source = byId.get(id);
    return source ? [source] : [];
  });
}

export function getTermsByIds(ids: string[]) {
  const byId = new Map(glossaryTerms.map((term) => [term.id, term]));
  return ids.flatMap((id) => {
    const term = byId.get(id);
    return term ? [term] : [];
  });
}
