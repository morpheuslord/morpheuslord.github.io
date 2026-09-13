// Website-only content. None of this belongs on the submittable PDF.

/** Dated "what I am working on now" block. Update the date whenever the items change. */
export const nowBlock = {
  updated: "September 2026",
  intro:
    "Current focus, updated every few weeks so repeat visitors can see what has moved.",
  items: [
    "Preparing the SOC 2 readiness program for external audit: control mapping, gap remediation, and evaluating Drata for compliance automation.",
    "Tightening the CI/CD security gates on the managed platform, deciding what blocks a merge versus what blocks a deploy.",
    "Extending PICOTTY after the Hackaday and CNX Software coverage, mostly around over-the-air update safety and canary rollout.",
    "Reading toward AWS Security Specialty and AZ-500. Neither is booked yet, so neither is on the resume.",
  ],
};

/** Talks and external representation. Previously buried as one line in Honors. */
export const talks = [
  {
    id: 1,
    title: "IRDCSTEM-2023 post-conference learning session",
    venue: "Jain (Deemed-to-be University)",
    year: "2023",
    description:
      "Invited speaker at the post-conference learning session. Awarded a Certificate of Appreciation by the university.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7047232215558066176/",
  },
  {
    id: 2,
    title: "Research presentation competition, first place",
    venue: "BGS College of Engineering and Technology",
    year: "2023",
    description:
      "Won first place in the research presentation competition, awarded a Certificate of Merit.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7105769231849324544/",
  },
  {
    id: 3,
    title: "University talks representing Cygne Noir Cyber",
    venue: "Multiple universities",
    year: "2024 - 2026",
    description:
      "Spoke at university sessions on behalf of the firm, covering cloud security and the realities of security engineering work.",
    link: null,
  },
  {
    id: 4,
    title: "Internal security training",
    venue: "Cygne Noir Cyber",
    year: "2024 - 2026",
    description:
      "Trained 7 security trainees on scanner output, the DefectDojo triage workflow, and the L2 SOC escalation path, plus ongoing intern and employee training sessions.",
    link: null,
  },
];

/** The personal lab, as a writeup rather than a three-line skills entry. */
export const homelab = {
  summary:
    "A self-hosted estate that runs on the same patterns as production: per-service isolation, no public ingress, and monitoring I actually read. It is where most of the infrastructure decisions get tested before a client sees them.",
  stack: [
    {
      name: "Proxmox VE",
      detail: "Type-1 hypervisor across custom hardware, with per-service LXC and VM isolation so one compromised service does not reach the others.",
    },
    {
      name: "Kubernetes",
      detail: "Container orchestration for the workloads that need it, kept deliberately small.",
    },
    {
      name: "Prometheus + Grafana",
      detail: "Metrics and dashboards for the whole estate, including host, container, and service health.",
    },
    {
      name: "Komodo",
      detail: "Container deployment and management across hosts. Also the subject of Komo.do-Hub, the mobile interface I built for it.",
    },
    {
      name: "Tailscale",
      detail: "Mesh VPN between my own devices and the lab. Nothing is published to the public internet, so there is no inbound attack surface to defend.",
    },
    {
      name: "Twingate",
      detail: "Per-resource zero-trust access for anything I need to share or reach without putting a device on the mesh. Same pattern I run for client production access, which is where I tested it before it went anywhere near a client.",
    },
    {
      name: "PICOTTY",
      detail: "My own networked serial console for the headless machines, so a node that drops off the network can still be recovered over serial.",
    },
  ],
  writeups: [
    {
      title: "Inside My $1,000 Homelab: How I Rebuilt Big Tech Services in a Tiny Rack",
      url: "https://hackernoon.com/inside-my-1000-homelab-how-i-rebuilt-big-tech-services-in-a-tiny-rack",
    },
    {
      title: "Let's Build a Practical Home Lab for Learning and Experimentation",
      url: "https://hackernoon.com/lets-build-a-practical-home-lab-for-learning-and-experimentation",
    },
    {
      title: "PicoTTY: A KVM Without the V (or the M) for My Homelab",
      url: "https://hackernoon.com/picotty-a-kvm-without-the-v-or-the-m-for-my-homelab",
    },
  ],
};
