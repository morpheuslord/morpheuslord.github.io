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
  title: "Lead Security Engineer",
  subtitle: "Cloud Security · DevSecOps · Secure Architecture",
  // Public, indexed page: email and a contact form only. The phone number stays
  // on the submittable PDF and off the website.
  email: "chiranjeevi.naidu@proton.me",
  linkedin: "https://www.linkedin.com/in/chiranjeevi-g-naidu/",
  github: "https://github.com/morpheuslord",
  orcid: "https://orcid.org/0000-0002-0677-0474",
  blog: "https://hackernoon.com/u/morpheuslord",
  /** The five-second answer. Rendered above the fold. */
  headline:
    "I run cloud security and DevSecOps for a managed security platform. Every client gets their own AWS account, and nothing they scan ever leaves it. I also write the backends I secure, which is rarer than it should be.",
  bio: `I am a Lead Security Engineer, three years in, working in cloud security, DevSecOps and secure architecture.

Day to day that means I own how our managed security platform is built and what stops bad code reaching production. Each client runs on a single EC2 instance inside their own AWS account. Their code and cloud metadata never leave that boundary, which was a deliberate call: it is the difference between promising tenants are separated and being able to show it. Access goes through Twingate rather than a VPN, so nobody holds standing SSH into a client box.

The scanners are the easy part. Trivy, Prowler, Checkov, ScoutSuite, Semgrep, Gitleaks and Kubescape all run, and between them they produce far more findings than any client can realistically fix. So everything lands in DefectDojo, gets normalised, syncs both ways with JIRA, and gets ranked by EPSS, CISA KEV and SSVC instead of raw CVSS. A theoretical critical nobody is exploiting should not outrank something already being used in the wild. I own the SOC 2 readiness work too.

The part that makes me useful is that I write the code I secure. I built and shipped a production app backend on my own, FastAPI on Supabase and Redis, built to scale, along with the security architecture around it. I also spent two years running a small application and API pentest function, setting the methodology and signing the client reports. That is where my sense of which findings actually matter comes from. It is background now, not the job.

On the side I am a part-time Full Stack Engineer at Golden Fork Ventures, building their compliance and operations software and running it myself on Proxmox. Seven published papers, security writing past 100,000 reads on HackerNoon, CEH v12 and CND.`,
};

export const stats = [
  { label: "Experience", value: "3 Years" },
  { label: "GitHub Stars", value: "1,665" },
  { label: "Research Papers", value: "7" },
  { label: "Certifications", value: "CEH v12, CND" },
];

