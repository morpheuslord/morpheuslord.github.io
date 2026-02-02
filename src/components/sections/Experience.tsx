import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import * as d3 from 'd3';
import {
  experiences,
  RESPONSIBILITY_CATEGORIES,
  DEFAULT_IMPORTANCE,
  type ResponsibilityScores,
  type MainExpCategory,
  type ExperienceHighlight,
} from '@/data/portfolioData';
import { Briefcase, Code, Users, Lightbulb, TrendingUp, Info, Handshake, Target, Package, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type CategoryKey = MainExpCategory;

const SCALE_MAX = 5; // Fixed 0–5 scale so chart is not inflated/deflated by data max; fair representation.

/** Raw counts per category. */
function getCountsFromHighlights(highlights: ExperienceHighlight[]): ResponsibilityScores {
  const counts: ResponsibilityScores = {
    security: 0,
    development: 0,
    research: 0,
    leadership: 0,
    collaboration: 0,
    strategy: 0,
    delivery: 0,
    advisory: 0,
  };
  highlights.forEach((h) => {
    counts[h.mainExp]++;
  });
  return counts;
}

/** Average importance per category (for derivation display). 0 if no highlights in category. */
function getAvgImportanceFromHighlights(highlights: ExperienceHighlight[]): ResponsibilityScores {
  const sums: ResponsibilityScores = {
    security: 0,
    development: 0,
    research: 0,
    leadership: 0,
    collaboration: 0,
    strategy: 0,
    delivery: 0,
    advisory: 0,
  };
  const counts = getCountsFromHighlights(highlights);
  highlights.forEach((h) => {
    const imp = h.importance ?? DEFAULT_IMPORTANCE;
    sums[h.mainExp] += imp;
  });
  return RESPONSIBILITY_CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c]: counts[c] > 0 ? sums[c] / counts[c] : 0 }),
    {} as ResponsibilityScores
  );
}

/** Score = min(5, round(avg importance in category)). Importance of the job is reflected; same 0–5 scale. */
function computeScoresFromHighlights(highlights: ExperienceHighlight[]): ResponsibilityScores {
  const counts = getCountsFromHighlights(highlights);
  const sums: ResponsibilityScores = {
    security: 0,
    development: 0,
    research: 0,
    leadership: 0,
    collaboration: 0,
    strategy: 0,
    delivery: 0,
    advisory: 0,
  };
  highlights.forEach((h) => {
    const imp = h.importance ?? DEFAULT_IMPORTANCE;
    sums[h.mainExp] += imp;
  });
  return RESPONSIBILITY_CATEGORIES.reduce(
    (acc, c) => {
      const avg = counts[c] > 0 ? sums[c] / counts[c] : 0;
      return { ...acc, [c]: Math.min(SCALE_MAX, Math.round(avg)) };
    },
    {} as ResponsibilityScores
  );
}

interface RoleMetrics {
  index: number;
  title: string;
  company: string;
  period: string;
  scores: ResponsibilityScores;
  counts: ResponsibilityScores;
  avgImportance: ResponsibilityScores; // avg importance per category (for derivation)
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

  const calculateRoleMetrics = (): RoleMetrics[] => {
    const allSums = experiences.map((e) => {
      const s = computeScoresFromHighlights(e.highlights);
      return RESPONSIBILITY_CATEGORIES.reduce((sum, c) => sum + s[c], 0);
    });
    const maxSum = Math.max(...allSums, 1);

    return [...experiences].reverse().map((exp, i) => {
      const counts = getCountsFromHighlights(exp.highlights);
      const scores = computeScoresFromHighlights(exp.highlights);
      const avgImportance = getAvgImportanceFromHighlights(exp.highlights);
      const totalResponsibilities = exp.highlights.length;
      const sumScores = RESPONSIBILITY_CATEGORIES.reduce((s, c) => s + scores[c], 0);
      const scopeScore = Math.round((sumScores / maxSum) * 100);

      return {
        index: i,
        title: exp.title,
        company: exp.company.split('/')[0].trim(),
        period: exp.period,
        scores,
        counts,
        avgImportance,
        totalResponsibilities,
        scopeScore,
        isActive: experiences.length - 1 - i === activeRole,
        isCurrent: exp.current || false,
      };
    });
  };

