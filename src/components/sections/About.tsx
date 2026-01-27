import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { personalInfo, stats } from '@/data/portfolioData';
import { Shield, Code, Brain, Terminal } from 'lucide-react';

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
    { icon: Shield, label: 'Certifications', value: 'CEH V12, CND V2' },
    { icon: Code, label: 'Projects', value: '9+ Completed' },
    { icon: Brain, label: 'Research', value: '6+ Papers' },
    { icon: Terminal, label: 'Experience', value: '2+ Years' },
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
                I am a <span className="text-foreground font-medium">cybersecurity engineer</span> with a strong foundation in offensive security, 
                holding a BCA in Cybersecurity from Jain University along with <span className="text-foreground">CEH v12</span> and <span className="text-foreground">CND</span> certifications.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                At <span className="text-foreground font-medium">Cygne Noir Cyber</span>, I work across product development and applied research, 
                contributing to the design and implementation of Python-based security tools and API-driven systems. 
                My responsibilities span from building automation frameworks to supporting client-facing engagements 
                involving secure backend development and threat detection capabilities.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Beyond my core role, I actively develop custom scripts, publish technical content, and contribute 
                to community learning platforms. I rank among the <span className="text-foreground font-medium">top 1% on TryHackMe</span> and 
                continue to refine my skills in penetration testing, bug hunting, and secure application architecture.
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
