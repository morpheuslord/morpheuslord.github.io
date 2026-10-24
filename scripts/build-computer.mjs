// Builds the hero computer with the anatomy kit's 3D turn mode (src/lib/anatomy).
// Writes src/components/sections/computer/computer.gen.json: the stage markup at
// rest and the turn data the runtime needs to re-project it while it spins.
//   node scripts/build-computer.mjs            build
//   node scripts/build-computer.mjs --audit    build, then run the kit and orbit audits
//   node scripts/build-computer.mjs --page     also write a standalone check page to the scratch dir
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../src/lib/anatomy/iso-kit.mjs";
import * as G from "../src/lib/anatomy/lathe.mjs";
import * as A from "../src/lib/anatomy/audit.mjs";
import { turning } from "../src/lib/anatomy/turn-build.mjs";
import * as TA from "../src/lib/anatomy/turn-audit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../src/components/sections/computer");
const argv = process.argv.slice(2);

const WIDTH = 560;
const HEIGHT = 500;
const AZIMUTH = 225;
const ELEVATION = 30;

// ── World layout (z up, ~1 unit per CSS px of the old model) ─────────────────
// Base unit: a desktop case lying flat, its front facing -y.
const CASE = { x: -75, y: -70, w: 150, d: 140, r: 3 };
const FOOT_H = 5;
const CASE_Z0 = FOOT_H;
const CASE_Z1 = 42;
const FRONT_Y = CASE.y; // -70
const BEZEL_T = 2.4;
const BEZEL_Z0 = 11;
const BEZEL_Z1 = CASE_Z1 - 3;

// Monitor: swivel disc and neck on the case, then the CRT.
const SWIVEL_R = 32;
const SWIVEL_Z1 = CASE_Z1 + 4;
const NECK = { x: -22, y: -18, w: 44, d: 34, r: 3 };
const NECK_Z1 = SWIVEL_Z1 + 7;
const MON = { x: -72, y: -58, w: 144, d: 24, r: 4 }; // front bezel box
const MON_Z0 = NECK_Z1;
const MON_Z1 = MON_Z0 + 124;
const HOUSE = { x: -58, y: MON.y + MON.d, w: 116, d: 54, r: 6 };
const HOUSE_Z0 = MON_Z0 + 8;
const HOUSE_Z1 = MON_Z1 - 10;
const CAP = { x: -40, y: HOUSE.y + HOUSE.d, w: 80, d: 16, r: 5 };
const CAP_Z0 = HOUSE_Z0 + 16;
const CAP_Z1 = HOUSE_Z1 - 18;
const FACE_Y = MON.y; // front face of the monitor bezel
const OPEN = { x0: -56, x1: 56, z0: MON_Z0 + 26, z1: MON_Z1 - 12 };
const FRAME_T = 3.2; // how far the frame stands proud of the bezel
const GLASS_T = 1; // the glass lies on the bezel face, recessed inside the raised frame

// Keyboard in front, mouse to its right.
const KB = { x: -58, y: -152, w: 142, d: 50, r: 3 }; // mirrored: keys are laid out from KB_L toward -x
const KB_Z1 = 7;
const U = 8; // key pitch
const KEY_GAP = 1.3;
const MOUSE = [-86, -126];

