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
  /** MAIN EXP: primary category (used when mainExpCategories has one item or for backward compatibility). */
  mainExp: MainExpCategory;
  /**
   * Optional: multiple categories this responsibility belongs to.
   * When set, the responsibility contributes its full importance to each category (full-weight-per-axis).
   */
  mainExpCategories?: MainExpCategory[];
  /** Importance of this responsibility in the role (1–5). Score per category = min(5, round(avg importance)). Default 3. */
  importance?: ImportanceLevel;
};

/** Resolve the list of categories for a highlight (multi or single). Use this for counts/sums. */
export function getHighlightCategories(h: ExperienceHighlight): MainExpCategory[] {
  if (h.mainExpCategories && h.mainExpCategories.length > 0) return h.mainExpCategories;
  return [h.mainExp];
}

export const personalInfo = {
  name: "Chiranjeevi Naidu",
  title: "Security Engineer",
  subtitle: "Backend Lead · Agentic AI Developer",
  email: "chiranjeevi.naidu@proton.me",
  linkedin: "https://www.linkedin.com/in/chiranjeevi-g-naidu/",
  github: "https://github.com/morpheuslord",
  bio: `I am a Security Engineer and Backend Developer with 3+ years of experience across cybersecurity, production backend development, agentic AI systems, and technical leadership. At Cygne Noir Cyber I serve as Security Engineer & Backend Lead — sole developer of a production-grade backend system designed to scale to millions of users, with full ownership of cloud infrastructure across AWS and Azure, security architecture, and client delivery.

My technical depth spans offensive security (CEH v12, CND), full-stack API development, E2EE systems, DevSecOps, and AI-driven automation. I build custom security tooling, design agentic workflows, and lead cross-functional teams — combining the ability to find vulnerabilities and the ability to build systems that resist them.

I publish actively on HackerNoon (27 articles, 199,521+ reads), hold 6 research publications, and rank in the top 1% on TryHackMe.`,
};

