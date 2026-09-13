import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { achievements, certifications } from '@/data/portfolioData';
import { Trophy, Star, Github, Medal, Newspaper, ExternalLink } from 'lucide-react';

const LearningAchievements = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const badges =
            sectionRef.current?.querySelectorAll<HTMLElement>('.achievement-badge') ?? [];

          if (reduceMotion) {
            anime.set('.learning-header, .achievement-card, .achievement-icon', {
              opacity: 1,
              translateY: 0,
              scale: 1,
              rotate: 0,
            });
            badges.forEach((b) => {
              b.textContent = b.dataset.display ?? b.textContent;
            });
            return;
          }

          anime({
            targets: '.learning-header',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(80),
            easing: 'easeOutExpo',
          });

          anime
            .timeline({ easing: 'easeOutExpo' })
            .add({
              targets: '.achievement-card',
              opacity: [0, 1],
              translateY: [46, 0],
              scale: [0.92, 1],
              duration: 820,
              delay: anime.stagger(110, { start: 200 }),
            })
            .add(
              {
                targets: '.achievement-icon',
                scale: [0, 1],
                rotate: [-35, 0],
                duration: 700,
                delay: anime.stagger(110),
                easing: 'easeOutBack',
              },
              '-=760'
            );

          // Count the numeric part of each badge up; leave the rest of the
          // label ("Stars", "Papers", "Top 1%") exactly as written.
          badges.forEach((el, i) => {
            const display = el.dataset.display ?? '';
            const match = display.match(/^([\d,]+)(.*)$/);
            if (!match) {
              el.textContent = display;
              return;
            }
            const target = Number(match[1].replace(/,/g, ''));
            const suffix = match[2];
            const counter = { v: 0 };
            anime({
              targets: counter,
              v: target,
              round: 1,
              duration: 1400,
              delay: 420 + i * 110,
              easing: 'easeOutExpo',
              update: () => {
                el.textContent = counter.v.toLocaleString() + suffix;
              },
            });
          });
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
    <section id="learning" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title learning-header opacity-0">Continuous Growth</p>
          <h2 className="section-heading learning-header opacity-0">Learning & Achievements</h2>
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const icons = [Newspaper, Trophy, Github, Star];
            const Icon = icons[index % icons.length];
            
            return (
              <div 
                key={achievement.title}
                className="achievement-card opacity-0 card-cyber rounded-xl p-6 text-center group hover:border-foreground/20 hover:-translate-y-1.5 transition-[transform,border-color] duration-300 ease-out will-change-transform"
              >
                <div className="achievement-icon w-16 h-16 mx-auto mb-4 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div
                  className="achievement-badge font-mono text-2xl font-bold text-foreground mb-2 tabular-nums"
                  data-display={achievement.badge}
                >
                  {achievement.badge}
                </div>
                <h3 className="font-medium text-foreground mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold learning-header opacity-0">Certifications</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {certifications.map((cert) => (
            <a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="achievement-card opacity-0 card-cyber rounded-xl p-6 group hover:border-foreground/20 transition-all duration-300"
              aria-label={`Verify ${cert.title} with ${cert.issuer}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                  <Medal className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    ID: {cert.certId}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {cert.validity}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningAchievements;
