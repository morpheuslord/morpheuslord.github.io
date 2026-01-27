// HackerNoon Articles Data - Complete Dataset

export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
  category: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "How AI is Changing the Cybersecurity Landscape",
    description: "Exploring AI computational models, vulnerability assessment using GPT APIs, and the evolving role of AI in security operations.",
    date: "April 3, 2023",
    readTime: "8 min",
    url: "https://hackernoon.com/how-ai-is-changing-the-cybersecurity-landscape",
    tags: ["AI", "Cybersecurity", "GPT"],
    category: "AI & Cybersecurity",
    featured: true,
  },
  {
    id: 2,
    title: "Let's Build a Practical Home Lab for Learning and Experimentation",
    description: "Detailed guide on setting up Ubuntu server, Docker, Portainer, and services like Grafana/Prometheus for security research.",
    date: "December 23, 2024",
    readTime: "12 min",
    url: "https://hackernoon.com/lets-build-a-practical-home-lab-for-learning-and-experimentation",
    tags: ["Home Lab", "Docker", "DevOps"],
    category: "Tools & Automation",
    featured: true,
  },
  {
    id: 3,
    title: "All the Methods You Can Use to Hack into a Website",
    description: "Educational piece on web security vulnerabilities and offensive techniques for security professionals.",
    date: "August 17, 2021",
    readTime: "10 min",
    url: "https://hackernoon.com/all-the-methods-you-can-use-to-hack-into-a-website",
    tags: ["Web Security", "Penetration Testing", "Tutorial"],
    category: "Penetration Testing",
    featured: true,
  },
  {
    id: 4,
    title: "Using GPT for Vulnerability Analysis: A Proof of Concept",
    description: "Demonstrating how Large Language Models can be integrated into security workflows for automated vulnerability assessment.",
    date: "March 15, 2023",
    readTime: "7 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["AI", "Vulnerability Analysis", "Python"],
    category: "AI & Cybersecurity",
  },
  {
    id: 5,
    title: "Introduction to Red Team Operations",
    description: "A comprehensive guide to understanding red team methodologies and their importance in modern security.",
    date: "February 10, 2023",
    readTime: "9 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Red Team", "Security", "Methodology"],
    category: "Penetration Testing",
  },
  {
    id: 6,
    title: "Building Security Automation with Python",
    description: "How to create automated security tools using Python for efficient vulnerability scanning and reporting.",
    date: "January 5, 2023",
    readTime: "11 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Python", "Automation", "Security Tools"],
    category: "Tools & Automation",
  },
  {
    id: 7,
    title: "AWS Security Best Practices for Startups",
    description: "Essential security configurations and practices for AWS cloud environments in startup contexts.",
    date: "November 20, 2023",
    readTime: "8 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["AWS", "Cloud Security", "Best Practices"],
    category: "Cloud Security",
  },
  {
    id: 8,
    title: "Understanding LangChain for Security Applications",
    description: "Exploring how LangChain can be used to build intelligent security assistants and automation tools.",
    date: "September 8, 2023",
    readTime: "10 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["LangChain", "AI", "Security"],
    category: "AI & Cybersecurity",
  },
  {
    id: 9,
    title: "Docker Security: Hardening Your Containers",
    description: "Best practices for securing Docker containers in production environments.",
    date: "October 12, 2023",
    readTime: "7 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Docker", "Container Security", "DevSecOps"],
    category: "Cloud Security",
  },
  {
    id: 10,
    title: "OWASP Top 10: A Practical Guide",
    description: "Understanding and mitigating the most critical web application security risks.",
    date: "July 25, 2022",
    readTime: "15 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["OWASP", "Web Security", "Tutorial"],
    category: "Penetration Testing",
  },
  {
    id: 11,
    title: "Nmap Scripting Engine: Advanced Techniques",
    description: "Leveraging NSE scripts for comprehensive network reconnaissance and vulnerability detection.",
    date: "June 18, 2022",
    readTime: "9 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Nmap", "Network Security", "Scripting"],
    category: "Tools & Automation",
  },
  {
    id: 12,
    title: "Building a C2 Framework: Educational Purposes Only",
    description: "Understanding Command and Control architectures for red team training and defense.",
    date: "May 5, 2022",
    readTime: "14 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["C2", "Red Team", "Research"],
    category: "Penetration Testing",
  },
  {
    id: 13,
    title: "RAG Systems for Threat Intelligence",
    description: "Building retrieval-augmented generation systems for processing and analyzing threat intelligence feeds.",
    date: "January 15, 2024",
    readTime: "11 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["RAG", "Threat Intelligence", "AI"],
    category: "AI & Cybersecurity",
  },
  {
    id: 14,
    title: "Azure Security Fundamentals",
    description: "Getting started with Microsoft Azure security services and configurations.",
    date: "December 5, 2023",
    readTime: "8 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Azure", "Cloud", "Security"],
    category: "Cloud Security",
  },
  {
    id: 15,
    title: "Automating Penetration Testing with AI",
    description: "How AI and machine learning can enhance and automate penetration testing workflows.",
    date: "February 28, 2024",
    readTime: "12 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["AI", "Pen Testing", "Automation"],
    category: "AI & Cybersecurity",
  },
  {
    id: 16,
    title: "Kubernetes Security Best Practices",
    description: "Securing Kubernetes clusters and containerized applications in production.",
    date: "March 10, 2024",
    readTime: "10 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Kubernetes", "Container", "Security"],
    category: "Cloud Security",
  },
  {
    id: 17,
    title: "Burp Suite Extensions for Advanced Testing",
    description: "Building and using custom Burp Suite extensions for web application security testing.",
    date: "April 20, 2023",
    readTime: "9 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["Burp Suite", "Web Security", "Extensions"],
    category: "Tools & Automation",
  },
  {
    id: 18,
    title: "Understanding MITRE ATT&CK Framework",
    description: "Deep dive into the MITRE ATT&CK framework and its applications in threat detection.",
    date: "May 15, 2023",
    readTime: "13 min",
    url: "https://hackernoon.com/u/morpheuslord",
    tags: ["MITRE", "Threat Detection", "Framework"],
    category: "Penetration Testing",
  },
];

export const articleCategories = [
  { 
    name: "AI & Cybersecurity", 
    count: articles.filter(a => a.category === "AI & Cybersecurity").length, 
    icon: "brain",
    description: "Intersection of artificial intelligence and security operations"
  },
  { 
    name: "Penetration Testing", 
    count: articles.filter(a => a.category === "Penetration Testing").length, 
    icon: "shield",
    description: "Offensive security techniques and methodologies"
  },
  { 
    name: "Tools & Automation", 
    count: articles.filter(a => a.category === "Tools & Automation").length, 
    icon: "code",
    description: "Building and using security tools with Python"
  },
  { 
    name: "Cloud Security", 
    count: articles.filter(a => a.category === "Cloud Security").length, 
    icon: "cloud",
    description: "AWS, Azure, and cloud infrastructure security"
  },
];

export const authorStats = {
  totalArticles: "60+",
  totalReads: "1.5M+",
  readingTime: "1 year 5 months",
  platform: "HackerNoon",
  profileUrl: "https://hackernoon.com/u/morpheuslord",
};
