import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { articles, articleCategories, authorStats, Article } from '@/data/articlesData';
import { ArrowLeft, ExternalLink, Clock, Calendar, Search, Brain, Shield, Code, Cloud, BookOpen } from 'lucide-react';

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Fixed filtering logic - match by category field directly
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Direct category matching
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(a => a.featured);

  useEffect(() => {
    anime({
      targets: '.article-header',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });

    anime({
      targets: '.article-card',
      opacity: [0, 1],
      translateY: [40, 0],
      delay: anime.stagger(80, { start: 300 }),
      duration: 600,
      easing: 'easeOutExpo',
    });
  }, []);

  // Re-animate cards when filter changes
  useEffect(() => {
    anime({
      targets: '.article-item',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(50),
      duration: 400,
      easing: 'easeOutExpo',
    });
  }, [selectedCategory, searchTerm]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Brain> = {
      brain: Brain,
      shield: Shield,
      code: Code,
      cloud: Cloud,
    };
    return icons[iconName] || BookOpen;
  };

  const handleCategoryClick = (categoryName: string) => {
    // Toggle category - if already selected, deselect
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to Portfolio</span>
          </Link>
          <a 
            href={authorStats.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-mono"
          >
            View on HackerNoon
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="article-header opacity-0">
            <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-4">
              Technical Writing
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Articles & Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              In-depth explorations of cybersecurity, AI integration, and development practices. 
              Published on HackerNoon with over 1.5M+ reads.
            </p>

            {/* Author Stats */}
            <div className="flex flex-wrap gap-6 mb-12">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm">{authorStats.totalArticles} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm">{authorStats.readingTime} Total Read Time</span>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="article-header opacity-0 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 font-mono text-sm transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-3 rounded-lg text-sm font-mono whitespace-nowrap transition-colors ${
                  !selectedCategory 
                    ? 'bg-foreground text-background' 
                    : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({articles.length})
              </button>
              {articleCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-4 py-3 rounded-lg text-sm font-mono whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name 
                      ? 'bg-foreground text-background' 
                      : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Articles - Only show when no filter */}
      {!searchTerm && !selectedCategory && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-6 article-header opacity-0">
              Featured
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-card opacity-0 group card-cyber rounded-xl p-6 hover:border-foreground/20 transition-all duration-300"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-mono">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Overview - Only show when no filter */}
      {!searchTerm && !selectedCategory && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-6 article-header opacity-0">
              Categories
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {articleCategories.map((category) => {
                const Icon = getIcon(category.icon);
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="article-card opacity-0 p-5 rounded-xl bg-secondary/20 border border-border/30 hover:border-foreground/20 text-left transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-3 transition-colors" />
                    <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                    <span className="text-2xl font-bold font-mono text-muted-foreground">
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All/Filtered Articles */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-6 article-header opacity-0">
            {selectedCategory ? `${selectedCategory}` : searchTerm ? 'Search Results' : 'All Articles'}
            <span className="ml-2 text-foreground/50">({filteredArticles.length})</span>
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-mono">No articles found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}
                className="mt-4 text-sm text-foreground underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-item flex flex-col md:flex-row md:items-center gap-4 p-6 rounded-xl bg-secondary/10 border border-border/30 hover:border-foreground/20 hover:bg-secondary/20 transition-all duration-300 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground font-mono">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono shrink-0">
                    <div className="flex gap-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 rounded bg-secondary/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span>{article.date}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <a 
              href={authorStats.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero inline-flex items-center gap-2"
            >
              View All on HackerNoon
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Articles;
