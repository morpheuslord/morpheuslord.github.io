import { useRef, useEffect } from 'react';
import anime from 'animejs';
import { ExternalLink, Shield, Bot, Cloud, GitBranch, CheckSquare, FileSearch, Server, Zap, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Cloud,
    title: "Cloud Security Architecture",
    description: "Multi-account isolation, IAM boundary design, zero-trust access, and ongoing posture management across AWS and Azure.",
    features: ["Account Isolation", "IAM Boundaries", "Zero-Trust Access", "Posture Management"],
  },
  {
    icon: GitBranch,
    title: "DevSecOps & CI/CD Security",
    description: "Security gates wired into the pipeline: which checks run, at which stage, and what blocks a merge or a deploy.",
    features: ["Semgrep · Gitleaks", "Trivy · Checkov", "SBOM · Supply Chain", "Pipeline Gates"],
  },
  {
    icon: Shield,
    title: "Vulnerability Management",
    description: "Scanner fleet operations feeding a single findings pipeline, with exploitation-aware prioritization so the right things get fixed first.",
    features: ["DefectDojo · JIRA", "SARIF Normalization", "EPSS · KEV · SSVC", "Triage Automation"],
  },
  {
    icon: CheckSquare,
    title: "Compliance Readiness",
    description: "SOC 2 readiness work: control mapping, gap remediation, evidence collection, and delivery for clients under EU regulatory regimes.",
    features: ["SOC 2 Readiness", "Control Mapping", "Audit Evidence", "DORA · NIS2 · GDPR"],
  },
  {
    icon: Server,
    title: "Secure Backend & API Development",
    description: "End-to-end Python backend systems, secure REST API design, cloud deployment, and scalable architecture for early-stage products.",
    features: ["Python · FastAPI", "AWS · Azure", "E2EE Systems", "Scalable Architecture"],
  },
  {
    icon: Bot,
    title: "AI Security & Agentic Systems",
    description: "Securing agentic pipelines, LLM-assisted triage and enrichment, and the agent and prompt threat surface.",
    features: ["Agentic Pipelines", "LLM-Assisted Triage", "Prompt Threat Surface", "Security Automation"],
  },
  {
    icon: FileSearch,
    title: "Security Research & Writing",
    description: "Security research, vulnerability analysis, technical documentation, and proof-of-concept development.",
    features: ["PoC Development", "Research Papers", "Technical Docs", "Tooling Analysis"],
  },
];


const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnimations = () => {
      anime({
        targets: '.services-header',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
      });

      anime({
        targets: '.service-card',
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.98, 1],
        delay: anime.stagger(100, { start: 300 }),
        duration: 700,
        easing: 'easeOutExpo',
      });
    };

    const node = sectionRef.current;
    if (!node) return;

    // If the section is already in view on mount, the observer may not fire, so
    // run immediately so the card never gets stuck at opacity-0.
    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      runAnimations();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimations();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section bg-secondary/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title services-header opacity-0">Freelance</p>
          <h2 className="section-heading services-header opacity-0">Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto services-header opacity-0">
            Available for consulting, contract work, and project-based engagements. 
            Specialized in security and AI integration.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.title}
                className="service-card opacity-0 card-cyber rounded-xl p-8 group hover:border-foreground/20 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500/70" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fiverr CTA */}
        <div className="service-card opacity-0 card-cyber rounded-xl p-8 md:p-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-green-500" />
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Available on Fiverr
            </span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Work Together?
          </h3>
          
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get professional security consulting and AI development services. 
            Clear communication, quality deliverables, and timely completion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://www.fiverr.com/chiranjeevinaid?public_mode=true"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero relative z-10 inline-flex items-center gap-2"
            >
              Hire Me on Fiverr
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="#contact"
              className="btn-ghost relative z-10"
            >
              Or Contact Directly
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500/70" />
              <span>Fast Response</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500/70" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500/70" />
              <span>Secure Process</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
