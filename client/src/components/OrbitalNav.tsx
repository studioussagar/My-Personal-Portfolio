import { useEffect, useRef } from "react";

export type OrbitNavId = "home" | "work" | "profile" | "journey" | "contact";

export type OrbitNavNode = {
  id: Exclude<OrbitNavId, "home">;
  label: string;
  /** Section id to navigate to (matches existing page anchors). */
  target: string;
  /** Which orbit the node rides: 0 = inner, 1 = outer. */
  orbit: 0 | 1;
  /** Angular slot on its orbit at t=0 (radians). Opposite nodes differ by PI. */
  offset: number;
  color: string;
  hint: string;
};

/** Slot order MUST match the header slot spans: work, profile, journey, contact. */
export const ORBIT_NAV_NODES: OrbitNavNode[] = [
  { id: "work", label: "Work", target: "work", orbit: 0, offset: 0.5, color: "#6de7f8", hint: "Selected work" },
  { id: "profile", label: "Profile", target: "about", orbit: 1, offset: 0.5 + Math.PI / 2, color: "#c28dff", hint: "Engineering focus" },
  { id: "journey", label: "Journey", target: "experience", orbit: 1, offset: 0.5 + (3 * Math.PI) / 2, color: "#ffcb69", hint: "Learning by shipping" },
  { id: "contact", label: "Contact", target: "contact", orbit: 0, offset: 0.5 + Math.PI, color: "#73f4af", hint: "Open channel" },
];

type OrbitDef = {
  /** Orbit radius as a fraction of the hero stage width (circular in its plane). */
  rx: number;
  /** Plane inclination from face-on, degrees. Restrained perspective tilt. */
  tilt: number;
  /** In-plane yaw of the ellipse major axis, degrees. Shared by both rings. */
  yaw: number;
  /** Full revolution duration in ms. */
  period: number;
  dir: 1 | -1;
};

/**
 * Inclined circular orbits projected orthographically: screen = yaw(tilt(p)).
 * Rings are square divs sized 2*rx carrying the identical tilt+yaw transform,
 * so nodes sit exactly on their rings. Labels use translate-only positioning
 * and are never distorted by the perspective.
 */
const ORBITS: OrbitDef[] = [
  // Shared period + direction freezes relative geometry: every pairwise gap
  // below was verified numerically over full cycles (desktop + 320px mobile).
  { rx: 0.34, tilt: 62, yaw: -14, period: 36000, dir: 1 },
  { rx: 0.44, tilt: 64, yaw: -14, period: 36000, dir: 1 },
];

const DEG = Math.PI / 180;
const ORBIT_MATH = ORBITS.map((o) => ({
  cosT: Math.cos(o.tilt * DEG),
  sinT: Math.sin(o.tilt * DEG),
  cosY: Math.cos(o.yaw * DEG),
  sinY: Math.sin(o.yaw * DEG),
}));

/** Scroll distance (px) over which the orbit morphs into the navbar. */
const SCROLL_RANGE = 520;
const TAU = Math.PI * 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smootherstep = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type OrbitalNavRefs = {
  /** In-flow hero spacer that reserves layout + anchors orbit geometry. */
  stage: React.RefObject<HTMLDivElement | null>;
  /** Invisible header slot spans (viewport coords, measured). Order = NODES. */
  slots: React.RefObject<Array<HTMLSpanElement | null>>;
  /** Invisible 30px header slot for Saturn. */
  saturnSlot: React.RefObject<HTMLSpanElement | null>;
  /** Fixed header element (solidity class toggled here). */
  header: React.RefObject<HTMLElement | null>;
  /** Mobile menu toggle (morph fallback target on small screens). */
  toggle: React.RefObject<HTMLButtonElement | null>;
};

type Props = {
  refs: OrbitalNavRefs;
  activeId: OrbitNavId;
  reduced: boolean;
  onNavigate: (target: string) => void;
};

/**
 * One navigation system with two forms. Fixed-position Saturn + 4 nodes are
 * driven every frame from a single elapsed clock: orbital slots (trig around
 * the hero anchor, depth-scaled) lerp into measured navbar slots by a
 * scroll-scrubbed progress value. Same DOM, same buttons — the orbit
 * physically becomes the navbar, reversibly. No dependencies, GPU transforms.
 */
