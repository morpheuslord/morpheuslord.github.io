import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { projects, projectClusters } from '@/data/portfolioData';
import { Github, Star, Newspaper, Folder } from 'lucide-react';

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
              targets: '.cluster-label',
              opacity: [0, 1],
              translateX: [-20, 0],
              delay: anime.stagger(120, { start: 200 }),
              duration: 600,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.project-card',
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              delay: anime.stagger(60, { start: 300 }),
              duration: 700,
              easing: 'easeOutExpo',
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title projects-header opacity-0">What I've Built</p>
          <h2 className="section-heading projects-header opacity-0">Projects</h2>
        </div>

        {/* Clusters */}
        <div className="space-y-14">
          {projectClusters.map((cluster) => {
            const items = projects.filter((p) => p.cluster === cluster.id);
            if (items.length === 0) return null;

            return (
              <div key={cluster.id}>
                {/* Cluster label */}
                <div className="cluster-label opacity-0 mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-mono text-sm uppercase tracking-widest text-foreground whitespace-nowrap">
                      {cluster.name}
                    </h3>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cluster.description}
                  </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((project) => (
                    <div
                      key={project.id}
                      className="project-card opacity-0 card-cyber rounded-xl p-6 flex flex-col group hover:border-foreground/20 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <Folder className="w-9 h-9 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="flex items-center gap-3">
                          {/* Star counts are only shown where they are strong. */}
                          {typeof project.stars === 'number' && (
                            <span
                              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground"
                              aria-label={`${project.stars} GitHub stars`}
                            >
                              <Star className="w-3.5 h-3.5" />
                              {project.stars}
                            </span>
                          )}
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={`View ${project.title} on GitHub`}
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-4"
                        >
                          {project.title}
                        </a>
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground flex-1 mb-4">
                        {project.description}
                      </p>

                      {/* Press coverage: stronger external validation than a star count. */}
                      {project.press && project.press.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Newspaper className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="font-mono text-xs text-muted-foreground">
                            Featured by
                          </span>
                          {project.press.map((p, i) => (
                            <span key={p.url} className="font-mono text-xs">
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:underline underline-offset-2"
                              >
                                {p.outlet}
                              </a>
                              {i < project.press!.length - 1 && (
                                <span className="text-muted-foreground">,</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
