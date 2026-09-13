import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { talks } from '@/data/siteExtras';
import { Mic, ExternalLink } from 'lucide-react';

const Talks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.talks-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.talk-card',
              opacity: [0, 1],
              translateX: [-30, 0],
              delay: anime.stagger(100, { start: 250 }),
              duration: 700,
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
    <section id="talks" ref={sectionRef} className="section">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="section-title talks-header opacity-0">External Representation</p>
          <h2 className="section-heading talks-header opacity-0">Talks &amp; training</h2>
        </div>

        <div className="space-y-4">
          {talks.map((talk) => {
            const body = (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                  <Mic className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <h3 className="font-medium text-foreground">{talk.title}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {talk.year}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mb-2">
                    {talk.venue}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {talk.description}
                  </p>
                </div>

                {talk.link && (
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                )}
              </div>
            );

            const className =
              'talk-card opacity-0 block card-cyber rounded-xl p-6 group transition-all duration-300';

            return talk.link ? (
              <a
                key={talk.id}
                href={talk.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} hover:border-foreground/20`}
              >
                {body}
              </a>
            ) : (
              <div key={talk.id} className={className}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Talks;
