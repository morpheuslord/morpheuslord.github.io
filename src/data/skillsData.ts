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
    title: "Cybersecurity Engineer Intern – Averlon/Avercyber",
    period: "May 2023 - Jul 2023",
    color: "#ff6b6b",
    skills: {
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "SQL": 0.7,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Metasploit": 0.75,
      "Burp Suite": 0.9,
      "OWASP": 0.8,
      "Vulnerability Assessment": 0.85,
      "Penetration Testing": 0.8,
      "OSINT": 0.75,
      "Network Security": 0.85,
      "Risk Assessment": 0.75,
      "AWS": 0.8,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      "Terraform": 0.8,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "RAG & Agentic AI": 0.9,
      "Technical Documentation": 0.95,
      "LaTeX/TexStudio": 0.95,
      "Postman": 0.7,
      "Slack": 0.9,
      "Jira": 0.7,
    }
  },
  {
    title: "Offensive Security Engineer Intern – Averlon/Avercyber",
    period: "Jul 2023 - Mar 2024",
    color: "#4ecdc4",
    skills: {
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "C/C++/Java": 0.3,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "API Development": 0.7,
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Metasploit": 0.75,
      "Burp Suite": 0.9,
      "OSINT": 0.75,
      "Penetration Testing": 0.8,
      "Network Security": 0.85,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.7,
      "AWS": 0.8,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      "Terraform": 0.8,
      "Infrastructure as Code": 0.7,
      "CI/CD": 0.6,
      "Prompt Engineering": 0.9,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "Technical Documentation": 0.95,
      "LaTeX/TexStudio": 0.95,
      "Project Management": 0.8,
      "Postman": 0.7,
      "Slack": 0.9,
      "Jira": 0.7,
    }
  },
  {
    title: "Freelance Researcher & Developer",
    period: "Mar 2024 - Oct 2024",
    color: "#45b7d1",
    skills: {
      "Python": 0.95,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "HTML/CSS": 0.8,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "Prompt Engineering": 0.9,
      "RAG & Agentic AI": 0.9,
      "LaTeX/TexStudio": 0.95,
      "Scientific Writing": 0.9,
      "Technical Documentation": 0.95,
      "Academic Writing": 0.85,
      "Literature Review": 0.8,
      "Research Methodology": 0.8,
      "Data Analysis": 0.7,
      "Pandas/NumPy": 0.7,
      "Jupyter Notebooks": 0.8,
      "Linux Administration": 0.9,
      "Project Management": 0.8,
      "Slack": 0.9,
    }
  },
  {
    title: "CyberSecurity Engineer – Cygne Noir Cyber",
    period: "Oct 2024 - Present",
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
    }
  }
];

// All 6 Skill Graphs from source file
export const skillGraphs: SkillGraph[] = [
  {
    header: "Programming & Development",
    captions: [
      "Python",
      "Shell Scripting/Bash",
      "JavaScript",
      "C/C++/Java",
      "Python Flask",
      "FastAPI",
      "Python Qt5",
      "SQL",
      "HTML/CSS",
      "Git/GitHub",
      "VS Code",
      "API Development"
    ],
    values: [0.95, 0.85, 0.7, 0.3, 0.8, 0.7, 0.8, 0.7, 0.8, 0.9, 0.9, 0.7],
    color: "#6c5ce7",
    description: "Core development skills spanning backend systems, automation, and API design."
  },
  {
    header: "Cybersecurity & Penetration Testing",
    captions: [
      "Nmap",
      "Wireshark",
      "Metasploit",
      "Burp Suite",
      "OWASP",
      "Vulnerability Assessment",
      "Penetration Testing",
      "OSINT",
      "Network Security",
      "NIST Framework",
      "MITRE ATT&CK",
      "Risk Assessment",
      "Wazuh",
      "EDR & XDR"
    ],
    values: [0.9, 0.85, 0.75, 0.9, 0.8, 0.85, 0.8, 0.75, 0.85, 0.7, 0.8, 0.75, 0.8, 0.8],
    color: "#ff6b6b",
    description: "Offensive security, vulnerability assessment, and red team operations."
  },
  {
    header: "Cloud & Infrastructure",
    captions: [
      "AWS",
      "Docker/Docker Compose",
      "Terraform",
      "Linux Administration",
      "Azure",
      "CI/CD",
      "Infrastructure as Code",
      "MongoDB"
    ],
    values: [0.8, 0.85, 0.8, 0.9, 0.5, 0.6, 0.7, 0.7],
    color: "#4ecdc4",
    description: "Cloud platforms, containerization, and infrastructure as code."
  },
  {
    header: "AI & Machine Learning",
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
    description: "Large language models, agentic systems, and AI-powered security tools."
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
    color: "#48dbfb",
    description: "Academic research, technical writing, and data analysis methodologies."
  },
  {
    header: "Tools & Collaboration",
    captions: [
      "Jira",
      "Confluence",
      "Slack",
      "Project Management"
    ],
    values: [0.6, 0.6, 0.9, 0.8],
    color: "#ff9ff3",
    description: "Project management, team collaboration, and workflow optimization."
  }
];

