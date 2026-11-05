import { describe, expect, it } from "vitest";
import { PERSONA_BY_ID } from "@mausam/shared";

describe("api bootstrap", () => {
  it("links shared personas", () => {
    expect(PERSONA_BY_ID.farmer.id).toBe("farmer");
  });
});
