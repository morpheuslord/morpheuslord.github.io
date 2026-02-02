// Portfolio Data

/** Importance of this responsibility in the role (1–5). Used with mainExp to compute radar score: score = min(5, round(avg importance in category)). */
export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

/** Main EXP category: each responsibility maps to one of these. Radar score 1–5 = min(5, round(avg importance in category)). */
export const RESPONSIBILITY_CATEGORIES = [
  "security",
  "development",
  "research",
  "leadership",
  "collaboration",
  "strategy",
  "delivery",
  "advisory",
] as const;

export type MainExpCategory = (typeof RESPONSIBILITY_CATEGORIES)[number];

/** Responsibility axes for the radar chart. Scores 0–5 = min(5, round(avg importance in category)). */
export type ResponsibilityScores = {
  security: number;
  development: number;
  research: number;
  leadership: number;
  collaboration: number;
  strategy: number;
  delivery: number;
  advisory: number;
};

export const DEFAULT_IMPORTANCE: ImportanceLevel = 3;

export type ExperienceHighlight = {
  title: string;
  desc: string;
  /** MAIN EXP: which of the 8 responsibility categories this highlight falls under. */
  mainExp: MainExpCategory;
  /** Importance of this responsibility in the role (1–5). Score per category = min(5, round(avg importance)). Default 3. */
  importance?: ImportanceLevel;
};

export const personalInfo = {
  name: "Chiranjeevi Naidu",
  title: "Cybersecurity Engineer",
  subtitle: "Agentic AI Developer",
  email: "chiranjeevi.naidu@proton.me",
  linkedin: "https://www.linkedin.com/in/chiranjeevi-g-naidu/",
  github: "https://github.com/morpheuslord",
  bio: `I am a cybersecurity engineer with a strong foundation in offensive security, holding a BCA in Cybersecurity from Jain University along with CEH v12 and CND certifications. At Cygne Noir Cyber, I work across product development and applied research, contributing to the design and implementation of Python-based security tools and API-driven systems.

My responsibilities span from building automation frameworks to supporting client-facing engagements involving secure backend development and threat detection capabilities. Previously at Avercyber Technologies, I focused on red teaming and cloud security assessments, particularly within AWS environments.

Beyond my core role, I actively develop custom scripts, publish technical content, and contribute to community learning platforms. I rank among the top 1% on TryHackMe and continue to refine my skills in penetration testing, bug hunting, and secure application architecture.`,
};

export const stats = [
  { label: "Certifications", value: "CEH V12, CND V2" },
  { label: "Projects", value: "9+" },
  { label: "Research Papers", value: "6+" },
  { label: "Experience", value: "2+ Years" },
];

