import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import kernelSource from '@/lib/hairline/kernel.js?raw';

/* The hairline kernel (src/lib/hairline/kernel.js, unchanged from the skill) and a
 * figure written in the skill's format: a script that reads the global `HL` and ends
 * with `hairline({ name, means, range, tour, mount })`. This host does what the
 * skill's bench does: it makes the stage and the svg, hands them to the figure's
 * mount, and walks the figure's tour when it scrolls into view. */

type HL = {
  inject(root: Document): void;
  mk(tag: string, attrs: Record<string, string>, parent: Element): SVGElement;
  tour(stage: Element, stops: ([number, number] | null)[], onStop?: (i: number) => void): { stop(): void };
  LAP: ([number, number] | null)[];
};
type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount(host: { stage: HTMLElement; svg: SVGElement; read: { textContent: string } }, value: number): { set(v: number): void; destroy(): void };
};

let kernel: HL | null = null;
const loadKernel = (): HL => (kernel ??= new Function(`${kernelSource}\nreturn HL;`)() as HL);
const loadFigure = (source: string): Figure => {
  let figure: Figure | null = null;
  new Function('HL', 'hairline', source)(loadKernel(), (f: Figure) => { figure = f; });
  if (!figure) throw new Error('hairline: the figure never called hairline()');
  return figure;
};

export interface HairlineHandle {
  /** Holds the pointer at a viewBox point, as a hand would; null lets go. */
  point(at: [number, number] | null): void;
}

interface Props {
  source: string;
  className?: string;
  /** Each time the read-out changes: the name of what is under the pointer, or "rest". */
  onRead?: (text: string) => void;
  /** Walk the figure's tour once, the first time it comes into view. */
  tourOnView?: boolean;
  /** The accessible name; the figure's own `means` when left out. */
  label?: string;
  /** Viewbox points the figure publishes as it moves ("hairline:anchors"), for annotating it from outside. */
  onAnchors?: (anchors: Record<string, [number, number]>) => void;
}

const HairlineFigure = forwardRef<HairlineHandle, Props>(({ source, className, onRead, tourOnView = true, label, onAnchors }, ref) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const onReadRef = useRef(onRead);
  onReadRef.current = onRead;
  const onAnchorsRef = useRef(onAnchors);
  onAnchorsRef.current = onAnchors;
  const tourRef = useRef<{ stop(): void } | null>(null);

  useImperativeHandle(ref, () => ({
    point(at) {
      const stage = stageRef.current;
      if (!stage) return;
      tourRef.current?.stop();
      tourRef.current = null;
      if (!at) {
        stage.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', pointerId: 1, bubbles: true }));
        return;
      }
      const r = stage.getBoundingClientRect();
      stage.dispatchEvent(new PointerEvent('pointermove', {
        pointerType: 'mouse', pointerId: 1, bubbles: true,
        clientX: r.left + (at[0] / 400) * r.width, clientY: r.top + (at[1] / 320) * r.height,
      }));
    },
  }), []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const HL = loadKernel();
    const figure = loadFigure(source);
    HL.inject(document);
    stage.setAttribute('data-hairline', figure.name);
    stage.setAttribute('aria-label', label ?? figure.means);
    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    let text = '';
    const read = {
      get textContent() { return text; },
      set textContent(value: string) {
        const next = value == null ? '' : String(value);
        if (next === text) return;
        text = next;
        onReadRef.current?.(text);
      },
    };
    const anchored = (e: Event) => onAnchorsRef.current?.((e as CustomEvent).detail);
    stage.addEventListener('hairline:anchors', anchored);
    const handle = figure.mount({ stage, svg, read }, figure.range[1]);

    let observer: IntersectionObserver | null = null;
    if (tourOnView && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        // One lap, then rest: the last stop is the leave.
        const stops = figure.tour || HL.LAP;
        tourRef.current = HL.tour(stage, stops, (i) => {
          if (i === stops.length - 1) { tourRef.current?.stop(); tourRef.current = null; }
        });
      }, { threshold: 0.6 });
      observer.observe(stage);
    }
    return () => {
      observer?.disconnect();
      tourRef.current?.stop();
      tourRef.current = null;
      handle.destroy();
      stage.removeEventListener('hairline:anchors', anchored);
      stage.replaceChildren();
    };
  }, [source, tourOnView, label]);

  return <div ref={stageRef} className={className} role="img" />;
});
HairlineFigure.displayName = 'HairlineFigure';

export default HairlineFigure;
