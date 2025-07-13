import React, { useEffect, useRef, useState, useCallback } from "react";
import "./experience.css"; // Use the improved CSS file above
import { BsPatchCheckFill } from "react-icons/bs";

const roles = [
  {
    title: "Cybersecurity Engineer Intern – Averlon/Avercyber",
    startDate: "May 2023",
    endDate: "Jul 2023",
    duration: "3 months",
    meta: "UNI Overlap",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Red Team Tools</h4>
                <small className="text-light">
                  Developed automated tools for threat detection and security assessment.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Vulnerability Assessments</h4>
                <small className="text-light">
                  Performed comprehensive security assessments and penetration testing.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>AWS Security</h4>
                <small className="text-light">
                  Conducted AWS Rules assessments and priority adjustments for cloud security.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>LLM Integration</h4>
                <small className="text-light">
                  Research on AI implementation strategies for cybersecurity applications.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>AI-Driven Security</h4>
                <small className="text-light">
                  Integrated AI models for enhanced security analysis and threat detection.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Security Automation</h4>
                <small className="text-light">
                  Automated security processes to enhance operational efficiency.
                </small>
              </div>
            </article>
          </div>
        </div>
      </>
    )
  },
  {
    title: "Offensive Security Engineer Intern – Averlon/Avercyber",
    startDate: "Jul 2023",
    endDate: "Mar 2024",
    duration: "8 months",
    meta: "UNI Overlap/Promotion",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Azure and AWS Security</h4>
                <small className="text-light">
                  Managed cloud infrastructure security tasks and compliance assessments.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Linux Optimization</h4>
                <small className="text-light">
                  Optimized system initialization processes and security hardening.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>SBOM Tools</h4>
                <small className="text-light">
                  Evaluated and tested Software Bill of Materials tools for integration.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Terraform Projects</h4>
                <small className="text-light">
                  Deployed security-focused infrastructure using Infrastructure as Code.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Vulnerability Research</h4>
                <small className="text-light">
                  Conducted in-depth security research and exploit development.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Linux Reverse Engineering</h4>
                <small className="text-light">
                  Conducted in-depth reverse engineering on the Linux Boot process.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>G.O.A.T Development</h4>
                <small className="text-light">
                  Developed and deployed vulnerable test machines for training purposes.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Automation Scripting</h4>
                <small className="text-light">
                  Programmed tools and scripts for security testing and analysis.
                </small>
              </div>
            </article>
          </div>
        </div>
      </>
    )
  },
  {
    title: "Freelance Researcher & Developer",
    startDate: "Mar 2024",
    endDate: "Oct 2024",
    duration: "7 months",
    meta: "Buffer Period",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>PoC Development</h4>
                <small className="text-light">
                  Designed and developed Proof-of-Concepts for novel vulnerabilities and exploits.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Automation Development</h4>
                <small className="text-light">
                  Built sophisticated automation tools for testing, monitoring and reporting.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Technical Writing & Proofreading</h4>
                <small className="text-light">
                  Provided proofreading and enhancement for technical reports and research papers.
                </small>
              </div>
            </article>
          </div>
        </div>
      </>
    )
  },
  {
    title: "CyberSecurity Engineer – Cygne Noir Cyber",
    startDate: "Oct 2024",
    endDate: "Present",
    duration: "8+ months",
    meta: "Current Position",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Python & API Development</h4>
                <small className="text-light">
                  Developed secure backend systems and tooling using Python and REST APIs.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Agentic AI Systems</h4>
                <small className="text-light">
                  Designed autonomous agents for internal security automation and threat response.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>MCP-Based Architecture</h4>
                <small className="text-light">
                  Worked on modular control pipelines for process-level control in secure environments.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Client-Facing Research</h4>
                <small className="text-light">
                  Collaborated with clients to deliver research-driven automation and secure workflows.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Security Automation</h4>
                <small className="text-light">
                  Built automated scripts and logic for vulnerability validation and pipeline integration.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>AI-Driven Detection</h4>
                <small className="text-light">
                  Integrated lightweight ML components into internal threat analysis systems.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>HR & Recruitment</h4>
                <small className="text-light">
                  Handling technical rounds and HR screening sessions for cybersecurity roles.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Architectural R&D</h4>
                <small className="text-light">
                  Designing architectural workflows to define development goals and project planning.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Training & Mentorship</h4>
                <small className="text-light">
                  Deeply involved in providing training and guidance to cybersecurity trainees.
                </small>
              </div>
            </article>
          </div>
        </div>
      </>
    )
  }
];