export const stats = [
  { label: "Certifications", value: "CEH V12, CND V2" },
  { label: "Projects", value: "9+" },
  { label: "Research Papers", value: "6+" },
  { label: "Experience", value: "~3 Years" },
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
      title: "Security Engineer & Backend Lead",
      company: "Cygne Noir Cyber",
      period: "Oct 2024 - Present",
      duration: "1.9+ Years",
      current: true,
      highlights: [
        {
          title: "Sole Production Backend Developer",
          desc: "Sole backend developer for a production application — independently designed, architected, and deployed the entire backend system as a single contributor, built to scale from thousands to millions of concurrent users.",
          mainExp: "development",
          mainExpCategories: ["development", "delivery", "strategy"],
          importance: 5,
        },
        {
          title: "Python & API Development",
          desc: "Developed secure backend systems and tooling using Python and REST APIs.",
          mainExp: "development",
          mainExpCategories: ["development", "security"],
          importance: 5,
        },
        {
          title: "90% Cloud Cost Reduction",
          desc: "Conducted infrastructure cost simulations and optimization analysis — identified critical S3 and network cost inefficiencies and implemented targeted optimizations achieving a 90% reduction in projected cloud infrastructure costs at million-user scale.",
          mainExp: "strategy",
          mainExpCategories: ["strategy", "delivery", "development"],
          importance: 5,
        },
        {
          title: "Autonomous Threat Detection",
          desc: "Designed and implemented a comprehensive security architecture including an autonomous threat detection, monitoring, and automated ban system for real-time application protection.",
          mainExp: "security",
          mainExpCategories: ["security", "development", "strategy"],
          importance: 5,
        },
        {
          title: "Agentic AI Systems",
          desc: "Designed autonomous agents for internal security automation and threat response.",
          mainExp: "development",
          mainExpCategories: ["development", "security"],
          importance: 5,
        },
        {
          title: "MCP-Based Architecture",
          desc: "Worked on modular control pipelines for process-level control.",
          mainExp: "strategy",
          mainExpCategories: ["strategy", "development"],
          importance: 4,
        },
        {
          title: "Client-Facing Research",
          desc: "Collaborated with clients to deliver research-driven automation.",
          mainExp: "collaboration",
          mainExpCategories: ["collaboration", "research"],
          importance: 5,
        },
        {
          title: "Security Automation",
          desc: "Built automated scripts for vulnerability validation and pipeline integration.",
          mainExp: "security",
          mainExpCategories: ["security", "development"],
          importance: 4,
        },
        {
          title: "Training & Mentorship",
          desc: "Providing training and guidance to cybersecurity trainees.",
          mainExp: "advisory",
          mainExpCategories: ["advisory", "leadership"],
          importance: 5,
        },
        {
          title: "Application Pentesting",
          desc: "Lead a Team in performing application pentesting.",
          mainExp: "security",
          mainExpCategories: ["security", "leadership"],
          importance: 5,
        },
        {
          title: "Client Admin Command Center",
          desc: "Built a fully-featured client admin command center for operational management, user oversight, and platform control.",
          mainExp: "development",
          mainExpCategories: ["development", "delivery"],
          importance: 5,
        },
        {
          title: "Recruiting",
          desc: "Recruiting and managing a team of cybersecurity professionals and interns.",
          mainExp: "leadership",
          mainExpCategories: ["leadership", "advisory"],
          importance: 5,
        },
        {
          title: "Team Lead in MVP Projects",
          desc: "Led teams across approximately 10 MVP-level projects, coordinating development and ensuring successful delivery.",
          mainExp: "delivery",
          mainExpCategories: ["delivery", "leadership"],
          importance: 5,
        },
        {
          title: "Architectural Design Leadership",
          desc: "Led architectural design and system architecture for all MVP projects, establishing technical standards and best practices.",
          mainExp: "strategy",
          mainExpCategories: ["strategy", "leadership"],
          importance: 5,
        },
        {
          title: "E2EE Systems Research",
          desc: "Contributed to cross-domain research in E2EE systems and secure agentic AI, expanding technical scope into privacy-focused secure communication architecture.",
          mainExp: "research",
          mainExpCategories: ["research", "security"],
          importance: 4,
        },
        {
          title: "Compliance & Regulatory",
          desc: "Performed compliance checks and ensured regulatory and security compliance across all deployed environments, proactively identifying and remediating gaps across tooling and processes.",
          mainExp: "security",
          mainExpCategories: ["security", "advisory"],
          importance: 4,
        },
        {
          title: "Cross-Domain Research",
          desc: "Worked across 6+ product research initiatives, converting 4 into MVP-level projects and 1 into a fully live production deployment.",
          mainExp: "research",
          mainExpCategories: ["research", "strategy"],
          importance: 5,
        },
        {
          title: "Architecture Documentation",
          desc: "Authored detailed backend architecture plans for upcoming development phases, ensuring technical continuity, scalability, and clear implementation road-maps for future team execution.",
          mainExp: "strategy",
          mainExpCategories: ["strategy", "advisory", "development"],
          importance: 4,
        },
        {
          title: "Cloud Infrastructure Ownership",
          desc: "Owned end-to-end cloud infrastructure — deployment, maintenance, cost optimization, and Cloudflare security configuration across AWS and Azure environments.",
          mainExp: "development",
          mainExpCategories: ["development", "strategy", "delivery"],
          importance: 5,
        },
        {
          title: "Sprint & Product Management",
          desc: "Implemented sprint management and product life-cycle planning, driving a faster and more structured development workflow across the team.",
          mainExp: "leadership",
          mainExpCategories: ["leadership", "delivery"],
          importance: 5,
        },
      ],
    },
    {
      id: 2,
      title: "Freelance Developer & Researcher",
      company: "Independent",
      period: "Mar 2024 - Oct 2024",
      duration: "7 months",
      current: false,
      highlights: [
        {
          title: "Restaurant POS System",
          desc: "Sole developer on a full-stack Point-of-Sale system (FastAPI + MongoDB + Redis) — order management, inventory, billing, and reporting. Deployed on self-hosted Proxmox hypervisor with LXC containers and Tailscale mesh VPN for zero-cloud-cost edge infrastructure.",
          mainExp: "development",
          mainExpCategories: ["development", "security"],
          importance: 5,
        },
        {
          title: "Designer Marketplace Platform",
          desc: "Built end-to-end marketplace (React/Next.js + FastAPI + MongoDB + Redis) connecting designers with clients. Dual-sided user model, service listings, booking/transaction workflows. Deployed via Vercel + self-managed VPS, optimized to ₹2–3k/month operational cost.",
          mainExp: "development",
          mainExpCategories: ["development", "collaboration"],
          importance: 5,
        },
        {
          title: "Infrastructure Architecture",
          desc: "Designed infrastructure under real constraints — converted low-power hardware into Proxmox hypervisor with per-service LXC isolation, and architected cost-optimized cloud deployments with Vercel + VPS stacks.",
          mainExp: "development",
          mainExpCategories: ["development", "security"],
          importance: 4,
        },
        {
          title: "Security Research & Tooling",
          desc: "Designed PoC implementations for security research, built Python and Bash automation scripts for testing, monitoring, and data processing pipelines.",
          mainExp: "research",
          mainExpCategories: ["security", "research"],
          importance: 4,
        },
        {
          title: "Technical Writing & Documentation",
          desc: "Delivered full system documentation covering architecture, container topology, and operational runbooks. Provided technical writing and review support for research papers.",
          mainExp: "research",
          mainExpCategories: ["research", "advisory"],
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
          mainExpCategories: ["security", "advisory"],
          importance: 4,
        },
        {
          title: "Linux Optimization",
          desc: "Optimized system initialization and security hardening.",
          mainExp: "development",
          mainExpCategories: ["research", "security"],
          importance: 4,
        },
        {
          title: "SBOM Tools",
          desc: "Evaluated Software Bill of Materials tools for integration.",
          mainExp: "development",
          mainExpCategories: ["research", "delivery", "strategy", "security"],
          importance: 3,
        },
        {
          title: "Terraform Projects",
          desc: "Deployed security-focused infrastructure using IaC.",
          mainExp: "advisory",
          mainExpCategories: ["advisory", "delivery"],
          importance: 4,
        },
        {
          title: "Vulnerability Research",
          desc: "Conducted in-depth security research and exploit development.",
          mainExp: "research",
          mainExpCategories: ["strategy", "security"],
          importance: 4,
        },
        {
          title: "G.O.A.T Project Development",
          desc: "Led development of the G.O.A.T security project initiative.",
          mainExp: "development",
          mainExpCategories: ["collaboration", "security"],
          importance: 4,
        },
        {
          title: "AWS and Azure Development",
          desc: "Developed cloud-native solutions and infrastructure on AWS and Azure platforms.",
          mainExp: "development",
          mainExpCategories: ["collaboration", "security"],
          importance: 4,
        },
        {
          title: "Containerized App Development",
          desc: "Built and deployed containerized applications using Docker and orchestration tools.",
          mainExp: "delivery",
          mainExpCategories: ["delivery", "development"],
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
          mainExpCategories: ["development", "security"],
          importance: 4,
        },
        {
          title: "Vulnerability Assessments",
          desc: "Performed comprehensive security assessments and pen testing.",
          mainExp: "security",
          mainExpCategories: ["security", "research"],
          importance: 4,
        },
        {
          title: "AWS Security",
          desc: "Conducted AWS Rules assessments for cloud security.",
          mainExp: "security",
          mainExpCategories: ["security", "advisory"],
          importance: 4,
        },
        {
          title: "LLM Integration",
          desc: "Research on AI implementation for cybersecurity applications.",
          mainExp: "research",
          mainExpCategories: ["research", "development"],
          importance: 4,
        },
        {
          title: "Network Assessment and Testing",
          desc: "Performed network security assessments and penetration testing.",
          mainExp: "security",
          mainExpCategories: ["security", "delivery"],
          importance: 4,
        },
        {
          title: "Cloud Web Testing",
          desc: "Conducted security testing for cloud-hosted web applications.",
          mainExp: "security",
          mainExpCategories: ["security", "development"],
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
    github: "https://github.com/morpheuslord/Startup-SBOM",
    tags: ["Python", "Linux", "SBOM"],
  },
  {
    id: 3,
    title: "QuadraInspect",
    description:
      "Automated approach for APK analysis with comprehensive security checks.",
    github: "https://github.com/morpheuslord/QuadraInspect",
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
  {
    id: 4,
    name: "Pavan Kumar",
    role: "Founder, Golden Fork Ventures",
    quote:
      "Chiranjeevi was hired to make our POS system and he did a fabulous job was active for all the changes we requested and made the entire system for multiple of our restraunts with the ability to make audit ready financial reports.",
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
