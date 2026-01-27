import { useRef, useEffect, useState, FormEvent } from 'react';
import anime from 'animejs';
import { personalInfo } from '@/data/portfolioData';
import { Mail, Linkedin, Github, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.contact-header',
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            anime({
              targets: '.contact-item',
              opacity: [0, 1],
              translateY: [30, 0],
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent successfully!');

    // Reset form
    (e.target as HTMLFormElement).reset();
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Chiranjeevi Naidu',
      href: personalInfo.linkedin,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'morpheuslord',
      href: personalInfo.github,
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title contact-header opacity-0">Get In Touch</p>
          <h2 className="section-heading contact-header opacity-0">Contact Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <p className="contact-item opacity-0 text-muted-foreground leading-relaxed">
              I'm always open to discussing new opportunities, interesting projects, 
              or potential collaborations in cybersecurity and AI development.
            </p>

            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="contact-item opacity-0 flex items-center gap-4 p-4 card-cyber rounded-lg group hover:border-foreground/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{link.label}</p>
                    <p className="font-medium text-foreground">{link.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="contact-item opacity-0 space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-muted-foreground"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-muted-foreground"
              />
            </div>
            
            <div>
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message"
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-muted-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="btn-hero w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Sending...
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