const Experience = () => {
  const container = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateProgressLine = useCallback((activeIndex) => {
    if (isMobile) return; // No progress line on mobile
    
    // Dynamic calculation based on grid layout
    const totalSteps = roles.length;
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    // Determine if we're in portrait mode (grid layout)
    const isPortraitGrid = aspectRatio <= 1;
    
    if (isPortraitGrid) {
      // No progress line in portrait grid mode
      return;
    }
    
    // Calculate progress width for horizontal timeline
    // The line spans from center of first dot to center of last dot
    const stepWidth = 100 / totalSteps; // Each step takes this percentage
    const startOffset = stepWidth / 2; // Offset to center of first dot
    const endOffset = stepWidth / 2; // Offset from center of last dot
    const totalLineWidth = 100 - startOffset - endOffset; // Available line width
    
    // Progress goes from 0 to totalLineWidth based on active index
    const progressPercentage = (activeIndex / (totalSteps - 1)) * totalLineWidth;
    
    // Remove previous style if exists
    const existingStyle = document.getElementById('progress-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new style
    const stepperAfter = document.createElement('style');
    stepperAfter.textContent = `
      .timeline__stepper { --timeline-steps: ${totalSteps}; }
      .timeline__stepper::after { width: ${progressPercentage}% !important; }
    `;
    stepperAfter.id = 'progress-style';
    document.head.appendChild(stepperAfter);
  }, [isMobile]);

  // Detect mobile screen size and aspect ratio
  const checkMobile = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    setIsMobile(width <= 768);
    
    // Update CSS custom property for dynamic calculations
    document.documentElement.style.setProperty('--viewport-aspect-ratio', aspectRatio.toString());
  }, []);

  const handleStepClick = useCallback((index) => {
    setActiveIndex(index);
    updateProgressLine(index);

    // Update active classes
    const timeline = container.current;
    if (!timeline) return;

    // Desktop stepper
    const stepper = timeline.querySelector('.timeline__stepper');
    if (stepper) {
      Array.from(stepper.children).forEach((step, i) => {
        step.classList.toggle('is-active', i === index);
      });
    }

    // Mobile cards
    const mobileCards = timeline.querySelectorAll('.timeline__mobile-card');
    mobileCards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index);
    });

    // Slides
    const slides = timeline.querySelectorAll('.timeline__slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    // Smooth scroll to content on mobile
    if (isMobile) {
      const slidesContainer = timeline.querySelector('.timeline__slides');
      if (slidesContainer) {
        setTimeout(() => {
          slidesContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  }, [isMobile, updateProgressLine]);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Also update progress line on resize
    const handleResize = () => {
      checkMobile();
      setTimeout(() => updateProgressLine(activeIndex), 100); // Delay to ensure layout is updated
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobile, updateProgressLine, activeIndex]);

  useEffect(() => {
    const timeline = container.current;
    if (!timeline) return;

    // Initialize first item as active
    handleStepClick(0);

    // Desktop stepper click handler
    const stepper = timeline.querySelector('.timeline__stepper');
    if (stepper) {
      const onStepClick = (e) => {
        const step = e.target.closest('.timeline__step');
        if (!step) return;
        
        const idx = Array.from(stepper.children).indexOf(step);
        handleStepClick(idx);
      };

      stepper.addEventListener("click", onStepClick);
      
      return () => {
        stepper.removeEventListener("click", onStepClick);
      };
    }
  }, [handleStepClick]);

  // Mobile card click handler
  const handleMobileCardClick = (index) => {
    handleStepClick(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        handleStepClick(activeIndex - 1);
      } else if (e.key === 'ArrowRight' && activeIndex < roles.length - 1) {
        handleStepClick(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleStepClick]);

  return (
    <section id="experience">
      <h5>What Skills I Have</h5>
      <h2>My Experience</h2>

      <div ref={container} className="timeline">
        {/* Desktop Timeline Stepper */}
        <div className="timeline__stepper" role="tablist" aria-label="Experience timeline">
          {roles.map((role, i) => (
            <div 
              key={i} 
              className="timeline__step"
              role="tab"
              aria-selected={i === activeIndex}
              aria-controls={`slide-${i}`}
              tabIndex={i === activeIndex ? 0 : -1}
            >
              <div className="timeline__step-dot" aria-hidden="true" />
              <div className="timeline__step-content">
                <div className="timeline__step-dates">
                  <span className="timeline__step-start-date">{role.startDate}</span>
                  <span className="timeline__step-end-date">{role.endDate}</span>
                  <span className="timeline__step-duration">{role.duration}</span>
                </div>
                {role.meta && (
                  <div className="timeline__step-meta">{role.meta}</div>
                )}
                <p className="timeline__step-title">{role.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Timeline Cards */}
        <div className="timeline__mobile-cards">
          {roles.map((role, i) => (
            <div 
              key={i}
              className="timeline__mobile-card"
              onClick={() => handleMobileCardClick(i)}
              role="button"
              aria-pressed={i === activeIndex}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMobileCardClick(i);
                }
              }}
            >
              <div className="timeline__mobile-card-header">
                <div className="timeline__mobile-card-dot" aria-hidden="true" />
                <div className="timeline__mobile-card-dates">
                  <span className="timeline__mobile-card-start">{role.startDate}</span>
                  <span className="timeline__mobile-card-end">{role.endDate}</span>
                </div>
                <div className="timeline__mobile-card-duration">{role.duration}</div>
              </div>
              {role.meta && (
                <div className="timeline__mobile-card-meta">{role.meta}</div>
              )}
              <h3 className="timeline__mobile-card-title">{role.title}</h3>
            </div>
          ))}
        </div>

        {/* Content Slides */}
        <div className="timeline__slides">
          {roles.map((role, i) => (
            <div 
              key={i} 
              className="timeline__slide"
              id={`slide-${i}`}
              role="tabpanel"
              aria-labelledby={`step-${i}`}
            >
              <h3 className="timeline__slide-title">{role.title}</h3>
              <div className="timeline__slide-content">{role.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;