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

// Employment-based Skill Ontology Graph
const EmploymentSkillOntology = ({ onExperienceClick }: { onExperienceClick: (exp: typeof experiences[0]) => void }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });

  // Responsive dimension handling
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 400)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width } = dimensions;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const margin = {
      top: isMobile ? 10 : 20,
      right: isMobile ? 10 : 20,
      bottom: isMobile ? 10 : 20,
      left: isMobile ? 60 : 180
    };

    // Map each skill to its employments and find the primary (highest level) one
    const skillToEmployments = new Map<string, Array<{ expIndex: number; level: number; color: string }>>();
    experiences.forEach((exp, expIndex) => {
      Object.keys(exp.skills).forEach(skillName => {
        if (!skillToEmployments.has(skillName)) {
          skillToEmployments.set(skillName, []);
        }
        skillToEmployments.get(skillName)!.push({
          expIndex,
          level: Math.round(exp.skills[skillName] * 100),
          color: exp.color
        });
      });
    });

    // Determine primary employment for each skill (highest level)
    const skillPrimary = new Map<string, number>();
    skillToEmployments.forEach((emps, skillName) => {
      const best = emps.reduce((a, b) => b.level > a.level ? b : a, emps[0]);
      skillPrimary.set(skillName, best.expIndex);
    });

    // Build tree: each skill appears ONCE under its primary employment
    const treeData: any = {
      name: 'Skills',
      children: experiences.map((exp, i) => {
        const titleParts = exp.title.split(' – ');
        const jobTitle = titleParts[0].split(' ').slice(0, 2).join(' ');
        const companyName = titleParts[1] || '';
        const shortName = companyName ? `${jobTitle} @ ${companyName}` : jobTitle;

        // Only include skills whose primary employment is this one
        const mySkills = Object.keys(exp.skills).filter(
          skillName => skillPrimary.get(skillName) === i
        );

        return {
          name: shortName,
          fullName: exp.title,
          type: 'employment',
          color: exp.color,
          expData: exp,
          expIndex: i,
          children: mySkills.length > 0 ? mySkills.map(skillName => {
            const emps = skillToEmployments.get(skillName)!;
            const isShared = emps.length > 1;
            return {
              name: skillName,
              type: 'skill',
              color: exp.color,
              level: Math.round(exp.skills[skillName] * 100),
              isShared,
              // Other employments that also use this skill (for connection lines)
              otherEmployments: isShared
                ? emps.filter(e => e.expIndex !== i).map(e => e.expIndex)
                : [],
              allColors: emps.map(e => e.color),
            };
          }) : undefined
        };
      })
    };

    // Compute tree layout
    const root = d3.hierarchy(treeData);
    const dx = isMobile ? 12 : 15;
    const dy = (width - margin.left - margin.right) / (root.height + 1);

    const tree = d3.tree().nodeSize([dx, dy]);
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const treeHeight = x1 - x0 + dx * 2;

    svg.attr('width', width)
      .attr('height', treeHeight)
      .attr('viewBox', [-dy / 3, x0 - dx, width, treeHeight])
      .style('max-width', '100%')
      .style('height', 'auto')
      .style('font', isMobile ? '7px' : isTablet ? '8px' : '9px JetBrains Mono, monospace');

    const g = svg.append('g');

    // Zoom/pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .filter((event) => {
        if (event.type === 'wheel') return !event.ctrlKey;
        return true;
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom as any);

    const initialScale = isMobile ? 0.5 : 1;
    const initialTransform = d3.zoomIdentity
      .translate(width / 2 - (width / 2) * initialScale, treeHeight / 2 - (treeHeight / 2) * initialScale)
      .scale(initialScale);
    svg.call(zoom.transform as any, initialTransform);

    svg.on('touchstart', (event) => event.preventDefault());

    // Index employment nodes and skill nodes for cross-links
    const employmentNodes = new Map<number, any>();
    const sharedSkillNodes: any[] = [];

    root.each((d: any) => {
      if (d.data.type === 'employment' && d.data.expIndex !== undefined) {
        employmentNodes.set(d.data.expIndex, d);
      }
      if (d.data.type === 'skill' && d.data.isShared) {
        sharedSkillNodes.push(d);
      }
    });

    // Draw tree links (parent-child)
    const treeLinks = root.links();
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', isMobile ? 1 : 1.2)
      .selectAll('path')
      .data(treeLinks)
      .join('path')
      .attr('stroke', (d: any) => {
        if (!d.source.parent) return '#888';
        return d.source.data.color || '#555';
      })
      .attr('stroke-width', (d: any) => {
        if (!d.source.parent) return isMobile ? 1.5 : 2;
        return isMobile ? 1.2 : 1.5;
      })
      .attr('d', d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x));

    // Build cross-links: dashed lines from shared skills to their OTHER employment nodes
    const crossLinkData: Array<{ skillNode: any; empNode: any; color: string }> = [];
    sharedSkillNodes.forEach((skillNode: any) => {
      if (skillNode.data.otherEmployments) {
        skillNode.data.otherEmployments.forEach((expIndex: number) => {
          const empNode = employmentNodes.get(expIndex);
          if (empNode) {
            crossLinkData.push({
              skillNode,
              empNode,
              color: empNode.data.color
            });
          }
        });
      }
    });

    // Draw cross-links as smooth dashed curves (same style as tree links)
    const crossLinkSelection = g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', isMobile ? 0.8 : 1.2)
      .attr('stroke-dasharray', '6,4')
      .selectAll('path')
      .data(crossLinkData)
      .join('path')
      .attr('stroke', (d: any) => d.color)
      .attr('d', (d: any) => {
        // Use the same smooth horizontal link generator as tree links
        const linkGen = d3.linkHorizontal()
          .x((p: any) => p.y)
          .y((p: any) => p.x);
        return linkGen({ source: d.skillNode, target: d.empNode } as any);
      });

    // Draw nodes
    const node = g.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Node circles
    node.append('circle')
      .attr('fill', (d: any) => {
        if (!d.parent) return '#666';
        if (d.data.type === 'employment') return d.data.color || '#555';
        if (d.data.type === 'skill') return d.data.color || '#999';
        return d.children ? '#555' : '#999';
      })
      .attr('r', (d: any) => {
        const baseSize = isMobile ? 0.6 : isTablet ? 0.75 : 0.85;
        if (!d.parent) return 5 * baseSize;
        if (d.data.type === 'employment') return 4 * baseSize;
        if (d.data.type === 'skill' && d.data.isShared) return 3 * baseSize;
        if (d.data.type === 'skill') return 2.5 * baseSize;
        return (d.children ? 3 : 2) * baseSize;
      })
      .attr('stroke', (d: any) => {
        if (!d.parent) return '#888';
        return d.data.color || '#555';
      })
      .attr('stroke-width', (d: any) => {
        if (!d.parent) return 2.5;
        if (d.data.type === 'employment') return 2;
        return 1.5;
      });

    // Text labels
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => {
        if (!d.parent) return -10;
        if (d.data.type === 'employment') return -10;
        if (d.data.type === 'skill') return 8;
        return d.children ? -8 : 8;
      })
      .attr('text-anchor', (d: any) => {
        if (!d.parent) return 'end';
        if (d.data.type === 'employment') return 'end';
        if (d.data.type === 'skill') return 'start';
        return d.children ? 'end' : 'start';
      })
      .text((d: any) => d.data.name)
      .attr('fill', (d: any) => {
        if (!d.parent) return '#aaa';
        if (d.data.type === 'employment') {
          const rgb = hexToRgb(d.data.color);
          return rgb ? `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})` : d.data.color;
        }
        return d.data.color || '#333';
      })
      .attr('font-weight', (d: any) => {
        if (!d.parent) return '700';
        if (d.data.type === 'employment') return '700';
        if (d.data.type === 'skill') return '500';
        return d.children ? '600' : '400';
      });

    // Store original text colors
    const originalTextColors = new Map();
    node.select('text').each(function (d: any) {
      originalTextColors.set(d, d3.select(this).attr('fill'));
    });

    // Hover interactions
    node.append('rect')
      .attr('fill', 'none')
      .attr('width', 200)
      .attr('height', 20)
      .attr('x', (d: any) => d.data.type === 'employment' ? -200 : -10)
      .attr('y', -10)
      .attr('pointer-events', 'all')
      .style('cursor', (d: any) => d.data.type === 'employment' ? 'pointer' : 'default')
      .on('pointerenter', (event, d: any) => {
        // Dim everything
        node.select('text').attr('fill', 'hsl(0, 0%, 50%)');
        link.attr('stroke-opacity', 0.1);
        crossLinkSelection.attr('stroke-opacity', 0.05);

        // Highlight hovered node
        node.filter((n: any) => n === d)
          .select('text')
          .attr('fill', (n: any) => originalTextColors.get(n) || n.data.color || '#333')
          .attr('font-weight', 'bold');

        // Highlight related nodes
        node.filter((n: any) => {
          if (d.parent && n.parent === d.parent && n !== d) return true;
          if (d.children && n.parent === d) return true;
          if (n.children && d.parent === n) return true;
          // For shared skills: highlight the other employment nodes they connect to
          if (d.data.type === 'skill' && d.data.isShared && n.data.type === 'employment') {
            return d.data.otherEmployments?.includes(n.data.expIndex);
          }
          // For employment: highlight shared skills that connect TO this employment
          if (d.data.type === 'employment' && n.data.type === 'skill' && n.data.isShared) {
            return n.data.otherEmployments?.includes(d.data.expIndex);
          }
          return false;
        })
          .select('text')
          .attr('fill', (n: any) => originalTextColors.get(n) || n.data.color || '#333')
          .attr('opacity', 0.9);

        // Highlight tree links
        link.filter((l: any) =>
          (l.source === d && l.target.parent === d) ||
          (l.target === d && l.source === d.parent)
        )
          .raise()
          .attr('stroke-opacity', 0.8)
          .attr('stroke-width', 2.5);

        // Highlight cross-links
        if (d.data.type === 'skill' && d.data.isShared) {
          crossLinkSelection.filter((l: any) => l.skillNode === d)
            .raise()
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);
        } else if (d.data.type === 'employment') {
          crossLinkSelection.filter((l: any) => l.empNode === d)
            .raise()
            .attr('stroke-opacity', 0.5)
            .attr('stroke-width', 1.5);
        }
      })
      .on('pointerout', () => {
        node.select('text').each(function (n: any) {
          d3.select(this)
            .attr('fill', originalTextColors.get(n) || n.data.color || '#333')
            .attr('opacity', 1)
            .attr('font-weight', (n: any) => {
              if (n.data.type === 'employment') return '700';
              if (n.data.type === 'skill') return '500';
              return n.children ? '600' : '400';
            });
        });
        link.order().attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);
        crossLinkSelection.order().attr('stroke-opacity', 0.2).attr('stroke-width', isMobile ? 0.8 : 1);
      })
      .on('click', (event, d: any) => {
        if (d.data.type === 'employment' && d.data.expData) {
          onExperienceClick(d.data.expData);
        }
      });

    return () => { };
  }, [dimensions, onExperienceClick]);

  return (
    <div ref={containerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl border border-border bg-card/30 overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full touch-none" />
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border/50 pointer-events-none">
        <div className="flex items-center gap-2">
          <span>🔍 Scroll to zoom</span>
          <span>•</span>
          <span>👆 Drag to pan</span>
        </div>
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
              ? 'Employment-based knowledge graph — click employment nodes to explore skills gained'
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
