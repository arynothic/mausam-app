#!/usr/bin/env npx tsx
/**
 * Demo: same fixture weather → different homepages per persona.
 * Run: pnpm demo:feed
 */
import { buildHomeFeed } from "../src/engine/index.js";
import {
  FIXTURE_NOW,
  FIXTURE_SNAPSHOT,
  profileFor,
} from "../tests/fixtures/weather-fixture.js";

const personas = ["runner", "farmer", "parent", "traveller"] as const;

console.log("Mausam feed demo (fixture weather — New Delhi, June)\n");

for (const persona of personas) {
  const feed = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor(persona), {
    now: FIXTURE_NOW,
  });
  console.log(`—— ${persona.toUpperCase()} ——`);
  console.log(`Hero: ${feed.heroSummary}`);
  console.log("Top cards:");
  for (const card of feed.cards.slice(0, 4)) {
    console.log(`  • [${card.score}] ${card.title}: ${card.headline}`);
  }
  console.log("");
}
