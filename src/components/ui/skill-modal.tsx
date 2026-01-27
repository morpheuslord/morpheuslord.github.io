import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Code, Shield, Cloud, Brain, Terminal, Server, Database, Lock, Cpu, Workflow, BookOpen } from "lucide-react";
import { SkillCategory } from "@/data/skillsData";

export type { SkillCategory };

interface SkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: SkillCategory | null;
}

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  shield: Shield,
  cloud: Cloud,
  brain: Brain,
  terminal: Terminal,
  server: Server,
  database: Database,
  lock: Lock,
  cpu: Cpu,
  workflow: Workflow,
  book: BookOpen,
};

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

export const SkillModal: React.FC<SkillModalProps> = ({ open, onOpenChange, category }) => {
  if (!category) return null;

  const Icon = iconMap[category.icon] || Code;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {category.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {category.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {category.skills.map((skill) => (
            <div 
              key={skill.name}
              className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-border/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{skill.name}</span>
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
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
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
                <p className="text-sm text-muted-foreground mb-2">
                  {skill.description}
                </p>
              )}

              {/* Related Tools */}
              {skill.tools && skill.tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skill.tools.map((tool) => (
                    <span 
                      key={tool}
                      className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-mono">
            {category.skills.length} skills
          </span>
          <span className="text-muted-foreground font-mono">
            Avg. proficiency: {Math.round(category.skills.reduce((a, b) => a + b.level, 0) / category.skills.length)}%
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
