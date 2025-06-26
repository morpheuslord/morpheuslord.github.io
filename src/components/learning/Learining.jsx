import React, { useState, useEffect } from 'react';
import './learining.css';
import { 
  BsShieldCheck, 
  BsTrophy, 
  BsLightbulb,
  BsCode,
  BsCloudArrowUp,
  BsBug,
  BsEye,
  BsCpu,
  BsAward,
  BsBookmark,
  BsGithub,
  BsGear,
  BsTerminal,
  BsBoxArrowUpRight
} from 'react-icons/bs';

const learningData = {
  cybersecurity: {
    title: "Cybersecurity Arsenal",
    subtitle: "Security Expertise",
    icon: <BsShieldCheck />,
    gradient: "cyber",
    skills: [
      {
        icon: <BsShieldCheck />,
        title: "Advanced Network Security",
        description: "Deep packet inspection, network forensics, and intrusion detection",
        level: 95,
        category: "Network"
      },
      {
        icon: <BsCloudArrowUp />,
        title: "Cloud Infrastructure Security",
        description: "AWS & Azure security architecture and compliance frameworks",
        level: 88,
        category: "Cloud"
      },
      {
        icon: <BsBug />,
        title: "Red Team Tactics & Penetration Testing",
        description: "Advanced exploitation techniques and security assessment",
        level: 92,
        category: "Offensive"
      },
      {
        icon: <BsCode />,
        title: "Ethical Hacking",
        description: "Web application security testing and vulnerability research",
        level: 90,
        category: "Testing"
      },
      {
        icon: <BsEye />,
        title: "Incident Response & Threat Hunting",
        description: "Real-time threat detection and incident management",
        level: 85,
        category: "Defense"
      }
    ]
  },
  achievements: {
    title: "Hall of Achievements",
    subtitle: "Proven Excellence",
    icon: <BsTrophy />,
    gradient: "achieve",
    accomplishments: [
      {
        icon: <BsAward />,
        title: "Professional Certifications",
        details: "CEH V12, CND V2",
        description: "Certified Ethical Hacker and Network Defense specialist",
        year: "2024",
        type: "certification"
      },
      {
        icon: <BsBookmark />,
        title: "TryHackMe Elite",
        details: "Level Max, 140+ rooms completed",
        description: "Top-tier cybersecurity challenges and practical experience",
        year: "2023-2024",
        type: "platform"
      },
      {
        icon: <BsLightbulb />,
        title: "Research Scholar",
        details: "4+ Published Research Papers",
        description: "Contributing to cybersecurity knowledge and innovation",
        year: "2023-2024",
        type: "research"
      },
      {
        icon: <BsGithub />,
        title: "Open Source Contributor",
        details: "7+ Security Projects",
        description: "Building tools that strengthen the security ecosystem",
        year: "2022-2024",
        type: "projects"
      }
    ]
  },
  research: {
    title: "Research Laboratory",
    subtitle: "Innovation & Development",
    icon: <BsLightbulb />,
    gradient: "research",
    projects: [
      {
        icon: <BsGear />,
        title: "Security Automation Tools",
        description: "Developing intelligent automation frameworks for threat response",
        status: "Active",
        impact: "High",
        tech: ["Python", "Machine Learning", "API Integration"]
      },
      {
        icon: <BsCpu />,
        title: "AI-Powered Threat Detection",
        description: "Machine learning models for advanced persistent threat identification",
        status: "Research",
        impact: "Critical",
        tech: ["TensorFlow", "Neural Networks", "Pattern Recognition"]
      },
      {
        icon: <BsTerminal />,
        title: "Linux Security Optimization",
        description: "Kernel-level security enhancements and performance optimization",
        status: "Development",
        impact: "Medium",
        tech: ["Python", "SBOM", "Kernel Modules", "System Calls"]
      },
      {
        icon: <BsBoxArrowUpRight />,
        title: "Open Source Security Projects",
        description: "Contributing to community-driven security tools and frameworks",
        status: "Ongoing",
        impact: "Community",
        tech: ["Various", "Collaboration", "Documentation"]
      }
    ]
  }
};

const Learning = () => {
  const [activeSection, setActiveSection] = useState('cybersecurity');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const renderCybersecurity = () => (
    <div className="section-content cybersecurity-content">
      <div className="skills-grid">
        {learningData.cybersecurity.skills.map((skill, index) => (
          <div 
            key={index}
            className={`skill-card ${hoveredItem === `cyber-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`cyber-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="skill-header">
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-category">{skill.category}</div>
            </div>
            <h4 className="skill-title">{skill.title}</h4>
            <p className="skill-description">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="section-content achievements-content">
      <div className="achievements-grid">
        {learningData.achievements.accomplishments.map((achievement, index) => (
          <div 
            key={index}
            className={`achievement-card ${achievement.type} ${hoveredItem === `achieve-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`achieve-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <div className="achievement-header">
                <h4 className="achievement-title">{achievement.title}</h4>
                <span className="achievement-year">{achievement.year}</span>
              </div>
              <div className="achievement-details">{achievement.details}</div>
              <p className="achievement-description">{achievement.description}</p>
            </div>
            <div className="achievement-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="section-content research-content">
      <div className="projects-grid">
        {learningData.research.projects.map((project, index) => (
          <div 
            key={index}
            className={`project-card ${hoveredItem === `research-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`research-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="project-header">
              <div className="project-icon">{project.icon}</div>
              <div className="project-status">
                <span className={`status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
                <span className={`impact-badge ${project.impact.toLowerCase()}`}>
                  {project.impact} Impact
                </span>
              </div>
            </div>
            <h4 className="project-title">{project.title}</h4>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sections = Object.keys(learningData);

  return (
    <section id='learning' className={`learning-section ${isVisible ? 'visible' : ''}`}>
      <div className="learning-header">
        <h5>What I Know</h5>
        <h2>My Learning & Achievements</h2>
      </div>

      <div className="container learning__container">
        {/* Navigation Tabs */}
        <div className="learning-nav">
          {sections.map((section) => {
            const data = learningData[section];
            return (
              <button
                key={section}
                className={`nav-tab ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                <div className="tab-icon">{data.icon}</div>
                <div className="tab-content">
                  <span className="tab-title">{data.title}</span>
                  <span className="tab-subtitle">{data.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className={`learning-content ${activeSection}`}>
          <div className="content-header">
            <div className="header-icon">
              {learningData[activeSection].icon}
            </div>
            <div className="header-text">
              <h3>{learningData[activeSection].title}</h3>
              <p>{learningData[activeSection].subtitle}</p>
            </div>
          </div>

          {activeSection === 'cybersecurity' && renderCybersecurity()}
          {activeSection === 'achievements' && renderAchievements()}
          {activeSection === 'research' && renderResearch()}
        </div>
      </div>
    </section>
  );
};

export default Learning;