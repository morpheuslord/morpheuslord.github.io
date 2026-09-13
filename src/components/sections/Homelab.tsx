import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { homelab } from '@/data/siteExtras';
import { Server, ExternalLink } from 'lucide-react';

const Homelab = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.homelab-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.homelab-item',
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.97, 1],
              delay: anime.stagger(70, { start: 250 }),
              duration: 650,
              easing: 'easeOutExpo',
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="homelab" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-6">
          <p className="section-title homelab-header opacity-0">Demonstrated Ownership</p>
          <h2 className="section-heading homelab-header opacity-0">Homelab</h2>
        </div>
        <p className="homelab-header opacity-0 text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          {homelab.summary}
        </p>

        {/* Stack */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {homelab.stack.map((item) => (
            <div
              key={item.name}
              className="homelab-item opacity-0 card-cyber rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <h3 className="font-medium text-foreground">{item.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Writeups */}
        <div className="mt-10">
          <p className="homelab-item opacity-0 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">
            Writeups
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {homelab.writeups.map((w) => (
              <a
                key={w.url}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="homelab-item opacity-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 bg-card/40 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
              >
                <span>{w.title}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homelab;
