import { useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { homelab } from '@/data/siteExtras';
import HairlineFigure, { type HairlineHandle } from './HairlineFigure';
import rackSource from './rack.js?raw';

type Point = [number, number];
const ITEMS = homelab.rack;

// The part of the figure's 400 × 320 viewBox the drawing fills, measured at full slide-out.
const BOX = { x0: 100, y0: 12, x1: 318, y1: 276 };
const LABEL_W = 214;
const LABEL_GAP = 60;

/** The lab, drawn: the rack figure, annotated with leader lines that follow the machines as they slide out. */
const LabViewer = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HairlineHandle>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [anchors, setAnchors] = useState<Record<string, Point>>({});
  const [active, setActive] = useState('rest');
  const [selected, setSelected] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const annotated = size.w >= 940; // lg is 1024 wide, 976 inside the section padding
  const gutter = annotated ? LABEL_W + 36 : size.w >= 700 ? 150 : 12;
  const z = size.w ? Math.min((size.w - 2 * gutter) / (BOX.x1 - BOX.x0), (size.h - 24) / (BOX.y1 - BOX.y0)) : 1;
  const cx = (BOX.x0 + BOX.x1) / 2;
  const cy = (BOX.y0 + BOX.y1) / 2 + 2;
  const toScreen = (a: Point): Point => [size.w / 2 + z * (a[0] - cx), size.h / 2 + z * (a[1] - cy)];

  // Labels stacked down each gutter in anchor order, kept apart, each with an elbowed leader to its anchor.
  const labels: { item: (typeof ITEMS)[number]; p: Point; y: number; x: number; side: string }[] = [];
  if (annotated) {
    for (const side of ['left', 'right']) {
      const col = ITEMS.filter((i) => i.side === side && anchors[i.read])
        .map((item) => ({ item, p: toScreen(anchors[item.read]), side }))
        .sort((a, b) => a.p[1] - b.p[1]);
      // Down the column keeping a gap, then back up from the bottom edge so none falls off it.
      const ys: number[] = [];
      col.forEach(({ p }, i) => ys.push(Math.max(p[1], 34, i ? ys[i - 1] + LABEL_GAP : -Infinity)));
      for (let i = ys.length - 1, lim = size.h - 34 - (side === 'left' && selected ? 132 : 0); i >= 0; i--) { ys[i] = Math.min(ys[i], lim); lim = ys[i] - LABEL_GAP; }
      col.forEach((c, i) => labels.push({ ...c, y: ys[i], x: side === 'left' ? 16 : size.w - 16 - LABEL_W }));
    }
  }

  const point = (read: string | null) => {
    const item = ITEMS.find((i) => i.read === read);
    figureRef.current?.point(item?.at ? (item.at as Point) : null);
  };
  const select = (read: string | null) => {
    setSelected(read);
    point(read);
  };
  const sel = ITEMS.find((i) => i.read === selected);

  return (
    <div
      ref={boxRef}
      className="lab-viewer relative w-full h-[440px] sm:h-[540px] lg:h-[620px] overflow-hidden select-none touch-pan-y"
      role="group"
      aria-label="The homelab rack. Point at a machine to slide it out; click it, or its label, to read about it."
      // A click on a machine reads about it; a click on nothing puts the card away.
      onClick={() => select(active !== 'rest' ? active : null)}
      // With a machine picked, keep it out when the pointer leaves the drawing.
      onMouseLeave={() => point(selected)}
    >
      <div
        className="absolute left-0 top-0 w-[400px] h-[320px] origin-top-left"
        style={{
          transform: `translate(${size.w / 2 - z * cx}px, ${size.h / 2 - z * cy}px) scale(${z})`,
          // The CSS scale thickens strokes; undo it so lines stay hairlines.
          ['--hairline-stroke' as string]: (1.05 / z).toFixed(4),
        }}
      >
        <HairlineFigure
          ref={figureRef}
          source={rackSource}
          onRead={setActive}
          onAnchors={setAnchors}
          className="lab-figure w-[400px]"
          label="My homelab rack, drawn in lines: a router on top, two ThinkCentre Tinys, a 2.5 GbE and a 1 GbE switch patched into their panels and a shelf of Raspberry Pis, with a third Tiny on the side and an SFF beside it."
        />
      </div>

      {/* Leader lines */}
      {annotated && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {labels.map(({ item, p, y, x, side }) => {
            const on = active === item.read || selected === item.read;
            const edge = side === 'left' ? x + LABEL_W : x;
            const knee = side === 'left' ? edge + 18 : edge - 18;
            return (
              <g key={item.read} className={`lab-leader ${on ? 'is-on' : ''}`}>
                <polyline points={`${edge},${y} ${knee},${y} ${p[0]},${p[1]}`} />
                <circle cx={p[0]} cy={p[1]} r={on ? 3 : 2.2} />
                {on && <circle cx={p[0]} cy={p[1]} r="7" className="lab-leader-ring" />}
              </g>
            );
          })}
        </svg>
      )}

      {/* Labels */}
      {labels.map(({ item, y, x, side }) => {
        const on = active === item.read || selected === item.read;
        return (
          <button
            key={item.read}
            type="button"
            onClick={(e) => { e.stopPropagation(); select(selected === item.read ? null : item.read); }}
            onMouseEnter={() => item.at && point(item.read)}
            onMouseLeave={() => point(selected)}
            onFocus={() => item.at && point(item.read)}
            onBlur={() => point(selected)}
            aria-pressed={selected === item.read}
            className={`lab-label absolute -translate-y-1/2 ${side === 'left' ? 'text-right' : 'text-left'} ${on ? 'is-on' : ''}`}
            style={{ left: x, top: y, width: LABEL_W }}
          >
            <span className="lab-label-key">{item.read}</span>
            <span className="lab-label-name">{item.name}</span>
            <span className="lab-label-role">
              {item.read === 'pico' && <span className="lab-beat" aria-hidden="true" />}
              {item.role}
            </span>
          </button>
        );
      })}

      {/* The picked machine */}
      {sel && (
        <div className="lab-card absolute left-4 bottom-4 max-w-[340px]" role="status" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{sel.read}</p>
              <p className="text-sm font-medium text-foreground">{sel.name}</p>
            </div>
            <button type="button" onClick={() => select(null)} className="lab-icon" aria-label="Close">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{sel.detail}</p>
        </div>
      )}
    </div>
  );
};

export default LabViewer;
