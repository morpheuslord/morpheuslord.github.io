import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '@/data/portfolioData';
import anime from 'animejs';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section (only for anchor links)
      const sections = navLinks
        .filter(link => link.href.startsWith('#'))
        .map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    anime({
      targets: '.nav-item',
      opacity: [0, 1],
      translateY: [-20, 0],
      delay: anime.stagger(50, { start: 500 }),
      duration: 600,
      easing: 'easeOutExpo',
    });
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle anchor links here, route links will be handled by React Router
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="font-mono text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            <span className="text-muted-foreground">{'>'}</span> chiranjeevi.dev
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isAnchorLink = link.href.startsWith('#');
              
              if (isAnchorLink) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-item nav-link ${
                      activeSection === link.href.replace('#', '') ? 'active' : ''
                    }`}
                  >
                    {link.name}
                  </a>
                );
              } else {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="nav-item nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              }
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            <span 
              className={`w-6 h-px bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span 
              className={`w-6 h-px bg-foreground transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`w-6 h-px bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isAnchorLink = link.href.startsWith('#');
            
            if (isAnchorLink) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-link text-lg"
                >
                  {link.name}
                </a>
              );
            } else {
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="nav-link text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
