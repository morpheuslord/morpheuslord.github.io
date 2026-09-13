// Website-only content. None of this belongs on the submittable PDF.

/** Dated "what I am working on now" block. Update the date whenever the items change. */
export const nowBlock = {
  updated: "September 2026",
  intro:
    "What I am actually working on right now. I update this every few weeks.",
  items: [
    "Getting the SOC 2 readiness work ready for an external audit. Mostly control mapping and closing gaps, and working out whether Drata is worth it.",
    "Arguing with myself about the CI/CD gates. The hard part is not which scanners run, it is deciding what is allowed to block a merge and what should only block a deploy.",
    "Still poking at PICOTTY after the Hackaday and CNX Software writeups. Right now it is over-the-air update safety, because bricking a node remotely would be a bad joke on a serial console project.",
    "Reading toward AWS Security Specialty and AZ-500. Neither is booked, so neither goes on the resume.",
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
    "Everything here runs the way I would run it for a client: each service isolated, nothing exposed to the public internet, and monitoring I actually look at. It is also where I break things first. Most of the infrastructure calls I have made at work were tested here on my own hardware, where the only person I can annoy is me.",
  stack: [
    {
      name: "Proxmox VE",
      detail: "Runs on hardware I put together myself. Every service gets its own LXC or VM, so if one gets popped it cannot walk into the others.",
    },
    {
      name: "Kubernetes",
      detail: "Only for the handful of workloads that genuinely need it. I have watched enough people run a three-node cluster for a blog.",
    },
    {
      name: "Prometheus + Grafana",
      detail: "Dashboards for host, container and service health. The useful part is the alerts, not the pretty graphs.",
    },
    {
      name: "Komodo",
      detail: "Handles container deployment across hosts. I liked it enough to build Komo.do-Hub, a mobile interface for it.",
    },
    {
      name: "Tailscale",
      detail: "Mesh VPN between my devices and the lab. Nothing is published publicly, so there is no front door to defend in the first place.",
    },
    {
      name: "Twingate",
      detail: "Per-resource access for anything I need to reach without putting a device on the mesh. This is the one I tested here for months before it went anywhere near client production.",
    },
    {
      name: "PICOTTY",
      detail: "My own serial console for the headless boxes. I built it because a node dropped off the network and I got tired of walking over with a keyboard.",
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
