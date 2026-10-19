import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import anime from 'animejs';
import InfraOpsGame, { GAME_WIDTH } from './InfraOpsGame';
import './infraOps.css';

// The hero computer's monitor, blown up to fill the viewport. It grows out of
// the little CSS-3D screen, runs a short boot log, then powers on the game.

interface Props {
  open: boolean;
  onClose: () => void;
  /** Where the hero computer's screen sits right now, so we can grow out of it. */
  getOriginRect: () => DOMRect | null;
}

type Phase = 'closed' | 'zoom' | 'boot' | 'on' | 'off';

const FIRST_BOOT = [
  { t: 'RETRO-1 BIOS v2.04', c: 'hi' },
  { t: 'Memory test ............ 640K OK', c: '' },
  { t: 'Detecting drives ....... hd0: infra OK', c: '' },
  { t: 'Mounting ~/clients/acme-0423/infra', c: '' },
  { t: '', c: '' },
  { t: '$ terraform init', c: 'hi' },
  { t: 'Initializing provider plugins: hashicorp/aws', c: 'dim' },
  { t: 'Terraform has been successfully initialized.', c: '' },
  { t: '', c: '' },
  { t: '$ infra-ops --client acme-0423', c: 'hi' },
];

const RESUME_BOOT = [
  { t: 'RETRO-1 waking from sleep', c: 'hi' },
  { t: 'Restoring session: infra-ops --client acme-0423', c: '' },
];

const MARGIN = 16;
const BEZEL_X = 44; // left + right bezel padding
const BEZEL_Y = 22 + 46; // top padding + chin
const GAME_RATIO = GAME_WIDTH / 980;
const MIN_SCALE = 0.5;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function monitorSize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const maxW = vw - MARGIN * 2, maxH = vh - MARGIN * 2;
  if (vw < 768) return { width: vw - 16, height: vh - 16 };
  let width = Math.min(maxW, 1640);
  let height = (width - BEZEL_X) / GAME_RATIO + BEZEL_Y;
  if (height > maxH) { height = maxH; width = (height - BEZEL_Y) * GAME_RATIO + BEZEL_X; }
  return { width: Math.round(width), height: Math.round(height) };
}