export const experiences: Array<{
  id: number;
  title: string;
  company: string;
  period: string;
  duration: string;
  current: boolean;
  highlights: ExperienceHighlight[];
}> = [
  {
    id: 1,
    title: "CyberSecurity Engineer",
    company: "Cygne Noir Cyber",
    period: "Oct 2024 - Present",
    duration: "1.5+ months",
    current: true,
    highlights: [
      {
        title: "Python & API Development",
        desc: "Developed secure backend systems and tooling using Python and REST APIs.",
        mainExp: "development",
        importance: 4,
      },
      {
        title: "Agentic AI Systems",
        desc: "Designed autonomous agents for internal security automation and threat response.",
        mainExp: "development",
        importance: 5,
      },
      {
        title: "MCP-Based Architecture",
        desc: "Worked on modular control pipelines for process-level control.",
        mainExp: "strategy",
        importance: 4,
      },
      {
        title: "Client-Facing Research",
        desc: "Collaborated with clients to deliver research-driven automation.",
        mainExp: "collaboration",
        importance: 5,
      },
      {
        title: "Security Automation",
        desc: "Built automated scripts for vulnerability validation and pipeline integration.",
        mainExp: "security",
        importance: 4,
      },
      {
        title: "Training & Mentorship",
        desc: "Providing training and guidance to cybersecurity trainees.",
        mainExp: "advisory",
        importance: 5,
      },
      {
        title: "Application Pentesting",
        desc: "Lead a Team in performing application pentesting.",
        mainExp: "security",
        importance: 5,
      },
      {
        title: "Android Development",
        desc: "Lead a Team in developing a secure backend for a mobile application.",
        mainExp: "development",
        importance: 4,
      },
      {
        title: "Recruting",
        desc: "Recruiting and managing a team of cybersecurity professionals and interns.",
        mainExp: "leadership",
        importance: 5,
      },
      {
        title: "Team Lead in MVP Projects",
        desc: "Led teams across approximately 10 MVP-level projects, coordinating development and ensuring successful delivery.",
        mainExp: "delivery",
        importance: 5,
      },
      {
        title: "Architectural Design Leadership",
        desc: "Led architectural design and system architecture for all MVP projects, establishing technical standards and best practices.",
        mainExp: "strategy",
        importance: 5,
      },
      {
        title: "Cross-Domain Research",
        desc: "Led research initiatives across diverse domains beyond cybersecurity including Dating platforms, Insurance, Cloud Automation, Crypto, and other innovative areas.",
        mainExp: "research",
        importance: 5,
      },
    ],
  },
  {
    id: 2,
    title: "Freelance Researcher & Developer",
    company: "Independent",
    period: "Mar 2024 - Oct 2024",
    duration: "7 months",
    current: false,
    highlights: [
      {
        title: "PoC Development",
        desc: "Designed Proof-of-Concepts for novel vulnerabilities and exploits.",
        mainExp: "research",
        importance: 5,
      },
      {
        title: "Automation Development",
        desc: "Built sophisticated automation tools for testing and monitoring.",
        mainExp: "development",
        importance: 5,
      },
      {
        title: "Technical Writing",
        desc: "Provided proofreading for technical reports and research papers.",
        mainExp: "research",
        importance: 3,
      },
      {
        title: "Research Assistance and Guidance",
        desc: "Provided research assistance and mentorship to students and professionals.",
        mainExp: "advisory",
        importance: 4,
      },
      {
        title: "Student Project Development",
        desc: "Guided and developed student projects in cybersecurity and development domains.",
        mainExp: "advisory",
        importance: 4,
      },
      {
        title: "Cybersecurity Training",
        desc: "Conducted cybersecurity training sessions and workshops.",
        mainExp: "security",
        importance: 3,
      },
    ],
  },
  {
    id: 3,
    title: "Offensive Security Engineer Intern",
    company: "Averlon/Avercyber",
    period: "Jul 2023 - Mar 2024",
    duration: "8 months",
    current: false,
    highlights: [
      {
        title: "Azure and AWS Security",
        desc: "Managed cloud infrastructure security and compliance assessments.",
        mainExp: "security",
        importance: 5,
      },
      {
        title: "Linux Optimization",
        desc: "Optimized system initialization and security hardening.",
        mainExp: "development",
        importance: 4,
      },
      {
        title: "SBOM Tools",
        desc: "Evaluated Software Bill of Materials tools for integration.",
        mainExp: "development",
        importance: 3,
      },
      {
        title: "Terraform Projects",
        desc: "Deployed security-focused infrastructure using IaC.",
        mainExp: "advisory",
        importance: 4,
      },
      {
        title: "Vulnerability Research",
        desc: "Conducted in-depth security research and exploit development.",
        mainExp: "research",
        importance: 5,
      },
      {
        title: "G.O.A.T Project Development",
        desc: "Led development of the G.O.A.T security project initiative.",
        mainExp: "development",
        importance: 5,
      },
      {
        title: "AWS and Azure Development",
        desc: "Developed cloud-native solutions and infrastructure on AWS and Azure platforms.",
        mainExp: "development",
        importance: 4,
      },
      {
        title: "Containerized App Development",
        desc: "Built and deployed containerized applications using Docker and orchestration tools.",
        mainExp: "delivery",
        importance: 4,
      },
    ],
  },
  {
    id: 4,
    title: "Cybersecurity Engineer Intern",
    company: "Averlon/Avercyber",
    period: "May 2023 - Jul 2023",
    duration: "3 months",
    current: false,
    highlights: [
      {
        title: "Red Team Tools",
        desc: "Developed automated tools for threat detection and assessment.",
        mainExp: "development",
        importance: 4,
      },
      {
        title: "Vulnerability Assessments",
        desc: "Performed comprehensive security assessments and pen testing.",
        mainExp: "security",
        importance: 5,
      },
      {
        title: "AWS Security",
        desc: "Conducted AWS Rules assessments for cloud security.",
        mainExp: "security",
        importance: 4,
      },
      {
        title: "LLM Integration",
        desc: "Research on AI implementation for cybersecurity applications.",
        mainExp: "research",
        importance: 4,
      },
      {
        title: "Network Assessment and Testing",
        desc: "Performed network security assessments and penetration testing.",
        mainExp: "security",
        importance: 4,
      },
      {
        title: "Cloud Web Testing",
        desc: "Conducted security testing for cloud-hosted web applications.",
        mainExp: "security",
        importance: 4,
      },
    ],
  },
];

