import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { homelab } from '@/data/siteExtras';
import { ExternalLink } from 'lucide-react';
import LabViewer from './lab/LabViewer';
import './lab/lab.css';

const { rack, topology, picotty } = homelab;

/** A device in the wiring map. */
const Node = ({ name, sub, dim = false }: { name: string; sub?: string; dim?: boolean }) => (
  <div className={`lab-node ${dim ? 'lab-node-dim' : ''}`}>
    <span className="font-mono text-xs text-foreground">{name}</span>
    {sub && <span className="font-mono text-[10px] text-muted-foreground">{sub}</span>}
  </div>
);

/** PicoTTY as a star: the hub in the middle, one Pico node per Proxmox box, a heartbeat on each link every 5 s. */
const PicoStar = () => {
  const W = 360, Hh = 230, hub = [W / 2, Hh / 2];
  const nodes = topology.picotty.map((name, i) => ({ name, x: i % 2 ? W - 62 : 62, y: i < 2 ? 46 : Hh - 46 }));
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} className="w-full h-auto" role="img" aria-label="PicoTTY: a hub in the middle, wired to a Pico node on each of the four Proxmox boxes">
      {nodes.map((n, i) => (
        <g key={n.name}>
          <line x1={hub[0]} y1={hub[1]} x2={n.x} y2={n.y} className="pico-link" />
          <line x1={n.x} y1={n.y} x2={hub[0]} y2={hub[1]} className="pico-beat" style={{ animationDelay: `${i * 1.25}s` }} />
        </g>
      ))}
      <rect x={hub[0] - 70} y={hub[1] - 21} width="140" height="42" rx="8" className="pico-box pico-hub" />
      <text x={hub[0]} y={hub[1] - 3} className="pico-text pico-strong" textAnchor="middle">hub</text>
      <text x={hub[0]} y={hub[1] + 11} className="pico-text" textAnchor="middle">Pi Zero 2 W · :8080</text>
      {nodes.map((n) => (
        <g key={n.name}>
          <rect x={n.x - 46} y={n.y - 17} width="92" height="34" rx="7" className="pico-box" />
          <text x={n.x} y={n.y - 2} className="pico-text pico-strong" textAnchor="middle">{n.name}</text>
          <text x={n.x} y={n.y + 10} className="pico-text" textAnchor="middle">Pico · USB</text>
        </g>
      ))}
    </svg>
  );
};

const Homelab = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          anime({ targets: '.homelab-header', opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutExpo' });
          anime({
            targets: '.homelab-item',
            opacity: [0, 1],
            translateY: [24, 0],
            delay: anime.stagger(50, { start: 250 }),
            duration: 650,
            easing: 'easeOutExpo',
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="homelab" ref={sectionRef} className="section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="section-title homelab-header opacity-0">Where I Test Things First</p>
          <h2 className="section-heading homelab-header opacity-0">My personal lab</h2>
        </div>
        <p className="homelab-header opacity-0 text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-14 leading-relaxed">
          {homelab.summary}
        </p>

        {/* The rack, drawn: zoomable, annotated, live */}
        <div className="homelab-item opacity-0 -mx-6 sm:mx-0">
          <LabViewer />
        </div>
        {/* Below the width the annotations need, the same list as text */}
        <ul className="lg:hidden mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {rack.map((item) => (
            <li key={item.read} className="homelab-item opacity-0 grid grid-cols-[4.5rem_1fr] gap-3">
              <span className="font-mono text-[11px] text-muted-foreground pt-0.5">{item.read}</span>
              <span>
                <span className="block text-sm font-medium text-foreground/90">{item.name}</span>
                <span className="block text-xs text-muted-foreground leading-relaxed">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* How it is wired */}
        <div className="mt-24">
          <p className="homelab-item opacity-0 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 text-center">How it is wired</p>
          <div className="homelab-item opacity-0 lab-map">
            <div className="flex flex-col items-center">
              <Node name="Router" sub="uplink" />
              <span className="lab-drop" />
              <Node name="2.5 GbE switch" sub="backbone" />
              <span className="lab-drop" />
            </div>
            <div className="lab-branches grid gap-5 lg:grid-cols-[2.1fr_1.15fr_0.75fr]">
              <div className="lab-group">
                <p className="lab-group-title">Proxmox cluster <span>· 4 nodes</span></p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {topology.cluster.map((n) => (
                    <div key={n.name} className="lab-host">
                      <p className="font-mono text-xs text-foreground mb-2">{n.name}</p>
                      {n.guests.length ? (
                        <ul className="flex flex-wrap gap-1.5">
                          {n.guests.map((g) => (
                            <li key={g} className="lab-guest">{g}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-mono text-[10px] text-muted-foreground">{n.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lab-group">
                <p className="lab-group-title">Management <span>· 1 GbE</span></p>
                <div className="grid grid-cols-2 gap-2">
                  {topology.management.map((m) => <Node key={m} name={m} />)}
                </div>
                <p className="lab-group-title mt-4">PicoTTY nodes <span>· serial + keyboard</span></p>
                <div className="grid grid-cols-2 gap-2">
                  {topology.picotty.map((p) => <Node key={p} name={`pico → ${p}`} dim />)}
                </div>
              </div>
              <div className="lab-group">
                <p className="lab-group-title">Work net</p>
                <div className="grid gap-2">
                  {topology.work.map((w) => <Node key={w} name={w} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PicoTTY */}
        <div className="mt-24 grid lg:grid-cols-[1fr_1.05fr] gap-10 items-center">
          <div className="homelab-item opacity-0">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Built for the lab</p>
            <h3 className="text-2xl font-semibold text-foreground mb-4">PicoTTY</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{picotty.summary}</p>
            <dl className="space-y-2.5">
              {picotty.facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
                  <dt className="font-mono text-[11px] text-muted-foreground pt-0.5">{f.k}</dt>
                  <dd className="text-foreground/85 leading-relaxed">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="homelab-item opacity-0 lab-pico">
            <PicoStar />
          </div>
        </div>

        {/* Software */}
        <div className="mt-24">
          <p className="homelab-item opacity-0 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 text-center">What runs on it</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homelab.stack.filter((s) => s.name !== 'PICOTTY').map((item) => (
              <div key={item.name} className="homelab-item opacity-0 card-cyber rounded-xl p-5">
                <h3 className="font-mono text-sm text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Writeups */}
        <div className="mt-12">
          <p className="homelab-item opacity-0 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">Writeups</p>
          <div className="flex flex-wrap justify-center gap-3">
            {homelab.writeups.map((w) => (
              <a
                key={w.url}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="homelab-item opacity-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 bg-card/40 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
              >
                <span>{w.title}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homelab;
