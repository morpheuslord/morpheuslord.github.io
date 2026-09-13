// Complete Skills Data from Source File

export interface Experience {
  title: string;
  period: string;
  color: string;
  skills: Record<string, number>;
}

export interface SkillGraph {
  header: string;
  captions: string[];
  values: number[];
  color: string;
  description?: string;
}

export interface SkillDetail {
  name: string;
  level: number;
  description?: string;
  tools?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  skills: SkillDetail[];
}

// Experience data for skill derivation
export const experiences: Experience[] = [
  {
    title: "Security Engineer Intern (Cybersecurity, then Offensive Security) – Avercyber",
    period: "May 2023 - Mar 2024",
    color: "#ff6b6b",
    skills: {
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "SQL": 0.7,
      "C/C++/Java": 0.3,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "API Development": 0.7,
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Metasploit": 0.75,
      "Burp Suite": 0.9,
      "OWASP": 0.8,
      "OSINT": 0.75,
      "Vulnerability Assessment": 0.85,
      "Penetration Testing": 0.8,
      "Network Security": 0.85,
      "Risk Assessment": 0.75,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.7,
      "AWS": 0.8,
      "Azure": 0.5,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      "Terraform": 0.8,
      "Infrastructure as Code": 0.7,
      "CI/CD": 0.6,
      "Syft (SBOM)": 0.7,
      "Supply-Chain Security": 0.7,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "RAG & Agentic AI": 0.9,
      "Prompt Engineering": 0.9,
      "Technical Documentation": 0.95,
      "LaTeX/TexStudio": 0.95,
      "Project Management": 0.8,
      "Postman": 0.7,
      "Slack": 0.9,
      "Jira": 0.7,
    }
  },
  {
    title: "Freelance Full Stack Developer & Researcher",
    period: "Mar 2024 - Oct 2024",
    color: "#45b7d1",
    skills: {
      "Python": 0.95,
      "FastAPI": 0.85,
      "Node.js": 0.75,
      "JavaScript": 0.75,
      "React/Next.js": 0.75,
      "MongoDB": 0.8,
      "Redis": 0.75,
      "REST API Design": 0.85,
      "Proxmox VE": 0.8,
      "LXC Containers": 0.8,
      "Tailscale (Mesh VPN)": 0.8,
      "Vercel": 0.7,
      "VPS Management": 0.8,
      "System Architecture Design": 0.85,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "Linux Administration": 0.9,
      "Shell Scripting/Bash": 0.85,
      "Technical Documentation": 0.9,
      "Scientific Writing": 0.9,
      "Docker/Docker Compose": 0.8,
    }
  },
  {
    title: "Security Engineer & Backend Lead – Cygne Noir Cyber",
    period: "Oct 2024 - Sep 2026",
    color: "#6c5ce7",
    skills: {
      "Python": 0.95,
      "Python Flask": 0.8,
      "FastAPI": 0.7,
      "Python Qt5": 0.8,
      "JavaScript": 0.7,
      "HTML/CSS": 0.8,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "API Development": 0.7,
      "Redis": 0.75,
      "Proxmox VE": 0.8,
      "LXC Containers": 0.8,
      "Tailscale (Mesh VPN)": 0.8,
      "Vercel": 0.7,
      "VPS Management": 0.8,
      "OWASP": 0.8,
      "Network Security": 0.85,
      "Risk Assessment": 0.75,
      "AWS": 0.8,
      "Docker/Docker Compose": 0.85,
      "Linux Administration": 0.9,
      "CI/CD": 0.6,
      "MongoDB": 0.7,
      "Azure": 0.5,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.7,
      "Wazuh": 0.8,
      "EDR & XDR": 0.8,
      // Named DevSecOps and cloud security tooling
      "Semgrep": 0.85,
      "Gitleaks": 0.85,
      "Trivy": 0.85,
      "Checkov": 0.8,
      "Syft (SBOM)": 0.8,
      "Prowler": 0.8,
      "ScoutSuite": 0.75,
      "Kubescape": 0.75,
      "Kubernetes": 0.7,
      "DefectDojo": 0.85,
      "SARIF Normalization": 0.8,
      "EPSS / CISA KEV / SSVC": 0.85,
      "Twingate (Zero Trust)": 0.85,
      "Multi-Account Isolation": 0.85,
      "IAM Boundaries": 0.8,
      "SOC 2 Readiness": 0.8,
      "Supply-Chain Security": 0.8,
      "Pipeline Security Gates": 0.85,
      "RAG & Agentic AI": 0.9,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "LangChain/LangGraph": 0.8,
      "Prompt Engineering": 0.9,
      "RAG Ops": 0.8,
      "MCP": 0.85,
      "Vector Databases": 0.7,
      "OpenAI API": 0.75,
      "Anthropic Claude API": 0.6,
      "Knowledge Graphs": 0.8,
      "Chroma": 0.6,
      "Technical Documentation": 0.95,
      "Ontologies": 0.8,
      "LaTeX/TexStudio": 0.95,
      "Data Analysis": 0.7,
      "Pandas/NumPy": 0.7,
      "Project Management": 0.8,
      "Jira": 0.7,
      "Slack": 0.9,
      "Confluence": 0.6,
      // Backend & API Engineering (Section 8a)
      "Supabase": 0.7,
      "SQLite3": 0.75,
      "REST API Design": 0.85,
      "Authentication Systems": 0.8,
      "E2EE Architecture": 0.75,
      "Secure Backend Development": 0.85,
      "Scalable System Architecture": 0.8,
      "Admin Systems": 0.8,
      "Node.js": 0.75,
      // Cloud & Infrastructure (Section 8b)
      "Cloudflare": 0.75,
      "Cloud Cost Optimization": 0.85,
      "Cloud Infrastructure Ownership": 0.85,
      "Terraform": 0.8,
      "Infrastructure as Code": 0.7,
      // Leadership & Management (Section 8c)
      "Sprint Management": 0.8,
      "Product Lifecycle Management": 0.8,
      "Client Relationship Management": 0.8,
      "Team Coordination": 0.85,
      "Architectural Decision Making": 0.85,
      "Technical Mentorship": 0.8,
      "Recruiting": 0.75,
      "MVP-to-Production Pipeline": 0.8,
      // Security expanded (Section 8d)
      "Autonomous Threat Detection": 0.85,
      "Real-time Security Monitoring": 0.8,
      "Application Security Testing": 0.85,
      "Compliance & Regulatory": 0.75,
      "Secure Architecture Design": 0.85,
      "Ban System Architecture": 0.8,
      // Agentic AI expanded (Section 8e)
      "Autonomous Agent Design": 0.85,
      "Security Automation Pipelines": 0.8,
      "LLM Integration for Operations": 0.8,
      "Modular Control Pipelines": 0.8,
      "Agentic Workflow Design": 0.85,
    }
  },
  {
    title: "Full Stack Engineer – Golden Fork Ventures",
    period: "Feb 2026 - Present",
    color: "#feca57",
    skills: {
      "Python": 0.95,
      "FastAPI": 0.85,
      "JavaScript": 0.75,
      "React/Next.js": 0.75,
      "Node.js": 0.75,
      "REST API Design": 0.85,
      "MongoDB": 0.75,
      "SQLite3": 0.75,
      "Git/GitHub": 0.9,
      "Shell Scripting/Bash": 0.85,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      // Self-hosted infrastructure focus
      "Proxmox VE": 0.85,
      "LXC Containers": 0.85,
      "Self-Hosted Infrastructure": 0.85,
      "Custom Hardware Deployment": 0.8,
      "Tailscale (Mesh VPN)": 0.8,
      "VPS Management": 0.8,
      "System Architecture Design": 0.85,
      "Compliance & Regulatory": 0.8,
      "CI/CD": 0.6,
      "Technical Documentation": 0.9,
    }
  },
  {
    title: "Lead Security Engineer – Cygne Noir Cyber",
    period: "2026 - Present",
    color: "#00b894",
    skills: {
      // Cloud security
      "AWS": 0.85,
      "Azure": 0.55,
      "Multi-Account Isolation": 0.85,
      "IAM Boundaries": 0.8,
      "Cloudflare": 0.75,
      "Twingate (Zero Trust)": 0.85,
      // DevSecOps and CI/CD security
      "Pipeline Security Gates": 0.9,
      "Semgrep": 0.85,
      "Gitleaks": 0.85,
      "Trivy": 0.85,
      "Checkov": 0.8,
      "Syft (SBOM)": 0.8,
      "Supply-Chain Security": 0.8,
      "CI/CD": 0.85,
      // IaC and containers
      "Terraform": 0.8,
      "Docker/Docker Compose": 0.85,
      "Kubernetes": 0.7,
      "Kubescape": 0.75,
      // Detection and response
      "Wazuh": 0.8,
      "EDR & XDR": 0.8,
      "DefectDojo": 0.85,
      // Vulnerability management
      "EPSS / CISA KEV / SSVC": 0.85,
      "SARIF Normalization": 0.8,
      "Risk Assessment": 0.85,
      // Compliance
      "SOC 2 Readiness": 0.85,
      "Compliance & Regulatory": 0.85,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.8,
      // Programming and automation
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "FastAPI": 0.85,
      "REST API Design": 0.85,
      // AI security
      "RAG & Agentic AI": 0.9,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "Prompt Engineering": 0.9,
      "MCP": 0.85,
      // Leadership
      "Team Coordination": 0.85,
      "Technical Mentorship": 0.85,
      "Recruiting": 0.8,
      "Architectural Decision Making": 0.9,
      "Project Management": 0.85,
      "Technical Documentation": 0.95,
      "Jira": 0.75,
      "Slack": 0.9,
      "Linux Administration": 0.9,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "Postman": 0.75,
      "SQL": 0.7,
      "C/C++/Java": 0.3,
      "API Development": 0.85,
      "Infrastructure as Code": 0.8,
      // Offensive and assessment skills still used day to day: the triage,
      // review and pentest oversight in this role runs on the same toolset.
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Burp Suite": 0.9,
      "Metasploit": 0.75,
      "OWASP": 0.85,
      "OSINT": 0.75,
      "Vulnerability Assessment": 0.9,
      "Penetration Testing": 0.85,
      "Network Security": 0.85,
      // Research output
      "LaTeX/TexStudio": 0.95,
      "Scientific Writing": 0.9,
      "Academic Writing": 0.85,
      "Literature Review": 0.85,
      "Research Methodology": 0.85,
      "Ontologies": 0.8,
      "Knowledge Graphs": 0.8,
      "Data Analysis": 0.75,
      "Pandas/NumPy": 0.7,
      "Jupyter Notebooks": 0.8,
    }
  }
];

