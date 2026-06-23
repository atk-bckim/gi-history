import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StaticSearch } from "@/components/search/static-search";

describe("StaticSearch", () => {
  it("finds bilingual lessons, glossary terms, and resources from one query box", () => {
    render(<StaticSearch locale="en" />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search learning content" }), {
      target: { value: "MCP" }
    });

    expect(screen.getByRole("link", { name: /Model Context Protocol/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /MCP and harness references/i })).toBeTruthy();
    expect(screen.getAllByText(/Glossary/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resource/i).length).toBeGreaterThan(0);
  });

  it("searches Korean terms and shows a useful empty state", () => {
    render(<StaticSearch locale="ko" />);

    fireEvent.change(screen.getByRole("searchbox", { name: "학습 콘텐츠 검색" }), {
      target: { value: "거버넌스" }
    });

    expect(
      screen.getByRole("link", { name: /Microsoft Copilot 업무 활용과 거버넌스/i })
    ).toBeTruthy();

    fireEvent.change(screen.getByRole("searchbox", { name: "학습 콘텐츠 검색" }), {
      target: { value: "없는검색어" }
    });

    expect(screen.getByText(/검색 결과가 없습니다/i)).toBeTruthy();
  });
});