export const experiences: Array<{
  id: number;
  title: string;
  company: string;
  period: string;
  duration: string;
  /** Seniority/engagement label shown as a chip. Explicit, not derived from array order. */
  level: string;
  current: boolean;
  highlights: ExperienceHighlight[];
}> = [
    {
      id: 1,
      title: "Lead Security Engineer",
      company: "Cygne Noir Cyber",
      period: "2026 - Present",
      duration: "Current role",
      level: "Lead",
      current: true,
      highlights: [
        // --- Authority and advisory ---
        {
          title: "Security sign-off authority",
          desc: "Hold sign-off on security architecture, tooling selection, and risk acceptance for the managed security platform.",
          mainExp: "advisory",
          mainExpCategories: ["advisory", "strategy", "security"],
          importance: 5,
        },
        // --- Research ---
        {
          title: "Lead security researcher",
          desc: "Own the security research track for the platform: evaluate emerging tooling and detection approaches, track vulnerability and threat intelligence, and decide what makes it into the product.",
          mainExp: "research",
          mainExpCategories: ["research", "security", "strategy", "advisory"],
          importance: 5,
        },
        {
          title: "Applied research: agentic AI security",
          desc: "Run applied research on securing agentic pipelines and on LLM-assisted triage and enrichment, including the agent and prompt threat surface, and feed the results back into the platform.",
          mainExp: "research",
          mainExpCategories: ["research", "security", "development"],
          importance: 5,
        },
        {
          title: "Published research and technical writing",
          desc: "Publish peer-reviewed research and long-form security writing: 7 papers across Springer, JETIR and FMDB, and security blogs past 100,000 cumulative reads.",
          mainExp: "research",
          mainExpCategories: ["research", "advisory", "collaboration"],
          importance: 5,
        },
        {
          title: "Tooling and detection evaluation",
          desc: "Prototype and benchmark scanners, detection rules and triage automation before they reach client deployments, including the false-positive work that decides what is worth shipping.",
          mainExp: "research",
          mainExpCategories: ["research", "security", "delivery"],
          importance: 5,
        },
        // --- Program ownership ---
        {
          title: "SOC 2 readiness program ownership",
          desc: "Own the SOC 2 readiness program across all deployed environments: control mapping, gap remediation, and evaluation of Drata for compliance automation.",
          mainExp: "security",
          mainExpCategories: ["security", "advisory", "delivery"],
          importance: 5,
        },
        {
          title: "Cloud security ownership (AWS and Azure)",
          desc: "Own cloud security across AWS and Azure client deployments, covering the per-client account isolation model, IAM boundaries, Cloudflare security and DNS, and ongoing posture management.",
          mainExp: "security",
          mainExpCategories: ["security", "strategy", "delivery"],
          importance: 5,
        },
        {
          title: "CI/CD and production DevSecOps ownership",
          desc: "Own CI/CD and production DevSecOps end to end: which gates run (Semgrep, Gitleaks, Trivy, Checkov, Syft), at which pipeline stage they run, and what blocks a merge or a deploy.",
          mainExp: "security",
          mainExpCategories: ["security", "development", "delivery", "strategy"],
          importance: 5,
        },
        // --- Leadership ---
        {
          title: "Lead the security engineering function",
          desc: "Set technical direction and working standards for the security team, run code and design review on security-critical work, and own the escalation path when something is found in production.",
          mainExp: "leadership",
          mainExpCategories: ["leadership", "strategy", "advisory"],
          importance: 5,
        },
        {
          title: "Hiring and team input",
          desc: "Hire engineers, manage freelancers, and advise the founder on team performance, promotions, and role changes.",
          mainExp: "leadership",
          mainExpCategories: ["leadership", "advisory", "strategy"],
          importance: 5,
        },
        {
          title: "Security training: 7 trainees",
          desc: "Trained 7 security trainees on the platform's scanner output, DefectDojo triage workflow, and L2 SOC escalation path.",
          mainExp: "leadership",
          mainExpCategories: ["leadership", "advisory", "collaboration"],
          importance: 4,
        },
        {
          title: "Client and stakeholder advisory",
          desc: "Present security posture, risk decisions and remediation plans directly to clients and to the founder, and translate findings into work the delivery team can act on.",
          mainExp: "collaboration",
          mainExpCategories: ["collaboration", "advisory", "delivery"],
          importance: 4,
        },
      ],
    },
    {
      id: 2,
      title: "Security Engineer & Backend Lead",
      company: "Cygne Noir Cyber",
      period: "Oct 2024 - Sep 2026",
      duration: "2 years",
      level: "Senior",
      current: false,
      highlights: [
        // --- Platform security and DevSecOps ---
        {
          title: "Platform security architecture",
          desc: "Designed the security architecture for the managed platform: one EC2 instance per client in a separate AWS account, data locality as a hard rule so no scan input leaves the client deployment, Twingate zero-trust access, and an RBAC management API. The isolation model removes cross-tenant data exposure as a class of risk.",
          mainExp: "security",
          mainExpCategories: ["security", "strategy", "development"],
          importance: 5,
        },
        {
          title: "Scanner fleet operations",
          desc: "Ran the scanner fleet across client deployments: Trivy, Prowler, Checkov, ScoutSuite, Semgrep, Gitleaks, and Kubescape.",
          mainExp: "security",
          mainExpCategories: ["security", "delivery"],
          importance: 5,
        },
        {
          title: "Findings pipeline on DefectDojo",
          desc: "Built the findings pipeline on DefectDojo as the hub, with bidirectional JIRA integration, SARIF normalization, and LLM-assisted triage enrichment, including tracing CVE misattribution on shared-CDN infrastructure to cut false positives.",
          mainExp: "security",
          mainExpCategories: ["security", "development", "delivery"],
          importance: 5,
        },
        {
          title: "Risk prioritization: EPSS, KEV, SSVC",
          desc: "Prioritized remediation with EPSS, CISA KEV, and SSVC, which moved known-exploited findings ahead of high-CVSS findings with no evidence of exploitation.",
          mainExp: "security",
          mainExpCategories: ["security", "strategy"],
          importance: 4,
        },
        {
          title: "Detection and response",
          desc: "Deployed Wazuh across client environments, integrated EDR and SIEM sources, and ran human-in-the-loop L2 SOC coverage with customer-facing incident support.",
          mainExp: "security",
          mainExpCategories: ["security", "delivery", "collaboration"],
          importance: 5,
        },
        {
          title: "Zero-trust production hardening",
          desc: "Hardened production to zero trust: moved management and administrative interfaces off the public internet behind Twingate and removed standing direct SSH access to client instances.",
          mainExp: "security",
          mainExpCategories: ["security", "development"],
          importance: 5,
        },
        {
          title: "90% projected cloud cost reduction",
          desc: "Owned AWS and Azure infrastructure and spend: ran a cost simulation at million-user scale, found S3 and network inefficiencies, and implemented optimizations projected to cut cloud costs by 90%.",
          mainExp: "strategy",
          mainExpCategories: ["strategy", "delivery", "development"],
          importance: 5,
        },
        {
          title: "Regulated EU client delivery",
          desc: "Designed security architecture for clients under EU regulatory regimes (DORA, NIS2, GDPR).",
          mainExp: "security",
          mainExpCategories: ["security", "advisory", "strategy"],
          importance: 4,
        },
        // --- Engineering and delivery leadership ---
        {
          title: "Led a 2-person pentest function",
          desc: "Led a two-person application and API penetration testing function: set direction and methodology, ran white-box and black-box engagements, performed manual and automated code review, and wrote and signed off the client-facing reports.",
          mainExp: "security",
          mainExpCategories: ["security", "leadership", "delivery"],
          importance: 4,
        },
        {
          title: "Sole backend developer, production app",
          desc: "Built and shipped the backend for a production dating application as sole backend developer and technical lead (FastAPI, Supabase, Redis, AWS), designed to scale horizontally toward millions of users, in a 5-person product team of 3 frontend engineers, 1 backend engineer, and 1 QA engineer, delegating tasks, reviewing code, and setting development pace across the 3 frontend engineers.",
          mainExp: "development",
          mainExpCategories: ["development", "leadership", "delivery"],
          importance: 5,
        },
        {
          title: "Application security architecture",
          desc: "Designed the application security architecture for that product: autonomous threat detection, monitoring, and an automated ban system for real-time abuse response, plus the architecture plans and implementation roadmaps for later phases.",
          mainExp: "security",
          mainExpCategories: ["security", "strategy", "development"],
          importance: 4,
        },
        {
          title: "Agentic AI and research",
          desc: "Built agentic workflows and modular control pipelines for security automation and threat analysis, and contributed research on E2EE systems and secure agentic AI.",
          mainExp: "research",
          mainExpCategories: ["research", "security", "development"],
          importance: 4,
        },
        {
          title: "Delivery and process",
          desc: "Ran delivery end to end: sprint management, product-lifecycle planning, the client admin command center, and product and application security testing across 6+ research initiatives, of which 4 reached MVP and 1 is live in production.",
          mainExp: "delivery",
          mainExpCategories: ["delivery", "leadership", "research"],
          importance: 4,
        },
        {
          title: "Direct client management",
          desc: "Managed clients directly through requirement-gathering sessions, change requests, and delivery communication.",
          mainExp: "collaboration",
          mainExpCategories: ["collaboration", "delivery"],
          importance: 4,
        },
        {
          title: "External representation",
          desc: "Spoke at university sessions and ran internal training for interns and employees.",
          mainExp: "advisory",
          mainExpCategories: ["advisory", "collaboration"],
          importance: 4,
        },
      ],
    },
    {
      id: 3,
      title: "Full Stack Engineer (Part-time)",
      company: "Golden Fork Ventures",
      period: "Feb 2026 - Present",
      duration: "7+ months · Part-time · Remote",
      level: "Part-time",
      current: true,
      highlights: [
        {
          title: "Compliance and operations software",
          desc: "Built and shipped the compliance and operations software the business runs on, working remotely alongside the primary role.",
          mainExp: "development",
          mainExpCategories: ["development", "delivery"],
          importance: 5,
        },
        {
          title: "On-prem provisioning and networking",
          desc: "Provisioned and deployed those systems on on-premise hardware, including networking and edge deployment.",
          mainExp: "delivery",
          mainExpCategories: ["delivery", "development"],
          importance: 5,
        },
        {
          title: "Self-hosted Proxmox VE infrastructure",
          desc: "Ran the self-hosted infrastructure on Proxmox VE with per-service LXC and VM isolation and secure remote access.",
          mainExp: "development",
          mainExpCategories: ["development", "security", "strategy"],
          importance: 5,
        },
        {
          title: "Monitoring and maintenance",
          desc: "Kept compliance-critical services available through monitoring, patching, and maintenance.",
          mainExp: "delivery",
          mainExpCategories: ["delivery", "advisory"],
          importance: 4,
        },
      ],
    },
    {
      id: 4,
      title: "Freelance Full Stack Developer & Researcher",
      company: "Independent · 4 client companies",
      period: "Mar 2024 - Oct 2024",
      duration: "4 client engagements",
      level: "Freelance",
      current: false,
      highlights: [
        {
          title: "AI and backend engineer (longest engagement)",
          desc: "Worked as the AI and backend engineer for one client across the longest of the four engagements, building and shipping Python and FastAPI services with LLM-backed processing.",
          mainExp: "development",
          mainExpCategories: ["development", "research"],
          importance: 5,
        },
        {
          title: "Insurance filing automation research",
          desc: "Researched and prototyped insurance filing automation for a second client.",
          mainExp: "research",
          mainExpCategories: ["research", "development"],
          importance: 4,
        },
        {
          title: "Online security enumeration",
          desc: "Ran online security enumeration work for a third client, the single security engagement of the four.",
          mainExp: "security",
          mainExpCategories: ["security", "research"],
          importance: 4,
        },
        {
          title: "Restaurant point-of-sale system",
          desc: "Built a restaurant point-of-sale system for a fourth client and deployed the full backend on local hardware, including the networking adjustments and edge deployment.",
          mainExp: "development",
          mainExpCategories: ["development", "delivery"],
          importance: 5,
        },
        {
          title: "Design studio site",
          desc: "Built a design studio site for a designer selling third-party products on Amazon, kept at very low hosting cost.",
          mainExp: "development",
          mainExpCategories: ["development", "collaboration"],
          importance: 4,
        },
      ],
    },
    {
      id: 5,
      title: "Security Engineer Intern (Cybersecurity, then Offensive Security)",
      company: "Avercyber Technologies",
      period: "May 2023 - Mar 2024",
      duration: "11 months · Internship",
      level: "Internship",
      current: false,
      highlights: [
        {
          title: "AWS and Azure cloud security assessments",
          desc: "Ran cloud security assessments across AWS and Azure environments, focused on misconfiguration and exposure risk.",
          mainExp: "security",
          mainExpCategories: ["security", "advisory"],
          importance: 4,
        },
        {
          title: "Terraform assessment environments",
          desc: "Built and deployed security-focused Terraform environments for assessment and research workloads.",
          mainExp: "development",
          mainExpCategories: ["development", "delivery", "security"],
          importance: 4,
        },
        {
          title: "SBOM and supply-chain research",
          desc: "Researched SBOM and supply-chain security tooling, Linux initialization behavior, and AWS security rules.",
          mainExp: "research",
          mainExpCategories: ["research", "security", "strategy"],
          importance: 4,
        },
        {
          title: "Python security tooling",
          desc: "Wrote Python security automation and red-team tooling, and supported vulnerability assessment, reporting, and remediation validation.",
          mainExp: "development",
          mainExpCategories: ["development", "security"],
          importance: 4,
        },
      ],
    },
  ];

