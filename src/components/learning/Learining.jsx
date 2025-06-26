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
  BsBoxArrowUpRight,
  BsStar,
  BsStarFill
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
        rating: 5,
        category: "Network",
        tools: ["Wireshark", "Nmap", "Snort"]
      },
      {
        icon: <BsCloudArrowUp />,
        title: "Cloud Infrastructure Security",
        description: "AWS & Azure security architecture and compliance frameworks",
        rating: 4,
        category: "Cloud",
        tools: ["AWS", "Azure", "Terraform"]
      },
      {
        icon: <BsBug />,
        title: "Red Team Tactics & Penetration Testing",
        description: "Advanced exploitation techniques and security assessment",
        rating: 5,
        category: "Offensive",
        tools: ["Metasploit", "Burp Suite", "Kali Linux"]
      },
      {
        icon: <BsCode />,
        title: "Ethical Hacking",
        description: "Web application security testing and vulnerability research",
        rating: 4,
        category: "Testing",
        tools: ["OWASP ZAP", "SQLMap", "Nikto"]
      },
      {
        icon: <BsEye />,
        title: "Incident Response & Threat Hunting",
        description: "Real-time threat detection and incident management",
        rating: 4,
        category: "Defense",
        tools: ["Splunk", "ELK Stack", "YARA"]
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
        description: "Certified Ethical Hacker and Network Defense specialist",
        badge: "CEH V12, CND V2",
        year: "2024",
        type: "certification",
        priority: "high"
      },
      {
        icon: <BsBookmark />,
        title: "TryHackMe Elite",
        description: "Top-tier cybersecurity challenges and practical experience",
        badge: "Level Legend",
        year: "2023-2024",
        type: "platform",
        priority: "medium"
      },
      {
        icon: <BsLightbulb />,
        title: "Research Scholar",
        description: "Contributing to cybersecurity knowledge and innovation",
        badge: "4+ Papers",
        year: "2023-2024",
        type: "research",
        priority: "high"
      },
      {
        icon: <BsGithub />,
        title: "Open Source Contributor",
        description: "Building tools that strengthen the security ecosystem",
        badge: "7+ Projects",
        year: "2022-2024",
        type: "projects",
        priority: "medium"
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
        progress: 85,
        tech: ["Python", "Machine Learning", "API Integration"]
      },
      {
        icon: <BsCpu />,
        title: "AI-Powered Threat Detection",
        description: "Machine learning models for advanced persistent threat identification",
        status: "Research",
        impact: "Critical",
        progress: 60,
        tech: ["TensorFlow", "Neural Networks", "Pattern Recognition"]
      },
      {
        icon: <BsTerminal />,
        title: "Linux Security Optimization",
        description: "Kernel-level security enhancements and performance optimization",
        status: "Development",
        impact: "Medium",
        progress: 40,
        tech: ["Python", "SBOM", "Kernel Modules"]
      },
      {
        icon: <BsBoxArrowUpRight />,
        title: "Open Source Security Projects",
        description: "Contributing to community-driven security tools and frameworks",
        status: "Ongoing",
        impact: "Community",
        progress: 75,
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < rating ? <BsStarFill /> : <BsStar />}
      </span>
    ));
  };

  const renderCybersecurity = () => (
    <div className="section-content">
      <div className="cards-grid">
        {learningData.cybersecurity.skills.map((skill, index) => (
          <div 
            key={index}
            className={`universal-card skill-variant ${hoveredItem === `cyber-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`cyber-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="card-header">
              <div className="card-icon">{skill.icon}</div>
              <div className="card-badge category-badge">{skill.category}</div>
            </div>
            
            <div className="card-content">
              <h4 className="card-title">{skill.title}</h4>
              <p className="card-description">{skill.description}</p>
              
              {/* <div className="skill-rating">
                {renderStars(skill.rating)}
              </div> */}
              
              <div className="card-tags">
                {skill.tools.map((tool, toolIndex) => (
                  <span key={toolIndex} className="card-tag">{tool}</span>
                ))}
              </div>
            </div>
            
            <div className="card-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="section-content">
      <div className="cards-grid">
        {learningData.achievements.accomplishments.map((achievement, index) => (
          <div 
            key={index}
            className={`universal-card achievement-variant ${achievement.priority} ${hoveredItem === `achieve-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`achieve-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="card-header">
              <div className="card-icon">{achievement.icon}</div>
              <div className="card-badge year-badge">{achievement.year}</div>
            </div>
            
            <div className="card-content">
              <h4 className="card-title">{achievement.title}</h4>
              <div className="achievement-badge">{achievement.badge}</div>
              <p className="card-description">{achievement.description}</p>
            </div>
            
            <div className="card-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="section-content">
      <div className="cards-grid">
        {learningData.research.projects.map((project, index) => (
          <div 
            key={index}
            className={`universal-card research-variant ${hoveredItem === `research-${index}` ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredItem(`research-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="card-header">
              <div className="card-icon">{project.icon}</div>
              <div className="card-badges">
                <div className={`card-badge status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </div>
                <div className={`card-badge impact-badge ${project.impact.toLowerCase()}`}>
                  {project.impact}
                </div>
              </div>
            </div>
            
            <div className="card-content">
              <h4 className="card-title">{project.title}</h4>
              <p className="card-description">{project.description}</p>
              
              {/* <div className="progress-section">
                <div className="progress-label">Progress: {project.progress}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div> */}
              
              <div className="card-tags">
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="card-tag">{tech}</span>
                ))}
              </div>
            </div>
            
            <div className="card-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const sections = Object.keys(learningData);

  return (
    <section id='learning' className={`learning-section ${isVisible ? 'visible' : ''}`}>
      <div className="learning-header">
        <h5 className="section-subtitle">What I Know</h5>
        <h2 className="section-title">My Learning & Achievements</h2>
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
                <div className="tab-glow"></div>
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