const points = [
  ...k.boxCorners(KB, 0, KB_Z1 + 4),
  ...k.boxCorners(CASE, 0, CASE_Z1),
  ...k.boxCorners({ x: MON.x, y: MON.y, w: MON.w, d: CAP.y + CAP.d - MON.y }, MON_Z0, MON_Z1),
  ...k.boxCorners({ x: MOUSE[0] - 10, y: MOUSE[1] - 14, w: 20, d: 28 }, 0, 9),
];
// The model turns, so fit the swept footprint: every corner at every azimuth.
const reach = Math.max(...points.map(([x, y]) => Math.hypot(x, y)));
const swept = [];
for (let i = 0; i < 32; i++) {
  const a = (i / 32) * Math.PI * 2;
  swept.push([reach * Math.cos(a), reach * Math.sin(a), 0], [reach * 0.55 * Math.cos(a), reach * 0.55 * Math.sin(a), MON_Z1]);
}
export const P = k.fitProjection(swept, WIDTH, HEIGHT, { pad: 6, azimuth: AZIMUTH, elevation: ELEVATION });
// The feet, the keyboard and the mouse stand on the desk (z = 0), which is the page itself.
const onDesk = (shape) => /^(case\.foot|kb\.case|mouse\.body)/.test(shape.name ?? "");
export const R = A.recorder(P, { ground: onDesk });
export const T = turning(P, { recorder: R });
const pc = T.group("pc", { turn: { pivot: [0, 0] } });
const live = T.layer("pc");
T.stack(["back", "pc"]);
export const follow = (values) => ({ ...values });
export const poses = () => Array.from({ length: 720 }, (_, i) => ({ pc: i * 0.5 }));

