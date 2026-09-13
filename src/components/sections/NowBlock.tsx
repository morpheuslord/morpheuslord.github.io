import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { nowBlock } from '@/data/siteExtras';
import { Radio } from 'lucide-react';

const NowBlock = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.now-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.now-item',
              opacity: [0, 1],
              translateX: [-20, 0],
              delay: anime.stagger(90, { start: 200 }),
              duration: 600,
              easing: 'easeOutExpo',
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="now" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="card-cyber rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="now-header opacity-0 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                <Radio className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="section-title !mb-0">Currently</p>
                <h2 className="text-2xl font-bold">What I am working on now</h2>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border/60">
              Updated {nowBlock.updated}
            </span>
          </div>

          <p className="now-header opacity-0 text-sm text-muted-foreground mb-6">
            {nowBlock.intro}
          </p>

          {/* Items */}
          <ul className="space-y-3">
            {nowBlock.items.map((item) => (
              <li
                key={item}
                className="now-item opacity-0 flex gap-3 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NowBlock;
