import { useEffect } from 'react';

/**
 * Feeds the pointer position into every `.card-cyber` as --mx / --my, which the
 * card's ::before (soft light) and ::after (lit edge) read. One delegated
 * listener for the whole page instead of one per card; skipped on touch.
 */
export const useCardSpotlight = () => {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!last) return;
      const card = (last.target as Element | null)?.closest?.('.card-cyber') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${last.clientX - rect.left}px`);
      card.style.setProperty('--my', `${last.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
};