/** Ordered for a cloud security and DevSecOps reader: cloud first, offensive
 *  work last and explicitly labelled as background. */
export const skillCategories = [
  {
    id: "cloud-security",
    name: "Cloud Security",
    skills: [
      { name: "AWS", level: 85 },
      { name: "Multi-Account Isolation", level: 85 },
      { name: "IAM Boundaries", level: 80 },
      { name: "Cloudflare", level: 75 },
      { name: "Threat Modeling", level: 80 },
      { name: "Azure", level: 55 },
    ],
  },
  {
    id: "devsecops",
    name: "DevSecOps & CI/CD Security",
    skills: [
      { name: "Pipeline Security Gates", level: 85 },
      { name: "Semgrep", level: 85 },
      { name: "Gitleaks", level: 85 },
      { name: "Trivy", level: 85 },
      { name: "Checkov", level: 80 },
      { name: "Syft / SBOM", level: 80 },
    ],
  },
  {
    id: "iac-containers",
    name: "Infrastructure as Code & Containers",
    skills: [
      { name: "Terraform", level: 80 },
      { name: "Docker", level: 85 },
      { name: "Docker Compose", level: 85 },
      { name: "Kubernetes", level: 70 },
      { name: "Kubescape", level: 75 },
    ],
  },
  {
    id: "detection",
    name: "Detection & Response Tooling",
    skills: [
      { name: "Wazuh", level: 80 },
      { name: "SIEM / EDR Integration", level: 80 },
      { name: "DefectDojo", level: 85 },
      { name: "JIRA Findings Workflow", level: 80 },
    ],
  },
  {
    id: "vuln-management",
    name: "Vulnerability Management",
    skills: [
      { name: "EPSS", level: 85 },
      { name: "CISA KEV", level: 85 },
      { name: "SSVC Prioritization", level: 80 },
      { name: "SARIF Normalization", level: 80 },
      { name: "Triage Automation", level: 85 },
    ],
  },
  {
    id: "ai-security",
    name: "AI Security & Agentic Systems",
    skills: [
      { name: "Securing Agentic Pipelines", level: 85 },
      { name: "LLM-Assisted Triage", level: 85 },
      { name: "Agent & Prompt Threat Surface", level: 80 },
      { name: "OpenAI / Llama / Ollama", level: 85 },
    ],
  },
  {
    id: "programming",
    name: "Programming & Automation",
    skills: [
      { name: "Python", level: 95 },
      { name: "Bash", level: 85 },
      { name: "FastAPI", level: 85 },
      { name: "REST API Design", level: 85 },
      { name: "E2EE Backend Development", level: 75 },
    ],
  },
  {
    id: "compliance",
    name: "Compliance & Risk",
    skills: [
      { name: "SOC 2 Readiness", level: 80 },
      { name: "Control Mapping", level: 80 },
      { name: "Audit Readiness", level: 75 },
      { name: "Regulated-Client Delivery", level: 75 },
    ],
  },
  {
    id: "offensive",
    name: "Offensive Security (background)",
    skills: [
      { name: "Web & API Pentesting", level: 85 },
      { name: "White-Box Methodology", level: 80 },
      { name: "Black-Box Methodology", level: 80 },
      { name: "Attack Surface Analysis", level: 80 },
      { name: "Network VAPT", level: 80 },
    ],
  },
  {
    id: "self-hosted",
    name: "Self-Hosted Infrastructure",
    skills: [
      { name: "Proxmox VE", level: 85 },
      { name: "LXC / VM Isolation", level: 85 },
      { name: "Komodo", level: 80 },
      { name: "Prometheus", level: 75 },
      { name: "Grafana", level: 75 },
      { name: "Tailscale", level: 80 },
    ],
  },
];

