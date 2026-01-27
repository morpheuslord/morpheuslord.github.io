import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { articleCategories, authorStats } from '@/data/articlesData';
import { Brain, Shield, Code, Cloud, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

const Blogs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.blogs-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.blog-card',
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.98, 1],
              delay: anime.stagger(100, { start: 300 }),
              duration: 700,
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

  const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Brain> = {
      brain: Brain,
      shield: Shield,
      code: Code,
      cloud: Cloud,
    };
    return icons[iconName] || BookOpen;
  };

  return (
    <section id="blogs" ref={sectionRef} className="section">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title blogs-header opacity-0">Technical Writing</p>
          <h2 className="section-heading blogs-header opacity-0">Articles</h2>
          <p className="text-muted-foreground blogs-header opacity-0">
            {authorStats.totalArticles} articles on cybersecurity, AI, and development
          </p>
        </div>

        {/* Stats Bar */}
        <div className="blogs-header opacity-0 flex flex-wrap justify-center gap-8 mb-12 p-6 rounded-xl bg-secondary/20 border border-border/30">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground">{authorStats.totalArticles}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground">{authorStats.totalReads}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Reads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground">{authorStats.readingTime}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Read Time</div>
          </div>
        </div>

        {/* Blog Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {articleCategories.map((category) => {
            const Icon = getIcon(category.icon);
            
            return (
              <div 
                key={category.name}
                className="blog-card opacity-0 card-cyber rounded-xl p-6 group hover:border-foreground/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                    <p className="font-mono text-2xl font-bold text-muted-foreground">
                      {category.count}
                      <span className="text-sm font-normal ml-1">articles</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link 
            to="/articles"
            className="btn-hero inline-flex items-center gap-2"
          >
            Browse All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href={authorStats.profileUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2"
          >
            View on HackerNoon
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
