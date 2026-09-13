import { useRef, useEffect, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import anime from 'animejs';
import { Code, Shield, Cloud, Brain, BookOpen, Workflow, X, ChevronRight } from 'lucide-react';
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

// Employment-based Skill Ontology, laid out as a mindmap.
//
// Layout follows dev.to/frankwisniewski/create-a-mindmap: flex columns place
// the nodes, SVG only draws bezier curves between measured DOM rects, and a
// ResizeObserver redraws them.
//
// The point of this graph is the overlap, not the tree. A skill is drawn once,
// under the role that uses it most heavily, but 79 of the 119 skills are used
// by more than one role, and each of those draws a dashed cross-link back to
// every other role that uses it. Hovering anything isolates its relationships.
//
// Branches expand on click, and more than one can be open at a time, because
// two open branches is what makes the shared skills between them visible.

const bezier = (x1: number, y1: number, x2: number, y2: number) =>
  `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;

type Connector = {
  id: string;
  d: string;
  color: string;
  dashed: boolean;
  roles: number[];
  skill?: string;
};

const EmploymentSkillOntology = ({ onExperienceClick }: { onExperienceClick: (exp: typeof experiences[0]) => void }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const [expanded, setExpanded] = useState<number[]>([]);
  const [hover, setHover] = useState<{ kind: 'role' | 'skill'; role?: number; skill?: string } | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  // Every role that uses a skill, plus the one that owns it (highest level).
  const { roles, usedBy } = useMemo(() => {
    const used = new Map<string, number[]>();
    const bestLevel = new Map<string, number>();
    const owner = new Map<string, number>();
    experiences.forEach((exp, i) => {
      Object.entries(exp.skills).forEach(([name, level]) => {
        if (!used.has(name)) used.set(name, []);
        used.get(name)!.push(i);
        if (!bestLevel.has(name) || level > bestLevel.get(name)!) {
          bestLevel.set(name, level);
          owner.set(name, i);
        }
      });
    });

    const built = experiences
      .map((exp, i) => ({ exp, i }))
      .reverse()
      .map(({ exp, i }, pos) => {
        const [title, company] = exp.title.split(' – ');
        const owned = Object.keys(exp.skills)
          .filter((n) => owner.get(n) === i)
          .sort((a, b) => exp.skills[b] - exp.skills[a]);
        return {
          key: i,
          title,
          company: company ?? '',
          period: exp.period,
          color: exp.color,
          exp,
          side: (pos % 2 === 0 ? 'left' : 'right') as 'left' | 'right',
          total: Object.keys(exp.skills).length,
          shared: Object.keys(exp.skills).filter((n) => (used.get(n) ?? []).length > 1).length,
          skills: owned.map((n) => ({
            name: n,
            level: Math.round(exp.skills[n] * 100),
            others: (used.get(n) ?? []).filter((r) => r !== i),
          })),
        };
      });
    return { roles: built, usedBy: used };
  }, []);

  const roleByKey = useMemo(() => new Map(roles.map((r) => [r.key, r])), [roles]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wb = wrap.getBoundingClientRect();
    const box = (id: string) => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left - wb.left,
        right: r.right - wb.left,
        cy: r.top - wb.top + r.height / 2,
      };
    };

    const root = box('root');
    if (!root) return;
    const next: Connector[] = [];

    roles.forEach((role) => {
      const rb = box(`role-${role.key}`);
      if (!rb) return;
      const left = role.side === 'left';

      next.push({
        id: `root-${role.key}`,
        d: bezier(left ? root.left : root.right, root.cy, left ? rb.right : rb.left, rb.cy),
        color: role.color,
        dashed: false,
        roles: [role.key],
      });

      if (!expanded.includes(role.key)) return;

      role.skills.forEach((sk) => {
        const sb = box(`skill-${role.key}-${sk.name}`);
        if (!sb) return;

        next.push({
          id: `own-${role.key}-${sk.name}`,
          d: bezier(left ? rb.left : rb.right, rb.cy, left ? sb.right : sb.left, sb.cy),
          color: role.color,
          dashed: false,
          roles: [role.key],
          skill: sk.name,
        });

        // The ontology part: link this skill back to every other role using it.
        sk.others.forEach((otherKey) => {
          const ob = box(`role-${otherKey}`);
          const other = roleByKey.get(otherKey);
          if (!ob || !other) return;
          const skillAnchorX = left ? sb.right : sb.left;
          const roleAnchorX = other.side === 'left' ? ob.left : ob.right;
          next.push({
            id: `x-${role.key}-${sk.name}-${otherKey}`,
            d: bezier(skillAnchorX, sb.cy, roleAnchorX, ob.cy),
            color: other.color,
            dashed: true,
            roles: [role.key, otherKey],
            skill: sk.name,
          });
        });
      });
    });

    setConnectors(next);
    setSvgSize((prev) =>
      prev.w === wrap.scrollWidth && prev.h === wrap.scrollHeight
        ? prev
        : { w: wrap.scrollWidth, h: wrap.scrollHeight }
    );
  }, [roles, expanded, roleByKey]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // What the current hover makes relevant.
  const focus = useMemo(() => {
    if (!hover) return null;
    if (hover.kind === 'skill' && hover.skill) {
      return {
        roles: new Set(usedBy.get(hover.skill) ?? []),
        skills: new Set([hover.skill]),
      };
    }
    if (hover.kind === 'role' && hover.role !== undefined) {
      const r = roleByKey.get(hover.role);
      const skills = new Set(Object.keys(r?.exp.skills ?? {}));
      return { roles: new Set([hover.role]), skills };
    }
    return null;
  }, [hover, usedBy, roleByKey]);

  const connectorLive = (c: Connector) => {
    if (!focus) return true;
    if (c.skill) return focus.skills.has(c.skill) && c.roles.some((r) => focus.roles.has(r));
    return c.roles.some((r) => focus.roles.has(r));
  };

  const setRef = (id: string) => (el: HTMLElement | null) => { nodeRefs.current[id] = el; };
  const toggle = (key: number) =>
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const renderSkills = (side: 'left' | 'right') => {
    const open = roles.filter((r) => r.side === side && expanded.includes(r.key));
    if (open.length === 0) return <div className="flex-1 min-w-0" />;
    return (
      <div className={`flex-1 min-w-0 flex flex-col justify-around gap-4 py-2 ${side === 'left' ? 'items-end' : 'items-start'}`}>
        {open.map((role) => (
          <div key={role.key} className={`flex flex-col gap-1 ${side === 'left' ? 'items-end' : 'items-start'}`}>
            {role.skills.map((sk) => {
              const live = !focus || focus.skills.has(sk.name);
              return (
                <div
                  key={sk.name}
                  ref={setRef(`skill-${role.key}-${sk.name}`)}
                  onMouseEnter={() => setHover({ kind: 'skill', skill: sk.name })}
                  onMouseLeave={() => setHover(null)}
                  className={`group/sk flex items-center gap-2 rounded border-l-2 bg-background/70 backdrop-blur-sm pl-2 pr-2 py-[3px] cursor-default transition-all duration-200 ${
                    live ? 'opacity-100' : 'opacity-20'
                  }`}
                  style={{ borderLeftColor: role.color }}
                  title={
                    sk.others.length
                      ? `${sk.name} · ${sk.level}% · also used in ${sk.others.length} other role${sk.others.length > 1 ? 's' : ''}`
                      : `${sk.name} · ${sk.level}% · only this role`
                  }
                >
                  <span className="font-mono text-[10px] md:text-[11px] text-foreground/90 whitespace-nowrap">
                    {sk.name}
                  </span>
                  <span className="h-[3px] w-8 rounded bg-foreground/10 overflow-hidden shrink-0">
                    <span className="block h-full rounded" style={{ width: `${sk.level}%`, background: role.color }} />
                  </span>
                  {sk.others.length > 0 && (
                    <span className="font-mono text-[9px] leading-none px-1 py-[2px] rounded-full bg-foreground/10 text-muted-foreground shrink-0">
                      {sk.others.length + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderRoles = (side: 'left' | 'right') => (
    <div className={`flex flex-col justify-around gap-5 py-2 shrink-0 ${side === 'left' ? 'items-end' : 'items-start'}`}>
      {roles.filter((r) => r.side === side).map((role) => {
        const open = expanded.includes(role.key);
        const live = !focus || focus.roles.has(role.key);
        return (
          <div
            key={role.key}
            ref={setRef(`role-${role.key}`)}
            onMouseEnter={() => setHover({ kind: 'role', role: role.key })}
            onMouseLeave={() => setHover(null)}
            className={`w-[188px] md:w-[204px] rounded-lg overflow-hidden bg-background/85 backdrop-blur-sm ring-1 transition-all duration-200 ${
              live ? 'opacity-100' : 'opacity-25'
            }`}
            style={{
              boxShadow: open ? `0 2px 14px -4px ${role.color}77` : undefined,
              ['--rc' as string]: role.color,
            }}
          >
            <div className="h-[3px] w-full" style={{ background: role.color }} />
            <button onClick={() => toggle(role.key)} aria-expanded={open} className="w-full text-left px-3 pt-2 pb-1.5">
              <div className="flex items-start gap-1.5">
                <ChevronRight
                  className={`w-3.5 h-3.5 mt-[3px] shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                  style={{ color: role.color }}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-foreground leading-tight">{role.title}</p>
                  {role.company && (
                    <p className="font-mono text-[10px] text-muted-foreground truncate">{role.company}</p>
                  )}
                </div>
              </div>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                {role.period}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground/70">
                {role.total} skills · {role.shared} shared
              </p>
            </button>
            <button
              onClick={() => onExperienceClick(role.exp)}
              className="w-full px-3 pb-2 text-left font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Role details
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full rounded-xl border border-border bg-card/30 overflow-auto relative h-[460px] sm:h-[560px] md:h-[680px]">
      <div ref={wrapRef} className="relative min-w-[900px] p-6 md:p-10">
        <svg className="absolute left-0 top-0 pointer-events-none" width={svgSize.w} height={svgSize.h} aria-hidden="true">
          {connectors.map((c) => {
            const live = connectorLive(c);
            return (
              <path
                key={c.id}
                d={c.d}
                fill="none"
                stroke={c.color}
                strokeWidth={focus && live ? 1.8 : c.dashed ? 1 : 1.4}
                strokeDasharray={c.dashed ? '5,4' : undefined}
                strokeOpacity={live ? (focus ? 0.85 : c.dashed ? 0.16 : 0.4) : 0.04}
                className="transition-[stroke-opacity,stroke-width] duration-200"
              />
            );
          })}
        </svg>

        <div className="relative flex items-stretch gap-3 md:gap-5">
          {renderSkills('left')}
          {renderRoles('left')}

          <div className="flex flex-col justify-center shrink-0">
            <div
              ref={setRef('root')}
              className="rounded-xl ring-1 ring-foreground/20 bg-background/90 backdrop-blur-sm px-4 py-3 text-center"
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Ontology</p>
              <p className="text-sm font-bold text-foreground">Skills</p>
              <p className="font-mono text-[9px] text-muted-foreground/70">119 mapped · 79 shared</p>
            </div>
          </div>

          {renderRoles('right')}
          {renderSkills('right')}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-x-4 gap-y-1 bg-background/85 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] text-muted-foreground border border-border/50 pointer-events-none">
        <span>Click roles to open them. Open two to see what they share.</span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" strokeWidth="1.4" /></svg>
          owns
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5,4" /></svg>
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
