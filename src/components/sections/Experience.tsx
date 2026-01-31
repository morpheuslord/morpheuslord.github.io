import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { experiences } from '@/data/portfolioData';
import { Briefcase, Code, Users, Lightbulb, TrendingUp, Award, ArrowUpRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRole, setActiveRole] = useState(0);

  const totalExperiences = experiences.length;
  const maxHighlights = Math.max(...experiences.map(e => e.highlights.length));

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

            anime({
              targets: '.growth-line',
              scaleY: [0, 1],
              duration: 1200,
              delay: 600,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.growth-dot',
              scale: [0, 1],
              delay: anime.stagger(150, { start: 800 }),
              duration: 400,
              easing: 'easeOutBack',
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

    anime({
      targets: '.growth-bar',
      scaleX: [0, 1],
      duration: 800,
      delay: 200,
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

  const getRoleLevel = (index: number) => {
    const levels = ['Senior', 'Mid-Level', 'Junior', 'Entry'];
    return levels[Math.min(index, levels.length - 1)];
  };

  const getGrowthPercentage = (index: number) => {
    return Math.round(((totalExperiences - index) / totalExperiences) * 100);
  };

  const getImpactScore = (highlightsCount: number) => {
    return Math.round((highlightsCount / maxHighlights) * 100);
  };

  return (
    <section id="experience" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title exp-header opacity-0">Where I've Worked</p>
          <h2 className="section-heading exp-header opacity-0">Experience</h2>
          <div className="exp-header opacity-0 flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>2+ years of continuous growth</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Timeline Tabs */}
          <div className="relative">
            {/* Growth Line */}
            <div className="hidden lg:block absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-500 via-foreground/20 to-foreground/5 growth-line origin-top" />
            
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
              {experiences.map((exp, index) => {
                const growthPercent = getGrowthPercentage(index);
                const isActive = activeRole === index;
                
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveRole(index)}
                    data-testid={`button-experience-tab-${exp.id}`}
                    className={`exp-tab opacity-0 relative flex items-start gap-4 px-4 py-4 rounded-lg text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className={`growth-dot hidden lg:flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                      isActive 
                        ? 'border-green-500 bg-green-500/20' 
                        : exp.current 
                          ? 'border-green-500 bg-background' 
                          : 'border-foreground/30 bg-background'
                    }`}>
                      {exp.current && (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                      {!exp.current && isActive && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{exp.company}</p>
                        {index === 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                            <ArrowUpRight className="w-3 h-3" />
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-muted-foreground mb-2">{exp.period}</p>
                      
                      {/* Mini Growth Bar */}
                      <div className="hidden lg:block">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-foreground/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isActive ? 'bg-green-500' : 'bg-foreground/30'
                              }`}
                              style={{ width: `${growthPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-8">{growthPercent}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="exp-content opacity-0 card-cyber rounded-xl p-6 md:p-8">
            {/* Header with Growth Indicators */}
            <div className="exp-detail mb-6 pb-6 border-b border-border/50">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      activeRole === 0 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-foreground/5 text-muted-foreground border border-border/50'
                    }`}>
                      {getRoleLevel(activeRole)}
                    </span>
                    {currentExp.current && (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    {currentExp.title}
                    <span className="text-muted-foreground"> @ {currentExp.company}</span>
                  </h3>
                </div>
                
                {/* Impact Score */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/50 border border-border/30">
                  <Award className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Impact Score</p>
                    <p className="text-lg font-bold text-foreground">{getImpactScore(currentExp.highlights.length)}%</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground mb-4">
                <span>{currentExp.period}</span>
                <span className="text-border">•</span>
                <span>{currentExp.duration}</span>
              </div>

              {/* Responsibility Growth Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Responsibility Growth</span>
                  <span className="font-mono text-foreground">{currentExp.highlights.length} achievements</span>
                </div>
                <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div 
                    className="growth-bar h-full bg-gradient-to-r from-green-500/80 to-green-400 rounded-full origin-left"
                    style={{ width: `${getImpactScore(currentExp.highlights.length)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Highlights Grid with Scroll */}
            <ScrollArea className="h-[380px] pr-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {currentExp.highlights.map((highlight, index) => {
                  const IconComponent = getCategoryIcon(highlight.title);
                  return (
                    <div 
                      key={index} 
                      className="exp-detail group p-4 rounded-lg bg-background/50 border border-border/30 hover:border-green-500/30 hover:bg-background/80 transition-all duration-300"
                      data-testid={`card-highlight-${index}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative p-2 rounded-md bg-foreground/5 group-hover:bg-green-500/10 transition-colors">
                          <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground mb-1 leading-tight group-hover:text-green-500/90 transition-colors">{highlight.title}</h4>
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
