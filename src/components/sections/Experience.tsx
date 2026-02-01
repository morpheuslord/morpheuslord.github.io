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

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = 220;
    const margin = { top: 20, right: 30, bottom: 60, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = calculateRoleMetrics();

    const categories = ['security', 'development', 'research', 'leadership'] as const;
    const colors: Record<typeof categories[number], string> = {
      security: '#22c55e',
      development: '#3b82f6',
      research: '#8b5cf6',
      leadership: '#f59e0b',
    };

    const categoryLabels: Record<typeof categories[number], string> = {
      security: 'Security Operations',
      development: 'Development & Tools',
      research: 'Research & Strategy',
      leadership: 'Leadership & Mentoring',
    };

    const xScale = d3.scalePoint<number>()
      .domain(data.map((_, i) => i))
      .range([0, innerWidth])
      .padding(0.3);

    const maxCategoryValue = Math.max(
      ...data.flatMap(d => [d.scores.security, d.scores.development, d.scores.research, d.scores.leadership])
    );
    const yMax = Math.max(maxCategoryValue + 1, 6);

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    const yTicks = d3.range(0, yMax + 1, Math.ceil(yMax / 5));

    g.selectAll('.grid-line')
      .data(yTicks)
      .join('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'rgba(255,255,255,0.06)')
      .attr('stroke-dasharray', '4,4');

    g.selectAll('.y-label')
      .data(yTicks)
      .join('text')
      .attr('class', 'y-label')
      .attr('x', -8)
      .attr('y', d => yScale(d))
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(d => d);

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
      .style('max-width', '320px')
      .style('box-shadow', '0 8px 32px rgba(0,0,0,0.4)');

    categories.forEach((category, catIndex) => {
      const lineData = data.map((d, i) => ({
        x: xScale(i) || 0,
        y: yScale(d.scores[category]),
        value: d.scores[category],
        raw: d.rawCounts[category],
        total: d.totalResponsibilities,
        ...d,
      }));

      const line = d3.line<typeof lineData[0]>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveMonotoneX);

      const path = g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', colors[category])
        .attr('stroke-width', 2.5)
        .attr('stroke-opacity', 0.8)
        .attr('d', line);

      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1200)
        .delay(catIndex * 150)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', 0);

      g.selectAll(`.dot-${category}`)
        .data(lineData)
        .join('circle')
        .attr('class', `dot-${category}`)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .attr('fill', colors[category])
        .attr('stroke', d => d.isActive ? 'white' : 'transparent')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer')
        .on('click', (_, d) => {
          setActiveRole(experiences.length - 1 - d.index);
        })
        .on('mouseover', function(event, d) {
          d3.select(this).transition().duration(150).attr('r', 8);
          
          const pct = ((d.value / d.total) * 100).toFixed(0);
          
          tooltip.html(`
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
              <div style="font-weight: 600; font-size: 13px; color: #22c55e;">${d.title}</div>
              <div style="color: #888; font-size: 11px; margin-top: 2px;">${d.company} | ${d.period}</div>
            </div>
            
            <div style="margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${colors[category]};"></span>
                <span style="font-weight: 500;">${categoryLabels[category]}</span>
              </div>
              <div style="font-size: 24px; font-weight: bold; color: ${colors[category]};">${d.value} tasks</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; font-size: 11px;">
              <div style="font-weight: 500; margin-bottom: 6px; color: #aaa;">Responsibility Breakdown:</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #888;">Total responsibilities:</span>
                <span style="font-weight: bold; color: #22c55e;">${d.total}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #888;">${categoryLabels[category]}:</span>
                <span style="font-weight: bold; color: ${colors[category]};">${d.value} (${pct}%)</span>
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
          d3.select(this).transition().duration(150).attr('r', d => (d as typeof lineData[0]).isActive ? 6 : 5);
          tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(600)
        .delay((_, i) => catIndex * 150 + i * 100 + 800)
        .attr('r', d => d.isActive ? 6 : 5);
    });

    g.selectAll('.x-label')
      .data(data)
      .join('text')
      .attr('class', 'x-label')
      .attr('x', (_, i) => xScale(i) || 0)
      .attr('y', innerHeight + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.5)')
      .attr('font-size', '9px')
      .attr('font-weight', d => d.isActive ? '600' : '400')
      .text(d => d.title.split(' ')[0]);

    g.selectAll('.x-company')
      .data(data)
      .join('text')
      .attr('class', 'x-company')
      .attr('x', (_, i) => xScale(i) || 0)
      .attr('y', innerHeight + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.3)')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .text(d => d.company.substring(0, 12));

    g.selectAll('.x-scope')
      .data(data)
      .join('text')
      .attr('class', 'x-scope')
      .attr('x', (_, i) => xScale(i) || 0)
      .attr('y', innerHeight + 46)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.4)')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('font-family', 'monospace')
      .text(d => `${d.totalResponsibilities}`);

    return () => {
      d3.selectAll('.exp-tooltip').remove();
    };

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
                <p className="text-sm font-medium text-foreground">Responsibility Growth</p>
                <button 
                  onClick={() => setShowMethodology(!showMethodology)}
                  className="p-1 rounded hover:bg-foreground/10 transition-colors"
                  data-testid="button-methodology-toggle"
                >
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Hover points for detailed breakdown | Click to navigate</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-muted-foreground">Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span className="text-muted-foreground">Development</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                <span className="text-muted-foreground">Research</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <span className="text-muted-foreground">Leadership</span>
              </div>
            </div>
          </div>

          {showMethodology && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
              <p className="font-medium text-green-500 mb-2">Quantization Methodology</p>
              <p className="text-muted-foreground leading-relaxed">
                This chart shows <span className="text-green-500/80">absolute responsibility counts</span> across 
                four key domains, inspired by the <span className="text-green-500/80">ResQu (Responsibility Quantification) Model</span>. 
                Each line tracks the actual number of tasks in that category over time:
              </p>
              <div className="mt-2 p-2 rounded bg-background/50 font-mono text-green-500/80">
                Y-axis = Number of responsibilities in each category
              </div>
              <p className="text-muted-foreground mt-2">
                This provides an objective view of responsibility growth, clearly showing how both scope and 
                specialization have increased throughout career progression.
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
