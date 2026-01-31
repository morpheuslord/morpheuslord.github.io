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

  // D3 Chart for Responsibilities
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = 120;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data - reversed so oldest is first (left to right growth)
    const data = [...experiences].reverse().map((exp, i) => ({
      index: i,
      company: exp.company.split('/')[0].trim(),
      responsibilities: exp.highlights.length,
      isCurrent: exp.current,
      isActive: experiences.length - 1 - i === activeRole,
    }));

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.responsibilities) || 10])
      .range([innerHeight, 0]);

    // Area generator for growth visualization
    const area = d3.area<typeof data[0]>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .y0(innerHeight)
      .y1(d => yScale(d.responsibilities))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3.line<typeof data[0]>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.responsibilities))
      .curve(d3.curveMonotoneX);

    // Draw gradient area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#22c55e')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#22c55e')
      .attr('stop-opacity', 0.05);

    // Area path
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // Line path
    const linePath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animate line
    const lineLength = linePath.node()?.getTotalLength() || 0;
    linePath
      .attr('stroke-dasharray', lineLength)
      .attr('stroke-dashoffset', lineLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadOut)
      .attr('stroke-dashoffset', 0);

    // Draw bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.1)')
      .attr('rx', 3)
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        setActiveRole(experiences.length - 1 - d.index);
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => yScale(d.responsibilities))
      .attr('height', d => innerHeight - yScale(d.responsibilities));

    // Draw dots on top of bars
    g.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('cy', innerHeight)
      .attr('r', 0)
      .attr('fill', d => d.isCurrent ? '#22c55e' : d.isActive ? '#22c55e' : 'rgba(255,255,255,0.5)')
      .attr('stroke', d => d.isActive ? '#22c55e' : 'transparent')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        setActiveRole(experiences.length - 1 - d.index);
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr('cy', d => yScale(d.responsibilities))
      .attr('r', d => d.isActive ? 6 : 4);

    // Labels
    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.4)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .text(d => d.company.substring(0, 8));

    // Value labels on top
    g.selectAll('.value')
      .data(data)
      .join('text')
      .attr('class', 'value')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.responsibilities) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.isActive ? '#22c55e' : 'rgba(255,255,255,0.6)')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => d.responsibilities)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 600)
      .attr('opacity', 1);

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
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground font-mono">Responsibilities Over Time</p>
            <p className="text-xs text-green-500 font-mono">Click bars to navigate</p>
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
                <p className="font-medium text-sm whitespace-nowrap">{exp.company}</p>
                <p className="font-mono text-xs text-muted-foreground">{exp.period}</p>
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
