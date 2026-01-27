import { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { testimonials } from '@/data/portfolioData';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.testimonials-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.testimonial-card',
              opacity: [0, 1],
              scale: [0.95, 1],
              duration: 800,
              delay: 300,
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

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const animateChange = (newIndex: number) => {
    setIsAnimating(true);
    
    anime({
      targets: '.testimonial-content',
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 300,
      easing: 'easeInQuad',
      complete: () => {
        setActiveIndex(newIndex);
        anime({
          targets: '.testimonial-content',
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 400,
          easing: 'easeOutQuad',
          complete: () => setIsAnimating(false),
        });
      },
    });
  };

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    animateChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1;
    animateChange(newIndex);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" ref={sectionRef} className="section bg-card/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title testimonials-header opacity-0">What People Say</p>
          <h2 className="section-heading testimonials-header opacity-0">Testimonials</h2>
        </div>

        {/* Testimonial Card */}
        <div className="testimonial-card opacity-0 card-cyber rounded-2xl p-8 md:p-12 relative">
          {/* Quote Icon */}
          <Quote className="absolute top-6 left-6 w-10 h-10 text-border" />
          
          {/* Content */}
          <div className="testimonial-content text-center pt-8">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              "{currentTestimonial.quote}"
            </p>
            
            <div>
              <p className="font-medium text-foreground">{currentTestimonial.name}</p>
              <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all disabled:opacity-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isAnimating && animateChange(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-6 bg-foreground'
                      : 'bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all disabled:opacity-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