const H = { group: pc, layer: live };
const VERT = (x, y) => G.frameOf([x, y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const frameOf = (o, a, u) => {
  const axis = G.unit3(a);
  const uu = G.unit3(G.sub3(u, G.mul3(axis, G.dot3(u, axis))));
  return { o, a: axis, u: uu, v: G.cross3(axis, uu) };
};
const box = (name, plan, z, h, opts = {}) => T.prism({ name, ...H, plan, z, h, steps: opts.steps ?? 3, tone: "mid", crease: "lo", ...opts });
const rect = (x0, y0, x1, y1, r = 0.6) => ({ x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), d: Math.abs(y1 - y0), r });
// Markup on the front face (normal -y): svg x runs along +x, svg y runs down (-z).
// Seen from the front, +x is on the viewer's left, so the face's u runs along -x.
// Face markup is written in svg x = -world x; physical parts use mx()/mrect() to match.
const FRONT_UV = { u: [-1, 0, 0], v: [0, 0, -1], normal: [0, -1, 0] };
const mrect = (x0, y0, x1, y1, r) => rect(-x1, y0, -x0, y1, r);
const onFront = (part, y, svg) => T.plane({ part, o: [0, y, 0], ...FRONT_UV, svg });
const slot = (x0, x1, z0, z1, tone = "lo") => {
  const r = Math.min(0.9, (z1 - z0) / 2);
  return `<rect class="iso-line" data-tone="${tone}" x="${x0}" y="${-z1}" width="${x1 - x0}" height="${z1 - z0}" rx="${r}" fill="none"/>`;
};

// ── Base unit ────────────────────────────────────────────────────────────────
for (const [x, y] of k.corners(CASE, 14)) T.round({ name: `case.foot.${x}.${y}`, ...H, F: VERT(x, y), s0: 0, s1: FOOT_H, r: 5, tone: "lo", material: "rubber" });
const caseScrews = k.corners(CASE, 6).map(([x, y]) => ({ at: [CASE_Z1, x, y], normal: [0, 0, 1], size: 0.5, tone: "mid" }));
const caseBody = box("case.body", CASE, CASE_Z0, CASE_Z1 - CASE_Z0, {
  steps: 4, bevel: 1.2, tone: "hi", material: "beige",
  details: { seams: [CASE_Z0 + 5], dots: caseScrews, rings: caseScrews.map((d) => ({ at: d.at, normal: d.normal, r: 1.3, tone: "lo" })) },
});
// Side vents on +x, a lid seam on the top.
T.plane({ part: caseBody, o: [CASE.x + CASE.w, 0, 0], u: [0, -1, 0], v: [0, 0, -1], normal: [1, 0, 0],
  svg: Array.from({ length: 9 }, (_, i) => slot(-36 + i * 8, -31 + i * 8, CASE_Z0 + 12, CASE_Z1 - 9)).join("") });
T.plane({ part: caseBody, o: [CASE.x, 0, 0], u: [0, 1, 0], v: [0, 0, -1], normal: [-1, 0, 0],
  svg: Array.from({ length: 6 }, (_, i) => slot(-20 + i * 8, -15 + i * 8, CASE_Z0 + 12, CASE_Z1 - 9)).join("") });
T.plane({ part: caseBody, o: [0, 0, CASE_Z1], u: [1, 0, 0], v: [0, 1, 0], normal: [0, 0, 1],
  svg: `<path class="iso-line" data-tone="faint" d="M${CASE.x + 4} ${CASE.y + 22}H${CASE.x + CASE.w - 4}"/>` });

// Front bezel: a darker putty plate proud of the case front.
const BZ = rect(CASE.x + 3, FRONT_Y - BEZEL_T, CASE.x + CASE.w - 3, FRONT_Y, 1.2);
const bezel = box("case.bezel", BZ, BEZEL_Z0, BEZEL_Z1 - BEZEL_Z0, { bevel: 0.6, material: "putty", tone: "hi" });
const BF = FRONT_Y - BEZEL_T; // bezel front face y
// 5.25" bay (the brown drive door of the old model) and 3.5" bay.
const BAY5 = { x0: -64, x1: -2, z0: 24, z1: 35 };
const BAY3 = { x0: -64, x1: -22, z0: 13.5, z1: 20.5 };
for (const [id, b] of Object.entries({ bay5: BAY5, bay3: BAY3 })) {
  const door = box(`case.${id}`, mrect(b.x0, BF - 1, b.x1, BF), b.z0, b.z1 - b.z0, { steps: 2, bevel: 0.35, material: "walnut", tone: "hi" });
  const mid = (b.z0 + b.z1) / 2;
  onFront(door, BF - 1, slot(b.x0 + 6, b.x1 - 16, mid - 0.9, mid + 0.9, "hi") + slot(b.x1 - 12, b.x1 - 4, mid - 2.2, mid + 2.2, "mid"));
}
// Eject lever on the 5.25" door and button on the 3.5" bay.
box("case.bay5.lever", mrect(BAY5.x1 - 11, BF - 2.6, BAY5.x1 - 5, BF - 1), (BAY5.z0 + BAY5.z1) / 2 - 2, 4, { steps: 2, bevel: 0.25, material: "putty", tone: "hi" });
box("case.bay3.eject", mrect(BAY3.x1 - 9, BF - 2.4, BAY3.x1 - 4, BF - 1), (BAY3.z0 + BAY3.z1) / 2 - 1.4, 2.8, { steps: 2, bevel: 0.2, material: "putty", tone: "hi" });
// Power button, reset button and the two LEDs.
const POWER = mrect(44, BF - 3, 58, BF, 1.4);
box("case.power", POWER, 15, 12, { steps: 3, bevel: 0.5, material: "putty", tone: "hi", details: { seams: [] } });
box("case.reset", mrect(34, BF - 1.6, 39, BF, 0.6), 18, 6, { steps: 2, bevel: 0.25, material: "walnut" });
// Badge plate on the bezel.
const badge = box("case.badge", mrect(16, BF - 0.8, 40, BF, 0.6), 29, 6, { steps: 2, bevel: 0.2, material: "walnut", tone: "hi" });
onFront(badge, BF - 0.8, `<text class="iso-face-text pc-badge" x="28" y="${-30.9}" font-size="3.4" text-anchor="middle">RETRO</text>`);
// Speaker grille dots and the LED windows on the bezel face.
const grille = [];
for (let c = 0; c < 6; c++) for (let r = 0; r < 3; r++) grille.push(`<circle class="pc-grille" cx="${10 + c * 3.2}" cy="${-(15 + r * 3)}" r="0.7"/>`);
onFront(bezel, BF, `${grille.join("")}
  <circle class="pc-led pc-led-on" cx="64" cy="${-33}" r="1.3"/><circle class="pc-led pc-led-hdd" cx="58" cy="${-33}" r="1.1"/>
  <path class="iso-line" data-tone="faint" d="M${BZ.x + 2} ${-(BEZEL_Z0 + 1.6)}H${BZ.x + BZ.w - 2}"/>`);
// Keyboard port on the case front, under the bezel.
const PORT_Z = 8;
const PORT_X = 30;

// ── Monitor ──────────────────────────────────────────────────────────────────
T.round({ name: "mon.swivel", ...H, F: VERT(0, -12), s0: CASE_Z1, s1: SWIVEL_Z1, r: SWIVEL_R, tone: "mid", material: "putty", details: { seams: [CASE_Z1 + 1.4] } });
box("mon.neck", { ...NECK, y: NECK.y - 12 }, SWIVEL_Z1, NECK_Z1 - SWIVEL_Z1, { steps: 3, bevel: 0.6, material: "putty", tone: "hi" });
const shell = box("mon.bezel", MON, MON_Z0, MON_Z1 - MON_Z0, { steps: 4, bevel: 1.6, tone: "hi", material: "beige", details: { seams: [MON_Z0 + 4] } });
const house = box("mon.house", HOUSE, HOUSE_Z0, HOUSE_Z1 - HOUSE_Z0, { steps: 5, bevel: 1.4, tone: "hi", material: "beige", details: { seams: [HOUSE_Z1 - 6] } });
const cap = box("mon.cap", CAP, CAP_Z0, CAP_Z1 - CAP_Z0, { steps: 5, bevel: 1.2, tone: "hi", material: "beige" });
// Vents on the housing top and on the cap's back.
T.plane({ part: house, o: [0, 0, HOUSE_Z1], u: [1, 0, 0], v: [0, 1, 0], normal: [0, 0, 1],
  svg: Array.from({ length: 11 }, (_, i) => `<rect class="iso-line" data-tone="lo" x="${-40 + i * 7.6}" y="${HOUSE.y + 12}" width="3.4" height="${HOUSE.d - 24}" rx="1.2" fill="none"/>`).join("") });
T.plane({ part: cap, o: [0, CAP.y + CAP.d, 0], u: [1, 0, 0], v: [0, 0, -1], normal: [0, 1, 0],
  svg: Array.from({ length: 7 }, (_, i) => slot(-26 + i * 7.6, -23 + i * 7.6, CAP_Z0 + 12, CAP_Z1 - 12)).join("") });
// Side vents on both sides of the housing.
for (const side of [1, -1]) {
  const x = side > 0 ? HOUSE.x + HOUSE.w : HOUSE.x;
  T.plane({ part: house, o: [x, 0, 0], u: [0, -side, 0], v: [0, 0, -1], normal: [side, 0, 0],
    svg: Array.from({ length: 5 }, (_, i) => {
      const y = HOUSE.y + 12 + i * 8;
      const x0 = side > 0 ? -y - 3.6 : y;
      return slot(x0, x0 + 3.6, HOUSE_Z0 + 20, HOUSE_Z1 - 26);
    }).join("") });
}

// Screen opening: a raised frame of four bars, the glass set back inside it.
const FY0 = FACE_Y - FRAME_T;
const frame = (name, x0, x1, z0, z1) => box(`mon.frame.${name}`, rect(x0, FY0, x1, FACE_Y, 0.8), z0, z1 - z0, { steps: 2, bevel: 0.7, tone: "hi", material: "beige" });
const FW = 5; // frame bar width
frame("bottom", OPEN.x0 - FW, OPEN.x1 + FW, OPEN.z0 - FW, OPEN.z0);
frame("top", OPEN.x0 - FW, OPEN.x1 + FW, OPEN.z1, OPEN.z1 + FW);
frame("left", OPEN.x0 - FW, OPEN.x0, OPEN.z0, OPEN.z1);
frame("right", OPEN.x1, OPEN.x1 + FW, OPEN.z0, OPEN.z1);
const GLASS_Y = FACE_Y - GLASS_T;
const glass = box("mon.glass", rect(OPEN.x0, GLASS_Y, OPEN.x1, FACE_Y, 0.4), OPEN.z0, OPEN.z1 - OPEN.z0, { steps: 2, tone: "hi", material: "glass" });
// The terminal on the glass. Coordinates: x along +x, y = -z.
const SX0 = OPEN.x0 + 2.5;
const SX1 = OPEN.x1 - 2.5;
const SZ0 = OPEN.z0 + 2.5;
const SZ1 = OPEN.z1 - 2.5;
const scan = [];
for (let z = SZ0 + 1; z < SZ1; z += 1.8) scan.push(`M${SX0} ${(-z).toFixed(1)}H${SX1}`);
const TX = SX0 + 8;
const lineAt = (i) => -(SZ1 - 14 - i * 9);
const screenSvg = `<g class="pc-screen" data-screen="">
  <rect class="pc-crt" x="${SX0}" y="${-SZ1}" width="${SX1 - SX0}" height="${SZ1 - SZ0}" rx="5"/>
  <rect class="pc-glow" x="${SX0}" y="${-SZ1}" width="${SX1 - SX0}" height="${SZ1 - SZ0}" rx="5"/>
  <text class="pc-term" x="${TX}" y="${lineAt(0)}">$ npm run dev</text>
  <text class="pc-term pc-dim" x="${TX}" y="${lineAt(1)}">✓ ready in 1.2s</text>
  <text class="pc-term" x="${TX}" y="${lineAt(2)}"><tspan class="pc-cyan">→</tspan> local: <tspan class="pc-white">localhost</tspan></text>
  <rect class="pc-bar" x="${TX}" y="${lineAt(3.4) - 4.6}" width="58" height="6" rx="0.6"/>
  <rect class="pc-bar-fill" x="${TX + 1.4}" y="${lineAt(3.4) - 3.2}" width="34" height="3.2"/>
  <text class="pc-term" x="${TX}" y="${lineAt(5.2)}">$ <tspan class="pc-cursor">█</tspan></text>
  <path class="pc-scan" d="${scan.join("")}"/>
  <path class="pc-sheen" d="M${SX0 + 5} ${-(SZ1 - 22)}Q${SX0 + 6} ${-(SZ1 - 6)} ${SX0 + 24} ${-(SZ1 - 5)}"/>
</g>`;
T.plane({ part: glass, o: [0, GLASS_Y, 0], ...FRONT_UV, svg: screenSvg, fade: [0.02, 0.25] });
// Controls under the screen: power button, LED, two knobs, brand plate.
const CTRL_Z = (MON_Z0 + OPEN.z0 - FW) / 2;
box("mon.power", mrect(48, FACE_Y - 2.2, 60, FACE_Y, 1), CTRL_Z - 3.5, 7, { steps: 2, bevel: 0.4, material: "putty", tone: "hi" });
for (const [i, x] of [26, 36].entries()) {
  T.round({ name: `mon.knob.${i}`, ...H, F: frameOf([-x, FACE_Y, CTRL_Z], [0, -1, 0], [0, 0, 1]), s0: 0, s1: 2.6, r: 3, tone: "mid", material: "walnut",
    details: { ribs: { s0: 0.4, s1: 2.2, count: 18, seams: true, tone: "lo" }, dots: [{ at: [2.6, 0, 1.6], normal: [0, -1, 0], size: 0.4, tone: "hi" }] } });
}
onFront(shell, FACE_Y, `<circle class="pc-led pc-led-on" cx="66" cy="${-CTRL_Z}" r="1.2"/>
  <text class="iso-face-text pc-brand" x="${OPEN.x0}" y="${-(CTRL_Z - 1.4)}" font-size="4">MORPHEUS</text>
  <path class="iso-line" data-tone="faint" d="M${OPEN.x0 + 32} ${-CTRL_Z}H${OPEN.x0 + 64}"/>`);

// ── Keyboard ─────────────────────────────────────────────────────────────────
const KB_L = KB.x + KB.w; // the keyboard's left end, seen from the front
const kbScrews = [[KB.x + 4, KB.y + KB.d - 4], [KB.x + KB.w - 4, KB.y + KB.d - 4]].map(([x, y]) => ({ at: [KB_Z1, x, y], normal: [0, 0, 1], size: 0.45, tone: "mid" }));
const kbCase = box("kb.case", KB, 0, KB_Z1, { steps: 4, bevel: 0.9, tone: "hi", material: "walnut", details: { seams: [2.2], dots: kbScrews } });
const keyRows = [
  { y: 0, h: 0.8, keys: [1, -0.5, 1, 1, 1, 1, -0.25, 1, 1, 1, 1, -0.25, 1, 1, 1, 1] }, // esc, F1–F12
  { y: 1.1, keys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { y: 2.1, keys: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5] },
  { y: 3.1, keys: [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25] },
  { y: 4.1, keys: [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 2.75] },
  { y: 5.1, keys: [1.5, 1.5, 7, 1.5, 1.5] },
];
const KEY_X0 = 5; // key x runs from the left end: world x = KB_L - key x
const KEY_Y0 = KB.y + KB.d - 5; // back row edge (keys run toward -y)
const keyAt = (x0, w, row, h = 1, name) => {
  const y1 = KEY_Y0 - row * U;
  const plan = rect(KB_L - x0 - w * U + KEY_GAP / 2, y1 - h * U + KEY_GAP / 2, KB_L - x0 - KEY_GAP / 2, y1 - KEY_GAP / 2, 0.9);
  T.prism({ name, ...H, plan, z: KB_Z1, h: 2.6, steps: 3, bevel: 0.5, tone: "hi", crease: "lo", material: "keycap" });
};
let keyCount = 0;
for (const [r, row] of keyRows.entries()) {
  let x = KEY_X0;
  for (const w of row.keys) {
    if (w < 0) { x += -w * U; continue; }
    keyAt(x, w, row.y, row.h ?? 1, `kb.key.${r}.${keyCount++}`);
    x += w * U;
  }
}
const PAD_X0 = KEY_X0 + 13 * U + 4;
for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) keyAt(PAD_X0 + c * U, 1, 1.1 + r * 1, 1, `kb.pad.${r}.${c}`);
// Status LEDs over the numpad, on the case top.
T.plane({ part: kbCase, o: [KB_L, 0, KB_Z1], u: [-1, 0, 0], v: [0, -1, 0], normal: [0, 0, 1],
  svg: [0, 1, 2].map((i) => `<circle class="pc-led${i === 0 ? " pc-led-on" : " pc-led-off"}" cx="${PAD_X0 + 4 + i * U}" cy="${-(KEY_Y0 - 0.4 * U)}" r="0.9"/>`).join("") });

