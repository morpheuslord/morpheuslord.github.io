import { useRef, useEffect, useState, useCallback } from 'react';
import anime from 'animejs';
import * as d3 from 'd3';
import { Code, Shield, Cloud, Brain, BookOpen, Workflow, X } from 'lucide-react';
import { skillCategories, experiences, SkillCategory } from '@/data/skillsData';

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Employment-based Skill Ontology.
//
// d3 hierarchy + zoom/pan, drawn as boxes. The bordered container is a
// viewport onto a much larger canvas, not the whole drawing.
//
// Roles start collapsed. All 119 skills on screen at once is unreadable at any
// zoom that fits the viewport, so the default view is 6 large boxes and you
// open the branches you care about. Type is sized to be legible at 1:1.
//
// Solid links run role to skill. Dashed links run from a shared skill back to
// every other role that also uses it, which is the ontology part: 79 of the
// 119 skills have two or more roles pointing at them.

type OntNode = {
  name: string;
  type: 'root' | 'employment' | 'skill';
  color: string;
  sub?: string;
  level?: number;
  expData?: typeof experiences[0];
  expIndex?: number;
  skillCount?: number;
  isOpen?: boolean;
  isShared?: boolean;
  otherEmployments?: number[];
  children?: OntNode[];
  boxW?: number;
  boxH?: number;
};

