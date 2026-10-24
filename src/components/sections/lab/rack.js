/**
 * Rack: the homelab as it stands. A ten-inch rack, router on its roof; two ThinkCentre Tinys, the 2.5G and 1G
 * switches patched into their panels, a shelf of Raspberry Pis. A third Tiny is bolted to its side, the SFF stands
 * beside it, and every node wears a PicoTTY Pico. The machine under the pointer slides out; rack units next to it
 * follow, staggered outwards. The slider is how far. It emits "hairline:anchors" so a page can annotate it.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, proj, rings, prism, put, ringAt, rrect, seg,
  tset, tval, tween, disposer, mk, place, pointer, register, solid,
} = HL;

const X0 = 0, X1 = 114, D = 84, PW = 6, FOOT = 7, GAP = 3; // the frame, in world units
const UX0 = X0 + PW + 1, UX1 = X1 - PW - 1;
const SPEC = [["tiny 1", 18, "tiny"], ["tiny 2", 18, "tiny"], ["2.5g sw", 25, "switch"], ["1g sw", 25, "switch"], ["raspis", 30, "pis"]];
let zc = FOOT;
const STACK = SPEC.slice().reverse().map(([name, h, kind]) => { const u = { name, kind, z0: zc + GAP / 2, z1: zc + h - GAP / 2 }; zc += h; return u; }).reverse();
const H = zc + 2, RT = 4, RZ = H + RT, ANT_L = 38; // roof, router height
const ANT = [[16, 18, -18, -10], [44, 14, -5, -16], [70, 14, 7, -16], [98, 18, 20, -9]];
const SFF = { x0: X0 - 54, x1: X0 - 18, y0: D - 92, y1: D, z0: 0, z1: 112 };
const SIDE = { x0: X1 + 1.5, x1: X1 + 15, y0: D - 70, y1: D - 2, z0: 30, z1: 98 };

const F = (Q, y) => (x, z) => Q(x, y, z); // a face facing +y, as (x, z)
const slot = (f, a0, b0, a1, b1, r, n = 3) => poly(rrect(Math.min(a0, a1), Math.min(b0, b1), Math.max(a0, a1), Math.max(b0, b1), r, n).map((q) => f(q.u, q.v)));
const B = (x0, y0, x1, y1, z0, z1, r = 1.6, b = 1) => ({ x0, y0, x1, y1, z0, z1, r, b });

/** A machine's front: ports, a power button and a vent. (a, b) run across and up the face. */
function face(f, a0, a1, b0, b1, upright) {
  const out = [], m = (b0 + b1) / 2, w = a1 - a0;
  if (upright) { // standing: the controls near the top, the vent below
    out.push([slot(f, a0 + 3, b1 - 8, a0 + 7, b1 - 4, 1.9, 4), "nf"]);
    out.push([slot(f, a0 + 2.5, b1 - 18, a1 - 2.5, b1 - 15.5, 0.6) + slot(f, a0 + 2.5, b1 - 23, a1 - 2.5, b1 - 20.5, 0.6), "nf lo"]);
    for (let k = 0; k < 9; k++) out.push([seg(f(a0 + 2.5, b0 + 6 + k * 3.4), f(a1 - 2.5, b0 + 6 + k * 3.4)), "nf lo"]);
  } else { // lying: the controls on the left, the vent on the right
    out.push([slot(f, a0 + 4, m - 2, a0 + 8, m + 2, 1.9, 4), "nf"]);
    out.push([slot(f, a0 + 12, m - 1.4, a0 + 17, m + 1.4, 0.5) + slot(f, a0 + 28, m - 1.4, a0 + 33, m + 1.4, 0.5), "nf lo"]);
    out.push([slot(f, a1 - w * 0.42, b0 + 2.5, a1 - 3, b1 - 2.5, 1.4), "nf lo"]);
    for (let k = 1; k < 12; k++) { const x = a1 - w * 0.42 + (k * (w * 0.42 - 3)) / 12; out.push([seg(f(x, b0 + 3.6), f(x, b1 - 3.6)), "nf lo"]); }
  }
  return out;
}
/** The machines: the router, the rack units top down, then the side Tiny; the SFF goes first. Each gives its solids and marks. */
function parts(screen) {
  const list = [{ name: "router", at: [X1 / 2, 64, RZ + 4], ants: true, shapes: () => [B(10, 12, X1 - 10, 64, RZ, RZ + 8, 9, 1.8)],
    marks: (Q) => [[[0, 1, 2, 3, 4, 5].map((k) => slot(F(Q, 64), 30 + k * 10, RZ + 3, 33 + k * 10, RZ + 5, 1)).join(""), "nf lo"]] }];
  for (const u of STACK) {
    const p = { name: u.name, at: [X1 / 2, D, (u.z0 + u.z1) / 2] }, m = (u.z0 + u.z1) / 2;
    if (u.kind === "tiny") {
      p.shapes = () => [B(UX0, 2, UX1, D, u.z0, u.z0 + 2, 1.4, 1), B(UX0 + 8, 10, UX1 - 8, D - 2, u.z0 + 2, u.z1, 2.6, 1.2), B(UX0 + 20.5, D - 2, UX0 + 25.5, D + 7, m - 0.2, m + 3, 0.8, 0.5)];
      p.pico = [UX0 + 23, D + 7, m + 1.4];
      p.marks = (Q) => face(F(Q, D - 2), UX0 + 8, UX1 - 8, u.z0 + 2, u.z1, false);
    } else if (u.kind === "switch") {
      p.shapes = () => [B(UX0, 2, UX1, D, u.z0, u.z1, 1.6, 1)];
      p.marks = (Q) => {
        const f = F(Q, D), hi = u.z1 - 6, lo = u.z0 + 5, out = [[seg(f(UX0 + 2, (hi + lo) / 2), f(UX1 - 2, (hi + lo) / 2)), "nf lo"]];
        for (let i = 0; i < 8; i++) {
          const x = UX0 + 14 + i * 10.6, sag = 6 + (i % 3) * 1.8, pts = [];
          out.push([slot(f, x - 3.2, hi - 2.4, x + 3.2, hi + 2.4, 0.8) + slot(f, x - 3.2, lo - 2.4, x + 3.2, lo + 2.4, 0.8), "nf lo"]);
          for (let t = 0; t <= 10; t++) { const s = t / 10; pts.push(Q(x, D + Math.sin(Math.PI * s) * sag, hi - 2.4 - (hi - lo - 4.8) * s)); }
          out.push([open(pts), "nf"]);
        }
        return out;
      };
      p.leds = Array.from({ length: 8 }, (_, i) => [UX0 + 14 + i * 10.6, D, u.z1 - 2]);
    } else {
      const pis = [[UX0 + 6, UX0 + 40], [UX1 - 40, UX1 - 6]], z0 = u.z0 + 2, z1 = u.z1 - 2;
      p.shapes = () => [B(UX0, 2, UX1, D, u.z0, z0, 1.4, 1), B(X1 / 2 - 14, D - 18, X1 / 2 + 14, D - 6, z0, z0 + 1.4, 1.2, 0.5), ...pis.map(([a, b]) => B(a, D - 5, b, D - 2.6, z0, z1, 1.6, 0.6))];
      p.marks = (Q) => pis.flatMap(([a, b]) => {
        const f = F(Q, D - 2.6);
        return [[slot(f, a + 4, z0 + 4, b - 4, z1 - 5, 1.2), "nf"], ...[0, 1, 2].map((k) => [seg(f(a + 7, z1 - 9 - k * 3.4), f(b - 7 - ((k + screen.phase + (a > X1 / 2 ? 1 : 0)) % 3) * 5, z1 - 9 - k * 3.4)), "nf lo"])];
      });
      // each Pi's four mounting holes, then the Pi Zero hub's 2 × 10 header lying between them
      p.dots = (Q) => [...pis.flatMap(([a, b]) => [[a + 2, z0 + 2], [b - 2, z0 + 2], [a + 2, z1 - 2], [b - 2, z1 - 2]].map(([x, z]) => Q(x, D - 2.6, z))),
        ...Array.from({ length: 20 }, (_, k) => Q(X1 / 2 - 11.5 + (k % 10) * 2.5, D - 15.5 + Math.floor(k / 10) * 2.4, z0 + 1.4))];
    }
    list.push(p);
  }
  const S = SIDE, T = SFF;
  list.push({ name: "tiny 3", at: [S.x1, S.y1, (S.z0 + S.z1) / 2], shapes: () => [B(S.x0, S.y0, S.x1, S.y1, S.z0, S.z1, 2.4, 1.2), B(S.x0 + 4.5, S.y1, S.x0 + 8.5, S.y1 + 8, S.z1 - 22, S.z1 - 17, 0.8, 0.5)],
    pico: [S.x0 + 6.5, S.y1 + 8, S.z1 - 19.5], marks: (Q) => face(F(Q, S.y1), S.x0, S.x1, S.z0, S.z1, true) });
  list.unshift({ name: "sff", at: [T.x1, T.y1, 60], pico: [T.x0 + 17.5, T.y1 + 8, T.z1 - 28], shapes: () => [B(T.x0, T.y0, T.x1, T.y1, T.z0 + 3, T.z1, 2.6, 1.4), B(T.x0 + 2, T.y0 + 4, T.x1 - 2, T.y1 - 4, 0, 3, 2, 1), B(T.x0 + 15, T.y1, T.x0 + 20, T.y1 + 8, T.z1 - 30, T.z1 - 26, 0.8, 0.5)],
    marks: (Q) => [[slot(F(Q, T.y1), T.x0 + 4, T.z1 - 14, T.x1 - 4, T.z1 - 10, 1), "nf"], ...face(F(Q, T.y1), T.x0, T.x1, T.z0 + 3, T.z1 - 14, true)] });
  return list;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.12);
  fit(C, [[SFF.x0, SFF.y0, 0], [SFF.x0, D + 30, 0], [X1 + 15, D + 30, 0], [X1 + 15, 0, H], [X0, D, RZ + 8 + ANT_L], [X1, 0, RZ + 8 + ANT_L]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const draw = (s, Q, b) => { const [ring, inner] = rings(b.x0, b.y0, b.x1, b.y1, b.r, b.b); put(s, prism(Q, front, ring, inner, b.z0, b.z1)); };
  const sil = (parent) => { const s = solid(parent); s.sil.setAttribute("class", "sil"); return s; }, still = (b) => draw(sil(g), P, b);
  const post = (x, y) => {
    still(B(x, y, x + PW, y + PW, FOOT - 1, H, 1.2, 0.8));
    if (y > 0) for (let k = 0; k < 26; k++) place(mk("circle", { r: 0.6, class: "dot off" }, g), P(x + PW / 2, D, FOOT + 4 + (k * (H - FOOT - 8)) / 25));
  };
  const make = (p) => {
    p.grp = mk("g", {}, g);
    p.solids = p.shapes().map(() => sil(p.grp));
    p.antS = p.ants ? ANT.map(() => sil(p.grp)) : [];
    p.mk = mk("g", {}, p.grp);
    p.ledEls = (p.leds ?? []).map((_, i) => mk("circle", { r: 0.8, class: i % 3 === 1 ? "dot off" : "dot m" }, p.grp));
    p.dotEls = p.dots ? p.dots(P).map(() => mk("circle", { r: 0.55, class: "dot off" }, p.grp)) : [];
    p.picoEl = p.pico ? mk("circle", { r: 0.8, class: "dot off" }, p.grp) : null;
    p.rest = p.name === "raspis" ? 16 : 0;
    p.pull = tween(p.rest); p.drawn = NaN;
  };

  // Back to front: the SFF (farthest), plinth, left posts, rack units bottom up, right posts, roof, router, side Tiny.
  // A unit sliding out passes in front of the left posts; the right posts always hide the units' right sides.
  const screen = { phase: 0 }; // which line of the Pi screens' logs is newest
  const list = parts(screen), sff = list[0], router = list[1], units = list.slice(2, 7), side = list[7];
  make(sff);
  still(B(X0 - 4, -4, X1 + 4, D + 4, 0, FOOT - 1, 4, 2));
  post(X0, 0); post(X0, D - PW);
  units.slice().reverse().forEach(make);
  post(X1 - PW, 0); post(X1 - PW, D - PW);
  still(B(X0 - 1.5, -1.5, X1 + 1.5, D + 1.5, H, RZ, 2.4, 1.4));
  make(router); make(side);
  const order = [router, ...units]; // the rack, top down: the stagger runs along it
  const mark = units[4].dotEls[8]; // at rest, one bright mark: the hub's first header pin
  mark.setAttribute("class", "dot");

  function paint(p, dy) {
    const Q = (x, y, z) => P(x, y + dy, z);
    p.shapes().forEach((b, i) => draw(p.solids[i], Q, b));
    p.antS.forEach((s, k) => {
      const [x, y, lx, ly] = ANT[k], ring = (r, cx, cy, z) => ringAt(Q, circ(r, 10).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), z);
      put(s, { sil: poly(hull(ring(2.2, x, y, RZ + 7).concat(ring(1.6, x + lx, y + ly, RZ + 8 + ANT_L)))), crease: "" });
    });
    p.mk.replaceChildren();
    for (const [d, cls] of p.marks(Q)) mk("path", { d, class: cls }, p.mk);
    (p.leds ?? []).forEach((l, i) => place(p.ledEls[i], Q(...l)));
    if (p.dots) p.dots(Q).forEach((pt, i) => place(p.dotEls[i], pt));
    if (p.picoEl) place(p.picoEl, Q(...p.pico));
  }
  // Ambient: switch LEDs flicker with traffic, each Pico blinks its 5 s PicoTTY heartbeat, the Pi screens scroll.
  const cls = (el, c) => el.getAttribute("class") !== c && el.setAttribute("class", c), flick = (i, k, t) => ((Math.sin(i * 12.9898 + k * 78.233 + t * 0.37) * 43758.5453) % 1 + 1) % 1;
  function ambient(now) {
    const t = Math.floor(now / 120), ph = Math.floor(now / 1400) % 3;
    units.forEach((u, i) => u.ledEls.forEach((el, k) => cls(el, flick(i, k, t) > 0.45 ? "dot m" : "dot off")));
    router.ledEls.forEach((el, k) => cls(el, flick(9, k, Math.floor(now / 400)) > 0.3 ? "dot m" : "dot off"));
    list.filter((p) => p.picoEl).forEach((p, i) => cls(p.picoEl, (now / 1000 + i * 1.25) % 5 < 0.3 ? "dot m" : "dot off"));
    if (ph !== screen.phase) { screen.phase = ph; units[4].drawn = NaN; }
  }
  // Where each machine's front is now, in viewBox units, for whatever annotates the figure from outside it.
  const at = (p, [x, y, z]) => P(x, y + p.drawn, z);
  const anchors = () => Object.fromEntries([...list.map((p) => [p.name, at(p, p.at)]), ["pico", at(side, side.pico)]]);
  const loop = register(stage, (_dt, now) => {
    let moved = false;
    ambient(now);
    for (const p of list) {
      const dy = tval(p.pull, now) * (reach / 18) * (p === sff ? 0.45 : 1); // the SFF stays clear of the rack's posts
      if (dy !== p.drawn) { paint(p, dy); p.drawn = dy; moved = true; }
    }
    if (moved) stage.dispatchEvent(new CustomEvent("hairline:anchors", { detail: anchors() }));
    return true; // ambient: the kernel still sleeps it offscreen and under reduced motion
  });
  bag.add(loop.unregister);
  // Hit test on the rest pose: the topmost resting outline under the pointer, in paint order. Nothing moves it.
  const painted = [sff, ...units.slice().reverse(), router, side];
  const hulls = painted.map((p) => hull(p.shapes().flatMap((b) => [b.x0, b.x1].flatMap((x) => [b.y0, b.y1].flatMap((y) => [b.z0, b.z1 + (p.ants ? ANT_L : 0)].map((z) => P(x, y, z)))))));
  const side_ = (h, [x, y], i) => { const a = h[i], b = h[(i + 1) % h.length]; return Math.sign((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])); };
  const inside = (h, pt) => new Set(h.map((_, i) => side_(h, pt, i)).filter(Boolean)).size < 2;
  function hit(pt) {
    for (let i = painted.length - 1; i >= 0; i--) if (inside(hulls[i], pt)) return list.indexOf(painted[i]);
    return -1;
  }

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), chosen = list[a], from = order.indexOf(chosen ?? list[act]);
    act = a;
    list.forEach((p) => {
      const i = order.indexOf(p), j = order.indexOf(chosen), d = p === chosen ? 0 : i >= 0 && j >= 0 ? Math.abs(i - j) : 9;
      const target = a < 0 ? p.rest : d === 0 ? 18 : d === 1 ? 5 : d === 2 ? 1.5 : 0;
      tset(p.pull, target, now, i >= 0 && from >= 0 ? Math.abs(i - from) * 45 : 0);
      for (const s of [...p.solids, ...p.antS]) s.sil.classList.toggle("hi", p === chosen);
    });
    mark.classList.toggle("m", a >= 0);
    read.textContent = a < 0 ? "rest" : chosen.name;
    loop.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; list.forEach((p) => (p.drawn = NaN)); loop.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rack",
  means: "The homelab rack: four nodes, two switches patched into their panels, the Pis. The machine under the pointer slides out.",
  rules: [1, 2, 5, 6, 9],
  range: [8, 18, 28],
  tour: [[229, 79], [273, 193], [206, 226], null],
  mount,
});
