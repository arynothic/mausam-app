/** Curated Indian places for offline-first search ranking (extend as needed). */
export interface IndiaSeedLocation {
  id: string;
  name: string;
  district?: string;
  state: string;
  lat: number;
  lon: number;
}

export const INDIA_SEED_LOCATIONS: readonly IndiaSeedLocation[] = [
  { id: "in-delhi", name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.209 },
  { id: "in-mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { id: "in-bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { id: "in-chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { id: "in-kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { id: "in-hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867 },
  { id: "in-pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { id: "in-ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { id: "in-jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { id: "in-lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { id: "in-chandigarh", name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { id: "in-amritsar", name: "Amritsar", state: "Punjab", lat: 31.634, lon: 74.8723 },
  { id: "in-ludhiana", name: "Ludhiana", state: "Punjab", lat: 30.901, lon: 75.8573 },
  { id: "in-patna", name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376 },
  { id: "in-bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
  { id: "in-indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577 },
  { id: "in-kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673 },
  { id: "in-thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366 },
  { id: "in-guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362 },
  { id: "in-shimla", name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734 },
] as const;

export function searchIndiaSeeds(query: string, limit: number): IndiaSeedLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = INDIA_SEED_LOCATIONS.map((loc) => {
    const haystack = [loc.name, loc.state, loc.district ?? ""].join(" ").toLowerCase();
    const idx = haystack.indexOf(q);
    const starts = loc.name.toLowerCase().startsWith(q) ? 0 : idx >= 0 ? idx + 10 : 999;
    return { loc, rank: starts };
  })
    .filter((x) => x.rank < 999)
    .sort((a, b) => a.rank - b.rank || a.loc.name.localeCompare(b.loc.name));

  return scored.slice(0, limit).map((x) => x.loc);
}