const RetroMonitorPopup = ({ open, onClose, getOriginRect }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('closed');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [bootCount, setBootCount] = useState(0);
  const [booted, setBooted] = useState(false);
  const [fit, setFit] = useState({ scale: 1, left: 0, top: 0, h: 980, scroll: false });

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastFocus = useRef<Element | null>(null);

  const bootLines = booted ? RESUME_BOOT : FIRST_BOOT;

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // Transform that makes the full monitor sit exactly on the hero computer's screen.
  const originTransform = useCallback(() => {
    const el = monitorRef.current, o = getOriginRect();
    if (!el || !o) return null;
    // Layout size (ignores any transform left over from a previous run); the
    // overlay centres the monitor, so its resting top-left is known.
    const w = el.offsetWidth, h = el.offsetHeight;
    const fx = (window.innerWidth - w) / 2, fy = (window.innerHeight - h) / 2;
    return { translateX: o.left - fx, translateY: o.top - fy, scaleX: o.width / w, scaleY: o.height / h };
  }, [getOriginRect]);

  // ---- powering on -------------------------------------------------------
  const powerOn = useCallback(() => {
    clearTimers();
    setPhase('on');
    setBooted(true);
    const screen = screenRef.current, flash = flashRef.current;
    if (!screen || !flash || prefersReducedMotion()) {
      if (screen) screen.style.transform = 'none';
      return;
    }
    anime.remove([screen, flash]);
    anime.timeline({ easing: 'easeOutQuart' })
      .add({ targets: flash, opacity: [0, 0.85], duration: 90, easing: 'linear' })
      .add({ targets: screen, scaleY: [0.006, 1], scaleX: [0.9, 1], filter: ['brightness(3)', 'brightness(1)'], duration: 520 }, '-=20')
      .add({ targets: flash, opacity: 0, duration: 380, easing: 'easeOutQuad' }, '-=520');
  }, []);

  const runBoot = useCallback(() => {
    clearTimers();
    setPhase('boot');
    setBootCount(0);
    const lines = booted ? RESUME_BOOT : FIRST_BOOT;
    const step = booted ? 220 : 150;
    lines.forEach((_, i) => timers.current.push(setTimeout(() => setBootCount(i + 1), 120 + i * step)));
    timers.current.push(setTimeout(powerOn, 120 + lines.length * step + 420));
  }, [booted, powerOn]);

  // ---- open --------------------------------------------------------------
  useEffect(() => {
    if (open && phase === 'closed') {
      lastFocus.current = document.activeElement;
      setSize(monitorSize());
      setMounted(true);
      setPhase('zoom');
    }
  }, [open, phase]);

  useLayoutEffect(() => {
    if (phase !== 'zoom') return;
    const monitor = monitorRef.current, backdrop = backdropRef.current, screen = screenRef.current;
    if (!monitor || !backdrop || !screen) return;
    screen.style.transform = 'scaleY(0.006)';
    powerRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion()) {
      backdrop.style.opacity = '1';
      monitor.style.transform = 'none';
      monitor.style.opacity = '1';
      powerOn();
      return;
    }
    const from = originTransform();
    anime.remove([monitor, backdrop]);
    anime.timeline({ easing: 'easeInOutQuart' })
      .add({ targets: backdrop, opacity: [0, 1], duration: 420, easing: 'easeOutQuad' })
      .add({
        targets: monitor,
        translateX: [from?.translateX ?? 0, 0],
        translateY: [from?.translateY ?? 40, 0],
        scaleX: [from?.scaleX ?? 0.2, 1],
        scaleY: [from?.scaleY ?? 0.2, 1],
        opacity: [{ value: [0, 1], duration: 160, easing: 'linear' }],
        duration: 760,
        complete: runBoot,
      }, 0);
  }, [phase, originTransform, powerOn, runBoot]);

  // ---- close -------------------------------------------------------------
  const close = useCallback(() => {
    if (phase === 'off' || phase === 'closed' || phase === 'zoom') return;
    clearTimers();
    setPhase('off');
    const monitor = monitorRef.current, backdrop = backdropRef.current, screen = screenRef.current, flash = flashRef.current;
    const finish = () => {
      setPhase('closed');
      onClose();
      const el = lastFocus.current as HTMLElement | null;
      el?.focus?.({ preventScroll: true });
    };
    if (!monitor || !backdrop || !screen || !flash || prefersReducedMotion()) { finish(); return; }
    const to = originTransform();
    anime.remove([monitor, backdrop, screen, flash]);
    anime.timeline({ easing: 'easeInQuad' })
      .add({ targets: screen, scaleY: 0.006, filter: 'brightness(3)', duration: 200 })
      .add({ targets: screen, scaleX: 0, duration: 140 })
      .add({ targets: monitor, translateX: to?.translateX ?? 0, translateY: to?.translateY ?? 40, scaleX: to?.scaleX ?? 0.2, scaleY: to?.scaleY ?? 0.2, duration: 620, easing: 'easeInOutQuart' }, '+=60')
      .add({ targets: monitor, opacity: 0, duration: 140, easing: 'linear' }, '-=140')
      .add({ targets: backdrop, opacity: 0, duration: 420, easing: 'easeOutQuad', complete: finish }, '-=520');
  }, [phase, onClose, originTransform]);

  // Parent may flip `open` to false (e.g. "Get in Touch"); play the exit.
  useEffect(() => { if (!open && (phase === 'boot' || phase === 'on')) close(); }, [open, phase, close]);

  // ---- keyboard, scroll lock, focus containment -------------------------
  const active = phase !== 'closed';
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (phase === 'boot' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); powerOn(); }
    };
    const onFocusIn = (e: FocusEvent) => {
      const o = overlayRef.current;
      if (o && e.target instanceof Node && !o.contains(e.target)) powerRef.current?.focus({ preventScroll: true });
    };
    const onResize = () => setSize(monitorSize());
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('resize', onResize);
    };
  }, [active, phase, close, powerOn]);

  useEffect(() => () => clearTimers(), []);

  // ---- fit the 1480px-wide game into the glass ---------------------------
  useLayoutEffect(() => {
    const vp = viewportRef.current, game = gameRef.current;
    if (!vp || !game) return;
    const measure = () => {
      const vw = vp.clientWidth, vh = vp.clientHeight, gh = game.offsetHeight || 980;
      if (!vw || !vh) return;
      const s = Math.min(vw / GAME_WIDTH, vh / gh);
      if (s < MIN_SCALE) {
        const sc = Math.max(MIN_SCALE, vw / GAME_WIDTH);
        setFit({ scale: sc, left: 0, top: 0, h: gh, scroll: true });
      } else {
        setFit({ scale: s, left: (vw - GAME_WIDTH * s) / 2, top: (vh - gh * s) / 2, h: gh, scroll: false });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp); ro.observe(game);
    return () => ro.disconnect();
  }, [mounted, size]);

  const handleContact = useCallback(() => {
    close();
    timers.current.push(setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 1300));
  }, [close]);

  if (!mounted) return null;

  return createPortal(
    <div ref={overlayRef} className="retro-overlay" hidden={!active} role="dialog" aria-modal="true" aria-label="Infra Ops: secure the cloud account">
      <div ref={backdropRef} className="retro-backdrop" style={{ opacity: 0 }} onClick={close} />
      <div ref={monitorRef} className="retro-monitor" style={{ width: size.width, height: size.height, opacity: 0 }}>
        <div className="retro-glass">
          <div ref={viewportRef} className={`retro-viewport${fit.scroll ? ' is-scrollable' : ''}`}>
            <div ref={screenRef} className="retro-screen" style={fit.scroll ? { position: 'relative', inset: 'auto', width: GAME_WIDTH * fit.scale, height: fit.h * fit.scale } : undefined}>
              <div className="retro-game-host" style={{ position: 'absolute', left: fit.left, top: fit.top, transform: `scale(${fit.scale})` }}>
                <div ref={gameRef}>
                  <InfraOpsGame onContact={handleContact} />
                </div>
              </div>
            </div>
          </div>

          {phase === 'boot' && (
            <div className="retro-boot" onClick={powerOn} aria-live="polite">
              {bootLines.slice(0, bootCount).map((l, i) => (
                <div key={i} className={l.c}>{l.t || ' '}</div>
              ))}
              <span className="caret" aria-hidden="true" />
              <span className="skip">click or press enter to skip</span>
            </div>
          )}
          {(phase === 'zoom') && <div className="retro-boot" aria-hidden="true" />}

          <div className="retro-scanlines" aria-hidden="true" />
          <div ref={flashRef} className="retro-flash" aria-hidden="true" />
        </div>

        <div className="retro-chin">
          <span className="retro-badge" aria-hidden="true">RETRO</span>
          <div className="retro-controls">
            <span className="esc-hint">esc to power off</span>
            <span className={`retro-led${phase === 'on' || phase === 'boot' ? ' on' : ''}`} aria-hidden="true" />
            <button ref={powerRef} type="button" className="retro-power" onClick={close}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3v8" /><path d="M6.4 6.6a8 8 0 1 0 11.2 0" />
              </svg>
              Power off
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RetroMonitorPopup;