// All skill graphs. Ordered for a cloud security and DevSecOps reader:
// cloud first, offensive work last and explicitly labelled as background.
export const skillGraphs: SkillGraph[] = [
  {
    header: "Cloud Security & Infrastructure",
    captions: [
      "AWS",
      "Multi-Account Isolation",
      "IAM Boundaries",
      "Cloudflare",
      "Twingate (Zero Trust)",
      "Terraform",
      "Docker/Docker Compose",
      "Kubernetes",
      "Linux Administration",
      "Azure"
    ],
    values: [0.85, 0.85, 0.8, 0.75, 0.85, 0.8, 0.85, 0.7, 0.9, 0.55],
    color: "#4ecdc4",
    description: "Cloud platform security, account isolation, zero-trust access, and infrastructure as code."
  },
  {
    header: "DevSecOps & Vulnerability Management",
    captions: [
      "Pipeline Security Gates",
      "Semgrep",
      "Gitleaks",
      "Trivy",
      "Checkov",
      "Syft (SBOM)",
      "Prowler",
      "ScoutSuite",
      "Kubescape",
      "DefectDojo",
      "SARIF Normalization",
      "EPSS / CISA KEV / SSVC",
      "Supply-Chain Security",
      "CI/CD"
    ],
    values: [0.9, 0.85, 0.85, 0.85, 0.8, 0.8, 0.8, 0.75, 0.75, 0.85, 0.8, 0.85, 0.8, 0.85],
    color: "#00b894",
    description: "CI/CD security gates, scanner fleet operations, findings pipelines, and exploitation-aware prioritization."
  },
  {
    header: "Detection, Response & Compliance",
    captions: [
      "Wazuh",
      "EDR & XDR",
      "Network Security",
      "MITRE ATT&CK",
      "NIST Framework",
      "Risk Assessment",
      "SOC 2 Readiness",
      "Compliance & Regulatory"
    ],
    values: [0.8, 0.8, 0.85, 0.8, 0.7, 0.85, 0.85, 0.85],
    color: "#6c5ce7",
    description: "SIEM and EDR operations, L2 SOC coverage, control mapping, and audit readiness."
  },
  {
    header: "AI Security & Agentic Systems",
    captions: [
      "LLM (ChatGPT, Claude, LLama2)",
      "RAG & Agentic AI",
      "LangChain/LangGraph",
      "Prompt Engineering",
      "RAG Ops",
      "MCP",
      "Vector Databases",
      "OpenAI API",
      "Anthropic Claude API",
      "Knowledge Graphs",
      "Chroma"
    ],
    values: [0.9, 0.9, 0.8, 0.9, 0.8, 0.85, 0.7, 0.75, 0.6, 0.8, 0.6],
    color: "#45b7d1",
    description: "Securing agentic pipelines, LLM-assisted triage and enrichment, and agent threat surface."
  },
  {
    header: "Programming & Backend",
    captions: [
      "Python",
      "Shell Scripting/Bash",
      "FastAPI",
      "REST API Design",
      "E2EE Architecture",
      "Python Flask",
      "Python Qt5",
      "JavaScript",
      "SQL",
      "HTML/CSS",
      "Git/GitHub",
      "C/C++/Java"
    ],
    values: [0.95, 0.85, 0.85, 0.85, 0.75, 0.8, 0.8, 0.7, 0.7, 0.8, 0.9, 0.3],
    color: "#feca57",
    description: "Production backend authorship, security tooling, and automation."
  },
  {
    header: "Self-Hosted Infrastructure",
    captions: [
      "Proxmox VE",
      "LXC Containers",
      "Self-Hosted Infrastructure",
      "Tailscale (Mesh VPN)",
      "VPS Management",
      "Custom Hardware Deployment"
    ],
    values: [0.85, 0.85, 0.85, 0.8, 0.8, 0.8],
    color: "#48dbfb",
    description: "Hypervisor management, per-service isolation, and zero-ingress remote access on owned hardware."
  },
  {
    header: "Research & Documentation",
    captions: [
      "LaTeX/TexStudio",
      "Scientific Writing",
      "Technical Documentation",
      "Academic Writing",
      "Literature Review",
      "Research Methodology",
      "Ontologies",
      "Data Analysis",
      "Pandas/NumPy",
      "Jupyter Notebooks"
    ],
    values: [0.95, 0.9, 0.95, 0.85, 0.8, 0.8, 0.8, 0.7, 0.7, 0.8],
    color: "#ff9ff3",
    description: "Academic research, technical writing, and data analysis methodologies."
  },
  {
    header: "Offensive Security (background)",
    captions: [
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Metasploit",
      "OWASP",
      "Vulnerability Assessment",
      "Penetration Testing",
      "OSINT"
    ],
    values: [0.9, 0.9, 0.85, 0.75, 0.8, 0.85, 0.8, 0.75],
    color: "#ff6b6b",
    description: "Earlier offensive work. It explains the triage judgment; it is not a current capability claim."
  }
];

