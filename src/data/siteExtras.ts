// Website-only content. None of this belongs on the submittable PDF.

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
  /**
   * What is physically in and around the rack, top down. `read` is the rack
   * figure's read-out for that machine; `at` is where in the figure's 400 × 320
   * viewBox a pointer picks it, so hovering a row can point the figure at it.
   */
  rack: [
    { read: "router", at: [229, 79], side: "right", role: "uplink, on the roof", name: "Router", detail: "The uplink, sitting on the roof. One cable down to the 2.5 GbE switch, and nothing in the lab is published past it." },
    { read: "tiny 1", at: [224, 129], side: "left", role: "Proxmox node", name: "ThinkCentre Tiny", detail: "Proxmox node, on the top shelf." },
    { read: "tiny 2", at: [220, 151], side: "left", role: "Proxmox node", name: "ThinkCentre Tiny", detail: "Proxmox node, on the shelf under it." },
    { read: "2.5g sw", at: [198, 173], side: "left", role: "backbone + patch panel", name: "2.5 GbE switch", detail: "Grandstream, patched down into its panel. The backbone: every node, the 1 GbE switch and both laptops hang off it." },
    { read: "1g sw", at: [200, 197], side: "left", role: "management + patch panel", name: "1 GbE switch", detail: "Patched into the second panel. The management side: the Pis, the access point and the four PicoTTY nodes." },
    { read: "raspis", at: [206, 224], side: "left", role: "screens + PicoTTY hub", name: "Raspberry Pis", detail: "The bottom shelf: the two Pis with screens on the front, and the Pi Zero 2 W that is PicoTTY's hub." },
    { read: "tiny 3", at: [273, 193], side: "right", role: "Proxmox node, side mount", name: "ThinkCentre Tiny", detail: "Proxmox node, bolted to the side of the rack." },
    { read: "pico", at: null, side: "right", role: "PicoTTY, on every node", name: "Pico in a USB port", detail: "One on every node: a Raspberry Pi Pico with a W5100S Ethernet HAT, so the node can be reached even when it is off the network." },
    { read: "sff", at: [136, 134], side: "left", role: "Proxmox node", name: "ThinkCentre SFF", detail: "Proxmox node, standing beside the rack." },
  ],
  /** PicoTTY, from its writeup. */
  picotty: {
    summary:
      "A KVM without the V or the M. Each node is a Raspberry Pi Pico with a WIZnet W5100S Ethernet HAT, plugged into its machine over USB, where it shows up as a serial console and a keyboard. The Ethernet chip talks to the Pico over SPI, so its one USB port stays free for the machine it looks after.",
    facts: [
      { k: "Nodes", v: "4 × Pico + W5100S, one per Proxmox box, powered from its USB port" },
      { k: "Hub", v: "Pi Zero 2 W with a Waveshare Ethernet HAT; every node keeps a connection open to it" },
      { k: "Network", v: "An isolated management VLAN; the dashboard is only reachable through Twingate" },
      { k: "Liveness", v: "A heartbeat every 5 s; a node silent for about 15 s is marked offline" },
      { k: "Cost", v: "₹8,400 for all four nodes and the hub, against ₹22,634 for one JetKVM" },
    ],
  },
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
