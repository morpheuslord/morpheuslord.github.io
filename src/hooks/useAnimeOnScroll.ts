import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface UseAnimeOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const useAnimeOnScroll = (
  animationConfig: anime.AnimeParams,
  options: UseAnimeOnScrollOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state
    anime.set(element, {
      opacity: 0,
      translateY: 30,
      ...animationConfig.begin ? {} : {},
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated)) {
            anime({
              targets: element,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
              ...animationConfig,
            });
            setHasAnimated(true);
            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animationConfig, threshold, rootMargin, once, hasAnimated]);

  return ref;
};

export const useStaggerAnimation = (
  selector: string,
  config: anime.AnimeParams = {}
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    
    // Set initial state
    anime.set(elements, {
      opacity: 0,
      translateY: 40,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            anime({
              targets: elements,
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 800,
              delay: anime.stagger(100),
              easing: 'easeOutExpo',
              ...config,
            });
            setHasAnimated(true);
            observer.unobserve(container);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [selector, config, hasAnimated]);

  return containerRef;
};

export const useTextReveal = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const text = element.textContent || '';
    element.innerHTML = '';
    
    // Create spans for each character
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      element.appendChild(span);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: element.querySelectorAll('span'),
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 600,
              delay: anime.stagger(30),
              easing: 'easeOutExpo',
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
};
