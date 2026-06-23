import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{ts,tsx,mdx,json}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f4ee",
        ink: "#171717",
        muted: "#6f6b63",
        github: "#161b22",
        microsoft: "#2563eb",
        line: "#ded8cc",
        success: "#2e7d4f",
        warning: "#b7791f"
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Noto Sans KR",
          "Inter",
          "system-ui",
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
