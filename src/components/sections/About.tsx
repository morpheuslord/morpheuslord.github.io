import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { personalInfo } from '@/data/portfolioData';
import AsciiStage from './AsciiStage';

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
              <AsciiStage />

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-border/30 rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-border/20 rounded-xl" />
            </div>
          </div>

          {/* Right - Content */}
          <div className="about-content opacity-0">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I'm a <span className="text-foreground font-medium">Lead Security Engineer</span> in Bengaluru, three
                years into the field. I work in <span className="text-foreground">cloud security and DevSecOps</span>,
                which in practice means I decide how things get secured, what tooling we use, and which risks are
                worth accepting. I also lead the security research and train the people joining the team.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                I started in <span className="text-foreground">commerce</span>. Cybersecurity was what I kept
                reading about instead, so I moved across, graduated studying it, and picked up{' '}
                <span className="text-foreground">CEH v12</span> and <span className="text-foreground">CND</span>{' '}
                along the way. The first real work was offensive security, and the two years I later spent running
                application and API pentests are why I can usually tell a finding that matters from one that just
                scores highly. Backend development came alongside it, and I still write the production code I'm
                responsible for securing. Seven published papers, and security writing past 100,000 reads.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Outside work I drown in new tech. My <span className="text-foreground">homelab</span> started as one
                mini PC and turned into a Proxmox cluster, and most of what I end up trusting at work got broken there
                first. When something irritates me enough I build a fix for it.{' '}
                <span className="text-foreground">PICOTTY</span> came out of a machine dropping off the network and me
                not wanting to walk over with a keyboard; Hackaday and CNX Software picked it up, which I wasn't
                expecting.
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