export const skillCategories = [
  {
    id: "programming",
    name: "Programming & Development",
    skills: [
      { name: "Python", level: 95 },
      { name: "Shell/Bash", level: 85 },
      { name: "JavaScript", level: 70 },
      { name: "Flask/FastAPI", level: 80 },
      { name: "Git/GitHub", level: 90 },
      { name: "API Development", level: 70 },
    ],
  },
  {
    id: "security",
    name: "Cybersecurity & Pen Testing",
    skills: [
      { name: "Burp Suite", level: 90 },
      { name: "Nmap", level: 90 },
      { name: "Wireshark", level: 85 },
      { name: "Metasploit", level: 75 },
      { name: "OWASP", level: 80 },
      { name: "Network Security", level: 85 },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure",
    skills: [
      { name: "AWS", level: 80 },
      { name: "Docker", level: 85 },
      { name: "Terraform", level: 80 },
      { name: "Linux Admin", level: 90 },
      { name: "CI/CD", level: 60 },
      { name: "Azure", level: 50 },
    ],
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    skills: [
      { name: "LLMs", level: 90 },
      { name: "RAG & Agentic AI", level: 90 },
      { name: "LangChain", level: 80 },
      { name: "Prompt Engineering", level: 90 },
      { name: "MCP", level: 85 },
      { name: "Vector DBs", level: 70 },
    ],
  },
];

export const certifications = [
  {
    id: 1,
    title: "Certified Ethical Hacker V12",
    issuer: "EC-Council",
    certId: "ECC7349261508",
    year: "2024",
  },
  {
    id: 2,
    title: "Certified Network Defender",
    issuer: "EC-Council",
    certId: "ECC9327805461",
    year: "2024",
  },
];

export const achievements = [
  {
    title: "TryHackMe Elite",
    badge: "Top 1%",
    desc: "Top-tier cybersecurity challenges",
  },
  {
    title: "Research Scholar",
    badge: "6+ Papers",
    desc: "Published cybersecurity research",
  },
  {
    title: "Open Source Contributor",
    badge: "9+ Projects",
    desc: "Security tools development",
  },
];

export const projects = [
  {
    id: 1,
    title: "GPT-Vuln-Analyzer",
    description:
      "AI integration into security operations - PoC demonstrating LLM-powered vulnerability analysis.",
    github: "https://github.com/morpheuslord/GPT_Vuln-analyzer",
    tags: ["Python", "AI", "Security"],
  },
  {
    id: 2,
    title: "Startup-SBOM",
    description:
      "SBOM based on complete reverse engineering of the Linux boot process.",
    github: "https://github.com/morpheuslord/WinFiHack",
    tags: ["Python", "Linux", "SBOM"],
  },
  {
    id: 3,
    title: "QuadraInspect",
    description:
      "Automated approach for APK analysis with comprehensive security checks.",
    github: "https://github.com/morpheuslord/netlify-personal-site",
    tags: ["Python", "Mobile Security", "Analysis"],
  },
  {
    id: 4,
    title: "Brute Framework",
    description:
      "All-in-one hackers framework for Windows-based security testing.",
    github:
      "https://github.com/morpheuslord/Brute-Hacking-Framework-SourceCode",
    tags: ["Python", "Framework", "Windows"],
  },
  {
    id: 5,
    title: "Nmap-API",
    description: "REST API for network analysis built as a graduation project.",
    github: "https://github.com/morpheuslord/Nmap-API",
    tags: ["Python", "API", "Nmap"],
  },
  {
    id: 6,
    title: "HackBot",
    description: "LLM Assistant PoC for analysis and information gathering.",
    github: "https://github.com/morpheuslord/HackBot",
    tags: ["Python", "AI", "Assistant"],
  },
  {
    id: 7,
    title: "CVE-LLM-Dataset",
    description:
      "Test dataset demonstrating LLM training dataset structure for CVEs.",
    github: "https://github.com/morpheuslord/CVE-llm_dataset",
    tags: ["Dataset", "LLM", "CVE"],
  },
  {
    id: 8,
    title: "C2C-Server",
    description:
      "Command & Control server demonstrating real-life attack scenarios.",
    github: "https://github.com/morpheuslord/C2C-Server",
    tags: ["Python", "C2", "Red Team"],
  },
  {
    id: 9,
    title: "WinFiHack",
    description: "WiFi bruteforcing using native Windows network libraries.",
    github: "https://github.com/morpheuslord/WinFiHack",
    tags: ["Python", "WiFi", "Windows"],
  },
  {
    id: 10,
    title: "Komo.do-Hub",
    description:
      "A Mobile application interface for the Komodo Container Management Platform",
    github: "https://github.com/morpheuslord/komo.do-hub",
    tags: [
      "Android",
      "Komodo",
      "Container Management",
      "Java",
      "Node.js",
      "React Native",
      "React",
    ],
  },
];

export const researchPapers = [
  {
    id: 1,
    title: "API-based Network Scanning",
    description: "Implementation of the Nmap-API project findings.",
    link: "https://drive.proton.me/urls/6P6MS0T83G#3OLWdBs3lWM1",
  },
  {
    id: 2,
    title: "AI Based Enumeration and Exploit Suggester",
    description: "Proposal paper on AI with cybersecurity research.",
    link: "https://www.jetir.org/view.php?paper=JETIRFM06037",
  },
  {
    id: 3,
    title: "AI in Action: Exploiting the Nexus of Cybersecurity",
    description: "AI in cybersecurity using CI/CD pipelines.",
    link: "https://drive.proton.me/urls/R83Q1HJS9W#8Z8HRKh44jS0",
  },
  {
    id: 4,
    title: "Using Autoencoder for Malware Detection",
    description: "Study into autoencoders and their use in cybersecurity.",
    link: "https://www.fmdbpub.com/uploads/articles/174600650419444.%20FTSIN-292-2024.pdf",
  },
  {
    id: 5,
    title: "Docker Based Decentralized Vulnerability Assessment",
    description: "Port scanning powered by Artificial Intelligence.",
    link: "https://www.fmdbpub.com/uploads/articles/174595000296104.%20FTSIN-290-2024.pdf",
  },
  {
    id: 6,
    title: "ML-Driven Secure Communication for 6G Networks",
    description: "Machine learning for next-generation network security.",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-85008-0_6",
  },
];

export const blogCategories = [
  { name: "AI & Cybersecurity", count: 12, icon: "robot" },
  { name: "Penetration Testing", count: 24, icon: "shield" },
  { name: "Tools & Programming", count: 18, icon: "code" },
  { name: "Education & Setup", count: 15, icon: "book" },
];

export const testimonials = [
  {
    id: 1,
    name: "Matthias Luft",
    role: "Mentor during internship",
    quote:
      "Chiranjeevi showed a lot of talent, focus, and determination in the area of penetration testing and hacking. I greatly enjoyed working with him and hope to do so again in the future!",
  },
  {
    id: 2,
    name: "Saumay Srivastava",
    role: "Colleague",
    quote:
      "I have known Chiranjeevi for more than 3 years and his dedication to actively learn and evolve in the whole domain is commendable. Chiranjeevi is proficient in Recon, Linux based exploitation and Red team domains.",
  },
  {
    id: 3,
    name: "Shyam R",
    role: "Lecturer and Client",
    quote:
      "I am delighted to recommend Chiranjeevi for his outstanding capabilities as a research writer specializing in cybersecurity. He has consistently demonstrated exceptional expertise and dedication.",
  },
];

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Research", href: "#research" },
  { name: "Services", href: "#services" },
  { name: "Articles", href: "/articles" },
  { name: "Contact", href: "#contact" },
];
