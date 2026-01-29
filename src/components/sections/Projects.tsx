import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { projects } from '@/data/portfolioData';
import { Github, ExternalLink, Folder } from 'lucide-react';

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.projects-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.project-card',
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              delay: anime.stagger(80, { start: 300 }),
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

  useEffect(() => {
    if (showAll) {
      anime({
        targets: '.project-card-extra',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(80),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  }, [showAll]);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title projects-header opacity-0">What I've Built</p>
          <h2 className="section-heading projects-header opacity-0">Projects</h2>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <a
              key={project.id}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card opacity-0 card-cyber rounded-xl p-6 flex flex-col group hover:border-foreground/20 transition-all duration-300 ${
                index >= 6 ? 'project-card-extra' : ''
              }`}
              aria-label={`View ${project.title} on GitHub`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Folder className="w-10 h-10 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="p-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-foreground/90">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground flex-1 mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && projects.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="btn-ghost"
            >
              Show More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
