// Website-only content.
//
// None of this belongs on the submittable PDF. It exists because the weakest
// part of the position is that the senior scope all comes from one small
// company and cannot be verified from outside. A PDF cannot fix that; a public
// page with dated updates, named decisions and linked artifacts can.

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

/** The homelab as a writeup rather than a three-line skills entry. For an
 *  infrastructure security role this is demonstrated ownership, not a hobby. */
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
      detail: "Mesh VPN for remote access. Nothing is published to the public internet, which is the same zero-trust posture used for client production access.",
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

/** Decision log: the architecture calls, what was rejected, and why.
 *  This is the closest thing to public proof of advisory authority. */
export const decisionLog = [
  {
    id: 1,
    decision: "Twingate for production access, not a VPN",
    context:
      "Client production instances needed operator access for L2 SOC work and incident response, across separate AWS accounts with no shared network.",
    rejected: [
      "A traditional VPN into each client VPC",
      "Bastion hosts with standing SSH keys",
    ],
    reasoning:
      "A VPN grants network-level reach once a user is on it, so a single compromised operator credential exposes a whole client subnet. Bastions keep standing SSH access alive, which is the exact access class worth removing. Twingate authorizes per resource rather than per network, so operator access is scoped to the specific service and revocation is immediate.",
    tradeoff:
      "A third-party dependency now sits in the access path, and access breaks if that provider is down. Accepted because the blast radius reduction is larger than the availability risk, and break-glass paths exist.",
  },
  {
    id: 2,
    decision: "Data locality as a hard architectural rule",
    context:
      "The platform scans client code, cloud accounts and containers. Scan input is some of the most sensitive material a client has.",
    rejected: [
      "A central multi-tenant scanning cluster",
      "Shipping findings to a shared analysis backend",
    ],
    reasoning:
      "A central cluster is cheaper and much easier to operate, but it means client source and cloud metadata leave the client boundary and sit next to other clients' data. Running one EC2 instance per client inside a separate AWS account means no scan input leaves the client deployment, which removes cross-tenant data exposure as a class of risk rather than mitigating it. It also makes the answer to the regulated-client question a fact about the architecture instead of a policy promise.",
    tradeoff:
      "Higher per-client cost and more deployments to operate and patch. Accepted, and it is the reason the cost simulation work mattered.",
  },
  {
    id: 3,
    decision: "HostExec replacing Komodo and Periphery",
    context:
      "Container deployment and host-level execution on client instances needed a control path that the platform owned.",
    rejected: ["Komodo plus its Periphery agent as the production control path"],
    reasoning:
      "Komodo and Periphery are good tools and still run in my homelab, but on client instances they meant running a general-purpose management agent with broad host reach for a narrow set of operations. A purpose-built execution path exposes only the operations the platform actually needs, which is a smaller surface to reason about during an audit and a smaller one to defend.",
    tradeoff:
      "Maintaining something in-house instead of adopting a maintained upstream project. Accepted because the scope is deliberately narrow.",
  },
  {
    id: 4,
    decision: "EPSS, CISA KEV and SSVC over raw CVSS ranking",
    context:
      "The scanner fleet produces far more findings than any client can remediate, and CVSS alone sorted them badly.",
    rejected: ["Ranking remediation work by CVSS severity"],
    reasoning:
      "CVSS scores severity if a vulnerability is exploited; it says nothing about whether anyone is exploiting it. Sorting by CVSS put theoretical criticals ahead of findings with active exploitation. Layering EPSS for exploitation probability, CISA KEV for confirmed exploitation, and SSVC for the decision itself moved known-exploited findings to the front of the queue.",
    tradeoff:
      "Harder to explain to a client than a single severity number, so each prioritized finding has to carry its reasoning.",
  },
];
