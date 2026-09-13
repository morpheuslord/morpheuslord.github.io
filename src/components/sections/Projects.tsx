import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { projects, projectClusters } from '@/data/portfolioData';
import { Github, Star, Newspaper, Folder } from 'lucide-react';

type Project = (typeof projects)[number];

/** One cluster, with its own scroll trigger so cards reveal as you reach them
 *  rather than all firing at once when the section top crosses the viewport. */
const Cluster = ({
  name,
  description,
  items,
}: {
  name: string;
  description: string;
  items: Project[];
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const label = el.querySelector('.cluster-label');
    const rule = el.querySelector('.cluster-rule');
    const cards = el.querySelectorAll('.project-card');
    const stars = el.querySelectorAll<HTMLElement>('.star-count');

    anime.set(cards, { opacity: 0, translateY: 44, scale: 0.94 });
    anime.set(label, { opacity: 0, translateX: -18 });
    anime.set(rule, { scaleX: 0 });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          if (reduceMotion) {
            anime.set(cards, { opacity: 1, translateY: 0, scale: 1 });
            anime.set(label, { opacity: 1, translateX: 0 });
            anime.set(rule, { scaleX: 1 });
            stars.forEach((s) => { s.textContent = s.dataset.value ?? ''; });
            return;
          }

          const tl = anime.timeline({ easing: 'easeOutExpo' });

          tl.add({ targets: label, opacity: [0, 1], translateX: [-18, 0], duration: 550 })
            .add({ targets: rule, scaleX: [0, 1], duration: 700 }, '-=400')
            .add(
              {
                targets: cards,
                opacity: [0, 1],
                translateY: [44, 0],
                scale: [0.94, 1],
                duration: 760,
                delay: anime.stagger(85),
              },
              '-=500'
            );

          // Count the star numbers up once their card is on screen.
          stars.forEach((el2, i) => {
            const target = Number(el2.dataset.value ?? 0);
            const counter = { v: 0 };
            anime({
              targets: counter,
              v: target,
              round: 1,
              duration: 1100,
              delay: 380 + i * 85,
              easing: 'easeOutExpo',
              update: () => { el2.textContent = String(counter.v); },
            });
          });
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* Cluster label */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h3 className="cluster-label font-mono text-sm uppercase tracking-widest text-foreground whitespace-nowrap">
            {name}
          </h3>
          <div className="cluster-rule h-px flex-1 bg-border origin-left" />
        </div>
        <p className="cluster-label text-sm text-muted-foreground mt-2">{description}</p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((project) => (
          <div
            key={project.id}
            className="project-card card-cyber rounded-xl p-6 flex flex-col group hover:border-foreground/20 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-foreground/5 transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Folder className="w-9 h-9 text-muted-foreground group-hover:text-foreground group-hover:-rotate-6 transition-all duration-300" />
              <div className="flex items-center gap-3">
                {/* Star counts are only shown where they are strong. */}
                {typeof project.stars === 'number' && (
                  <span
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground"
                    aria-label={`${project.stars} GitHub stars`}
                  >
                    <Star className="w-3.5 h-3.5 group-hover:text-foreground group-hover:fill-foreground/20 transition-colors duration-300" />
                    <span className="star-count tabular-nums" data-value={project.stars}>
                      {project.stars}
                    </span>
                  </span>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-200"
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
                className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-400 ease-out"
              >
                {project.title}
              </a>
            </h4>

            {/* Description */}
            <p className="text-sm text-muted-foreground flex-1 mb-4">{project.description}</p>

            {/* Press coverage: stronger external validation than a star count. */}
            {project.press && project.press.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Newspaper className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="font-mono text-xs text-muted-foreground">Featured by</span>
                {project.press.map((pr, i) => (
                  <span key={pr.url} className="font-mono text-xs">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline underline-offset-2"
                    >
                      {pr.outlet}
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
                  className="px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded transition-colors duration-300 group-hover:bg-foreground/10 group-hover:text-foreground/80"
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
};

const Projects = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          anime({
            targets: el.querySelectorAll('.projects-header'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(90),
            easing: 'easeOutExpo',
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-title projects-header opacity-0">What I've Built</p>
          <h2 className="section-heading projects-header opacity-0">Projects</h2>
        </div>

        {/* Clusters */}
        <div className="space-y-14">
          {projectClusters.map((cluster) => {
            const items = projects.filter((p) => p.cluster === cluster.id);
            if (items.length === 0) return null;
            return (
              <Cluster
                key={cluster.id}
                name={cluster.name}
                description={cluster.description}
                items={items}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