  const [showCombined, setShowCombined] = useState(true);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(() => setChartKey((k) => k + 1));
    const el = chartRef.current?.parentElement;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const container = chartRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const isNarrow = width < 640;
    const height = isNarrow ? 320 : 380;
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = isNarrow ? 72 : 80;
    const radius = Math.min(width, height) / 2 - padding;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    const allData = calculateRoleMetrics();
    const categories = RESPONSIBILITY_CATEGORIES;

    const categoryLabelsLong: Record<CategoryKey, string> = {
      security: 'Security',
      development: 'Development',
      research: 'Research',
      leadership: 'Leadership',
      collaboration: 'Collaboration',
      strategy: 'Strategy',
      delivery: 'Delivery',
      advisory: 'Advisory',
    };
    const categoryLabelsShort: Record<CategoryKey, string> = {
      security: 'Sec',
      development: 'Dev',
      research: 'Res',
      leadership: 'Lead',
      collaboration: 'Collab',
      strategy: 'Strat',
      delivery: 'Deliv',
      advisory: 'Adv',
    };
    const categoryLabels = isNarrow ? categoryLabelsShort : categoryLabelsLong;

    // Complementary colors for monochrome theme - cyan, blue, violet, rose
    const roleColors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f472b6', '#a855f7', '#0ea5e9', '#818cf8', '#e879f9'];

