import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { personalInfo, stats } from '@/data/portfolioData';
import { Shield, Cloud, Brain, Terminal } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.about-content',
              opacity: [0, 1],
              translateX: [-50, 0],
              duration: 1000,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.about-card',
              opacity: [0, 1],
              translateY: [40, 0],
              delay: anime.stagger(100, { start: 300 }),
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.about-image-wrapper',
              opacity: [0, 1],
              scale: [0.9, 1],
              duration: 1000,
              delay: 200,
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

  const cards = [
    { icon: Cloud, label: 'Cloud Security', value: 'AWS & Azure' },
    { icon: Terminal, label: 'DevSecOps', value: 'CI/CD Gates' },
    { icon: Shield, label: 'Certifications', value: 'CEH v12, CND' },
    { icon: Brain, label: 'Research', value: '7 Papers' },
  ];

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title opacity-0 about-content">Get To Know</p>
          <h2 className="section-heading opacity-0 about-content">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image/Visual */}
          <div className="about-image-wrapper opacity-0 relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Decorative Background */}
              <div className="absolute inset-4 bg-gradient-to-br from-foreground/5 to-transparent rounded-2xl" />

              {/* Main Card */}
              <div className="absolute inset-0 card-cyber rounded-2xl p-8 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {cards.map((card, index) => (
                    <div
                      key={card.label}
                      className="about-card opacity-0 p-4 bg-card-elevated rounded-lg border border-border/50 hover:border-foreground/20 transition-all duration-300 group"
                    >
                      <card.icon className="w-6 h-6 mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <p className="font-mono text-xs text-muted-foreground mb-1">{card.label}</p>
                      <p className="font-medium text-sm">{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-border/30 rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-border/20 rounded-xl" />
            </div>
          </div>

          {/* Right - Content */}
          <div className="about-content opacity-0">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I am a <span className="text-foreground font-medium">Lead Security Engineer</span> with 3 years across
                cloud security, DevSecOps, and secure architecture. At <span className="text-foreground font-medium">Cygne Noir Cyber</span> I
                own the security architecture and the CI/CD security gates for a managed security platform that runs
                on isolated per-client AWS deployments: one EC2 instance per client in a separate AWS account,
                data locality as a hard rule so no scan input leaves the client deployment, and Twingate zero-trust access.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                I run a scanner fleet of <span className="text-foreground">Trivy, Prowler, Checkov, ScoutSuite, Semgrep, Gitleaks and Kubescape</span> into
                a <span className="text-foreground">DefectDojo</span> findings pipeline with bidirectional JIRA integration, SARIF normalization,
                and <span className="text-foreground">EPSS, CISA KEV and SSVC</span> prioritization. I also own the SOC 2 readiness
                program and cloud posture across AWS and Azure.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                What separates this from most cloud security work is that I write the code I secure. I shipped a
                production application backend as sole developer (FastAPI, Supabase, Redis, AWS) along with its
                application security architecture. I previously led a two-person application and API penetration
                testing function, which is where the triage judgment comes from. That offensive work is background,
                not what I am hired to do now.
              </p>

              {/* CTA */}
              <div className="pt-4">
                <a
                  href="#contact"
                  className="btn-hero"
                >
                  Let's Talk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
