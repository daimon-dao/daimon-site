/**
 * Target shapes for the particle engine (src/components/Particles.tsx).
 *
 * A shape is a set of target points in a unit box: x in [0, aspect], y in [0, 1].
 * The engine fits that box into its canvas ("contain") and animates particles
 * towards the points. Everything here is pure geometry, except the logo, which
 * is sampled from the PNG at runtime (it needs a canvas to read pixels).
 */

export type ShapeSpec =
  | { kind: "logo"; src: string }
  | { kind: "hourglass" }
  | { kind: "grid" }
  | { kind: "curve" }
  | { kind: "disperse" };

export interface Stream {
  /** x position and y range (unit coords) of particles that flow downwards on a loop. */
  x: number;
  y0: number;
  y1: number;
  count: number;
}

export interface Shape {
  /** Target points as [x0, y0, x1, y1, …] in unit coords. */
  points: Float32Array;
  /** Width of the unit box (height is always 1). */
  aspect: number;
  /** In which order particles are released towards their targets. */
  order: "random" | "index";
  /** Thin static lines to draw under the particles, [x1, y1, x2, y2] each. */
  lines?: number[][];
  /** Particles that keep flowing instead of settling (the hourglass sand). */
  streams?: Stream[];
}

/** Small seeded PRNG so a shape is the same on every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ───────────────────────── the logo ───────────────────────── */

const SAMPLE_SIZE = 192; // the PNG is read at this resolution
const LUMA_THRESHOLD = 0.34; // keeps the gold marks and rim, drops the navy disk

/**
 * Samples the logo PNG into `budget` points: every pixel that is opaque and
 * bright enough is a candidate; a seeded shuffle picks the subset.
 */
export function sampleImage(src: string, budget: number, rand: () => number): Promise<Shape | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = SAMPLE_SIZE;
      c.height = SAMPLE_SIZE;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const candidates: number[] = [];
      for (let i = 0; i < SAMPLE_SIZE * SAMPLE_SIZE; i++) {
        const a = data[i * 4 + 3];
        if (a < 128) continue;
        const luma = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
        if (luma >= LUMA_THRESHOLD) candidates.push(i);
      }
      // Fisher–Yates, seeded, then take the first `budget`.
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      const n = Math.min(budget, candidates.length);
      const points = new Float32Array(n * 2);
      for (let k = 0; k < n; k++) {
        const i = candidates[k];
        points[k * 2] = ((i % SAMPLE_SIZE) + 0.5 + (rand() - 0.5)) / SAMPLE_SIZE;
        points[k * 2 + 1] = (Math.floor(i / SAMPLE_SIZE) + 0.5 + (rand() - 0.5)) / SAMPLE_SIZE;
      }
      resolve({ points, aspect: 1, order: "random" });
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/* ───────────────────────── the hourglass ───────────────────────── */

/** Half-width of a bulb at height `t` (0 = wide end, 1 = neck). */
function bulbHalfWidth(t: number): number {
  return 0.028 + 0.29 * Math.pow(1 - t, 1.55);
}

export function hourglass(budget: number, rand: () => number): Shape {
  const aspect = 0.8;
  const cx = aspect / 2;
  const top = 0.07;
  const neck = 0.5;
  const bottom = 0.93;
  const pts: number[] = [];

  // Outline of both bulbs (≈ 38 % of the budget).
  const outline = Math.round(budget * 0.38);
  for (let k = 0; k < outline; k++) {
    const t = rand();
    const w = bulbHalfWidth(t);
    const side = rand() < 0.5 ? -1 : 1;
    const upper = rand() < 0.5;
    const y = upper ? top + t * (neck - top) : bottom - t * (bottom - neck);
    pts.push(cx + side * w, y);
  }
  // Sand still waiting in the upper bulb (≈ 22 %).
  const upperSand = Math.round(budget * 0.22);
  for (let k = 0; k < upperSand; k++) {
    const t = 0.55 + rand() * 0.42; // lower part of the upper bulb
    const w = bulbHalfWidth(t) * 0.94;
    pts.push(cx + (rand() * 2 - 1) * w, top + t * (neck - top));
  }
  // The mound already fallen into the lower bulb (≈ 30 %).
  const mound = Math.round(budget * 0.3);
  let placed = 0;
  while (placed < mound) {
    const y = 0.7 + rand() * 0.23;
    const t = (bottom - y) / (bottom - neck);
    const cone = ((y - 0.7) / 0.23) * 0.3;
    const w = Math.min(bulbHalfWidth(t) * 0.94, cone);
    if (w <= 0) continue;
    pts.push(cx + (rand() * 2 - 1) * w, y);
    placed++;
  }
  const points = Float32Array.from(pts);
  return {
    points,
    aspect,
    order: "random",
    lines: [
      [0.06, 0.045, aspect - 0.06, 0.045],
      [0.06, 0.955, aspect - 0.06, 0.955],
    ],
    streams: [{ x: cx, y0: neck, y1: 0.86, count: Math.max(12, Math.round(budget * 0.06)) }],
  };
}

/* ───────────────────────── the lattice ───────────────────────── */

export function grid(mobile: boolean): Shape {
  const cols = mobile ? 12 : 22;
  const rows = mobile ? 8 : 13;
  const aspect = 1.6;
  const points = new Float32Array(cols * rows * 2);
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points[k++] = 0.06 + ((aspect - 0.12) * c) / (cols - 1);
      points[k++] = 0.08 + (0.84 * r) / (rows - 1);
    }
  }
  return { points, aspect, order: "index" };
}

/* ───────────────────────── the curve and its floor ───────────────────────── */

export function curve(budget: number, rand: () => number): Shape {
  const aspect = 1.6;
  const floor = 0.82;
  const x0 = 0.05;
  const x1 = aspect - 0.08;
  const yTop = 0.1;
  const pts: number[] = [];

  // The floor forms first: a dense line of particles (≈ 30 %).
  const floorCount = Math.round(budget * 0.3);
  for (let k = 0; k < floorCount; k++) {
    pts.push(0.03 + rand() * (aspect - 0.06), floor + (rand() - 0.5) * 0.006);
  }
  // Then the falling band, released left to right (sorted by x).
  const bandCount = budget - floorCount;
  const band: number[] = [];
  for (let k = 0; k < bandCount; k++) {
    const t = Math.pow(rand(), 0.8); // a little denser near the floor
    const x = x0 + t * (x1 - x0);
    const yCentre = floor - (floor - yTop) * Math.pow(1 - t, 2.4);
    const thickness = 0.004 + 0.045 * (1 - t);
    band.push(x, yCentre + (rand() - 0.5) * thickness);
  }
  const pairs: [number, number][] = [];
  for (let i = 0; i < band.length; i += 2) pairs.push([band[i], band[i + 1]]);
  pairs.sort((a, b) => a[0] - b[0]);
  for (const [x, y] of pairs) pts.push(x, y);

  return {
    points: Float32Array.from(pts),
    aspect,
    order: "index",
    lines: [[0.02, floor, aspect - 0.02, floor]],
  };
}

/* ───────────────────────── dispatcher ───────────────────────── */

export async function resolveShape(
  spec: ShapeSpec,
  budget: number,
  mobile: boolean,
  rand: () => number,
): Promise<Shape | null> {
  switch (spec.kind) {
    case "logo":
      return sampleImage(spec.src, budget, rand);
    case "hourglass":
      return hourglass(budget, rand);
    case "grid":
      return grid(mobile);
    case "curve":
      return curve(budget, rand);
    case "disperse":
      return { points: new Float32Array(0), aspect: 1, order: "random" };
  }
}
