import { describe, expect, it } from "vitest";
import { searchIndiaSeeds } from "../src/locations/india-seeds.js";

describe("searchIndiaSeeds", () => {
  it("matches city names case-insensitively", () => {
    const hits = searchIndiaSeeds("delhi", 3);
    expect(hits[0]?.name).toBe("New Delhi");
  });

  it("matches state names", () => {
    const hits = searchIndiaSeeds("punjab", 5);
    expect(hits.some((h) => h.state === "Punjab")).toBe(true);
  });
});
