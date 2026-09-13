import { useRef, useEffect, useState } from 'react';
import { COLS, ROWS, PALETTE, SCENES, BG_HEX } from '@/data/asciiScenes';

// Coloured ASCII stage: my HackerNoon avatar, the site logo, a terminal and the
// rack, morphing into one another.
//
// The scenes are generated from the real images by scripts/gen_ascii_scenes.py
// (luminance -> glyph ramp, colour sampled per cell). Re-run that script if the
// source images change; do not hand-edit src/data/asciiScenes.ts.
//
// Painted to canvas rather than DOM: 72x43 is 3,096 cells, and repainting that
// many spans every frame during a morph would be far heavier than one canvas.
// The grid is 72x43 because a monospace cell is about 0.6 as wide as it is
// tall, so 72 * 0.6 comes out square, matching the container.

const SCRAMBLE = '!<>-_\\/[]{}=+*^?#@%&$.:0O';
const HOLD_MS = 4600;
const MORPH_MS = 1000;
const FONT = 'JetBrains Mono, ui-monospace, monospace';

type Decoded = { glyphs: string[]; fg: Uint8Array; bg: Uint8Array };

const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
const decode = (rows: string[]): Decoded => {
  const n = COLS * ROWS;
  const glyphs = new Array<string>(n);
  const fg = new Uint8Array(n);
  const bg = new Uint8Array(n);
  for (let r = 0; r < ROWS; r++) {
    const row = rows[r];
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const o = c * 3;
      glyphs[i] = row[o];
      fg[i] = B36.indexOf(row[o + 1]);
      bg[i] = B36.indexOf(row[o + 2]);
    }
  }
  return { glyphs, fg, bg };
};

const FRAMES: Decoded[] = SCENES.map((s) => decode(s.rows));

const AsciiStage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState(SCENES[0].label);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cellW = 0;
    let cellH = 0;
    let fontPx = 0;
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width < 2 || height < 2) return false;
      cssW = width;
      cssH = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cellW = width / COLS;
      cellH = height / ROWS;

      // Scale the font so one glyph advance is exactly one cell wide. Without
      // this the block glyphs leave seams between columns.
      ctx.font = `${cellH}px ${FONT}`;
      const adv = ctx.measureText('█').width || cellH * 0.6;
      fontPx = cellH * (cellW / adv);
      ctx.font = `${fontPx}px ${FONT}`;
      ctx.textBaseline = 'middle';
      return true;
    };

    const paint = (a: Decoded, b: Decoded, t: number, settle: Float32Array) => {
      // Coordinates are in CSS pixels here: the dpr lives in the transform.
      ctx.fillStyle = BG_HEX;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.font = `${fontPx}px ${FONT}`;
      ctx.textBaseline = 'middle';

      let lastFill = '';
      const scrambling = t < 1;

      for (let r = 0; r < ROWS; r++) {
        const y = r * cellH + cellH / 2;
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          let glyph: string;
          let colour: number;

          if (!scrambling || t >= settle[i] * 0.68 + 0.32) {
            glyph = b.glyphs[i];
            colour = b.fg[i];
          } else if (t < 0.22) {
            glyph = a.glyphs[i];
            colour = a.fg[i];
          } else if (a.glyphs[i] === ' ' && b.glyphs[i] === ' ') {
            continue;
          } else {
            glyph = SCRAMBLE[(i * 7 + ((t * 90) | 0)) % SCRAMBLE.length];
            colour = b.fg[i];
          }

          if (glyph === ' ') continue;
          const fill = PALETTE[colour];
          if (fill !== lastFill) {
            ctx.fillStyle = fill;
            lastFill = fill;
          }
          ctx.fillText(glyph, c * cellW, y);
        }
      }
    };

    const settle = new Float32Array(COLS * ROWS);
    let from = 0;
    let raf = 0;
    let timer = 0;
    let cancelled = false;

    const still = (idx: number) => paint(FRAMES[idx], FRAMES[idx], 1, settle);

    const morphTo = (to: number) => {
      for (let i = 0; i < settle.length; i++) settle[i] = Math.random();
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / MORPH_MS);
        paint(FRAMES[from], FRAMES[to], t, settle);
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          from = to;
          setLabel(SCENES[to].label);
          timer = window.setTimeout(() => morphTo((to + 1) % FRAMES.length), HOLD_MS);
        }
      };
      raf = requestAnimationFrame(step);
    };

    if (!resize()) return;
    still(0);

    const ro = new ResizeObserver(() => {
      if (resize()) still(from);
    });
    ro.observe(host);

    if (!reduceMotion) {
      timer = window.setTimeout(() => morphTo(1), HOLD_MS);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border/60"
      style={{ background: BG_HEX }}>
      <div ref={hostRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />
      </div>

      {/* scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.13]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* viewfinder framing */}
      {[
        'top-3 left-3 border-l border-t',
        'top-3 right-3 border-r border-t',
        'bottom-3 left-3 border-l border-b',
        'bottom-3 right-3 border-r border-b',
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute w-5 h-5 border-foreground/25 rounded-[3px] pointer-events-none ${pos}`}
        />
      ))}

      {/* scene label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 font-mono text-[10px] text-muted-foreground pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
        {label}
      </div>

      <span className="sr-only">
        Animated ASCII art cycling through a portrait, a logo, a terminal and a homelab rack.
      </span>
    </div>
  );
};

export default AsciiStage;