export const certifications = [
  {
    id: 1,
    title: "Certified Ethical Hacker V12",
    issuer: "EC-Council",
    certId: "ECC7349261508",
    year: "2023",
    validity: "Valid 6/2023 - 6/2027",
    verifyUrl: "https://aspen.eccouncil.org/Verify",
  },
  {
    id: 2,
    title: "Certified Network Defender",
    issuer: "EC-Council",
    certId: "ECC9327805461",
    year: "2023",
    validity: "Valid 6/2023 - 6/2027",
    verifyUrl: "https://aspen.eccouncil.org/Verify",
  },
];

export const achievements = [
  {
    title: "Third-Party Press",
    badge: "Hackaday + CNX",
    desc: "PICOTTY covered by two independent technical outlets",
  },
  {
    title: "Research Scholar",
    badge: "7 Papers",
    desc: "Springer, JETIR and FMDB, 2022 to 2026",
  },
  {
    title: "Open Source",
    badge: "1,665 Stars",
    desc: "Security and infrastructure tooling on GitHub",
  },
  {
    title: "TryHackMe Elite",
    badge: "Top 1%",
    desc: "Top-tier cybersecurity challenges",
  },
];

/** Project clusters. The labels do the positioning work: offensive work is
 *  explicitly marked as background and ordered last. Star counts are shown only
 *  at roughly 50 and above; below that the number is omitted rather than shown weak. */
