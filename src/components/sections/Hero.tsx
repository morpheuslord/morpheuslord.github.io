import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { personalInfo, stats } from '@/data/portfolioData';
import { ChevronDown, Download } from 'lucide-react';
import ComputerModel from './ComputerModel';
import TerrainLines from '@/components/ui/terrain-lines';
import resumePdf from '@/data/Resume.pdf';

// The game only loads once someone clicks the computer.
const RetroMonitorPopup = lazy(() => import('./infra-ops/RetroMonitorPopup'));

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<Element | null>(null);
  const [gameOpen, setGameOpen] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const bootGame = useCallback(() => { setGameLoaded(true); setGameOpen(true); }, []);
  const getScreenRect = useCallback(() => screenRef.current?.getBoundingClientRect() ?? null, []);

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
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/10" />

      <div className="hero-glow w-[720px] h-[720px] -top-64 -left-48" aria-hidden="true" />

      {/* Terrain accent along the bottom edge; rises a little under the cursor */}
      <TerrainLines className="absolute inset-x-0 bottom-0 h-[220px] md:h-[300px]" amplitude={64} />

      {/* Fade into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Top Line */}
            <div className="hero-line h-px w-20 bg-foreground/40 mx-auto lg:mx-0 mb-8 origin-left" />

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/20 backdrop-blur-md mb-8 opacity-0">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Available for opportunities
              </span>
            </div>

            {/* Main Title */}
            <h1 
              ref={titleRef}
              className="group text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.035em] leading-[0.95] mb-8 opacity-0"
            >
              <span className="glow-text">{personalInfo.name.split(' ')[0]}</span>
              <br />
              <span className="text-outline">{personalInfo.name.split(' ')[1]}</span>
            </h1>

            {/* Subtitle */}
            <div 
              ref={subtitleRef}
              className="max-w-lg mx-auto lg:mx-0 mb-10 opacity-0"
            >
              <p className="font-mono text-sm md:text-base text-muted-foreground mb-4">
                <span className="text-foreground font-medium">{personalInfo.title}</span>
                <span className="mx-3 text-foreground">|</span>
                <span>{personalInfo.subtitle}</span>
              </p>
              {/* The five-second answer, above the fold. */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {personalInfo.headline}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-6 max-w-lg mx-auto lg:mx-0 mb-10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="hero-stat text-center lg:text-left opacity-0 lg:pl-4 lg:border-l lg:border-border/60"
                >
                  <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 tabular-nums sm:whitespace-nowrap">
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
              <a 
                href={resumePdf} 
                download="Chiranjeevi_Naidu_Resume.pdf"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </div>

          {/* Right: Computer Model */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="hero-illustration opacity-0 relative w-full max-w-lg lg:max-w-xl h-[400px] lg:h-[500px]">
              {/* Glow effect behind computer model */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,hsla(0,0%,100%,0.08),transparent_65%)] blur-2xl rounded-full" />
              
              <ComputerModel onBoot={bootGame} screenRef={screenRef} />

              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xs text-muted-foreground whitespace-nowrap pointer-events-none" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EC456] shadow-[0_0_6px_#4EC456]" />
                Click the computer to play Infra Ops
              </p>
              
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
      {gameLoaded && (
        <Suspense fallback={null}>
          <RetroMonitorPopup open={gameOpen} onClose={() => setGameOpen(false)} getOriginRect={getScreenRect} />
        </Suspense>
      )}
    </section>
  );
};

export default Hero;
