import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("launch documentation", () => {
  it("documents release gates, known limitations, and rollback criteria", () => {
    const path = "docs/product/release-checklist.md";

    expect(existsSync(path)).toBe(true);

    const document = readFileSync(path, "utf8");

    for (const phrase of [
      "출시 게이트",
      "검증 명령",
      "알려진 제한사항",
      "공식 문서 재검증",
      "롤백 기준",
      "다음 단계 후보"
    ]) {
      expect(document).toContain(phrase);
    }
  });
});