export const projectClusters = [
  {
    id: "ai-security",
    name: "AI security and LLM research",
    description: "Applying language models to vulnerability analysis and triage.",
  },
  {
    id: "security-tooling",
    name: "Security tooling and analysis",
    description: "Scanners, analysis frameworks, and API-driven security tooling.",
  },
  {
    id: "systems",
    name: "Systems and infrastructure",
    description: "Hardware, fleet management, and container operations.",
  },
  {
    id: "offensive",
    name: "Offensive security internals (background)",
    description: "Earlier work on attack tooling and platform internals. Background, not a current capability claim.",
  },
] as const;

export type ProjectCluster = (typeof projectClusters)[number]["id"];

export const projects: Array<{
  id: number;
  title: string;
  description: string;
  github: string;
  tags: string[];
  cluster: ProjectCluster;
  stars?: number;
  press?: { outlet: string; url: string }[];
}> = [
  // --- AI security and LLM research (ordered by stars) ---
  {
    id: 1,
    title: "GPT-Vuln-Analyzer",
    description:
      "LLM-assisted vulnerability analysis across multiple model backends, with DNS reconnaissance, subdomain enumeration, and structured vulnerability reasoning.",
    github: "https://github.com/morpheuslord/GPT_Vuln-analyzer",
    tags: ["Python", "LLMs", "Security Analysis"],
    cluster: "ai-security",
    stars: 599,
  },
  {
    id: 2,
    title: "HackBot",
    description:
      "Agentic LLM assistant for security analysis and scan interpretation, built to support code inspection and scan-result triage.",
    github: "https://github.com/morpheuslord/HackBot",
    tags: ["Python", "LLMs", "Assistant Systems"],
    cluster: "ai-security",
    stars: 363,
  },
  {
    id: 3,
    title: "CVE-LLM-Dataset",
    description:
      "Dataset design for training and evaluating LLMs on vulnerability intelligence, exploring dataset problems specific to CVE data.",
    github: "https://github.com/morpheuslord/CVE-llm_dataset",
    tags: ["Dataset", "LLM Research", "CVE Analysis"],
    cluster: "ai-security",
    stars: 69,
  },

  // --- Security tooling and analysis (ordered by stars) ---
  {
    id: 4,
    title: "QuadraInspect",
    description:
      "Automated Android APK security analysis framework, combining several techniques to inspect permissions, components, and application behavior.",
    github: "https://github.com/morpheuslord/QuadraInspect",
    tags: ["Python", "Mobile Security", "Reverse Engineering"],
    cluster: "security-tooling",
    stars: 349,
  },
  {
    id: 5,
    title: "Nmap-API",
    description:
      "REST API wrapper around Nmap for programmatic network scanning, and the basis for the published paper on API-driven network scanning.",
    github: "https://github.com/morpheuslord/Nmap-API",
    tags: ["Python", "API Development", "Network Security"],
    cluster: "security-tooling",
    stars: 83,
  },
  {
    id: 6,
    title: "Startup-SBOM",
    description:
      "Linux boot and package analysis for startup and persistence vectors, using chroot-based inspection of RPM and DPKG metadata.",
    github: "https://github.com/morpheuslord/Startup-SBOM",
    tags: ["Python", "Linux", "SBOM"],
    cluster: "security-tooling",
  },

  // --- Systems and infrastructure ---
  {
    id: 7,
    title: "PICOTTY",
    description:
      "Networked serial console system for headless fleet management: CircuitPython on Raspberry Pi Pico nodes with W5100S Ethernet and USB HID keystroke injection, with over-the-air firmware updates, rollback protection, and canary rollout.",
    github: "https://github.com/morpheuslord/PICOTTY",
    tags: ["CircuitPython", "Python", "Embedded", "Raspberry Pi Pico"],
    cluster: "systems",
    stars: 103,
    press: [
      {
        outlet: "Hackaday",
        url: "https://hackaday.com/2026/08/02/a-kvm-without-the-v-or-the-m/",
      },
      {
        outlet: "CNX Software",
        url: "https://www.cnx-software.com/2026/08/06/picotty-project-enables-multi-target-serial-remote-management-through-raspberry-pi-pico-boards-and-pi-zero-2-w-sbc/",
      },
    ],
  },
  {
    id: 8,
    title: "Komo.do-Hub",
    description:
      "Mobile interface for the Komodo container management platform, built across frontend and backend for operational visibility into containerized environments.",
    github: "https://github.com/morpheuslord/komo.do-hub",
    tags: ["Java", "Node.js", "React Native", "React"],
    cluster: "systems",
  },

  // --- Offensive security internals (background) ---
  {
    id: 9,
    title: "WinFiHack",
    description:
      "Windows wireless stack internals and native networking library automation, focused on platform behavior and automation constraints.",
    github: "https://github.com/morpheuslord/WinFiHack",
    tags: ["Python", "WiFi", "Windows Internals"],
    cluster: "offensive",
    stars: 82,
  },
  {
    id: 10,
    title: "C2C-Server",
    description:
      "Command-and-control server demonstrating real attack communication patterns, used for controlled red-team experimentation.",
    github: "https://github.com/morpheuslord/C2C-Server",
    tags: ["Python", "C2", "Red Team"],
    cluster: "offensive",
  },
];