// Detailed skill categories for modal display
export const skillCategories: SkillCategory[] = [
  {
    id: "cloud",
    name: "Cloud Security & Infrastructure",
    description: "Cloud platform security, account isolation, zero-trust access, and infrastructure as code.",
    color: "#4ecdc4",
    icon: "cloud",
    skills: [
      { name: "AWS", level: 85, description: "Amazon Web Services security and infrastructure, including per-client account isolation.", tools: ["EC2", "S3", "IAM", "VPC", "Organizations"] },
      { name: "Multi-Account Isolation", level: 85, description: "One client per AWS account so scan input and findings never cross a tenant boundary.", tools: ["AWS Organizations", "SCPs", "Cross-Account Roles"] },
      { name: "IAM Boundaries", level: 80, description: "Least-privilege role design and permission boundaries across client accounts.", tools: ["IAM Policies", "Permission Boundaries", "Role Assumption"] },
      { name: "Twingate (Zero Trust)", level: 85, description: "Per-resource authorization for production access, replacing network-level VPN reach.", tools: ["Resource Policies", "Connectors", "Access Groups"] },
      { name: "Cloudflare", level: 75, description: "Edge security and DNS management for client-facing deployments.", tools: ["WAF", "DNS", "Access", "Tunnels"] },
      { name: "Terraform", level: 80, description: "Infrastructure as Code for cloud provisioning.", tools: ["HCL", "State Management", "Modules"] },
      { name: "Infrastructure as Code", level: 70, description: "Declarative infrastructure management.", tools: ["Terraform", "Ansible", "CloudFormation"] },
      { name: "Docker/Docker Compose", level: 85, description: "Containerization and microservices deployment.", tools: ["Multi-stage Builds", "Networks", "Volumes"] },
      { name: "Kubernetes", level: 70, description: "Container orchestration, kept deliberately small in scope.", tools: ["Deployments", "RBAC", "Network Policies"] },
      { name: "Linux Administration", level: 90, description: "System administration and security hardening.", tools: ["Ubuntu", "CentOS", "SELinux", "systemd"] },
      { name: "Cloud Cost Optimization", level: 85, description: "Cost simulation at scale and targeted optimization of storage and network spend.", tools: ["Cost Explorer", "S3 Lifecycle", "Traffic Analysis"] },
      { name: "Azure", level: 55, description: "Microsoft Azure cloud services.", tools: ["VMs", "Active Directory", "Key Vault"] },
    ],
  },
  {
    id: "devsecops",
    name: "DevSecOps & Vulnerability Management",
    description: "CI/CD security gates, scanner fleet operations, findings pipelines, and exploitation-aware prioritization.",
    color: "#00b894",
    icon: "shield-check",
    skills: [
      { name: "Pipeline Security Gates", level: 90, description: "Deciding which checks run at which pipeline stage, and what blocks a merge versus a deploy.", tools: ["GitHub Actions", "Pre-commit", "Branch Protection"] },
      { name: "Semgrep", level: 85, description: "Static analysis for application code in CI.", tools: ["Custom Rules", "SARIF Output", "CI Integration"] },
      { name: "Gitleaks", level: 85, description: "Credential and secret-leak detection across repositories and history.", tools: ["Pre-commit Hooks", "CI Scanning", "Custom Rules"] },
      { name: "Trivy", level: 85, description: "Container, filesystem, and dependency vulnerability scanning.", tools: ["Image Scanning", "IaC Scanning", "SBOM"] },
      { name: "Checkov", level: 80, description: "Infrastructure-as-code misconfiguration scanning.", tools: ["Terraform", "Custom Policies", "CI Integration"] },
      { name: "Syft (SBOM)", level: 80, description: "Software bill of materials generation for supply-chain visibility.", tools: ["SPDX", "CycloneDX", "Grype"] },
      { name: "Prowler", level: 80, description: "AWS security posture assessment across client accounts.", tools: ["CIS Benchmarks", "Custom Checks", "Multi-Account"] },
      { name: "ScoutSuite", level: 75, description: "Multi-cloud security auditing and posture reporting.", tools: ["AWS", "Azure", "Reporting"] },
      { name: "Kubescape", level: 75, description: "Kubernetes cluster and manifest security scanning.", tools: ["NSA Framework", "MITRE Controls", "CI Integration"] },
      { name: "DefectDojo", level: 85, description: "Central findings hub with deduplication and lifecycle tracking.", tools: ["Bidirectional JIRA", "Importers", "Dashboards"] },
      { name: "SARIF Normalization", level: 80, description: "Normalizing heterogeneous scanner output into one comparable format.", tools: ["SARIF", "Parsers", "Deduplication"] },
      { name: "EPSS / CISA KEV / SSVC", level: 85, description: "Exploitation-aware prioritization, so known-exploited findings outrank theoretical criticals.", tools: ["EPSS Scores", "KEV Catalog", "SSVC Decision Trees"] },
      { name: "Supply-Chain Security", level: 80, description: "Dependency and build-pipeline risk analysis.", tools: ["SBOM", "Provenance", "Dependency Pinning"] },
      { name: "CI/CD", level: 85, description: "Continuous integration and deployment pipelines with security gates in place.", tools: ["GitHub Actions", "Jenkins", "GitLab CI"] },
    ],
  },
  {
    id: "detection",
    name: "Detection, Response & Compliance",
    description: "SIEM and EDR operations, L2 SOC coverage, control mapping, and audit readiness.",
    color: "#6c5ce7",
    icon: "radar",
    skills: [
      { name: "Wazuh", level: 80, description: "Open-source security monitoring deployed across client environments.", tools: ["SIEM", "Log Analysis", "Threat Detection"] },
      { name: "EDR & XDR", level: 80, description: "Endpoint detection and extended detection response.", tools: ["CrowdStrike", "Carbon Black", "Elastic Security"] },
      { name: "Network Security", level: 85, description: "Infrastructure security and defense strategies.", tools: ["Firewalls", "IDS/IPS", "VPNs", "WAF"] },
      { name: "MITRE ATT&CK", level: 80, description: "Adversary tactics and techniques knowledge base.", tools: ["Navigator", "TTPs", "Detection"] },
      { name: "NIST Framework", level: 70, description: "Cybersecurity framework for risk management.", tools: ["CSF", "800-53", "Risk Assessment"] },
      { name: "Risk Assessment", level: 85, description: "Evaluating and prioritizing security risks against real business impact.", tools: ["FAIR", "CVSS", "Risk Matrices"] },
      { name: "SOC 2 Readiness", level: 85, description: "Control mapping, gap remediation, and audit preparation across deployed environments.", tools: ["Drata", "Control Mapping", "Evidence Collection"] },
      { name: "Compliance & Regulatory", level: 85, description: "Delivery for clients under EU regulatory regimes.", tools: ["DORA", "NIS2", "GDPR"] },
    ],
  },
  {
    id: "ai",
    name: "AI Security & Agentic Systems",
    description: "Securing agentic pipelines, LLM-assisted triage and enrichment, and agent threat surface.",
    color: "#45b7d1",
    icon: "brain",
    skills: [
      { name: "LLM (ChatGPT, Claude, LLama2)", level: 90, description: "Working with large language models for various applications.", tools: ["GPT-4", "Claude 3", "Llama 3", "Mistral"] },
      { name: "RAG & Agentic AI", level: 90, description: "Building and securing retrieval-augmented and autonomous AI systems.", tools: ["Vector Search", "Agent Frameworks", "Tool Use"] },
      { name: "LangChain/LangGraph", level: 80, description: "Framework for developing LLM-powered applications.", tools: ["Chains", "Agents", "Memory", "Graphs"] },
      { name: "Prompt Engineering", level: 90, description: "Designing effective prompts for AI systems.", tools: ["Few-shot", "Chain-of-Thought", "System Prompts"] },
      { name: "RAG Ops", level: 80, description: "Operationalizing retrieval-augmented generation systems.", tools: ["Embeddings", "Chunking", "Reranking"] },
      { name: "MCP", level: 85, description: "Model Context Protocol for AI integration.", tools: ["Tool Use", "Function Calling", "Servers"] },
      { name: "Vector Databases", level: 70, description: "Vector databases for semantic search and RAG.", tools: ["Pinecone", "Weaviate", "ChromaDB", "Qdrant"] },
      { name: "OpenAI API", level: 75, description: "OpenAI's API for GPT models.", tools: ["Chat Completions", "Embeddings", "Fine-tuning"] },
      { name: "Anthropic Claude API", level: 60, description: "Anthropic's Claude API.", tools: ["Messages API", "Vision", "Tool Use"] },
      { name: "Knowledge Graphs", level: 80, description: "Graph-based knowledge representation.", tools: ["Neo4j", "Ontologies", "RDF"] },
      { name: "Chroma", level: 60, description: "Open-source embedding database.", tools: ["Collections", "Queries", "Persistence"] },
    ],
  },
  {
    id: "programming",
    name: "Programming & Backend",
    description: "Production backend authorship, security tooling, and automation. I write the code I secure.",
    color: "#feca57",
    icon: "code",
    skills: [
      { name: "Python", level: 95, description: "Primary language for security tools, automation, and AI integrations.", tools: ["Flask", "FastAPI", "PyQt5", "Requests", "Pydantic"] },
      { name: "Shell Scripting/Bash", level: 85, description: "System administration and automation scripting.", tools: ["Zsh", "GNU Utils", "Cron", "AWK", "Sed"] },
      { name: "FastAPI", level: 85, description: "Async Python framework behind the production application backend.", tools: ["Pydantic", "Starlette", "Uvicorn"] },
      { name: "REST API Design", level: 85, description: "Designing and building robust API systems.", tools: ["REST", "OpenAPI", "Auth Flows"] },
      { name: "E2EE Architecture", level: 75, description: "End-to-end encrypted API backend development and secure communication design.", tools: ["Key Exchange", "Envelope Encryption", "Zero-Knowledge Patterns"] },
      { name: "Python Flask", level: 80, description: "Web framework for building RESTful APIs.", tools: ["SQLAlchemy", "Jinja2", "Flask-JWT"] },
      { name: "Python Qt5", level: 80, description: "Desktop GUI application development.", tools: ["PyQt5", "Qt Designer", "QML"] },
      { name: "JavaScript", level: 70, description: "Frontend development and Node.js applications.", tools: ["React", "Node.js", "Express"] },
      { name: "SQL", level: 70, description: "Database querying and management.", tools: ["PostgreSQL", "MySQL", "SQLite"] },
      { name: "HTML/CSS", level: 80, description: "Web markup and styling.", tools: ["Tailwind", "SCSS", "Flexbox"] },
      { name: "Git/GitHub", level: 90, description: "Version control and collaborative development.", tools: ["GitHub Actions", "Git Flow", "CI/CD"] },
      { name: "API Development", level: 70, description: "Designing and building robust API systems.", tools: ["REST", "GraphQL", "OpenAPI"] },
      { name: "C/C++/Java", level: 30, description: "Low-level systems programming fundamentals.", tools: ["GCC", "Make", "JDK"] },
    ],
  },
  {
    id: "self-hosted",
    name: "Self-Hosted Infrastructure",
    description: "Hypervisor management, per-service isolation, and zero-ingress remote access on owned hardware.",
    color: "#48dbfb",
    icon: "server",
    skills: [
      { name: "Proxmox VE", level: 85, description: "Type-1 hypervisor for self-hosted virtualization and container hosting.", tools: ["LXC", "VMs", "Backups", "Clustering"] },
      { name: "LXC Containers", level: 85, description: "Lightweight per-service container isolation on self-hosted hypervisors.", tools: ["Templates", "Snapshots", "Resource Limits"] },
      { name: "Self-Hosted Infrastructure", level: 85, description: "Designing and operating self-hosted server environments on custom hardware for production workloads.", tools: ["Proxmox VE", "Custom Hardware", "Reverse Proxies", "On-Prem Deployment"] },
      { name: "Custom Hardware Deployment", level: 80, description: "On-premise provisioning, networking, and edge deployment.", tools: ["Bare Metal", "Networking", "Edge"] },
      { name: "Tailscale (Mesh VPN)", level: 80, description: "Zero-config mesh VPN for secure remote access with no public ingress.", tools: ["WireGuard", "ACLs", "Subnet Routing"] },
      { name: "VPS Management", level: 80, description: "Provisioning, hardening, and maintaining virtual private servers.", tools: ["SSH Hardening", "Nginx", "systemd", "Firewalls"] },
      { name: "MongoDB", level: 70, description: "NoSQL document database.", tools: ["Atlas", "Mongoose", "Aggregations"] },
    ],
  },
  {
    id: "research",
    name: "Research & Documentation",
    description: "Academic research, technical writing, and data analysis methodologies.",
    color: "#48dbfb",
    icon: "book",
    skills: [
      { name: "LaTeX/TexStudio", level: 95, description: "Professional typesetting for academic documents.", tools: ["BibTeX", "TikZ", "Beamer"] },
      { name: "Scientific Writing", level: 90, description: "Writing research papers and technical reports.", tools: ["IEEE", "ACM", "Springer Formats"] },
      { name: "Technical Documentation", level: 95, description: "Creating comprehensive technical documentation.", tools: ["Markdown", "Docusaurus", "GitBook"] },
      { name: "Academic Writing", level: 85, description: "Scholarly writing for publications.", tools: ["Zotero", "Mendeley", "Citations"] },
      { name: "Literature Review", level: 80, description: "Systematic review of existing research.", tools: ["Google Scholar", "Scopus", "Web of Science"] },
      { name: "Research Methodology", level: 80, description: "Designing and conducting research studies.", tools: ["Qualitative", "Quantitative", "Mixed Methods"] },
      { name: "Ontologies", level: 80, description: "Knowledge representation and semantic modeling.", tools: ["OWL", "Protégé", "RDF/RDFS"] },
      { name: "Data Analysis", level: 70, description: "Statistical analysis and data interpretation.", tools: ["Python", "R", "SPSS"] },
      { name: "Pandas/NumPy", level: 70, description: "Python data manipulation libraries.", tools: ["DataFrames", "Arrays", "Vectorization"] },
      { name: "Jupyter Notebooks", level: 80, description: "Interactive computing and documentation.", tools: ["JupyterLab", "Colab", "nbconvert"] },
    ],
  },
  {
    id: "offensive",
    name: "Offensive Security (background)",
    description: "Earlier offensive work. It explains the triage judgment; it is not a current capability claim.",
    color: "#ff6b6b",
    icon: "target",
    skills: [
      { name: "Burp Suite", level: 90, description: "Web application security testing and vulnerability scanning.", tools: ["Intruder", "Repeater", "Decoder", "Extensions"] },
      { name: "Nmap", level: 90, description: "Network discovery and security auditing.", tools: ["NSE Scripts", "Service Detection", "OS Fingerprinting"] },
      { name: "Wireshark", level: 85, description: "Network protocol analysis and traffic inspection.", tools: ["Packet Analysis", "Protocol Decoding", "TShark"] },
      { name: "Metasploit", level: 75, description: "Exploitation framework for penetration testing.", tools: ["Meterpreter", "Auxiliary Modules", "Post-Exploitation"] },
      { name: "OWASP", level: 80, description: "Web application security standards and methodologies.", tools: ["ZAP", "Top 10", "ASVS", "Testing Guide"] },
      { name: "Vulnerability Assessment", level: 85, description: "Systematic security evaluation and risk identification.", tools: ["Nessus", "OpenVAS", "Qualys"] },
      { name: "Penetration Testing", level: 80, description: "White-box and black-box engagements, manual and automated code review, and client report sign-off.", tools: ["Kali Linux", "Parrot OS", "Custom Scripts"] },
      { name: "OSINT", level: 75, description: "Open-source intelligence gathering.", tools: ["Maltego", "theHarvester", "Shodan"] },
    ],
  },
  {
    id: "tools",
    name: "Tools & Collaboration",
    description: "Project management, team collaboration, and workflow optimization.",
    color: "#ff9ff3",
    icon: "workflow",
    skills: [
      { name: "Jira", level: 75, description: "Project and issue tracking, wired bidirectionally into DefectDojo findings.", tools: ["Scrum Boards", "Sprints", "Workflows"] },
      { name: "Confluence", level: 60, description: "Team collaboration and documentation.", tools: ["Spaces", "Templates", "Macros"] },
      { name: "Slack", level: 90, description: "Team communication platform.", tools: ["Channels", "Integrations", "Bots"] },
      { name: "Project Management", level: 85, description: "Planning and executing projects.", tools: ["Agile", "Scrum", "Kanban"] },
    ],
  },
];

// Get skill derivation from experiences
export const getSkillDerivation = (skillName: string): { experience: string; period: string; color: string; contribution: number }[] => {
  return experiences.map(exp => ({
    experience: exp.title.split(' – ')[0],
    period: exp.period,
    color: exp.color,
    contribution: exp.skills[skillName] || 0
  })).filter(item => item.contribution > 0);
};
