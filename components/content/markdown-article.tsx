export function MarkdownArticle({ html }: { html: string }) {
  return (
    <div
      className="lesson-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
