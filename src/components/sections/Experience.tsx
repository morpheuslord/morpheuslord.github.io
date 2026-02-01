import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import * as d3 from 'd3';
import { experiences } from '@/data/portfolioData';
import { Briefcase, Code, Users, Lightbulb, TrendingUp, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryScores {
  security: number;
  development: number;
  research: number;
  leadership: number;
}

interface RoleMetrics {
  index: number;
  title: string;
  company: string;
  period: string;
  scores: CategoryScores;
  rawCounts: CategoryScores;
  totalResponsibilities: number;
  scopeScore: number;
  isActive: boolean;
  isCurrent: boolean;
}

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const [activeRole, setActiveRole] = useState(0);
  const [showMethodology, setShowMethodology] = useState(false);

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
              translateY: [20, 0],
              delay: anime.stagger(80, { start: 300 }),
              duration: 600,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.exp-content',
              opacity: [0, 1],
              translateY: [30, 0],
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

  const categorizeHighlight = (title: string): keyof CategoryScores => {
    const lower = title.toLowerCase();
    if (lower.includes('lead') || lower.includes('team') || lower.includes('mentor') || lower.includes('recruit') || lower.includes('training') || lower.includes('coordinate')) {
      return 'leadership';
    }
    if (lower.includes('development') || lower.includes('api') || lower.includes('python') || lower.includes('android') || lower.includes('automation') || lower.includes('tools') || lower.includes('implement')) {
      return 'development';
    }
    if (lower.includes('research') || lower.includes('design') || lower.includes('architecture') || lower.includes('poc') || lower.includes('analysis') || lower.includes('strategy')) {
      return 'research';
    }
    return 'security';
  };

  const calculateRoleMetrics = (): RoleMetrics[] => {
    const maxResponsibilities = Math.max(...experiences.map(e => e.highlights.length));
    
    return [...experiences].reverse().map((exp, i) => {
      const rawCounts: CategoryScores = { leadership: 0, development: 0, research: 0, security: 0 };
      
      exp.highlights.forEach(h => {
        const cat = categorizeHighlight(h.title);
        rawCounts[cat]++;
      });

      const totalResponsibilities = exp.highlights.length;
      const scopeScore = (totalResponsibilities / maxResponsibilities) * 100;

      const scores: CategoryScores = {
        security: rawCounts.security,
        development: rawCounts.development,
        research: rawCounts.research,
        leadership: rawCounts.leadership,
      };

      return {
        index: i,
        title: exp.title,
        company: exp.company.split('/')[0].trim(),
        period: exp.period,
        scores,
        rawCounts,
        totalResponsibilities,
        scopeScore,
        isActive: experiences.length - 1 - i === activeRole,
        isCurrent: exp.current || false,
      };
    });
  };

  const [showCombined, setShowCombined] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = 340;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    const allData = calculateRoleMetrics();
    const categories = ['security', 'development', 'research', 'leadership'] as const;
    
    const categoryLabels: Record<typeof categories[number], string> = {
      security: 'Security',
      development: 'Development',
      research: 'Research',
      leadership: 'Leadership',
    };

    const roleColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b'];

    const maxValue = Math.max(
      ...allData.flatMap(d => categories.map(c => d.scores[c]))
    );
    const levels = 5;
    const angleSlice = (Math.PI * 2) / categories.length;

    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      const levelValue = Math.round((maxValue / levels) * level);
      
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.1)')
        .attr('stroke-dasharray', '3,3');

      g.append('text')
        .attr('x', 5)
        .attr('y', -levelRadius - 2)
        .attr('fill', 'rgba(255,255,255,0.4)')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(levelValue);
    }

    categories.forEach((cat, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.15)')
        .attr('stroke-width', 1);

      const labelX = Math.cos(angle) * (radius + 25);
      const labelY = Math.sin(angle) * (radius + 25);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255,255,255,0.7)')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .text(categoryLabels[cat]);
    });

    const tooltip = d3.select('body').append('div')
      .attr('class', 'exp-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(10,10,10,0.95)')
      .style('border', '1px solid rgba(34,197,94,0.3)')
      .style('border-radius', '10px')
      .style('padding', '14px')
      .style('font-size', '12px')
      .style('color', 'white')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '280px')
      .style('box-shadow', '0 8px 32px rgba(0,0,0,0.4)');

    const radarLine = d3.lineRadial<number>()
      .radius(d => (d / maxValue) * radius)
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const dataToRender = showCombined ? allData : [allData[experiences.length - 1 - activeRole]];

    dataToRender.forEach((role, roleIndex) => {
      const values = categories.map(c => role.scores[c]);
      const color = showCombined ? roleColors[roleIndex % roleColors.length] : '#22c55e';
      const opacity = showCombined ? (role.isActive ? 1 : 0.4) : 0.8;

      g.append('path')
        .datum(values)
        .attr('fill', color)
        .attr('fill-opacity', opacity * 0.15)
        .attr('stroke', color)
        .attr('stroke-width', role.isActive || !showCombined ? 2.5 : 1.5)
        .attr('stroke-opacity', opacity)
        .attr('d', radarLine)
        .attr('cursor', 'pointer')
        .on('click', () => {
          if (showCombined) {
            setActiveRole(experiences.length - 1 - role.index);
          }
        })
        .on('mouseover', function(event) {
          d3.select(this).attr('stroke-width', 3);
          
          const coords = categories.map(c => `${categoryLabels[c]}: ${role.scores[c]}`).join(' | ');
          
          tooltip.html(`
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 8px;">
              <div style="font-weight: 600; font-size: 13px; color: ${color};">${role.title}</div>
              <div style="color: #888; font-size: 11px; margin-top: 2px;">${role.company} | ${role.period}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Responsibility Scores:</div>
              ${categories.map(c => `
                <div style="display: flex; justify-content: space-between; margin: 3px 0;">
                  <span style="color: #888;">${categoryLabels[c]}:</span>
                  <span style="font-weight: bold; color: white;">${role.scores[c]}</span>
                </div>
              `).join('')}
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; font-size: 10px;">
              <div style="color: #22c55e; font-family: monospace; word-break: break-all;">
                (${coords})
              </div>
            </div>
          `)
            .style('visibility', 'visible')
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px');
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('stroke-width', role.isActive || !showCombined ? 2.5 : 1.5);
          tooltip.style('visibility', 'hidden');
        });

      categories.forEach((cat, catIndex) => {
        const angle = angleSlice * catIndex - Math.PI / 2;
        const value = role.scores[cat];
        const pointRadius = (value / maxValue) * radius;
        const x = Math.cos(angle) * pointRadius;
        const y = Math.sin(angle) * pointRadius;

        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', role.isActive || !showCombined ? 5 : 3)
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', role.isActive || !showCombined ? 2 : 0)
          .attr('cursor', 'pointer')
          .on('click', () => {
            if (showCombined) {
              setActiveRole(experiences.length - 1 - role.index);
            }
          });
      });
    });

    if (showCombined) {
      const legendG = svg.append('g')
        .attr('transform', `translate(${width - 150}, 20)`);

      allData.forEach((role, i) => {
        const color = roleColors[i % roleColors.length];
        const yPos = i * 18;

        legendG.append('rect')
          .attr('x', 0)
          .attr('y', yPos)
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', color)
          .attr('rx', 2)
          .attr('opacity', role.isActive ? 1 : 0.5);

        legendG.append('text')
          .attr('x', 18)
          .attr('y', yPos + 10)
          .attr('fill', role.isActive ? 'white' : 'rgba(255,255,255,0.5)')
          .attr('font-size', '10px')
          .text(role.company.substring(0, 12));
      });
    }

    return () => {
      d3.selectAll('.exp-tooltip').remove();
    };

  }, [activeRole, showCombined]);

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

  return (
    <section id="experience" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="section-title exp-header opacity-0">Where I've Worked</p>
          <h2 className="section-heading exp-header opacity-0">Experience</h2>
          <div className="exp-header opacity-0 flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>2+ years of continuous growth</span>
          </div>
        </div>

        <div className="exp-header opacity-0 mb-8 p-4 sm:p-5 rounded-xl bg-background/30 border border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">Responsibility Radar</p>
                <button 
                  onClick={() => setShowMethodology(!showMethodology)}
                  className="p-1 rounded hover:bg-foreground/10 transition-colors"
                  data-testid="button-methodology-toggle"
                >
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {showCombined ? 'All positions overlaid | Hover to see coordinates' : `Showing: ${experiences[activeRole].title}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 rounded-lg bg-foreground/5 border border-border/30">
                <button
                  onClick={() => setShowCombined(true)}
                  data-testid="button-view-combined"
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    showCombined 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Combined
                </button>
                <button
                  onClick={() => setShowCombined(false)}
                  data-testid="button-view-selected"
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    !showCombined 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Selected
                </button>
              </div>
            </div>
          </div>

          {showMethodology && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
              <p className="font-medium text-green-500 mb-2">Radar Chart Quantization</p>
              <p className="text-muted-foreground leading-relaxed">
                This radar chart visualizes <span className="text-green-500/80">responsibility distribution</span> across 
                four key domains, inspired by the <span className="text-green-500/80">ResQu (Responsibility Quantification) Model</span>. 
                Each axis represents a category, and the distance from center shows the count:
              </p>
              <div className="mt-2 p-2 rounded bg-background/50 font-mono text-green-500/80">
                Coordinates = (Security, Development, Research, Leadership)
              </div>
              <p className="text-muted-foreground mt-2">
                Combined view overlays all positions to show growth trajectory. 
                Selected view focuses on a single role for detailed analysis.
              </p>
            </div>
          )}

          <div className="w-full overflow-hidden">
            <svg ref={chartRef} className="w-full" />
          </div>
        </div>

        <div className="exp-tab opacity-0 flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          {experiences.map((exp, index) => (
            <button
              key={exp.id}
              onClick={() => setActiveRole(index)}
              data-testid={`button-experience-tab-${exp.id}`}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                activeRole === index
                  ? 'bg-green-500/10 text-foreground border border-green-500/30'
                  : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground border border-transparent'
              }`}
            >
              <div>
                <p className="font-medium text-sm whitespace-nowrap">{exp.title}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{exp.company}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70">{exp.period}</p>
              </div>
              {exp.current && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="exp-content opacity-0 card-cyber rounded-xl p-4 sm:p-6 md:p-8">
          <div className="exp-detail mb-6 pb-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2 mb-3">
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
              <span className="px-2 py-1 rounded text-xs font-mono bg-foreground/5 text-muted-foreground border border-border/50">
                {currentExp.highlights.length} responsibilities
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
              {currentExp.title}
              <span className="text-muted-foreground"> @ {currentExp.company}</span>
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-muted-foreground">
              <span>{currentExp.period}</span>
              <span className="text-border">|</span>
              <span>{currentExp.duration}</span>
            </div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentExp.highlights.map((highlight, index) => {
                const IconComponent = getCategoryIcon(highlight.title);
                return (
                  <div 
                    key={index} 
                    className="exp-detail group p-3 sm:p-4 rounded-lg bg-background/50 border border-border/30 hover:border-green-500/30 hover:bg-background/80 transition-all duration-300"
                    data-testid={`card-highlight-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-foreground/5 group-hover:bg-green-500/10 transition-colors flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
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
    </section>
  );
};

export default Experience;