// Detailed skill categories for modal display
export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    name: "Programming & Development",
    description: "Core development skills spanning backend systems, automation, and API design.",
    color: "#6c5ce7",
    icon: "code",
    skills: [
      { name: "Python", level: 95, description: "Primary language for security tools, automation, and AI integrations.", tools: ["Flask", "FastAPI", "PyQt5", "Requests", "Pydantic"] },
      { name: "Shell Scripting/Bash", level: 85, description: "System administration and automation scripting.", tools: ["Zsh", "GNU Utils", "Cron", "AWK", "Sed"] },
      { name: "JavaScript", level: 70, description: "Frontend development and Node.js applications.", tools: ["React", "Node.js", "Express"] },
      { name: "Python Flask", level: 80, description: "Web framework for building RESTful APIs.", tools: ["SQLAlchemy", "Jinja2", "Flask-JWT"] },
      { name: "FastAPI", level: 70, description: "Modern async Python framework for high-performance APIs.", tools: ["Pydantic", "Starlette", "Uvicorn"] },
      { name: "Python Qt5", level: 80, description: "Desktop GUI application development.", tools: ["PyQt5", "Qt Designer", "QML"] },
      { name: "SQL", level: 70, description: "Database querying and management.", tools: ["PostgreSQL", "MySQL", "SQLite"] },
      { name: "HTML/CSS", level: 80, description: "Web markup and styling.", tools: ["Tailwind", "SCSS", "Flexbox"] },
      { name: "Git/GitHub", level: 90, description: "Version control and collaborative development.", tools: ["GitHub Actions", "Git Flow", "CI/CD"] },
      { name: "API Development", level: 70, description: "Designing and building robust API systems.", tools: ["REST", "GraphQL", "OpenAPI"] },
      { name: "C/C++/Java", level: 30, description: "Low-level systems programming fundamentals.", tools: ["GCC", "Make", "JDK"] },
    ],
  },
  {
    id: "security",
    name: "Cybersecurity & Pen Testing",
    description: "Offensive security, vulnerability assessment, and red team operations.",
    color: "#ff6b6b",
    icon: "shield",
    skills: [
      { name: "Nmap", level: 90, description: "Network discovery and security auditing.", tools: ["NSE Scripts", "Service Detection", "OS Fingerprinting"] },
      { name: "Wireshark", level: 85, description: "Network protocol analysis and traffic inspection.", tools: ["Packet Analysis", "Protocol Decoding", "TShark"] },
      { name: "Metasploit", level: 75, description: "Exploitation framework for penetration testing.", tools: ["Meterpreter", "Auxiliary Modules", "Post-Exploitation"] },
      { name: "Burp Suite", level: 90, description: "Web application security testing and vulnerability scanning.", tools: ["Intruder", "Repeater", "Decoder", "Extensions"] },
      { name: "OWASP", level: 80, description: "Web application security standards and methodologies.", tools: ["ZAP", "Top 10", "ASVS", "Testing Guide"] },
      { name: "Vulnerability Assessment", level: 85, description: "Systematic security evaluation and risk identification.", tools: ["Nessus", "OpenVAS", "Qualys"] },
      { name: "Penetration Testing", level: 80, description: "Authorized simulated attacks to evaluate security.", tools: ["Kali Linux", "Parrot OS", "Custom Scripts"] },
      { name: "OSINT", level: 75, description: "Open-source intelligence gathering.", tools: ["Maltego", "theHarvester", "Shodan"] },
      { name: "Network Security", level: 85, description: "Infrastructure security and defense strategies.", tools: ["Firewalls", "IDS/IPS", "VPNs", "WAF"] },
      { name: "NIST Framework", level: 70, description: "Cybersecurity framework for risk management.", tools: ["CSF", "800-53", "Risk Assessment"] },
      { name: "MITRE ATT&CK", level: 80, description: "Adversary tactics and techniques knowledge base.", tools: ["Navigator", "TTPs", "Detection"] },
      { name: "Risk Assessment", level: 75, description: "Evaluating and prioritizing security risks.", tools: ["FAIR", "CVSS", "Risk Matrices"] },
      { name: "Wazuh", level: 80, description: "Open-source security monitoring platform.", tools: ["SIEM", "Log Analysis", "Threat Detection"] },
      { name: "EDR & XDR", level: 80, description: "Endpoint detection and extended detection response.", tools: ["CrowdStrike", "Carbon Black", "Elastic Security"] },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure",
    description: "Cloud platforms, containerization, and infrastructure as code.",
    color: "#4ecdc4",
    icon: "cloud",
    skills: [
      { name: "AWS", level: 80, description: "Amazon Web Services cloud infrastructure.", tools: ["EC2", "S3", "Lambda", "IAM", "VPC"] },
      { name: "Docker/Docker Compose", level: 85, description: "Containerization and microservices deployment.", tools: ["Multi-stage Builds", "Networks", "Volumes"] },
      { name: "Terraform", level: 80, description: "Infrastructure as Code for cloud provisioning.", tools: ["HCL", "State Management", "Modules"] },
      { name: "Linux Administration", level: 90, description: "System administration and security hardening.", tools: ["Ubuntu", "CentOS", "SELinux", "systemd"] },
      { name: "Azure", level: 50, description: "Microsoft Azure cloud services.", tools: ["VMs", "Active Directory", "Key Vault"] },
      { name: "CI/CD", level: 60, description: "Continuous integration and deployment pipelines.", tools: ["GitHub Actions", "Jenkins", "GitLab CI"] },
      { name: "Infrastructure as Code", level: 70, description: "Declarative infrastructure management.", tools: ["Terraform", "Ansible", "CloudFormation"] },
      { name: "MongoDB", level: 70, description: "NoSQL document database.", tools: ["Atlas", "Mongoose", "Aggregations"] },
    ],
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    description: "Large language models, agentic systems, and AI-powered security tools.",
    color: "#45b7d1",
    icon: "brain",
    skills: [
      { name: "LLM (ChatGPT, Claude, LLama2)", level: 90, description: "Working with large language models for various applications.", tools: ["GPT-4", "Claude 3", "Llama 3", "Mistral"] },
      { name: "RAG & Agentic AI", level: 90, description: "Building retrieval-augmented and autonomous AI systems.", tools: ["Vector Search", "Agent Frameworks", "Tool Use"] },
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
    id: "tools",
    name: "Tools & Collaboration",
    description: "Project management, team collaboration, and workflow optimization.",
    color: "#ff9ff3",
    icon: "workflow",
    skills: [
      { name: "Jira", level: 60, description: "Project and issue tracking.", tools: ["Scrum Boards", "Sprints", "Workflows"] },
      { name: "Confluence", level: 60, description: "Team collaboration and documentation.", tools: ["Spaces", "Templates", "Macros"] },
      { name: "Slack", level: 90, description: "Team communication platform.", tools: ["Channels", "Integrations", "Bots"] },
      { name: "Project Management", level: 80, description: "Planning and executing projects.", tools: ["Agile", "Scrum", "Kanban"] },
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
