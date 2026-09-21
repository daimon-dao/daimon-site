"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32, resolveShape, type Shape, type ShapeSpec } from "@/lib/shapes";

/*
 * The particle engine. One component, many shapes (see src/lib/shapes.ts).
 *
 * Particles start scattered, converge into the target shape, then breathe
 * around it. Particles near the pointer are pushed away and ease back.
 * Only the most visible canvas on the page animates; everything else is
 * paused, and everything pauses when the tab is hidden. Under
 * prefers-reduced-motion, or without a 2D canvas, a static SVG of the same
 * shape is rendered instead.
 */

/* ───────────────────────── tunables ───────────────────────── */

const COUNT_DESKTOP = 2600; // target points on desktop
const COUNT_MOBILE = 800; // and on phones
const MOBILE_MAX_WIDTH = 768; // px; below this the mobile budget applies
const DPR_CAP = 2; // devicePixelRatio is capped here

const FILL = 0.95; // fraction of the canvas the shape's box occupies
const RING_FILL = 0.86; // the hero: leaves just enough room for the outer orbit
const SIZE_MIN = 0.9; // particle radius, CSS px
const SIZE_MAX = 2.4;
const ALPHA_MIN = 0.35;
const ALPHA_MAX = 1;

const STIFFNESS = 34; // spring pull towards the target (1/s²)
const DAMPING = 7.5; // velocity damping (1/s); with STIFFNESS gives ζ ≈ 0.64
const STAGGER_SECONDS = 1.6; // particles are released over this long → convergence time
const SCATTER_SPEED = 30; // px/s wander before a particle is released
const DRIFT_AMPLITUDE = 0.007; // idle "breathing", fraction of the box size
const DRIFT_SPEED = 0.8; // rad/s

const REPEL_RADIUS = 110; // px around the pointer
const REPEL_STRENGTH = 2600; // px/s² at the pointer, fading to 0 at the radius

const RING_RADII = [0.53, 0.58]; // orbit radii, fraction of the box size, from the centre
const RING_COUNTS = [36, 60];
const RING_SPEEDS = [0.09, -0.055]; // rad/s (negative = counter-clockwise)
const RING_ALPHA = 0.5;

const STREAM_SPEED = 0.16; // box units per second (the hourglass sand)
const DISPERSE_SPEED: [number, number] = [0.03, 0.1]; // box units per second
const DISPERSE_LIFE: [number, number] = [4, 9]; // seconds
const DISPERSE_SHARE = 0.5; // fraction of the budget used by the disperse shape

const SVG_MAX_POINTS = 900; // the static fallback keeps the DOM light

/** Colours come from the theme tokens in globals.css ("r, g, b" triples). */
function readColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    particle: cs.getPropertyValue("--particle").trim() || "201, 162, 39",
    accent: cs.getPropertyValue("--accent-rgb").trim() || "201, 162, 39",
  };
}
const TAU = Math.PI * 2;

/* ───────────────────────── one-animates-at-a-time ───────────────────────── */

interface Registered {
  ratio: number;
  setActive: (on: boolean) => void;
}
const registry = new Set<Registered>();

function arbitrate() {
  let best: Registered | null = null;
  for (const r of registry) if (r.ratio > 0 && (!best || r.ratio > best.ratio)) best = r;
  const hidden = document.visibilityState === "hidden";
  for (const r of registry) r.setActive(!hidden && r === best);
}

/* ───────────────────────── the engine ───────────────────────── */

interface EngineOptions {
  ring: boolean;
  disperse: boolean;
  mobile: boolean;
  rand: () => number;
}

