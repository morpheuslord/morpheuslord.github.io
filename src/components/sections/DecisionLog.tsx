import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { decisionLog } from '@/data/siteExtras';
import { GitBranch, X, Check, ChevronDown } from 'lucide-react';

const DecisionLog = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<number | null>(decisionLog[0]?.id ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.decisions-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.decision-card',
              opacity: [0, 1],
              translateY: [30, 0],
              delay: anime.stagger(100, { start: 250 }),
              duration: 700,
              easing: 'easeOutExpo',
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="decisions" ref={sectionRef} className="section">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-6">
          <p className="section-title decisions-header opacity-0">How I Decide</p>
          <h2 className="section-heading decisions-header opacity-0">Decision log</h2>
        </div>
        <p className="decisions-header opacity-0 text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Architecture and security calls I owned, the alternatives I rejected, and what
          each one cost. The tradeoff is the part worth reading.
        </p>

        {/* Decisions */}
        <div className="space-y-4">
          {decisionLog.map((d) => {
            const isOpen = openId === d.id;

            return (
              <div
                key={d.id}
                className="decision-card opacity-0 card-cyber rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : d.id)}
                  className="w-full flex items-start gap-4 p-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                    <GitBranch className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{d.decision}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{d.context}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 md:pl-20 space-y-5">
                    {/* Rejected */}
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Rejected
                      </p>
                      <ul className="space-y-1.5">
                        {d.rejected.map((r) => (
                          <li
                            key={r}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <X className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reasoning */}
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Why
                      </p>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-foreground/70" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {d.reasoning}
                        </p>
                      </div>
                    </div>

                    {/* Tradeoff */}
                    <div className="border-l-2 border-border pl-4">
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Tradeoff
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {d.tradeoff}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DecisionLog;