const EmploymentSkillOntology = ({ onExperienceClick }: { onExperienceClick: (exp: typeof experiences[0]) => void }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 640 });
  const [expanded, setExpanded] = useState<number[]>([]);
  const [focusRole, setFocusRole] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width: Math.max(width, 320), height: Math.max(height, 360) });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const toggleRole = useCallback((i: number) => {
    setFocusRole(i);
    setExpanded((prev) => (prev.includes(i) ? prev.filter((k) => k !== i) : [...prev, i]));
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const isMobile = width < 640;

    const usedBy = new Map<string, number[]>();
    const bestLevel = new Map<string, number>();
    const owner = new Map<string, number>();
    experiences.forEach((exp, i) => {
      Object.entries(exp.skills).forEach(([name, lvl]) => {
        if (!usedBy.has(name)) usedBy.set(name, []);
        usedBy.get(name)!.push(i);
        if (!bestLevel.has(name) || lvl > bestLevel.get(name)!) {
          bestLevel.set(name, lvl);
          owner.set(name, i);
        }
      });
    });
    const totalShared = [...usedBy.values()].filter((v) => v.length > 1).length;

    const treeData: OntNode = {
      name: 'Skills',
      sub: `${usedBy.size} skills · ${totalShared} shared across roles`,
      type: 'root',
      color: '#9a9a9a',
      // skillsData lists roles oldest first. Render newest at the top, but keep
      // the original index as expIndex: skill ownership and the cross-links
      // key off it.
      children: experiences
        .map((exp, i) => ({ exp, i }))
        .reverse()
        .map(({ exp, i }) => {
          const [title, company] = exp.title.split(' – ');
          const owned = Object.keys(exp.skills)
            .filter((n) => owner.get(n) === i)
            .sort((a, b) => exp.skills[b] - exp.skills[a]);
          const isOpen = expanded.includes(i);
          return {
            name: title,
            sub: `${company ? company + ' · ' : ''}${exp.period}`,
            type: 'employment' as const,
            color: exp.color,
            expData: exp,
            expIndex: i,
            skillCount: Object.keys(exp.skills).length,
            isOpen,
            children: isOpen
              ? owned.map((n) => ({
                  name: n,
                  type: 'skill' as const,
                  color: exp.color,
                  level: Math.round(exp.skills[n] * 100),
                  isShared: (usedBy.get(n) ?? []).length > 1,
                  otherEmployments: (usedBy.get(n) ?? []).filter((r) => r !== i),
                }))
              : undefined,
          };
        }),
    };

    const root = d3.hierarchy<OntNode>(treeData);
    const dx = isMobile ? 34 : 38;
    d3.tree<OntNode>()
      .nodeSize([dx, 1])
      // Separation is a multiple of the row pitch, so it has to clear the box
      // height. Role boxes are 54px on a 38px pitch: at separation 1 they
      // overlapped each other in the collapsed view.
      .separation((a, b) => {
        const touchesRole = a.data.type === 'employment' || b.data.type === 'employment';
        if (touchesRole) return 3.2;
        return a.parent === b.parent ? 1.15 : 2.4;
      })(root);

    let x0 = Infinity, x1 = -Infinity;
    root.each((d) => {
      if (d.x! > x1) x1 = d.x!;
      if (d.x! < x0) x0 = d.x!;
    });

    svg.attr('width', width).attr('height', height);
    const outer = svg.append('g');
    const g = outer.append('g').attr('transform', `translate(0, ${-x0 + dx * 2})`);

    const linkG = g.append('g').attr('fill', 'none');
    const crossG = g.append('g').attr('fill', 'none');
    const nodeG = g.append('g');

    const nodes = root.descendants();
    const nodeSel = nodeG.selectAll<SVGGElement, d3.HierarchyNode<OntNode>>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', (d) => (d.data.type === 'employment' ? 'pointer' : 'default'));

    nodeSel.each(function (d) {
      const el = d3.select(this);
      const isRoot = d.data.type === 'root';
      const isEmp = d.data.type === 'employment';
      const big = isRoot || isEmp;
      const padX = big ? 14 : 10;
      const padY = big ? 10 : 7;
      const textX = padX + 10;

      const text = el.append('text')
        .attr('x', textX)
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('dominant-baseline', 'middle');

      if (d.data.sub) {
        text.append('tspan')
          .attr('x', textX).attr('dy', '-0.4em')
          .attr('fill', isRoot ? '#f2f2f2' : d.data.color)
          .attr('font-size', isRoot ? '17px' : '16px')
          .attr('font-weight', '700')
          .text(d.data.name);
        text.append('tspan')
          .attr('x', textX).attr('dy', '1.5em')
          .attr('fill', 'rgba(255,255,255,0.55)')
          .attr('font-size', '12px')
          .attr('font-weight', '400')
          .text(isEmp
            ? `${d.data.sub}  ·  ${d.data.skillCount} skills`
            : d.data.sub);
      } else {
        text.append('tspan')
          .attr('x', textX).attr('dy', '0em')
          .attr('fill', 'rgba(255,255,255,0.92)')
          .attr('font-size', isMobile ? '13px' : '14px')
          .text(d.data.name);
        if (d.data.level !== undefined) {
          text.append('tspan')
            .attr('fill', 'rgba(255,255,255,0.42)')
            .attr('font-size', '12px')
            .text(`   ${d.data.level}`);
        }
      }

      const bb = (text.node() as SVGTextElement).getBBox();
      // getBBox can report 0 before layout settles; fall back to a character
      // estimate so the columns never collapse on top of each other.
      const estimate = d.data.name.length * (big ? 9.4 : 8.2) + 40;
      const textW = bb.width > 1 ? bb.width : estimate;
      const textH = bb.height > 1 ? bb.height : (d.data.sub ? 34 : 16);

      const extra = isEmp ? 44 : 0; // room for the open/close chevron
      const w = textW + padX * 2 + 10 + extra;
      const h = Math.max(textH + padY * 2, big ? 54 : 30);
      d.data.boxW = w;
      d.data.boxH = h;

      el.insert('rect', 'text')
        .attr('x', 8).attr('y', -h / 2)
        .attr('width', w).attr('height', h)
        .attr('rx', big ? 10 : 6)
        .attr('fill', isRoot ? 'rgba(26,26,30,0.98)' : isEmp ? 'rgba(21,21,25,0.98)' : 'rgba(18,18,21,0.96)')
        .attr('stroke', isRoot ? 'rgba(255,255,255,0.4)' : d.data.color)
        .attr('stroke-opacity', big ? 1 : 0.5)
        .attr('stroke-width', big ? 1.8 : 1.1);

      el.insert('rect', 'text')
        .attr('x', 8).attr('y', -h / 2)
        .attr('width', big ? 5 : 3).attr('height', h)
        .attr('fill', isRoot ? 'rgba(255,255,255,0.55)' : d.data.color);

      text.raise();

      if (isEmp) {
        const cx = 8 + w - 22;
        el.append('circle')
          .attr('cx', cx).attr('cy', 0).attr('r', 13)
          .attr('fill', d.data.isOpen ? d.data.color : 'rgba(255,255,255,0.07)')
          .attr('fill-opacity', d.data.isOpen ? 0.22 : 1)
          .attr('stroke', d.data.color).attr('stroke-opacity', 0.6);
        el.append('text')
          .attr('x', cx).attr('y', 1)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('font-size', '15px').attr('font-weight', '700')
          .attr('font-family', 'monospace')
          .attr('fill', d.data.color)
          .attr('pointer-events', 'none')
          .text(d.data.isOpen ? '–' : '+');
      }

      if (d.data.isShared && d.data.otherEmployments?.length) {
        const n = d.data.otherEmployments.length + 1;
        el.append('circle')
          .attr('cx', 8 + w + 13).attr('cy', 0).attr('r', 10)
          .attr('fill', 'rgba(255,255,255,0.09)')
          .attr('stroke', d.data.color).attr('stroke-opacity', 0.55);
        el.append('text')
          .attr('x', 8 + w + 13).attr('y', 1)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('font-size', '11px').attr('font-family', 'monospace')
          .attr('fill', 'rgba(255,255,255,0.8)')
          .attr('pointer-events', 'none')
          .text(n);
      }
    });

    const slot = (d: d3.HierarchyNode<OntNode>) =>
      (d.data.boxW ?? 0) + 8 + (d.data.isShared ? 30 : 0);
    const colWidth: number[] = [];
    nodes.forEach((d) => { colWidth[d.depth] = Math.max(colWidth[d.depth] ?? 0, slot(d)); });
    const colGap = isMobile ? 70 : 110;
    const colX: number[] = [];
    let acc = 40;
    for (let depth = 0; depth <= root.height; depth++) {
      colX[depth] = acc;
      acc += (colWidth[depth] ?? 0) + colGap;
    }
    nodes.forEach((d) => { d.y = colX[d.depth]; });
    nodeSel.attr('transform', (d) => `translate(${d.y},${d.x})`);

    const rightEdge = (d: d3.HierarchyNode<OntNode>) => d.y! + 8 + (d.data.boxW ?? 0);
    const leftEdge = (d: d3.HierarchyNode<OntNode>) => d.y! + 8;
    const curve = (xa: number, ya: number, xb: number, yb: number) =>
      `M${xa},${ya}C${(xa + xb) / 2},${ya} ${(xa + xb) / 2},${yb} ${xb},${yb}`;

    const treeLinks = linkG.selectAll('path')
      .data(root.links())
      .join('path')
      .attr('stroke', (d) => d.source.data.color || '#666')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => (d.source.data.type === 'root' ? 2.4 : 1.6))
      .attr('d', (d) => curve(rightEdge(d.source), d.source.x!, leftEdge(d.target), d.target.x!));

    const empByIndex = new Map<number, d3.HierarchyNode<OntNode>>();
    root.each((d) => {
      if (d.data.type === 'employment' && d.data.expIndex !== undefined) empByIndex.set(d.data.expIndex, d);
    });

    type Cross = { skill: d3.HierarchyNode<OntNode>; emp: d3.HierarchyNode<OntNode>; color: string };
    const crossData: Cross[] = [];
    root.each((d) => {
      if (d.data.type !== 'skill' || !d.data.isShared) return;
      d.data.otherEmployments?.forEach((idx) => {
        const emp = empByIndex.get(idx);
        if (emp) crossData.push({ skill: d, emp, color: emp.data.color });
      });
    });

    const crossLinks = crossG.selectAll('path')
      .data(crossData)
      .join('path')
      .attr('stroke', (d) => d.color)
      .attr('stroke-opacity', 0.16)
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '6,5')
      .attr('d', (d) => curve(rightEdge(d.emp), d.emp.x!, leftEdge(d.skill), d.skill.x!));

    const resetAll = () => {
      nodeSel.attr('opacity', 1);
      treeLinks.attr('stroke-opacity', 0.5).attr('stroke-width', (d) => (d.source.data.type === 'root' ? 2.4 : 1.6));
      crossLinks.attr('stroke-opacity', 0.16).attr('stroke-width', 1.2);
    };

    nodeSel
      .on('pointerenter', (_e, d) => {
        const related = new Set<d3.HierarchyNode<OntNode>>([d]);
        if (d.parent) related.add(d.parent);
        d.children?.forEach((c) => related.add(c));
        if (d.data.type === 'skill') {
          d.data.otherEmployments?.forEach((i) => {
            const e = empByIndex.get(i);
            if (e) related.add(e);
          });
        }
        if (d.data.type === 'employment') {
          crossData.forEach((c) => { if (c.emp === d) related.add(c.skill); });
        }
        nodeSel.attr('opacity', (n) => (related.has(n) ? 1 : 0.13));
        treeLinks
          .attr('stroke-opacity', (l) => (related.has(l.source) && related.has(l.target) ? 0.95 : 0.05))
          .attr('stroke-width', (l) => (related.has(l.source) && related.has(l.target) ? 2.4 : 1.2));
        crossLinks
          .attr('stroke-opacity', (c) => (c.skill === d || c.emp === d ? 0.9 : 0.03))
          .attr('stroke-width', (c) => (c.skill === d || c.emp === d ? 2 : 1));
      })
      .on('pointerleave', resetAll)
      .on('click', (event: MouseEvent, d) => {
        if (d.data.type !== 'employment' || d.data.expIndex === undefined) return;
        if (event.shiftKey && d.data.expData) {
          onExperienceClick(d.data.expData);
          return;
        }
        toggleRole(d.data.expIndex);
      })
      .on('dblclick', (event: MouseEvent, d) => {
        event.stopPropagation();
        if (d.data.type === 'employment' && d.data.expData) onExperienceClick(d.data.expData);
      });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 2.5])
      .on('zoom', (event) => outer.attr('transform', event.transform.toString()));
    svg.call(zoom);

    // Open at 1:1 so the boxes read as skills, not texture, and park the view
    // on whichever role was last toggled (the root on first paint).
    const scale = isMobile ? 0.8 : 1;
    const target = focusRole !== null ? empByIndex.get(focusRole) : root;
    const ty = ((target?.x ?? 0) - x0 + dx * 2) * scale;
    const tx = (target && focusRole !== null ? (target.y ?? 0) : 0) * scale;
    const initial = d3.zoomIdentity
      .translate(Math.min(24, width * 0.06) - tx * 0.15, height / 2 - ty)
      .scale(scale);
    svg.call(zoom.transform, initial);

    return () => { svg.on('.zoom', null); };
  }, [dimensions, expanded, focusRole, onExperienceClick, toggleRole]);

  const allOpen = expanded.length === experiences.length;

  return (
    <div ref={containerRef} className="w-full h-[460px] sm:h-[560px] md:h-[680px] rounded-xl border border-border bg-card/30 overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full touch-none block" />

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => {
            setFocusRole(null);
            setExpanded(allOpen ? [] : experiences.map((_, i) => i));
          }}
          className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-background/90 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-x-4 gap-y-1 bg-background/85 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] text-muted-foreground border border-border/50 pointer-events-none">
        <span>Click a role to open it · double-click for details · scroll to zoom · drag to pan</span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="20" height="6" aria-hidden="true"><line x1="0" y1="3" x2="20" y2="3" stroke="currentColor" strokeWidth="1.6" /></svg>
          uses
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="20" height="6" aria-hidden="true"><line x1="0" y1="3" x2="20" y2="3" stroke="currentColor" strokeWidth="1.6" strokeDasharray="6,5" /></svg>
          also used in
        </span>
      </div>
    </div>
  );
};

