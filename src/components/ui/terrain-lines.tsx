import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type TerrainLinesProps = {
  className?: string;
  /** Number of stacked contour lines. */
  lines?: number;
  /** Ridge height in px at full strength. */
  amplitude?: number;
  /** Raise a ridge under the cursor. */
  interactive?: boolean;
};

// A few slow ridges that drift sideways, so the band has shape without a cursor.
const RIDGES = [
  { x: 0.18, w: 0.1, h: 0.55, drift: 0.00004 },
  { x: 0.62, w: 0.14, h: 0.8, drift: -0.00003 },
  { x: 0.88, w: 0.08, h: 0.45, drift: 0.00005 },
];

/**
 * Stacked ridgelines, drawn back to front with occlusion so they read as terrain.
 * Meant as a quiet accent band, not a full background: low contrast, masked at
 * the edges, paused off-screen, and a single still frame under reduced motion.
 */
const TerrainLines = ({ className, lines = 14, amplitude = 46, interactive = true }: TerrainLinesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    // Cursor ridge eases towards its target so it swells rather than snaps.
    const cursor = { x: 0.5, strength: 0, tx: 0.5, ts: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      cursor.x += (cursor.tx - cursor.x) * 0.06;
      cursor.strength += (cursor.ts - cursor.strength) * 0.04;

      const gap = height / (lines + 1);
      const step = 6;

      for (let l = 0; l < lines; l++) {
        const depth = l / (lines - 1); // 0 = back line, 1 = front line
        const baseY = gap * (l + 1.2);
        const amp = amplitude * (0.45 + depth * 0.55);

        const ys: number[] = [];
        for (let px = 0; px <= width + step; px += step) {
          const u = px / width;
          let lift = 0;
          for (const r of RIDGES) {
            const cx = (((r.x + t * r.drift) % 1) + 1) % 1;
            lift += r.h * Math.exp(-((u - cx) ** 2) / (2 * r.w * r.w));
          }
          lift += cursor.strength * 0.9 * Math.exp(-((u - cursor.x) ** 2) / 0.006);
          // Per-line texture so ridges look weathered, not like copies.
          const grain = Math.sin(u * 38 + l * 1.7) * Math.sin(u * 9 - l * 0.6 + t * 0.0004) * 0.12;
          ys.push(baseY - amp * (lift * (0.7 + 0.3 * Math.sin(l * 2.3)) + grain));
        }
        const trace = () => {
          ctx.beginPath();
          ys.forEach((y, i) => (i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * step, y)));
        };

        // Erase what this line hides, then stroke it.
        trace();
        ctx.lineTo(width + step, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        trace();
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.05 + depth * 0.11})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      draw(t);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!frame && visible && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      start();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
      start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Track the pointer over the band's parent section, strongest when close to the band.
    const host = canvas.closest('section, footer') ?? canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.tx = (e.clientX - rect.left) / rect.width;
      const dist = Math.max(0, rect.top - e.clientY);
      cursor.ts = Math.max(0.25, 1 - dist / 500);
    };
    const onLeave = () => {
      cursor.ts = 0;
    };
    const trackCursor = interactive && finePointer && !reduceMotion && host;
    if (trackCursor) {
      host.addEventListener('pointermove', onMove as EventListener, { passive: true });
      host.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (trackCursor) {
        host.removeEventListener('pointermove', onMove as EventListener);
        host.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [lines, amplitude, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none block w-full', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, #000 35%, #000 70%, transparent), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, #000 35%, #000 70%, transparent), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    />
  );
};

export default TerrainLines;
