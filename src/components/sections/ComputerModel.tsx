import { useEffect, useRef, type KeyboardEvent, type MutableRefObject } from 'react';
import '@/lib/anatomy/iso.css';
import './computer/computer.css';

interface ComputerModelProps {
  /** Called on a plain click (not a drag-to-rotate) or Enter/Space. */
  onBoot?: () => void;
  /** Set to the monitor's screen so a popup can grow out of it. */
  screenRef?: MutableRefObject<Element | null>;
}

// Pointer travel (px) beyond which a press counts as a rotate-drag, not a click.
const DRAG_THRESHOLD = 6;
// Degrees of turn per pixel of horizontal drag.
const DRAG_GAIN = 0.55;
// Exponential follow rate (1/s) of the drawn angle toward the target.
const FOLLOW = 9;
// The idle tour: a slow sway around the rest pose once nobody has touched it for a while.
const TOUR_AMPLITUDE = 22;
const TOUR_PERIOD = 14;
const TOUR_DELAY = 3600;

/**
 * The hero computer: a beige desktop PC, CRT, keyboard and mouse drawn with the
 * anatomy kit's 3D turn mode (geometry in scripts/build-computer.mjs). Drag to spin
 * it, click it to boot Infra Ops.
 */
const ComputerModel = ({ onBoot, screenRef }: ComputerModelProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const keyTurn = useRef<(by: number) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import('./computer/computer.gen.json'), import('@/lib/anatomy/turn.mjs')]).then(([genModule, { TURN }]) => {
      if (cancelled) return;
      const gen = genModule.default;
      stage.innerHTML = `<style>${gen.css}</style>${gen.stage}`;
      const controller = TURN.mount(stage, gen.turn);
      if (screenRef) screenRef.current = stage.querySelector('[data-screen]');

      const still = matchMedia('(prefers-reduced-motion: reduce)');
      let angle = 0;
      let target = 0;
      let velocity = 0;
      let drawn = NaN;
      let frame = 0;
      let last = 0;
      let visible = true;
      let touring = !still.matches;
      let tourClock = 0;
      let tourBase = 0;
      let idle = 0;
      let drag: { x: number; from: number; t: number; lastX: number } | null = null;

      const hold = () => {
        touring = false;
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          if (still.matches) return;
          touring = true;
          tourClock = 0;
          tourBase = target;
          run();
        }, TOUR_DELAY);
      };

      const tick = (now: number) => {
        const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
        last = now;
        if (touring) {
          tourClock += dt;
          // Ease the sway in from zero so the tour never jumps.
          const ramp = Math.min(1, tourClock / 2.5);
          target = tourBase + TOUR_AMPLITUDE * ramp * Math.sin((tourClock / TOUR_PERIOD) * Math.PI * 2);
        } else if (!drag && Math.abs(velocity) > 0.5) {
          // A flick coasts and settles.
          target += velocity * dt;
          velocity *= Math.exp(-dt * 3.2);
        }
        angle += (target - angle) * (1 - Math.exp(-FOLLOW * dt));
        if (Math.abs(angle - drawn) > 0.01) {
          controller.set({ pc: angle });
          drawn = angle;
        }
        const moving = touring || drag || Math.abs(target - angle) > 0.02 || Math.abs(velocity) > 0.5;
        frame = visible && moving ? requestAnimationFrame(tick) : 0;
      };
      const run = () => {
        if (!frame && visible) {
          last = 0;
          frame = requestAnimationFrame(tick);
        }
      };

      const onDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        hold();
        velocity = 0;
        drag = { x: e.clientX, from: target, t: performance.now(), lastX: e.clientX };
        run();
      };
      const onMove = (e: PointerEvent) => {
        if (!drag) return;
        const now = performance.now();
        const dtMove = Math.max(1, now - drag.t) / 1000;
        velocity = ((e.clientX - drag.lastX) * DRAG_GAIN) / dtMove;
        drag.t = now;
        drag.lastX = e.clientX;
        target = drag.from + (e.clientX - drag.x) * DRAG_GAIN;
        run();
      };
      const onUp = () => {
        if (!drag) return;
        if (performance.now() - drag.t > 80) velocity = 0;
        drag = null;
        hold();
        run();
      };
      keyTurn.current = (by: number) => {
        hold();
        velocity = 0;
        target += by;
        run();
      };

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
      });
      observer.observe(stage);
      const onMotion = () => {
        touring = !still.matches;
        run();
      };
      still.addEventListener('change', onMotion);
      stage.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      run();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(idle);
        observer.disconnect();
        still.removeEventListener('change', onMotion);
        stage.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        controller.destroy();
        if (screenRef) screenRef.current = null;
        keyTurn.current = () => {};
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [screenRef]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pressStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    const start = pressStart.current;
    pressStart.current = null;
    if (!onBoot) return;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD) return;
    onBoot();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      keyTurn.current(e.key === 'ArrowLeft' ? -15 : 15);
      return;
    }
    if (!onBoot || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onBoot();
  };

  return (
    <div className="iso pc-figure absolute inset-0 flex items-center justify-center" data-theme="dark">
      <div
        ref={stageRef}
        className="iso-stage iso-turn pc-stage w-full max-w-[560px] aspect-[56/50] cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={onBoot ? 'button' : 'img'}
        tabIndex={0}
        aria-label={
          onBoot
            ? 'A beige retro desktop computer. Drag or use the arrow keys to turn it; press Enter to boot Infra Ops, a cloud security game'
            : 'A beige retro desktop computer with a CRT monitor, keyboard and mouse'
        }
      />
    </div>
  );
};

export default ComputerModel;
