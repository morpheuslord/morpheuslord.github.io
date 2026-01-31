import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import * as d3 from 'd3';
import { experiences } from '@/data/portfolioData';
import { Briefcase, Code, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
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

  // Categorize highlights
  const categorizeHighlight = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('lead') || lower.includes('team') || lower.includes('mentor') || lower.includes('recruit') || lower.includes('training')) {
      return 'leadership';
    }
    if (lower.includes('development') || lower.includes('api') || lower.includes('python') || lower.includes('android') || lower.includes('automation') || lower.includes('tools')) {
      return 'development';
    }
    if (lower.includes('research') || lower.includes('design') || lower.includes('architecture') || lower.includes('poc')) {
      return 'research';
    }
    return 'security';
  };

  // D3 Stacked Bar Chart for Responsibilities
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = 180;
    const margin = { top: 30, right: 20, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data with categories - reversed so oldest is first
    const data = [...experiences].reverse().map((exp, i) => {
      const categories = { leadership: 0, development: 0, research: 0, security: 0 };
      exp.highlights.forEach(h => {
        const cat = categorizeHighlight(h.title);
        categories[cat as keyof typeof categories]++;
      });
      return {
        index: i,
        title: exp.title,
        company: exp.company.split('/')[0].trim(),
        period: exp.period,
        total: exp.highlights.length,
        ...categories,
        isCurrent: exp.current,
        isActive: experiences.length - 1 - i === activeRole,
      };
    });

    const categories = ['security', 'development', 'research', 'leadership'] as const;
    const colors: Record<typeof categories[number], string> = {
      leadership: '#f59e0b',
      development: '#3b82f6',
      research: '#8b5cf6',
      security: '#22c55e',
    };

    // Stack data
    const stack = d3.stack<typeof data[0]>()
      .keys(categories)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.25);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) || 10])
      .range([innerHeight, 0]);

    // Y-axis gridlines
    g.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .join('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-dasharray', '3,3');

    // Y-axis labels
    g.selectAll('.y-label')
      .data(yScale.ticks(5))
      .join('text')
      .attr('class', 'y-label')
      .attr('x', -8)
      .attr('y', d => yScale(d))
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .text(d => d);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'exp-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0,0,0,0.9)')
      .style('border', '1px solid rgba(255,255,255,0.2)')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('font-size', '12px')
      .style('color', 'white')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '250px');

    // Draw stacked bars
    stackedData.forEach((layer, layerIndex) => {
      g.selectAll(`.bar-${layer.key}`)
        .data(layer)
        .join('rect')
        .attr('class', `bar-${layer.key}`)
        .attr('x', (d, i) => xScale(i.toString()) || 0)
        .attr('y', innerHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', colors[layer.key as keyof typeof colors])
        .attr('opacity', d => d.data.isActive ? 1 : 0.6)
        .attr('cursor', 'pointer')
        .on('click', (_, d) => {
          setActiveRole(experiences.length - 1 - d.data.index);
        })
        .on('mouseover', function(event, d) {
          const catLabels: Record<string, string> = {
            leadership: 'Leadership & Mentorship',
            development: 'Development & Tools',
            research: 'Research & Architecture',
            security: 'Security & Operations'
          };
          
          tooltip.html(`
            <div style="font-weight: bold; margin-bottom: 8px; color: #22c55e;">${d.data.title}</div>
            <div style="color: #888; margin-bottom: 8px; font-size: 11px;">${d.data.company} • ${d.data.period}</div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
              <div style="margin-bottom: 4px; font-weight: 500;">Responsibility Breakdown:</div>
              ${categories.map(cat => `
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: ${colors[cat]};">${catLabels[cat]}</span>
                  <span style="font-weight: bold;">${d.data[cat]}</span>
                </div>
              `).join('')}
              <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 6px; padding-top: 6px; display: flex; justify-content: space-between;">
                <span>Total</span>
                <span style="font-weight: bold; color: #22c55e;">${d.data.total}</span>
              </div>
            </div>
          `)
            .style('visibility', 'visible')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((_, i) => i * 100 + layerIndex * 50)
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]));
    });

    // Total labels on top
    g.selectAll('.total')
      .data(data)
      .join('text')
      .attr('class', 'total')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.total) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.7)')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => d.total)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr('opacity', 1);

    // X-axis labels (title)
    g.selectAll('.x-title')
      .data(data)
      .join('text')
      .attr('class', 'x-title')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.5)')
      .attr('font-size', '9px')
      .attr('font-weight', '500')
      .text(d => d.title.split(' ')[0]);

    // X-axis labels (company)
    g.selectAll('.x-company')
      .data(data)
      .join('text')
      .attr('class', 'x-company')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 26)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.3)')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .text(d => d.company.substring(0, 10));

    // Cleanup tooltip on unmount
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
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="section-title exp-header opacity-0">Where I've Worked</p>
          <h2 className="section-heading exp-header opacity-0">Experience</h2>
          <div className="exp-header opacity-0 flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>2+ years of continuous growth</span>
          </div>
        </div>

        {/* Responsibility Growth Chart */}
        <div className="exp-header opacity-0 mb-8 p-4 rounded-xl bg-background/30 border border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-medium text-foreground">Responsibility Growth</p>
              <p className="text-xs text-muted-foreground">Hover over bars to see breakdown</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#22c55e]" />
                <span className="text-muted-foreground">Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#3b82f6]" />
                <span className="text-muted-foreground">Development</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#8b5cf6]" />
                <span className="text-muted-foreground">Research</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
                <span className="text-muted-foreground">Leadership</span>
              </div>
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <svg ref={chartRef} className="w-full" />
          </div>
        </div>

        {/* Role Tabs - Horizontal scroll on mobile */}
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

        {/* Content */}
        <div className="exp-content opacity-0 card-cyber rounded-xl p-4 sm:p-6 md:p-8">
          {/* Header */}
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
              <span className="text-border">•</span>
              <span>{currentExp.duration}</span>
            </div>
          </div>

          {/* Highlights Grid with Scroll */}
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
