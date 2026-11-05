import { describe, expect, it } from "vitest";
import { buildHomeFeed } from "../src/engine/index.js";
import {
  FIXTURE_NOW,
  FIXTURE_SNAPSHOT,
  FIXTURE_SNAPSHOT_STORM,
  profileFor,
} from "./fixtures/weather-fixture.js";

describe("personalisation engine", () => {
  it("ranks runner-specific cards for runner persona", () => {
    const feed = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("runner"), {
      now: FIXTURE_NOW,
    });
    const ids = feed.cards.map((c) => c.id);
    expect(ids).toContain("run-suitability");
    expect(ids).toContain("best-run-window");
    expect(feed.activePersona).toBe("runner");
    expect(feed.heroSummary.length).toBeGreaterThan(10);
  });

  it("ranks farmer rainfall and crop cards for farmer persona", () => {
    const feed = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("farmer"), {
      now: FIXTURE_NOW,
    });
    const ids = feed.cards.map((c) => c.id);
    expect(ids).toContain("rainfall-outlook");
    expect(ids).toContain("crop-advisory");
    const topFarmer = feed.cards.find((c) => c.id === "rainfall-outlook");
    expect(topFarmer?.whyExplanation).toMatch(/precipitation/i);
  });

  it("pins active alerts above other cards", () => {
    const feed = buildHomeFeed(FIXTURE_SNAPSHOT_STORM, profileFor("parent"), {
      now: FIXTURE_NOW,
    });
    expect(feed.cards[0]?.id).toBe("active-alerts");
    expect(feed.cards[0]?.score).toBe(100);
  });

  it("produces different top headlines for parent vs traveller", () => {
    const parent = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("parent"), {
      now: FIXTURE_NOW,
    });
    const traveller = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("traveller"), {
      now: FIXTURE_NOW,
    });
    expect(parent.cards.some((c) => c.id === "school-commute")).toBe(true);
    expect(traveller.cards.some((c) => c.id === "disruption-risk")).toBe(true);
    expect(parent.activePersona).toBe("parent");
    expect(traveller.activePersona).toBe("traveller");
  });

  it("every card includes whyExplanation", () => {
    const feed = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("general"), {
      now: FIXTURE_NOW,
    });
    for (const card of feed.cards) {
      expect(card.whyExplanation.length).toBeGreaterThan(5);
    }
  });

  it("respects hidden card ids", () => {
    const profile = profileFor("runner");
    profile.cardVisibility.hiddenCardIds = ["run-suitability"];
    const feed = buildHomeFeed(FIXTURE_SNAPSHOT, profile, { now: FIXTURE_NOW });
    expect(feed.cards.some((c) => c.id === "run-suitability")).toBe(false);
  });
});
