import React, { useEffect, useRef } from "react";
import "./experience.css"; // Import the CSS file above
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
                  Developed automated tools for threat detection.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Vulnerability Assessments</h4>
                <small className="text-light">
                  Performed comprehensive assessments.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>AWS Assessments</h4>
                <small className="text-light">
                  AWS Rules assessments and priority adjustments.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>LLM Integration</h4>
                <small className="text-light">
                  Research on AI implementation strategies.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>AI-Driven Security</h4>
                <small className="text-light">
                  Integrated AI models for enhanced security analysis.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Security Automation</h4>
                <small className="text-light">
                  Automated security processes to enhance efficiency.
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
                  Managed infrastructure security tasks.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Linux Optimization</h4>
                <small className="text-light">
                  Optimized initialization processes.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>SBOM Tools</h4>
                <small className="text-light">
                  Evaluated and tested tools for integration.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Terraform Projects</h4>
                <small className="text-light">
                  Deployed security-focused infrastructure.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Vulnerability Research</h4>
                <small className="text-light">
                  Conducted in-depth security research.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Linux Reverse Engineering</h4>
                <small className="text-light">
                  Conducted in-depth Reverse Engineering on the Linux Boot process.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>G.O.A.T Development</h4>
                <small className="text-light">
                  Developed and Deployed vulnerable test machines.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Automation Scripting</h4>
                <small className="text-light">
                  Programmed tools and scripts for testing and analysis.
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
    meta: "Buffer",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>PoC Development</h4>
                <small className="text-light">
                  Designed and developed Proof-of-Concepts for novel vulnerabilities.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Automation Development</h4>
                <small className="text-light">
                  Built automation tools for testing, monitoring and reporting.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Technical Writing & Proofreading</h4>
                <small className="text-light">
                  Provided proofreading and enhancement for technical reports and papers.
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
    meta: "Present Working",
    content: (
      <>
        <div className="experience__section">
          <div className="experience__content">
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Python & API-Centric Development</h4>
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
                <h4>Client-Facing Research Projects</h4>
                <small className="text-light">
                  Collaborated with clients to deliver research-driven automation and secure development workflows.
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
                <h4>AI-Driven Detection Models</h4>
                <small className="text-light">
                  Integrated lightweight machine learning components into internal threat analysis systems.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>HR Screening</h4>
                <small className="text-light">
                  Handling Technical rounds and HR screening sessions.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Architectural R&D</h4>
                <small className="text-light">
                  Designing architectural workflows to define development goals and facilitate project planning.
                </small>
              </div>
            </article>
            <article className="experience__details">
              <BsPatchCheckFill className="experience__details-icon" />
              <div>
                <h4>Training</h4>
                <small className="text-light">
                  Deeply involved in providing training and guidance to trainees.
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

  useEffect(() => {
    const DOM = {
      step: "timeline__step",
      active: "is-active",
      slide: "timeline__slide",
      slideActive: "is-active",
      stepper: "timeline__stepper",
    };

    const timeline = container.current;
    const stepper = timeline.querySelector(`.${DOM.stepper}`);
    const slides = Array.from(timeline.querySelectorAll(`.${DOM.slide}`));

    // Initial state — point to latest (index 0)
    stepper.firstElementChild.classList.add(DOM.active);
    slides[0].classList.add(DOM.slideActive);

    stepper.addEventListener("click", onStepClick);

    function onStepClick(e) {
      const step = e.target.closest(`.${DOM.step}`);
      if (!step) return;
      
      Array.from(stepper.children).forEach((s) =>
        s.classList.remove(DOM.active)
      );
      step.classList.add(DOM.active);

      const idx = Array.from(stepper.children).indexOf(step);
      slides.forEach((s) => s.classList.remove(DOM.slideActive));
      slides[idx].classList.add(DOM.slideActive);

      // Update progress line
      updateProgressLine(idx);
    }

    function updateProgressLine(activeIndex) {
      const progressWidth = ((activeIndex + 1) / roles.length) * 100;
      const stepperAfter = document.createElement('style');
      stepperAfter.textContent = `.timeline__stepper::after { width: ${progressWidth}% !important; }`;
      
      // Remove previous style if exists
      const existingStyle = document.getElementById('progress-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      stepperAfter.id = 'progress-style';
      document.head.appendChild(stepperAfter);
    }

    // Initialize progress line
    updateProgressLine(0);

    return () => {
      stepper.removeEventListener("click", onStepClick);
    };
  }, []);

  return (
    <section id="experience">
      <h5>What Skills I Have</h5>
      <h2>My Experience</h2>

      <div ref={container} className="timeline">
        <div className="timeline__stepper">
          {roles.map((role, i) => (
            <div key={i} className="timeline__step">
              <div className="timeline__step-dot" />
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
          ))}
        </div>

        <div className="timeline__slides">
          {roles.map((role, i) => (
            <div key={i} className="timeline__slide">
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