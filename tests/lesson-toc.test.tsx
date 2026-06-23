import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LessonTableOfContents } from "@/components/layout/lesson-table-of-contents";
import type { MdxHeading } from "@/lib/content/mdx-docs";

const headings: MdxHeading[] = [
  { id: "section-1", level: 2, text: "Which Copilot surface should you use?" },
  { id: "section-2", level: 2, text: "Plans, accounts, and policy boundaries" },
  { id: "section-3", level: 3, text: "Practice checklist" }
];

function setScrollMetrics(scrollY: number) {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 1000
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 2000
  });
}

function mountHeadingTargets(positions: Map<string, number>) {
  const wrapper = document.createElement("div");

  for (const heading of headings) {
    const element = document.createElement("h2");
    element.id = heading.id;
    element.textContent = heading.text;
    element.getBoundingClientRect = () =>
      ({
        top: positions.get(heading.id) ?? Number.POSITIVE_INFINITY,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }) as DOMRect;
    wrapper.appendChild(element);
  }

  document.body.appendChild(wrapper);
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("LessonTableOfContents", () => {
  it("renders accessible anchor links and highlights the first section by default", () => {
    render(<LessonTableOfContents headings={headings} locale="en" />);

    expect(
      screen.getByRole("navigation", { name: "On this page" })
    ).toBeTruthy();

    const firstLink = screen.getByRole("link", {
      name: "Which Copilot surface should you use?"
    });

    expect(firstLink.getAttribute("href")).toBe("#section-1");
    expect(firstLink.getAttribute("aria-current")).toBe("location");
    expect(screen.getByText("Reading progress")).toBeTruthy();
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("updates the active section when learners choose another heading", () => {
    render(<LessonTableOfContents headings={headings} locale="en" />);

    const policyLink = screen.getByRole("link", {
      name: "Plans, accounts, and policy boundaries"
    });

    fireEvent.click(policyLink);

    expect(policyLink.getAttribute("aria-current")).toBe("location");
    expect(
      screen
        .getByRole("link", { name: "Which Copilot surface should you use?" })
        .hasAttribute("aria-current")
    ).toBe(false);
  });

  it("updates progress and scroll-driven active state from real heading positions", async () => {
    const positions = new Map([
      ["section-1", -420],
      ["section-2", 80],
      ["section-3", 460]
    ]);

    setScrollMetrics(500);
    mountHeadingTargets(positions);
    render(<LessonTableOfContents headings={headings} locale="en" />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(
        screen
          .getByRole("link", { name: "Plans, accounts, and policy boundaries" })
          .getAttribute("aria-current")
      ).toBe("location");
      expect(
        screen.getByRole("progressbar", { name: "Reading progress" })
        .getAttribute("aria-valuenow")
      ).toBe("50");
      expect(screen.getByText("50%")).toBeTruthy();
    });
  });

  it("returns active state to the first section when scrolled above all headings", async () => {
    const positions = new Map([
      ["section-1", 240],
      ["section-2", 640],
      ["section-3", 940]
    ]);

    setScrollMetrics(0);
    mountHeadingTargets(positions);
    render(<LessonTableOfContents headings={headings} locale="en" />);

    const policyLink = screen.getByRole("link", {
      name: "Plans, accounts, and policy boundaries"
    });
    fireEvent.click(policyLink);
    expect(policyLink.getAttribute("aria-current")).toBe("location");

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(
        screen
          .getByRole("link", { name: "Which Copilot surface should you use?" })
          .getAttribute("aria-current")
      ).toBe("location");
      expect(policyLink.hasAttribute("aria-current")).toBe(false);
    });
  });

  it("localizes the progress label for Korean lessons", () => {
    render(<LessonTableOfContents headings={headings} locale="ko" />);

    expect(screen.getByText("읽기 진행률")).toBeTruthy();
  });
});
