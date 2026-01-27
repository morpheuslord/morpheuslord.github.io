import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { personalInfo, stats } from '@/data/portfolioData';
import { ChevronDown } from 'lucide-react';
import ComputerModel from './ComputerModel';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    });

    timeline
      .add({
        targets: '.hero-line',
        scaleX: [0, 1],
        duration: 1000,
        delay: 300,
      })
      .add({
        targets: '.hero-badge',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, '-=400')
      .add({
        targets: '.hero-illustration',
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 1000,
      }, '-=400')
      .add({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [60, 0],
        duration: 1000,
      }, '-=600')
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
      }, '-=600')
      .add({
        targets: '.hero-stat',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100),
        duration: 600,
      }, '-=400')
      .add({
        targets: '.hero-cta',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, '-=400')
      .add({
        targets: '.hero-scroll',
        opacity: [0, 1],
        duration: 800,
      }, '-=200');

    // Floating animation for scroll indicator
    anime({
      targets: '.hero-scroll',
      translateY: [0, 10, 0],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine',
    });

    // Subtle floating animation for illustration
    anime({
      targets: '.hero-illustration',
      translateY: [0, -8, 0],
      duration: 4000,
      loop: true,
      easing: 'easeInOutSine',
    });
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/10" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Top Line */}
            <div className="hero-line h-px w-20 bg-foreground/40 mx-auto lg:mx-0 mb-8 origin-left" />

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/20 backdrop-blur-md mb-8 opacity-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">
                Available for opportunities
              </span>
            </div>

            {/* Main Title */}
            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0"
            >
              <span className="glow-text">{personalInfo.name.split(' ')[0]}</span>
              <br />
              <span className="text-muted-foreground/50">{personalInfo.name.split(' ')[1]}</span>
            </h1>

            {/* Subtitle */}
            <p 
              ref={subtitleRef}
              className="font-mono text-sm md:text-base text-muted-foreground max-w-md mx-auto lg:mx-0 mb-10 opacity-0"
            >
              <span className="text-foreground font-medium">{personalInfo.title}</span>
              <span className="mx-3 text-border">|</span>
              <span>{personalInfo.subtitle}</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10 mb-10">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat text-center lg:text-left opacity-0">
                  <div className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="hero-cta flex flex-wrap justify-center lg:justify-start gap-4 opacity-0">
              <a href="#contact" className="btn-hero">
                Get in Touch
              </a>
              <a href="#projects" className="btn-ghost">
                View Projects
              </a>
            </div>
          </div>

          {/* Right: Computer Model */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="hero-illustration opacity-0 relative w-full max-w-lg lg:max-w-xl h-[400px] lg:h-[500px]">
              {/* Glow effect behind computer model */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl rounded-full" />
              
              <ComputerModel />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-border/20 rounded-full opacity-60" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-border/20 rounded-full opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToAbout}
        className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer opacity-0"
      >
        <span className="font-mono text-xs tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};

export default Hero;
