export const motion = {
  duration: {
    instant: 120,
    fast: 200,
    normal: 320,
    slow: 480,
  },
  stagger: {
    card: 50,
  },
} as const;

export type Motion = typeof motion;
