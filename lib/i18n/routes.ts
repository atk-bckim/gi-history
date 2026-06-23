export type MainRoute = {
  slug: string;
  label: {
    ko: string;
    en: string;
  };
};

export const mainRoutes: MainRoute[] = [
  { slug: "/", label: { ko: "홈", en: "Home" } },
  { slug: "/paths", label: { ko: "학습 경로", en: "Paths" } },
  {
    slug: "/github-copilot",
    label: { ko: "GitHub Copilot", en: "GitHub Copilot" }
  },
  {
    slug: "/github-copilot/vscode",
    label: { ko: "VS Code", en: "VS Code" }
  },
  {
    slug: "/github-copilot/cli",
    label: { ko: "Copilot CLI", en: "Copilot CLI" }
  },
  {
    slug: "/github-copilot/agents",
    label: { ko: "에이전트", en: "Agents" }
  },
  {
    slug: "/github-copilot/review",
    label: { ko: "리뷰", en: "Review" }
  },
  {
    slug: "/microsoft-copilot",
    label: { ko: "Microsoft Copilot", en: "Microsoft Copilot" }
  },
  {
    slug: "/agentic-ai",
    label: { ko: "Agentic AI", en: "Agentic AI" }
  },
  { slug: "/labs", label: { ko: "실습실", en: "Labs" } },
  { slug: "/showcase", label: { ko: "쇼케이스", en: "Showcase" } },
  { slug: "/glossary", label: { ko: "용어집", en: "Glossary" } },
  { slug: "/resources", label: { ko: "자료실", en: "Resources" } }
];