function createEngine(
  box: HTMLDivElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  opts: EngineOptions,
) {
  const { rand, disperse } = opts;
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  const fill = opts.ring ? RING_FILL : FILL;
  let colors = readColors();

  // Canvas geometry (CSS px) and the fitted box of the shape.
  let w = 0;
  let h = 0;
  let ox = 0;
  let oy = 0;
  let s = 1;

  const streams = shape.streams ?? [];
  const streamTotal = streams.reduce((a, st) => a + st.count, 0);
  const budget = opts.mobile ? COUNT_MOBILE : COUNT_DESKTOP;
  const n = disperse ? Math.round(budget * DISPERSE_SHARE) : shape.points.length / 2 + streamTotal;

  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const vx = new Float32Array(n);
  const vy = new Float32Array(n);
  const tx = new Float32Array(n);
  const ty = new Float32Array(n);
  const size = new Float32Array(n);
  const alpha = new Float32Array(n);
  const mod = new Float32Array(n).fill(1); // per-frame alpha modulation
  const phase = new Float32Array(n);
  const delay = new Float32Array(n);
  const streamOf = new Int16Array(n).fill(-1);
  // disperse mode only
  const age = new Float32Array(n);
  const life = new Float32Array(n);
  const dirX = new Float32Array(n);
  const dirY = new Float32Array(n);
  const speed = new Float32Array(n);

  const fixed = shape.points.length / 2;
  for (let i = 0; i < n; i++) {
    size[i] = SIZE_MIN + rand() * (SIZE_MAX - SIZE_MIN);
    alpha[i] = ALPHA_MIN + rand() * (ALPHA_MAX - ALPHA_MIN);
    phase[i] = rand();
    if (!disperse && i < fixed) {
      tx[i] = shape.points[i * 2];
      ty[i] = shape.points[i * 2 + 1];
      delay[i] = (shape.order === "index" ? i / fixed : rand()) * STAGGER_SECONDS;
    }
  }
  // Stream particles come after the fixed ones.
  let k = fixed;
  streams.forEach((st, si) => {
    for (let j = 0; j < st.count; j++, k++) streamOf[k] = si;
  });

  const ringAngle: number[][] = RING_RADII.map((_, r) =>
    Array.from({ length: RING_COUNTS[r] }, () => rand() * TAU),
  );

  let time = 0;
  let pointerX = -1e9;
  let pointerY = -1e9;

  function respawn(i: number) {
    const a = rand() * TAU;
    dirX[i] = Math.cos(a);
    dirY[i] = Math.sin(a);
    speed[i] = DISPERSE_SPEED[0] + rand() * (DISPERSE_SPEED[1] - DISPERSE_SPEED[0]);
    life[i] = DISPERSE_LIFE[0] + rand() * (DISPERSE_LIFE[1] - DISPERSE_LIFE[0]);
    age[i] = 0;
    x[i] = ox + (shape.aspect * s) / 2 + (rand() - 0.5) * 0.02 * s;
    y[i] = oy + s / 2 + (rand() - 0.5) * 0.02 * s;
    vx[i] = 0;
    vy[i] = 0;
  }

  /** Scatter every particle across the canvas and restart the convergence. */
  function scatter() {
    time = 0;
    for (let i = 0; i < n; i++) {
      if (disperse) {
        respawn(i);
        age[i] = rand() * life[i]; // not all born at once
        const t = age[i] * speed[i] * s;
        x[i] += dirX[i] * t;
        y[i] += dirY[i] * t;
        continue;
      }
      x[i] = rand() * w;
      y[i] = rand() * h;
      const a = rand() * TAU;
      vx[i] = Math.cos(a) * SCATTER_SPEED;
      vy[i] = Math.sin(a) * SCATTER_SPEED;
    }
  }

  function resize() {
    const cw = box.clientWidth;
    const ch = box.clientHeight;
    if (cw === 0 || ch === 0) return false;
    const first = w === 0;
    w = cw;
    h = ch;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    s = Math.min(w / shape.aspect, h) * fill;
    ox = (w - shape.aspect * s) / 2;
    oy = (h - s) / 2;
    if (first) scatter();
    return true;
  }

  function update(dt: number) {
    time += dt;
    const r2 = REPEL_RADIUS * REPEL_RADIUS;
    for (let i = 0; i < n; i++) {
      if (disperse) {
        age[i] += dt;
        if (age[i] >= life[i]) respawn(i);
        const u = age[i] / life[i];
        mod[i] = Math.sin(u * Math.PI); // fade in, fade out
        vx[i] += dirX[i] * speed[i] * s * 0.6 * dt;
        vy[i] += dirY[i] * speed[i] * s * 0.6 * dt;
      } else {
        if (time < delay[i]) {
          x[i] += vx[i] * dt;
          y[i] += vy[i] * dt;
          continue;
        }
        let gx: number;
        let gy: number;
        const si = streamOf[i];
        if (si >= 0) {
          const st = streams[si];
          const len = st.y1 - st.y0;
          const u = (phase[i] + (time * STREAM_SPEED) / len) % 1;
          gx = ox + (st.x + Math.sin((u + phase[i]) * 9) * 0.006) * s;
          gy = oy + (st.y0 + u * len) * s;
          mod[i] = Math.min(1, Math.sin(u * Math.PI) * 1.6);
        } else {
          const p = phase[i] * TAU;
          gx = ox + tx[i] * s + Math.sin(time * DRIFT_SPEED + p) * DRIFT_AMPLITUDE * s;
          gy = oy + ty[i] * s + Math.cos(time * DRIFT_SPEED * 1.3 + p * 2) * DRIFT_AMPLITUDE * s;
        }
        vx[i] += ((gx - x[i]) * STIFFNESS - vx[i] * DAMPING) * dt;
        vy[i] += ((gy - y[i]) * STIFFNESS - vy[i] * DAMPING) * dt;
      }
      // Pointer repulsion.
      const dx = x[i] - pointerX;
      const dy = y[i] - pointerY;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2) {
        const d = Math.sqrt(d2) + 0.001;
        const f = REPEL_STRENGTH * (1 - d / REPEL_RADIUS);
        vx[i] += (dx / d) * f * dt;
        vy[i] += (dy / d) * f * dt;
      }
      if (disperse) {
        vx[i] *= 1 - 1.5 * dt;
        vy[i] *= 1 - 1.5 * dt;
      }
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
    }
    if (opts.ring) {
      for (let r = 0; r < ringAngle.length; r++) {
        const arr = ringAngle[r];
        for (let j = 0; j < arr.length; j++) arr[j] += RING_SPEEDS[r] * dt;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    if (shape.lines) {
      ctx.strokeStyle = `rgba(${colors.accent}, 0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of shape.lines) {
        ctx.moveTo(ox + x1 * s, oy + y1 * s);
        ctx.lineTo(ox + x2 * s, oy + y2 * s);
      }
      ctx.stroke();
    }
    ctx.fillStyle = `rgb(${colors.particle})`;
    // Five alpha buckets → five fills per frame instead of one per particle.
    for (let b = 0; b < 5; b++) {
      ctx.globalAlpha = (b + 1) / 5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = alpha[i] * mod[i];
        const bucket = a <= 0 ? -1 : Math.min(4, Math.floor(a * 5));
        if (bucket !== b) continue;
        const r = size[i];
        ctx.moveTo(x[i] + r, y[i]);
        ctx.arc(x[i], y[i], r, 0, TAU);
      }
      ctx.fill();
    }
    if (opts.ring) {
      const cx = ox + (shape.aspect * s) / 2;
      const cy = oy + s / 2;
      ctx.globalAlpha = RING_ALPHA;
      ctx.beginPath();
      for (let r = 0; r < ringAngle.length; r++) {
        const radius = RING_RADII[r] * s;
        const arr = ringAngle[r];
        for (let j = 0; j < arr.length; j++) {
          const wobble = 1 + 0.012 * Math.sin(time * 0.5 + j);
          const px = cx + Math.cos(arr[j]) * radius * wobble;
          const py = cy + Math.sin(arr[j]) * radius * wobble;
          ctx.moveTo(px + 1.2, py);
          ctx.arc(px, py, 1.2, 0, TAU);
        }
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // requestAnimationFrame loop, only while this instance is the active one.
  let raf = 0;
  let running = false;
  let last = 0;
  function frame(now: number) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (w === 0 && !resize()) {
      raf = requestAnimationFrame(frame);
      return;
    }
    update(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function setActive(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  }

  // Wiring: size, visibility, pointer, restart hook.
  const registered: Registered = { ratio: 0, setActive };
  registry.add(registered);
  const ro = new ResizeObserver(() => resize());
  ro.observe(box);
  const io = new IntersectionObserver(
    (entries) => {
      registered.ratio = entries[entries.length - 1].intersectionRatio;
      arbitrate();
    },
    { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
  );
  io.observe(box);
  const onVisibility = () => arbitrate();
  document.addEventListener("visibilitychange", onVisibility);
  const onMove = (e: PointerEvent) => {
    const rect = box.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
  };
  const onLeave = () => {
    pointerX = -1e9;
    pointerY = -1e9;
  };
  box.addEventListener("pointermove", onMove);
  box.addEventListener("pointerleave", onLeave);
  box.addEventListener("pointercancel", onLeave);
  const onRestart = () => scatter();
  box.addEventListener("daimon:restart", onRestart);
  // Theme switch: re-read the colours and repaint once, even while paused.
  const themeObserver = new MutationObserver(() => {
    colors = readColors();
    if (w > 0) draw();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  resize();

  return {
    destroy() {
      setActive(false);
      registry.delete(registered);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointercancel", onLeave);
      box.removeEventListener("daimon:restart", onRestart);
      themeObserver.disconnect();
      arbitrate();
    },
  };
}

/* ───────────────────────── static fallback ───────────────────────── */

function StaticShape({ shape, ring, seed }: { shape: Shape; ring: boolean; seed: number }) {
  const W = shape.aspect * 1000;
  const H = 1000;
  const rand = mulberry32(seed + 1);
  const total = shape.points.length / 2;
  const step = Math.max(1, Math.ceil(total / SVG_MAX_POINTS));
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < total; i += step) {
    dots.push({ x: shape.points[i * 2] * 1000, y: shape.points[i * 2 + 1] * 1000, r: 3 + rand() * 3, o: 0.4 + rand() * 0.6 });
  }
  if (total === 0) {
    // The disperse shape: a scattered field around the centre.
    for (let i = 0; i < 160; i++) {
      const a = rand() * TAU;
      const d = Math.pow(rand(), 0.6) * 460;
      dots.push({ x: W / 2 + Math.cos(a) * d, y: H / 2 + Math.sin(a) * d, r: 3 + rand() * 3, o: 0.25 + rand() * 0.6 });
    }
  }
  for (const st of shape.streams ?? []) {
    for (let i = 0; i < st.count; i++) {
      const u = (i + 0.5) / st.count;
      dots.push({ x: st.x * 1000, y: (st.y0 + u * (st.y1 - st.y0)) * 1000, r: 3, o: 0.5 });
    }
  }
  const rings: { x: number; y: number }[] = [];
  if (ring) {
    RING_RADII.forEach((radius, r) => {
      for (let j = 0; j < RING_COUNTS[r]; j++) {
        const a = (j / RING_COUNTS[r]) * TAU + r;
        rings.push({ x: W / 2 + Math.cos(a) * radius * 1000, y: H / 2 + Math.sin(a) * radius * 1000 });
      }
    });
  }
  const pad = ((1 - (ring ? RING_FILL : FILL)) / 2) * 1000;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full"
      aria-hidden="true"
    >
      {shape.lines?.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1 * 1000} y1={y1 * 1000} x2={x2 * 1000} y2={y2 * 1000} stroke="var(--accent)" strokeOpacity={0.6} strokeWidth={2} />
      ))}
      <g fill="var(--particle-color)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
        ))}
        {rings.map((d, i) => (
          <circle key={`r${i}`} cx={d.x} cy={d.y} r={2.5} opacity={RING_ALPHA} />
        ))}
      </g>
    </svg>
  );
}

/* ───────────────────────── the component ───────────────────────── */

export interface ParticlesProps {
  /** What the particles should form. */
  spec: ShapeSpec;
  /** Add the two slow orbits of sparse particles (the hero). */
  ring?: boolean;
  /** Seed for the deterministic layout of a given shape. */
  seed?: number;
  /** Sizing is the caller's job: give the box a height or an aspect ratio. */
  className?: string;
}

export function Particles({ spec, ring = false, seed = 7, className }: ParticlesProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);
  const [fallback, setFallback] = useState<{ kind: "svg"; shape: Shape } | { kind: "image" } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = reduced ? null : canvas.getContext("2d");
    const mobile = window.innerWidth < MOBILE_MAX_WIDTH;
    const rand = mulberry32(seed);
    let cancelled = false;
    let engine: ReturnType<typeof createEngine> | null = null;

    resolveShape(spec, mobile ? COUNT_MOBILE : COUNT_DESKTOP, mobile, rand).then((shape) => {
      if (cancelled) return;
      if (!shape) {
        setFallback({ kind: "image" });
        return;
      }
      if (!ctx) {
        setFallback({ kind: "svg", shape });
        return;
      }
      setFallback(null);
      engine = createEngine(box, canvas, ctx, shape, { ring, disperse: spec.kind === "disperse", mobile, rand });
    });

    return () => {
      cancelled = true;
      engine?.destroy();
    };
    // `spec` is an object literal in JSX; compare by its stable parts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.kind, spec.kind === "logo" ? spec.src : "", ring, seed, reduced]);

  return (
    <div ref={boxRef} className={className} aria-hidden="true" data-particles={spec.kind}>
      <canvas ref={canvasRef} className={fallback ? "hidden" : "block h-full w-full"} />
      {fallback?.kind === "svg" && <StaticShape shape={fallback.shape} ring={ring} seed={seed} />}
      {fallback?.kind === "image" && spec.kind === "logo" && (
        <img src={spec.src} alt="" className="mx-auto block h-full w-auto" />
      )}
    </div>
  );
}