// Proficiency Level Helper
const getLevelLabel = (level: number): string => {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Advanced";
  if (level >= 60) return "Proficient";
  if (level >= 40) return "Intermediate";
  return "Foundational";
};

const getLevelColor = (level: number): string => {
  if (level >= 90) return "hsl(142, 70%, 45%)";
  if (level >= 75) return "hsl(200, 70%, 50%)";
  if (level >= 60) return "hsl(45, 80%, 50%)";
  return "hsl(0, 0%, 55%)";
};

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  shield: Shield,
  cloud: Cloud,
  brain: Brain,
  book: BookOpen,
  workflow: Workflow,
};

// Skill Detail Panel Component
const SkillDetailPanel = ({
  category,
  onClose
}: {
  category: SkillCategory;
  onClose: () => void;
}) => {
  const Icon = iconMap[category.icon] || Code;

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{category.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm font-mono">
          <span className="text-muted-foreground">
            {category.skills.length} skills
          </span>
          <span className="text-muted-foreground">
            Avg: {Math.round(category.skills.reduce((a, b) => a + b.level, 0) / category.skills.length)}%
          </span>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-border/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground text-sm">{skill.name}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    backgroundColor: `${getLevelColor(skill.level)}20`,
                    color: getLevelColor(skill.level)
                  }}
                >
                  {getLevelLabel(skill.level)}
                </span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {skill.level}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: category.color
                }}
              />
            </div>

            {/* Description */}
            {skill.description && (
              <p className="text-xs text-muted-foreground mb-2">
                {skill.description}
              </p>
            )}

            {/* Tools */}
            {skill.tools && skill.tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skill.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Experience Detail Panel
const ExperienceDetailPanel = ({
  experience,
  onClose
}: {
  experience: typeof experiences[0];
  onClose: () => void;
}) => {
  const skillsList = Object.entries(experience.skills).sort((a, b) => b[1] - a[1]);

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${experience.color}20` }}
            >
              <Workflow className="w-6 h-6" style={{ color: experience.color }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{experience.title.split(' – ')[0]}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{experience.title.split(' – ')[1]}</p>
              <p className="text-xs font-mono mt-1" style={{ color: experience.color }}>{experience.period}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm font-mono">
          <span className="text-muted-foreground">{skillsList.length} skills developed</span>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {skillsList.map(([skillName, level]) => (
          <div
            key={skillName}
            className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-border/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground text-sm">{skillName}</span>
              <span className="text-xs font-mono text-muted-foreground">{Math.round(level * 100)}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${level * 100}%`, backgroundColor: experience.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'ontology' | 'detailed'>('ontology');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<typeof experiences[0] | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleCategoryClick = useCallback((category: SkillCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleExperienceClick = useCallback((exp: typeof experiences[0]) => {
    setSelectedExperience(exp);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCategory(null);
    setSelectedExperience(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            anime({ targets: '.skills-header', opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutExpo' });
            anime({ targets: '.skills-content', opacity: [0, 1], translateY: [40, 0], delay: 300, duration: 700, easing: 'easeOutExpo' });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Re-animate on tab switch
  useEffect(() => {
    if (hasAnimated) {
      setSelectedCategory(null);
      setSelectedExperience(null);
      anime({ targets: '.skills-content', opacity: [0, 1], translateY: [20, 0], duration: 500, easing: 'easeOutExpo' });
    }
  }, [activeTab, hasAnimated]);

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-title skills-header opacity-0">Technical Expertise</p>
          <h2 className="section-heading skills-header opacity-0">Skill Ontology</h2>
          <p className="text-muted-foreground skills-header opacity-0 max-w-2xl mx-auto">
            {activeTab === 'ontology'
              ? 'Every skill I use, mapped to the job where I picked it up. Click a role to open it.'
              : 'Click a category to view detailed skills and proficiency levels'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="skills-header opacity-0 flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-border p-1 bg-card">
            <button
              onClick={() => setActiveTab('ontology')}
              className={`px-5 py-2.5 rounded-md text-sm font-mono transition-all ${activeTab === 'ontology' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Skill Ontology
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-5 py-2.5 rounded-md text-sm font-mono transition-all ${activeTab === 'detailed' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Detailed View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="skills-content" style={{ opacity: hasAnimated ? 1 : 0 }}>
          {/* Employment-based Ontology View */}
          {activeTab === 'ontology' && (
            <div className="relative">
              <EmploymentSkillOntology onExperienceClick={handleExperienceClick} />

              {/* Enhanced Legend - Hidden on small screens */}
              <div className="absolute bottom-4 left-4 p-4 bg-card/95 border border-border/60 rounded-xl backdrop-blur-md shadow-xl hidden md:block">
                <p className="text-xs font-mono text-foreground/80 mb-3 font-semibold tracking-wider uppercase">Employment Timeline</p>
                <div className="space-y-2">
                  {experiences.map((exp, i) => {
                    const rgb = hexToRgb(exp.color);
                    const glowStyle = rgb ? {
                      boxShadow: `0 0 8px ${exp.color}40, 0 0 4px ${exp.color}60`
                    } : {};

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 group cursor-pointer hover:translate-x-1 transition-transform duration-200"
                      >
                        <div
                          className="w-3 h-3 rounded-full transition-all duration-200 group-hover:scale-125"
                          style={{
                            backgroundColor: exp.color,
                            ...glowStyle
                          }}
                        />
                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                          {(() => {
                            const titleParts = exp.title.split(' – ');
                            const jobTitle = titleParts[0].split(' ').slice(0, 2).join(' ');
                            const companyName = titleParts[1] || '';
                            return companyName ? `${jobTitle} @ ${companyName}` : jobTitle;
                          })()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Instructions - Hidden on small screens */}
              <div className="absolute top-4 right-4 p-3 bg-card/95 border border-border/60 rounded-xl backdrop-blur-md shadow-xl hidden md:block">
                <p className="text-xs font-mono text-muted-foreground/90">
                  <span className="text-foreground/70">Scroll</span> to zoom • <span className="text-foreground/70">Drag</span> to pan
                </p>
              </div>

              {/* Slide-in Panel for Experience */}
              {selectedExperience && (
                <div className="absolute top-0 right-0 h-full w-full max-w-md animate-slide-in-right">
                  <ExperienceDetailPanel experience={selectedExperience} onClose={handleClosePanel} />
                </div>
              )}
            </div>
          )}

          {/* Detailed Grid View */}
          {activeTab === 'detailed' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Category Grid */}
              <div className={`${selectedCategory ? 'lg:col-span-1' : 'lg:col-span-3'} grid ${selectedCategory ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {skillCategories.map((category) => {
                  const Icon = iconMap[category.icon] || Code;
                  const isSelected = selectedCategory?.id === category.id;

                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`card-cyber rounded-xl p-5 cursor-pointer transition-all duration-300 group ${isSelected ? 'ring-2' : 'hover:border-foreground/20'
                        }`}
                      style={{
                        borderColor: isSelected ? category.color : undefined,
                        // @ts-ignore - ringColor applied via outline
                        outlineColor: isSelected ? category.color : undefined,
                        outline: isSelected ? `2px solid ${category.color}` : undefined
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: category.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono text-sm text-foreground truncate">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.skills.length} skills</p>
                        </div>
                      </div>

                      {!selectedCategory && (
                        <>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{category.description}</p>

                          {/* Top skills preview */}
                          <div className="space-y-1.5">
                            {category.skills.slice(0, 3).map((skill) => (
                              <div key={skill.name} className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono truncate flex-1">{skill.name}</span>
                                <span
                                  className="text-xs font-mono ml-2"
                                  style={{ color: getLevelColor(skill.level) }}
                                >
                                  {skill.level}%
                                </span>
                              </div>
                            ))}
                            {category.skills.length > 3 && (
                              <p className="text-xs text-muted-foreground/60 font-mono">
                                +{category.skills.length - 3} more
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detail Panel */}
              {selectedCategory && (
                <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden border border-border animate-fade-in">
                  <SkillDetailPanel category={selectedCategory} onClose={handleClosePanel} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