export default function OrbitalNav({ refs, activeId, reduced, onNavigate }: Props) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tagRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const saturnRef = useRef<HTMLButtonElement | null>(null);
  const ringRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  /** Hover/focus hold slows the orbit for easy activation (no re-render). */
  const hoverRef = useRef(false);
  const hold = (v: boolean) => {
    hoverRef.current = v;
  };

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const S = {
      ax: 0,
      ay: 0,
      rxA: 0,
      ryA: 0,
      rxB: 0,
      ryB: 0,
      slots: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      sat: { x: 0, y: 0 },
      mobile: false,
      planetBase: 1,
      elapsed: 0,
    };
    const mqMobile = window.matchMedia("(max-width: 650px)");

    const measure = () => {
      S.mobile = mqMobile.matches;
      // Mobile presence: near-desktop planet and orbit scale, fitted to width.
      S.planetBase = S.mobile ? 0.92 : 1;
      const radF = S.mobile ? 0.88 : 1;
      const stage = refs.stage.current;
      if (stage) {
        const r = stage.getBoundingClientRect();
        S.ax = r.left + r.width / 2 + window.scrollX;
        S.ay = r.top + r.height / 2 + window.scrollY;
        const w = Math.max(r.width, 1);
        S.rxA = w * ORBITS[0].rx * radF;
        S.rxB = w * ORBITS[1].rx * radF;
        const rA = ringRefs.current[0];
        const rB = ringRefs.current[1];
        // Square rings; tilt+yaw lives in the transform so each border traces
        // exactly the projected circular path its nodes travel.
        if (rA) {
          const d = (S.rxA * 2).toFixed(1);
          rA.style.width = `${d}px`;
          rA.style.height = `${d}px`;
        }
        if (rB) {
          const d = (S.rxB * 2).toFixed(1);
          rB.style.width = `${d}px`;
          rB.style.height = `${d}px`;
        }
      }
      if (!S.mobile) {
        const spans = refs.slots.current;
        for (let i = 0; i < ORBIT_NAV_NODES.length; i++) {
          const el = spans[i];
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.width > 0) S.slots[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
        const ss = refs.saturnSlot.current;
        if (ss) {
          const r = ss.getBoundingClientRect();
          if (r.width > 0) S.sat = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      }
    };

    const render = (dt: number) => {
      const reducedNow = reducedRef.current;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      // Mobile has two phases. Phase 1: the page scrolls normally with Saturn
      // fully intact at its dedicated spot. Phase 2 begins only once the stage
      // center passes viewport center — i.e. the user starts PASSING Saturn —
      // and completes as the stage center reaches the navbar. The trigger is
      // spatial (passing Saturn), never tied to scroll start. Desktop morphs
      // over a fixed range instead and is unchanged.
      const centerPastMiddle = sy + vh * 0.5 - S.ay;
      const mSpan = Math.max(60, vh * 0.5 - 80);
      const mRaw = clamp01(centerPastMiddle / mSpan);
      const raw = S.mobile ? mRaw : clamp01(sy / SCROLL_RANGE);
      const p = reducedNow ? (raw > 0.12 ? 1 : 0) : raw;
      const e = reducedNow ? p : smootherstep(p);
      // Staged handoff (desktop): hold the orbit, then travel decisively while
      // orbital tags fade early and bar labels arrive late — the two label sets
      // are never both half-visible, so no muddy intermediate navbar state.
      const trav = reducedNow ? p : smootherstep((p - 0.1) / 0.55);
      const orbF = reducedNow ? 1 - p : 1 - smootherstep(p / 0.6);
      const barF = reducedNow ? p : smootherstep((p - 0.4) / 0.4);
      if (!reducedNow && !hoverRef.current) S.elapsed += dt * (1 - p * 0.85);
      const t = S.elapsed;

      // Continuous navbar surface driven by bar arrival — background, blur,
      // and border build exactly as the links do. No binary state switch.
      // Writes are guarded so idle frames cost nothing extra.
      const header = refs.header.current;
      if (header) {
        const a = (0.72 * barF).toFixed(3);
        if (header.dataset.nbg !== a) {
          header.style.setProperty("--nav-bg", a);
          header.style.setProperty("--nav-blur", `${(16 * barF).toFixed(1)}px`);
          header.style.setProperty("--nav-border", (0.08 * barF).toFixed(3));
          header.dataset.nbg = a;
        }
      }
      // Layer-level crossfade vars (inherited by nodes + Saturn; mobile pins
      // orbital-on/bar-off since it has no bar representation).
      if (S.mobile) {
        layer.style.setProperty("--op", "1");
        layer.style.setProperty("--bp", "0");
      } else {
        layer.style.setProperty("--op", orbF.toFixed(3));
        layer.style.setProperty("--bp", barF.toFixed(3));
      }
      // Deterministic final state: once the morph completes, force bar labels
      // visible through the plain cascade (no vars, no timing involved).
      layer.classList.toggle("nav-locked", p >= 0.999);

      const nodes = nodeRefs.current;
      const saturn = saturnRef.current;
      const rings = ringRefs.current;

      // Decorative rings stay glued to the scrolling anchor, then fade out.
      const rcx = S.ax - window.scrollX;
      const rcy = S.ay - window.scrollY;
      const ringOp = 1 - trav;
      for (let ri = 0; ri < rings.length; ri++) {
        const r = rings[ri];
        if (!r) continue;
        const o = ORBITS[ri];
        r.style.transform = `translate3d(${rcx.toFixed(1)}px, ${rcy.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${o.yaw}deg) rotateX(${o.tilt}deg) scale(${(1 - 0.65 * trav).toFixed(3)})`;
        r.style.opacity = ringOp < 0.02 ? "0" : ringOp.toFixed(3);
      }

      // Saturn anchor in viewport coords: repulsion origin for labels.
      const satOX = S.ax - window.scrollX;
      const satOY = S.ay - window.scrollY;
      const placeTag = (i: number, vx: number, vy: number) => {
        // Radial label separation: pure function of orbital position, so it is
        // deterministic, smooth, and jitter-free. Fades out at the navbar.
        const rdx = vx - satOX;
        const rdy = vy - satOY;
        const rl = Math.hypot(rdx, rdy) || 1;
        const roff = (S.mobile ? 26 : 20) * (1 - e);
        const tag = tagRefs.current[i];
        if (tag) {
          tag.style.transform = `translate(-50%, -50%) translate(${((rdx / rl) * roff).toFixed(1)}px, ${((rdy / rl) * roff).toFixed(1)}px)`;
        }
      };

      for (let i = 0; i < ORBIT_NAV_NODES.length; i++) {
        const n = ORBIT_NAV_NODES[i];
        const o = ORBITS[n.orbit];
        const m = ORBIT_MATH[n.orbit];
        const rx = n.orbit === 0 ? S.rxA : S.rxB;
        const a = n.offset + o.dir * ((t * TAU) / o.period);
        // Circular orbit inclined about the x-axis, then yawed in screen plane.
        // Matches the ring transform exactly, so nodes ride their rings.
        const px = rx * Math.cos(a);
        const py = rx * Math.sin(a);
        const y1 = py * m.cosT;
        const lx = px * m.cosY - y1 * m.sinY;
        const ly = px * m.sinY + y1 * m.cosY;
        // Document-space orbit slot; viewport = minus scroll (tracks hero scroll).
        const ox = S.ax + lx;
        const oy = S.ay + ly;
        const vx = ox - window.scrollX;
        const vy = oy - window.scrollY;
        // True projected depth (front = toward viewer): brighter/larger in front,
        // dimmer behind. Nodes never vanish: rear floor keeps every destination
        // identifiable while rear nodes slip behind Saturn via z-order.
        const depth = (Math.sin(a) + 1) / 2;
        const el = nodes[i];
        if (!el) continue;
        if (S.mobile) {
          // Migrate upward toward the navbar, dissolving before arrival so the
          // hamburger bar is never crowded and no links ever duplicate.
          const tx = window.innerWidth / 2 + (i - 1.5) * 52;
          const ty = 44;
          const X = lerp(vx, tx, e);
          const Y = lerp(vy, ty, e);
          const msc = 0.8 + 0.3 * depth;
          const mop = 0.5 + 0.5 * depth;
          const fade = 1 - clamp01((e - 0.5) / 0.35);
          el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${msc.toFixed(3)})`;
          el.style.opacity = (mop * fade).toFixed(3);
          el.style.visibility = fade < 0.02 ? "hidden" : "visible";
          el.style.zIndex = "30";
          placeTag(i, vx, vy);
          continue;
        }
        const s = S.slots[i];
        const X = lerp(vx, s.x, trav);
        const Y = lerp(vy, s.y, trav);
        const sc = lerp(0.8 + 0.3 * depth, 1, trav);
        const op = lerp(0.5 + 0.5 * depth, 1, trav);
        el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.visibility = "visible";
        const zi = p < 0.5 ? (depth > 0.45 ? "30" : "10") : "30";
        if (el.dataset.zi !== zi) {
          el.style.zIndex = zi;
          el.dataset.zi = zi;
        }
        placeTag(i, vx, vy);
      }

      if (saturn) {
        const sx = S.ax - window.scrollX;
        const syy = S.ay - window.scrollY;
        if (S.mobile) {
          // One Saturn only: it travels to the navbar center, shrinking, and
          // dissolves on arrival — the hamburger bar is never crowded.
          const tx = window.innerWidth / 2;
          const ty = 38;
          const X = lerp(sx, tx, e);
          const Y = lerp(syy, ty, e);
          const sc = S.planetBase * lerp(1, 0.2, e);
          const satFade = 1 - clamp01((e - 0.7) / 0.3);
          saturn.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(3)})`;
          saturn.style.opacity = satFade.toFixed(3);
          saturn.style.visibility = satFade < 0.02 ? "hidden" : "visible";
        } else {
          const X = lerp(sx, S.sat.x, trav);
          const Y = lerp(syy, S.sat.y, trav);
          const sc = S.planetBase * lerp(1, 0.24, trav);
          saturn.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(3)})`;
          saturn.style.opacity = "1";
          saturn.style.visibility = "visible";
        }
        saturn.style.zIndex = "20";
      }
    };

    let last = performance.now();
    let raf = 0;
    let resizeTimer = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      render(dt);
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (reducedRef.current) render(0);
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        if (reducedRef.current) render(0);
      }, 150);
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reducedRef.current && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    measure();
    render(0);
    layer.classList.add("is-ready");
    if (!reducedRef.current) raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measure();
        if (reducedRef.current) render(0);
      });
    }
    const settleTimer = window.setTimeout(measure, 600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, refs]);

  return (
    <div ref={layerRef} className="olayer" aria-label="Orbital site navigation">
      <div
        ref={(el) => {
          ringRefs.current[0] = el;
        }}
        className="oring oring-a"
        aria-hidden="true"
      />
      <div
        ref={(el) => {
          ringRefs.current[1] = el;
        }}
        className="oring oring-b"
        aria-hidden="true"
      />
      {ORBIT_NAV_NODES.map((n, i) => (
        <button
          key={n.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          type="button"
          className={`onode${activeId === n.id ? " is-active" : ""}`}
          style={{ ["--nc" as string]: n.color }}
          onClick={() => onNavigate(n.target)}
          onPointerEnter={() => hold(true)}
          onPointerLeave={() => hold(false)}
          onFocus={() => hold(true)}
          onBlur={() => hold(false)}
          aria-label={`${n.label} — ${n.hint}`}
          aria-current={activeId === n.id ? "true" : undefined}
        >
          <span className="onode-orbit" aria-hidden="true">
            <span className="onode-dot" />
            <span
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
              className="onode-tag"
            >
              {n.label}
            </span>
          </span>
          <span className="onode-bar" aria-hidden="true">
            {n.label}
          </span>
        </button>
      ))}
      <button
        ref={saturnRef}
        type="button"
        className={`osaturn${activeId === "home" ? " is-active" : ""}`}
        onClick={() => onNavigate("top")}
        aria-label="Home — back to top"
        aria-current={activeId === "home" ? "true" : undefined}
      >
        <span className="pring pring-back" aria-hidden="true" />
        <span className="oplanet" aria-hidden="true">
          <span className="osheen" />
        </span>
        <span className="pring pring-front" aria-hidden="true" />
        <span className="ohome" aria-hidden="true">
          HOME
        </span>
      </button>
    </div>
  );
}
