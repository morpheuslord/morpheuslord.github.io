import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { experiences } from '@/data/portfolioData';
import { CheckCircle2, Briefcase, Code, Users, Lightbulb } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.exp-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.exp-tab',
              opacity: [0, 1],
              translateX: [-30, 0],
              delay: anime.stagger(80, { start: 300 }),
              duration: 600,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.exp-content',
              opacity: [0, 1],
              translateX: [30, 0],
              duration: 800,
              delay: 500,
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

  useEffect(() => {
    anime({
      targets: '.exp-detail',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(30),
      duration: 400,
      easing: 'easeOutExpo',
    });
  }, [activeRole]);

  const currentExp = experiences[activeRole];

  const getCategoryIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('lead') || lowerTitle.includes('team') || lowerTitle.includes('mentor') || lowerTitle.includes('recruit')) {
      return Users;
    }
    if (lowerTitle.includes('development') || lowerTitle.includes('api') || lowerTitle.includes('python') || lowerTitle.includes('android')) {
      return Code;
    }
    if (lowerTitle.includes('research') || lowerTitle.includes('design') || lowerTitle.includes('architecture')) {
      return Lightbulb;
    }
    return Briefcase;
  };

  return (
    <section id="experience" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title exp-header opacity-0">Where I've Worked</p>
          <h2 className="section-heading exp-header opacity-0">Experience</h2>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => setActiveRole(index)}
                data-testid={`button-experience-tab-${exp.id}`}
                className={`exp-tab opacity-0 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
                  activeRole === index
                    ? 'bg-foreground/10 text-foreground border-l-2 border-foreground'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground border-l-2 border-transparent'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{exp.company}</p>
                  <p className="font-mono text-xs text-muted-foreground">{exp.period}</p>
                </div>
                {exp.current && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="exp-content opacity-0 card-cyber rounded-xl p-6 md:p-8">
            {/* Header */}
            <div className="exp-detail mb-6 pb-6 border-b border-border/50">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {currentExp.title}
                <span className="text-muted-foreground"> @ {currentExp.company}</span>
              </h3>
              <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
                <span>{currentExp.period}</span>
                <span className="text-border">•</span>
                <span>{currentExp.duration}</span>
                {currentExp.current && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5 text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Current Role
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {currentExp.highlights.length} key responsibilities & achievements
              </p>
            </div>

            {/* Highlights Grid with Scroll */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {currentExp.highlights.map((highlight, index) => {
                  const IconComponent = getCategoryIcon(highlight.title);
                  return (
                    <div 
                      key={index} 
                      className="exp-detail group p-4 rounded-lg bg-background/50 border border-border/30 hover:border-foreground/20 hover:bg-background/80 transition-all duration-300"
                      data-testid={`card-highlight-${index}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                          <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground mb-1 leading-tight">{highlight.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{highlight.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
