import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { achievements, certifications } from '@/data/portfolioData';
import { Award, Trophy, Star, BookOpen, Github, Medal } from 'lucide-react';

const LearningAchievements = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.learning-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.achievement-card',
              opacity: [0, 1],
              translateY: [40, 0],
              delay: anime.stagger(100, { start: 300 }),
              duration: 800,
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
    <section id="learning" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title learning-header opacity-0">Continuous Growth</p>
          <h2 className="section-heading learning-header opacity-0">Learning & Achievements</h2>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const icons = [Trophy, Star, Github];
            const Icon = icons[index % icons.length];
            
            return (
              <div 
                key={achievement.title}
                className="achievement-card opacity-0 card-cyber rounded-xl p-6 text-center group hover:border-foreground/20 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="font-mono text-2xl font-bold text-foreground mb-2">
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
            <div 
              key={cert.id}
              className="achievement-card opacity-0 card-cyber rounded-xl p-6 group hover:border-foreground/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                  <Medal className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{cert.issuer}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    ID: {cert.certId}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{cert.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningAchievements;
