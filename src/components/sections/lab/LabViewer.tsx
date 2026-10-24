import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Maximize2, Minus, Plus, X } from 'lucide-react';
import { homelab } from '@/data/siteExtras';
import HairlineFigure, { type HairlineHandle } from './HairlineFigure';
import rackSource from './rack.js?raw';

type Point = [number, number];
type View = { cx: number; cy: number; z: number };
const ITEMS = homelab.rack;

// The part of the figure's 400 × 320 viewBox the drawing fills, measured at full slide-out.
const BOX = { x0: 100, y0: 12, x1: 318, y1: 276 };
const MAX_ZOOM = 5;
const LABEL_W = 214;
const LABEL_GAP = 60;
const EASE = 'cubicBezier(.32,.72,0,1)';

/** The lab, drawn: the rack figure in a pannable, zoomable view, annotated with leader lines that follow the machines. */
const LabViewer = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HairlineHandle>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [anchors, setAnchors] = useState<Record<string, Point>>({});
  const [active, setActive] = useState('rest');
  const [selected, setSelected] = useState<string | null>(null);
  const view = useRef<View>({ cx: 209, cy: 144, z: 1 });
  const [, setFrame] = useState(0);
  const flight = useRef<anime.AnimeInstance | null>(null);

  const gutter = size.w >= 1000 ? LABEL_W + 40 : size.w >= 700 ? 150 : 12;
  const annotated = size.w >= 1000;
  const fitZoom = size.w ? Math.min((size.w - 2 * gutter) / (BOX.x1 - BOX.x0), (size.h - 24) / (BOX.y1 - BOX.y0)) : 1;

  const clampView = useCallback((v: View): View => {
    const z = Math.min(Math.max(v.z, fitZoom), fitZoom * MAX_ZOOM);
    return { z, cx: Math.min(Math.max(v.cx, BOX.x0), BOX.x1), cy: Math.min(Math.max(v.cy, BOX.y0), BOX.y1) };
  }, [fitZoom]);

  /** Writes the view to the world's transform and re-renders the annotations. */
  const apply = useCallback(() => {
    const { cx, cy, z } = view.current;
    const world = worldRef.current;
    if (world) {
      world.style.transform = `translate(${size.w / 2 - z * cx}px, ${size.h / 2 - z * cy}px) scale(${z})`;
      // The CSS scale thickens strokes; undo it, letting lines grow only a little as you zoom in, so they stay hairlines.
      world.style.setProperty('--hairline-stroke', ((1.05 * Math.pow(z / fitZoom, 0.3)) / z).toFixed(4));
    }
    setFrame((f) => f + 1);
  }, [size, fitZoom]);

  const fly = useCallback((to: View, duration = 700) => {
    flight.current?.pause();
    const target = clampView(to);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { view.current = target; apply(); return; }
    const from = { ...view.current };
    flight.current = anime({ targets: from, ...target, duration, easing: EASE, update: () => { view.current = { ...from }; apply(); } });
  }, [apply, clampView]);

  const fitAll = useCallback(() => { setSelected(null); fly({ cx: (BOX.x0 + BOX.x1) / 2, cy: (BOX.y0 + BOX.y1) / 2 + 2, z: fitZoom }); }, [fitZoom, fly]);
  const focus = useCallback((read: string) => {
    const item = ITEMS.find((i) => i.read === read);
    const a = anchors[read];
    if (!item || !a) return;
    setSelected(read);
    if (item.at) figureRef.current?.point(item.at as Point);
    // Lean the view toward the side the label sits on, so the machine and its label share the frame.
    fly({ cx: a[0] + (item.side === 'left' ? -14 : 14), cy: a[1], z: fitZoom * (read === 'pico' ? 3.4 : read === 'router' ? 1.9 : 2.5) });
  }, [anchors, fitZoom, fly]);
  const zoomBy = useCallback((k: number, at?: Point) => {
    const v = view.current;
    const z = Math.min(Math.max(v.z * k, fitZoom), fitZoom * MAX_ZOOM);
    // Keep the point under `at` (container px) where it is.
    const p = at ?? [size.w / 2, size.h / 2];
    const wx = v.cx + (p[0] - size.w / 2) / v.z, wy = v.cy + (p[1] - size.h / 2) / v.z;
    return clampView({ z, cx: wx - (p[0] - size.w / 2) / z, cy: wy - (p[1] - size.h / 2) / z });
  }, [clampView, fitZoom, size]);

  // Size, and the fitted view whenever the size changes.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!size.w) return;
    view.current = { cx: (BOX.x0 + BOX.x1) / 2, cy: (BOX.y0 + BOX.y1) / 2 + 2, z: fitZoom };
    setSelected(null);
    apply();
  }, [size, fitZoom, apply]);

  // Wheel (with Ctrl or ⌘, so the page still scrolls), drag to pan, pinch to zoom, click to fly to a machine.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      flight.current?.pause();
      const r = el.getBoundingClientRect();
      view.current = zoomBy(Math.exp(-e.deltaY * 0.0025), [e.clientX - r.left, e.clientY - r.top]);
      apply();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [apply, zoomBy]);

  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ moved: boolean; start: Point; pinch?: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    flight.current?.pause();
    gesture.current = { moved: false, start: [e.clientX, e.clientY] };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev || !gesture.current) return;
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    const pts = [...pointers.current.values()];
    const r = boxRef.current!.getBoundingClientRect();
    if (pts.length === 2) {
      const d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      if (gesture.current.pinch) view.current = zoomBy(d / gesture.current.pinch, [(pts[0][0] + pts[1][0]) / 2 - r.left, (pts[0][1] + pts[1][1]) / 2 - r.top]);
      gesture.current.pinch = d;
      gesture.current.moved = true;
      apply();
      return;
    }
    const far = Math.hypot(e.clientX - gesture.current.start[0], e.clientY - gesture.current.start[1]) > 5;
    if (far) gesture.current.moved = true;
    if (gesture.current.moved && view.current.z > fitZoom * 1.01) {
      const v = view.current;
      view.current = clampView({ ...v, cx: v.cx - (e.clientX - prev[0]) / v.z, cy: v.cy - (e.clientY - prev[1]) / v.z });
      apply();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size) return;
    gesture.current = null;
    if (!g || g.moved || e.button !== 0) return;
    if (active !== 'rest') focus(active);
    else if (view.current.z > fitZoom * 1.01) fitAll();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') fly(zoomBy(1.5), 300);
    else if (e.key === '-' || e.key === '_') fly(zoomBy(1 / 1.5), 300);
    else if (e.key === '0' || e.key === 'Escape') fitAll();
    else return;
    e.preventDefault();
  };

  // Annotations: labels stacked down each gutter in anchor order, kept apart, with an elbowed leader to the anchor.
  const { cx, cy, z } = view.current;
  const toScreen = (a: Point): Point => [size.w / 2 + z * (a[0] - cx), size.h / 2 + z * (a[1] - cy)];
  const labels: { item: (typeof ITEMS)[number]; p: Point; y: number; x: number; side: string }[] = [];
  if (annotated) {
    for (const side of ['left', 'right']) {
      const col = ITEMS.filter((i) => i.side === side && anchors[i.read])
        .map((item) => ({ item, p: toScreen(anchors[item.read]), side }))
        .filter(({ p }) => p[0] > -20 && p[0] < size.w + 20 && p[1] > -20 && p[1] < size.h + 20)
        .sort((a, b) => a.p[1] - b.p[1]);
      // Down the column keeping a gap, then back up from the bottom edge so none falls off it.
      const ys: number[] = [];
      col.forEach(({ p }, i) => ys.push(Math.max(p[1], 34, i ? ys[i - 1] + LABEL_GAP : -Infinity)));
      for (let i = ys.length - 1, lim = size.h - 34 - (side === 'left' && selected ? 132 : 0); i >= 0; i--) { ys[i] = Math.min(ys[i], lim); lim = ys[i] - LABEL_GAP; }
      col.forEach((c, i) => labels.push({ ...c, y: ys[i], x: side === 'left' ? 16 : size.w - 16 - LABEL_W }));
    }
  }
  const sel = ITEMS.find((i) => i.read === selected);
  const zoomed = z > fitZoom * 1.01;

  return (
    <div
      ref={boxRef}
      className={`lab-viewer ${zoomed ? 'is-zoomed' : ''} relative w-full h-[480px] sm:h-[560px] lg:h-[640px] overflow-hidden select-none outline-none ${zoomed ? 'cursor-grab active:cursor-grabbing touch-none' : 'touch-pan-y'}`}
      tabIndex={0}
      role="group"
      aria-label="The homelab rack. Point at a machine to slide it out, click to zoom to it; Ctrl or ⌘ and scroll, or pinch, to zoom; drag to pan; Escape to fit."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div ref={worldRef} className="absolute left-0 top-0 w-[400px] h-[320px] origin-top-left will-change-transform">
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
              <g key={item.read} className={`lab-leader ${on ? 'is-on' : zoomed ? 'is-dim' : ''}`}>
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
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => (selected === item.read ? fitAll() : focus(item.read))}
            onMouseEnter={() => item.at && figureRef.current?.point(item.at as Point)}
            onMouseLeave={() => !selected && figureRef.current?.point(null)}
            className={`lab-label absolute -translate-y-1/2 ${side === 'left' ? 'text-right' : 'text-left'} ${on ? 'is-on' : zoomed ? 'is-dim' : ''}`}
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

      {/* The selected machine */}
      {sel && (
        <div className="lab-card absolute left-4 bottom-4 max-w-[340px]" role="status">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{sel.read}</p>
              <p className="text-sm font-medium text-foreground">{sel.name}</p>
            </div>
            <button type="button" onClick={fitAll} onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} className="lab-icon" aria-label="Back to the whole rack">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{sel.detail}</p>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute right-4 bottom-4 flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
        <span className="hidden lg:inline font-mono text-[10px] text-muted-foreground/70 mr-2">click a machine · ctrl + scroll · drag</span>
        <button type="button" className="lab-icon" onClick={() => fly(zoomBy(1 / 1.6), 350)} aria-label="Zoom out" disabled={!zoomed}><Minus className="w-3.5 h-3.5" /></button>
        <button type="button" className="lab-icon" onClick={fitAll} aria-label="Fit the whole rack"><Maximize2 className="w-3.5 h-3.5" /></button>
        <button type="button" className="lab-icon" onClick={() => fly(zoomBy(1.6), 350)} aria-label="Zoom in"><Plus className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

export default LabViewer;