export const researchPapers: Array<{
  id: number;
  title: string;
  description: string;
  venue: string;
  /** null where the publication year is not yet confirmed. Never guessed. */
  year: number | null;
  link: string;
  relatedProject?: { name: string; url: string };
}> = [
  {
    id: 1,
    title:
      "Hybrid Quantum-Classical Neural Network Incorporating Attention Mechanisms for Anomaly Detection",
    description:
      "A hybrid quantum-classical architecture with attention mechanisms for anomaly detection. My contribution was the computer science and systems side: architecture, implementation, and evaluation of the detection pipeline.",
    venue: "Springer CCIS",
    year: 2026,
    link: "https://link.springer.com/chapter/10.1007/978-3-032-20447-9_13",
  },
  {
    id: 2,
    title: "ML-Driven Secure Communication for Next-Generation 6G Networks",
    description:
      "A machine learning approach to secure communication in 6G networks, covering how ML can improve security and reliability in high-speed network infrastructure. Published in 6G Cyber Security Resilience: Trends and Challenges.",
    venue: "Springer",
    year: 2025,
    link: "https://link.springer.com/chapter/10.1007/978-3-031-85008-0_6",
  },
  {
    id: 3,
    title:
      "Using Autoencoder-Driven Machine Learning for Advanced Cybersecurity Malware Detection",
    description:
      "Autoencoder-based models for malware detection on the Ember dataset, and how unsupervised feature learning finds anomalous behavior in executables. FMDB Transactions on Sustainable Intelligent Networks, Vol.1 No.4.",
    venue: "FMDB",
    year: 2024,
    link: "https://www.fmdbpub.com/uploads/articles/174600650419444.%20FTSIN-292-2024.pdf",
  },
  {
    id: 4,
    title: "Docker Based Decentralized Vulnerability Assessment",
    description:
      "A decentralized vulnerability assessment framework built on Docker containers: distributed scanning, scaling, and AI-assisted port scanning and analysis. FMDB Transactions on Sustainable Intelligent Networks, Vol.1 No.4.",
    venue: "FMDB",
    year: 2024,
    link: "https://www.fmdbpub.com/uploads/articles/174595000296104.%20FTSIN-290-2024.pdf",
  },
  {
    id: 5,
    title: "AI Based Enumeration and Exploit Suggester",
    description:
      "Using AI models in cybersecurity workflows to automate reconnaissance, vulnerability enumeration, and exploit suggestion, and to prioritize likely attack vectors. JETIR Vol.9 Issue 6.",
    venue: "JETIR",
    year: 2022,
    link: "https://www.jetir.org/view.php?paper=JETIRFM06037",
  },
  {
    id: 6,
    title: "API-Based Network Scanning",
    description:
      "An API-driven approach to network vulnerability scanning, based on the Nmap-API project. Covers stability, usability, and scaling through structured resource management and virtualized client interactions.",
    venue: "Cybersecurity & ML",
    // TODO: confirm the publication year for this paper.
    year: null,
    link: "https://drive.proton.me/urls/6P6MS0T83G#3OLWdBs3lWM1",
    relatedProject: {
      name: "Nmap-API",
      url: "https://github.com/morpheuslord/Nmap-API",
    },
  },
  {
    id: 7,
    title: "AI in Action: Exploiting the Nexus of Cybersecurity",
    description:
      "AI in modern security environments, with a focus on integrating AI-driven analysis into CI/CD pipelines for security automation, threat detection, and response.",
    venue: "Cybersecurity & ML",
    // TODO: confirm the publication year for this paper.
    year: null,
    link: "https://drive.proton.me/urls/R83Q1HJS9W#8Z8HRKh44jS0",
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
  { name: "Now", href: "#now" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Lab", href: "#homelab" },
  { name: "Research", href: "#research" },
  { name: "Services", href: "#services" },
  { name: "Articles", href: "/articles" },
  { name: "Contact", href: "#contact" },
];
