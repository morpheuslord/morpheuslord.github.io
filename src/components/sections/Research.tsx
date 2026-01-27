import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { researchPapers } from '@/data/portfolioData';
import { FileText, ExternalLink, BookOpen } from 'lucide-react';

const Research = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.research-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.research-card',
              opacity: [0, 1],
              translateX: [-30, 0],
              delay: anime.stagger(100, { start: 300 }),
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
    <section id="research" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title research-header opacity-0">Published Work</p>
          <h2 className="section-heading research-header opacity-0">Research Papers</h2>
        </div>

        {/* Research List */}
        <div className="space-y-4">
          {researchPapers.map((paper, index) => (
            <a
              key={paper.id}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="research-card opacity-0 block card-cyber rounded-xl p-6 group hover:border-foreground/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                  <FileText className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 group-hover:text-foreground/90 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {paper.description}
                  </p>
                </div>

                {/* Arrow */}
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;