    // Fixed scale 0–5 so no one looks over/underestimated; same yardstick for all roles
    const maxValue = SCALE_MAX;
    const levels = SCALE_MAX;
    const angleSlice = (Math.PI * 2) / categories.length;
    const labelRadius = radius + (isNarrow ? 22 : 30);
    const axisLabelFontSize = isNarrow ? '9px' : '11px';

    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      const levelValue = level; // 1, 2, 3, 4, 5

      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.08)')
        .attr('stroke-dasharray', '2,2');

      if (!isNarrow) {
        g.append('text')
          .attr('x', 5)
          .attr('y', -levelRadius - 2)
          .attr('fill', 'rgba(255,255,255,0.35)')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .text(levelValue);
      }
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
        .attr('stroke', 'rgba(255,255,255,0.12)')
        .attr('stroke-width', 1);

      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(255,255,255,0.75)')
        .attr('font-size', axisLabelFontSize)
        .attr('font-weight', '500')
        .text(categoryLabels[cat]);
    });

    const tooltip = d3.select('body').append('div')
      .attr('class', 'exp-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(10,10,10,0.95)')
      .style('border', '1px solid rgba(6,182,212,0.3)')
      .style('border-radius', '10px')
      .style('padding', '14px')
      .style('font-size', '12px')
      .style('color', 'white')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '280px')
      .style('box-shadow', '0 8px 32px rgba(0,0,0,0.4)');

    // Custom radar polygon path generator - explicit SVG path for proper connection
    const radarPath = (values: number[]): string => {
      if (values.length === 0) return '';
      
      const points = values.map((v, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = (v / SCALE_MAX) * radius;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return { x, y };
      });
      
      // Build SVG path: M (move to first), L (line to each subsequent), Z (close)
      let path = `M ${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
      }
      path += ' Z'; // Close the path back to start
      
      return path;
    };

    // Combined: draw active role LAST so its path is on top and receives hover (fixes wrong-tooltip bug)
    const dataToRender = showCombined
      ? [...allData].sort((a, b) => (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0))
      : [allData[experiences.length - 1 - activeRole]];

    // Each experience has a fixed color (exp 0 = first color, exp 1 = second, etc.)
    const getColorForRole = (role: RoleMetrics) =>
      roleColors[experiences.length - 1 - role.index];

    dataToRender.forEach((role) => {
      const values = categories.map(c => role.scores[c]);
      const color = getColorForRole(role);
      const opacity = showCombined ? (role.isActive ? 1 : 0.4) : 0.8;

      g.append('path')
        .attr('fill', color)
        .attr('fill-opacity', role.isActive || !showCombined ? 0.2 : opacity * 0.12)
        .attr('stroke', color)
        .attr('stroke-width', role.isActive || !showCombined ? 2.5 : 1.5)
        .attr('stroke-opacity', opacity)
        .attr('stroke-linejoin', 'round')
        .attr('d', radarPath(values))
        .attr('cursor', 'pointer')
        .on('click', () => {
          if (showCombined) {
            setActiveRole(experiences.length - 1 - role.index);
          }
        })
        .on('mouseover', function(event) {
          d3.select(this).attr('stroke-width', 3);
          const coords = categories.map(c => {
            const avg = role.avgImportance[c];
            const avgStr = avg > 0 ? avg.toFixed(1) : '0';
            return `${categoryLabelsLong[c]}: ${role.counts[c]} resp., avg ${avgStr} → ${role.scores[c]}/5`;
          }).join(' · ');
          tooltip.html(`
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 8px;">
              <div style="font-weight: 600; font-size: 13px; color: ${color};">${role.title}</div>
              <div style="color: #888; font-size: 11px; margin-top: 2px;">${role.company} | ${role.period}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Score = min(5, round(avg importance)). Scale 0–5:</div>
              ${categories.map(c => {
                const avg = role.avgImportance[c];
                const avgStr = avg > 0 ? avg.toFixed(1) : '0';
                return `
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                  <span style="color: #888;">${categoryLabelsLong[c]}:</span>
                  <span style="font-weight: bold; color: white;">${role.counts[c]} resp., avg ${avgStr} → ${role.scores[c]}/5</span>
                </div>
              `;
              }).join('')}
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 6px 8px; border-radius: 6px; font-size: 10px;">
              <div style="color: #06b6d4; font-family: monospace; word-break: break-all;">${coords}</div>
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
        const pointRadius = (value / SCALE_MAX) * radius;
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
      const legendX = isNarrow ? width / 2 - 70 : width - 160;
      const legendY = isNarrow ? height - 52 : 16;
      const legendG = svg.append('g')
        .attr('transform', `translate(${legendX}, ${legendY})`);

      const itemWidth = isNarrow ? 70 : 140;
      const cols = isNarrow ? 2 : 1;
      allData.forEach((role, i) => {
        const color = roleColors[experiences.length - 1 - i];
        const row = Math.floor(i / cols);
        const colIndex = i % cols;
        const xPos = colIndex * itemWidth;
        const yPos = row * 18;

        legendG.append('rect')
          .attr('x', xPos)
          .attr('y', yPos)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', color)
          .attr('rx', 2)
          .attr('opacity', role.isActive ? 1 : 0.5);

        legendG.append('text')
          .attr('x', xPos + 14)
          .attr('y', yPos + 8)
          .attr('fill', role.isActive ? 'white' : 'rgba(255,255,255,0.5)')
          .attr('font-size', isNarrow ? '9px' : '10px')
          .text(role.company.substring(0, isNarrow ? 10 : 14));
      });
    }

    return () => {
      d3.selectAll('.exp-tooltip').remove();
    };

  }, [activeRole, showCombined, chartKey]);

  const currentExp = experiences[activeRole];
  const currentScores = computeScoresFromHighlights(currentExp.highlights);
  const currentCounts = getCountsFromHighlights(currentExp.highlights);
  const currentAvgImportance = getAvgImportanceFromHighlights(currentExp.highlights);

  const MAIN_EXP_LABELS: Record<CategoryKey, string> = {
    security: 'Security',
    development: 'Development',
    research: 'Research',
    leadership: 'Leadership',
    collaboration: 'Collaboration',
    strategy: 'Strategy',
    delivery: 'Delivery',
    advisory: 'Advisory',
  };
  const MAIN_EXP_ICONS: Record<CategoryKey, typeof Briefcase> = {
    security: Briefcase,
    development: Code,
    research: Lightbulb,
    leadership: Users,
    collaboration: Handshake,
    strategy: Target,
    delivery: Package,
    advisory: MessageCircle,
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
            <TrendingUp className="w-4 h-4 text-cyan-500" />
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
                      ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' 
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
                      ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Selected
                </button>
              </div>
            </div>
          </div>

          {showMethodology && (
            <div className="mb-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-xs">
              <p className="font-medium text-cyan-500 mb-2">Responsibility Radar (8 axes)</p>
              <p className="text-muted-foreground leading-relaxed">
                Each responsibility has a <span className="text-cyan-500/80">MAIN EXP</span> (category) and an <span className="text-cyan-500/80">importance</span> (1–5). 
                Score per category = <span className="text-cyan-500/80">min(5, round(avg importance))</span> in that category—so importance of the job is reflected, not just count. 
                Chart uses a <span className="text-cyan-500/80">fixed 0–5 scale</span>.
              </p>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Methodology draws on formal responsibility quantification: ResQu (human–automation responsibility), 
                axiomatic responsibility ascription (member-level values and aggregation), and FeAR (causal responsibility in multi-agent settings).
              </p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                <a href="https://arxiv.org/abs/1810.12644" target="_blank" rel="noopener noreferrer" className="text-cyan-500/90 hover:underline">ResQu · arXiv:1810.12644</a>
                <a href="https://arxiv.org/abs/2111.06711" target="_blank" rel="noopener noreferrer" className="text-cyan-500/90 hover:underline">Axiomatic · arXiv:2111.06711</a>
                <a href="https://arxiv.org/abs/2305.15003" target="_blank" rel="noopener noreferrer" className="text-cyan-500/90 hover:underline">FeAR · arXiv:2305.15003</a>
              </div>
              <p className="text-muted-foreground mt-2">
                Combined view overlays all positions; Selected view focuses on one role.
              </p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 w-full overflow-hidden min-h-[280px] sm:min-h-[320px]">
            {/* Left: calculation derivation for selected role — how scores were derived */}
            <div className="lg:min-w-[200px] lg:max-w-[260px] flex-shrink-0 p-3 rounded-lg bg-background/50 border border-border/30 text-xs">
              <p className="font-medium text-foreground mb-1.5">How the score was derived</p>
              <p className="text-muted-foreground mb-2 leading-tight">
                Score = min(5, round(avg <span className="font-semibold text-foreground">importance</span> in that category). Importance 1–5 per responsibility; scale fixed 0–5.
              </p>
              <p className="text-muted-foreground/80 font-medium mb-2 truncate" title={`${currentExp.title} @ ${currentExp.company}`}>
                {currentExp.title} @ {currentExp.company.split('/')[0].trim()}
              </p>
              <ul className="space-y-1.5">
                {RESPONSIBILITY_CATEGORIES.map((cat) => {
                  const count = currentCounts[cat];
                  const avgImp = currentAvgImportance[cat];
                  const score = currentScores[cat];
                  const label = MAIN_EXP_LABELS[cat];
                  const avgStr = avgImp > 0 ? avgImp.toFixed(1) : '0';
                  return (
                    <li key={cat} className="flex items-center justify-between gap-2 text-muted-foreground">
                      <span className="truncate">{label}:</span>
                      <span className="flex-shrink-0 font-mono text-cyan-500/90 text-right">
                        {count} resp., avg {avgStr} → {score}/5
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <svg ref={chartRef} className="w-full h-full max-w-full" preserveAspectRatio="xMidYMid meet" />
            </div>
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
                  ? 'bg-cyan-500/10 text-foreground border border-cyan-500/30'
                  : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground border border-transparent'
              }`}
            >
              <div>
                <p className="font-medium text-sm whitespace-nowrap">{exp.title}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{exp.company}</p>
                <p className="font-mono text-[10px] text-muted-foreground/70">{exp.period}</p>
              </div>
              {exp.current && (
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="exp-content opacity-0 card-cyber rounded-xl p-4 sm:p-6 md:p-8">
          <div className="exp-detail mb-6 pb-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                activeRole === 0 
                  ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
                  : 'bg-foreground/5 text-muted-foreground border border-border/50'
              }`}>
                {getRoleLevel(activeRole)}
              </span>
              {currentExp.current && (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  Active
                </span>
              )}
              <span className="px-2 py-1 rounded text-xs font-mono bg-foreground/5 text-muted-foreground border border-border/50">
                {currentExp.highlights.length} responsibilities · Score sum {RESPONSIBILITY_CATEGORIES.reduce((s, c) => s + currentScores[c], 0)}/40
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
                const IconComponent = MAIN_EXP_ICONS[highlight.mainExp];
                return (
                  <div 
                    key={index} 
                    className="exp-detail group p-3 sm:p-4 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-500/30 hover:bg-background/80 transition-all duration-300"
                    data-testid={`card-highlight-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-foreground/5 group-hover:bg-cyan-500/10 transition-colors flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-sm text-foreground leading-tight group-hover:text-cyan-500/90 transition-colors">{highlight.title}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-500/90 border border-cyan-500/20">
                            {MAIN_EXP_LABELS[highlight.mainExp]}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-foreground/5 text-muted-foreground border border-border/50" title="Importance 1–5">
                            imp. {highlight.importance ?? DEFAULT_IMPORTANCE}
                          </span>
                        </div>
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