// Keyboard cable: straight from the keyboard's back face to the case port.
const CABLE_R = 1.1;
const kbBack = KB.y + KB.d;
const from = [PORT_X, kbBack, PORT_Z - 1];
const to = [PORT_X, FRONT_Y, PORT_Z - 1];
const PLUG = 3;
T.round({ name: "kb.strain", ...H, F: frameOf(from, [0, 1, 0], [0, 0, 1]), s0: 0, s1: PLUG, r: 1.8, tone: "mid", material: "walnut", owner: "kb.cable" });
T.round({ name: "case.port", ...H, F: frameOf(to, [0, -1, 0], [0, 0, 1]), s0: 0, s1: PLUG, r: 2, tone: "mid", material: "putty", owner: "kb.cable" });
const cableLen = to[1] - from[1];
T.tube({ name: "kb.cable", ...H, route: [from, to], r: CABLE_R, chunk: 6, gaps: [[0, PLUG], [cableLen - PLUG, cableLen]], tone: "hi", material: "rubber",
  rings: { pitch: 2.2, twist: 0, cross: true, fade: [0.1, 0.55], tone: "lo" } });

// ── Mouse ────────────────────────────────────────────────────────────────────
const [mx, my] = MOUSE;
const mouseRing = [];
for (let i = 0; i < 20; i++) {
  const t = (i / 20) * Math.PI * 2;
  mouseRing.push([mx + 9.5 * Math.cos(t), my + 13.5 * Math.sin(t) * (Math.sin(t) > 0 ? 1 : 0.92)]);
}
T.prism({ name: "mouse.body", ...H, F: { o: [0, 0, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }, polygon: mouseRing, s0: 0, s1: 6.5, steps: 4, bevel: 1, tone: "hi", crease: "lo", material: "beige" });
for (const [i, side] of [-1, 1].entries()) {
  const ring = [[mx + side * 0.6, my + 2], [mx + side * 7.6, my + 2], [mx + side * 6.2, my + 10.6], [mx + side * 0.6, my + 12]].map(([x, y]) => [x, y]);
  if (side < 0) ring.reverse();
  T.prism({ name: `mouse.button.${i}`, ...H, F: { o: [0, 0, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }, polygon: ring, s0: 6.5, s1: 7.4, steps: 2, bevel: 0.25, tone: "hi", material: "putty" });
}

// ── Build ────────────────────────────────────────────────────────────────────
const out = T.build({ statics: R.items, poses, strict: true });
A.settle(R, P);
if (argv.includes("--audit")) {
  A.auditOrExit(R, P);
  TA.orbitOrExit(T, R, P, { sweep: { at: (x) => follow({ pc: x }), from: 0, to: 360, frame: 0.3 }, quick: argv.includes("--quick"), only: argv.find((a) => a.startsWith("--only="))?.slice(7).split(",") ?? null });
}

// A soft round shadow under the model: round, so it holds still while the model turns.
const halo = `<path class="iso-halo pc-halo" d="${k.haloOf({ x: -reach * 0.78, y: -reach * 0.78, w: reach * 1.56, d: reach * 1.56, r: reach * 0.78 }, 0, 0.1, P)}"/>`;
const back = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso-layer" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true">${halo}</svg>`;
const stage = `${back}${out.layerSvg("pc", { width: WIDTH, height: HEIGHT })}`;
mkdirSync(OUT, { recursive: true });
const gen = { width: WIDTH, height: HEIGHT, stage, css: out.css, turn: out.data };
const json = JSON.stringify(gen);
writeFileSync(join(OUT, "computer.gen.json"), json);
console.log(`wrote computer.gen.json · ${(json.length / 1024).toFixed(0)} KB · ${out.report.parts} parts · ${out.report.layers.map((l) => `${l.name}: ${l.planar} planes, ${l.dynamic} dynamic`).join(" · ")} · build ${out.report.seconds.toFixed(1)} s`);

if (argv.includes("--page")) {
  const { readFileSync } = await import("node:fs");
  const ISO = readFileSync(join(HERE, "../src/lib/anatomy/iso.css"), "utf8");
  const turnSrc = readFileSync(join(HERE, "../src/lib/anatomy/turn.mjs"), "utf8").replace(/^export /gm, "");
  const pageCss = readFileSync(join(OUT, "computer.css"), "utf8");
  const html = `<!doctype html><meta charset="utf-8"><style>${ISO}${out.css}${pageCss} body{margin:0;background:#0d0d0d} .stage{width:560px;height:500px;margin:20px auto}</style>
<div class="iso" data-theme="dark"><div class="iso-stage iso-turn stage">${stage}</div></div>
<script>${turnSrc}
const DATA=${JSON.stringify(out.data)};
const c=TURN.mount(document.querySelector('.stage'),DATA,{});
window.__set=(a)=>c.set({pc:a});
const q=new URLSearchParams(location.search); if(q.get('a')) c.set({pc:+q.get('a')});
</script>`;
  const dir = process.env.PAGE_DIR ?? OUT;
  writeFileSync(join(dir, "computer-check.html"), html);
  console.log(`wrote ${join(dir, "computer-check.html")}`);
}
