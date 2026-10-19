import React from 'react';
import { LEVELS, type Blocks, type Helpers } from './levels';
import './infraOps.css';

// Faithful React port of the InfraOpsGameV2 design: fix a client's terraform
// so the attack wave is blocked while the legit traffic stays online.

const RED = '#e5484d', GREEN = '#3ddc84';
export const GAME_WIDTH = 1480;

type LineKind = 'dim' | 'ok' | 'bad' | 'in' | 'hl' | 'good';
interface Line { t: string; k: LineKind }
type Files = Record<string, string>;

interface Props {
  startLevel?: number;
  packetSpeed?: number;
  wireLabels?: boolean;
  onContact?: () => void;
}

interface State {
  lv: number;
  files: Record<number, Files>;
  applied: Record<number, Files>;
  active: Record<number, string>;
  cleared: Record<number, boolean>;
  applies: Record<number, number>;
  hints: Record<number, number>;
  sel: string | null;
  cmd: string;
  wave: number;
  lines: Line[];
}

interface Node { id: string; type: string; label: string; gx: number; gy: number; res?: string }
interface Shape { d: string; f: string; s: string; w: number; da: string; o: number }
type Pt = [number, number];

const A = 42, OX = 300, OY = 120;
const P = (gx: number, gy: number, z = 0): Pt => [OX + (gx - gy) * A, OY + (gx + gy) * A / 2 - z];

const KIND: Record<string, string> = { inet: 'PUBLIC', server: 'EC2', alb: 'ALB', waf: 'WAF', ecs: 'ECS', rds: 'RDS', s3: 'S3', nat: 'NAT', cdn: 'CLOUDFRONT', iam: 'IAM ROLE', kms: 'KMS', secrets: 'SECRETS', imds: 'METADATA', vpce: 'ENDPOINT', trail: 'CLOUDTRAIL' };
const LINE_C: Record<LineKind, string> = { dim: '#6b6560', ok: '#d8d4ce', bad: RED, in: '#a8a29c', hl: '#f1efec', good: GREEN };
const HL_C = ['#c9a978', '#5f5a55', '#e0a370', '#ece0cc', '#9aa3ad', '#c8b89c', '#6b6560'];

const WAVES = Array.from({ length: 11 }, (_, i) => {
  let d = '';
  for (let x = 0; x <= 1480; x += 20) {
    const y = 70 + i * 22 + Math.sin(x / 140 + i * 0.7) * (10 + i * 1.5) + Math.sin(x / 57 + i) * 4;
    d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(1);
  }
  return d;
});

const NOISE = "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

const MONO = "'JetBrains Mono', monospace";
const GROTESK = "'Space Grotesk', system-ui, sans-serif";
const kicker: React.CSSProperties = { font: `500 10px ${GROTESK}`, letterSpacing: '.14em', color: '#8a8580' };

class InfraOpsGame extends React.Component<Props, State> {
  LV = LEVELS;
  state: State = {
    lv: 0, files: {}, applied: {}, active: {}, cleared: {}, applies: {}, hints: {}, sel: null, cmd: '', wave: 0,
    lines: [{ t: 'infra-ops v1.0 · fix the account in code. Type help.', k: 'dim' }, { t: 'Loaded 01 Open Door: 4 files, 3 misconfigurations.', k: 'in' }],
  };
  taRef = React.createRef<HTMLTextAreaElement>();
  gutRef = React.createRef<HTMLDivElement>();
  conRef = React.createRef<HTMLDivElement>();
  preRef = React.createRef<HTMLDivElement>();
  jumpTimer: ReturnType<typeof setTimeout> | undefined;

  componentDidMount() { const s = this.props.startLevel; if (s > 1 && s <= 5) this.go(s - 1); }
  componentDidUpdate() { const c = this.conRef.current; if (c) c.scrollTop = c.scrollHeight; }
  componentWillUnmount() { clearTimeout(this.jumpTimer); }

  // ---- tiny HCL reader ----------------------------------------------------
  brace(t: string, i: number) { let d = 0; for (let j = i; j < t.length; j++) { if (t[j] === '{') d++; else if (t[j] === '}' && --d === 0) return j; } return t.length; }
  res(code: string): Blocks { const R: Blocks = {}, re = /resource\s+"([\w-]+)"\s+"([\w-]+)"\s*\{/g; let m; while ((m = re.exec(code))) { const s = m.index + m[0].length - 1; R[m[1] + '.' + m[2]] = code.slice(s + 1, this.brace(code, s)); } return R; }
  H: Helpers = {
    sub: (b, n) => { const o: string[] = [], re = new RegExp('(^|\\n)[ \\t]*' + n + '[ \\t]*\\{', 'g'); let m; while ((m = re.exec(b))) { const s = m.index + m[0].length - 1; o.push(b.slice(s + 1, this.brace(b, s))); } return o; },
    val: (b, k) => { const m = b.match(new RegExp('(^|\\n)[ \\t]*' + k + '[ \\t]*=[ \\t]*([^\\n]+)')); return m ? m[2].trim().replace(/,$/, '').replace(/^"|"$/g, '') : null; },
    open: (b, p) => this.H.sub(b, 'ingress').some((x) => this.H.val(x, 'from_port') === p && x.includes('0.0.0.0/0')),
  };

  files(i = this.state.lv): Files { return this.state.files[i] || this.LV[i].files; }
  appliedFiles(i = this.state.lv): Files { return this.state.applied[i] || this.LV[i].files; }
  cat(f: Files) { return Object.values(f).join('\n\n'); }
  evalF(i: number, f: Files) { const L = this.LV[i], R = this.res(this.cat(f)); return { m: L.missions.map((x) => !!x.ok(R, this.H)), g: L.guards.map((x) => !!x.ok(R, this.H)) }; }
  activeFile(i = this.state.lv) { return this.state.active[i] || Object.keys(this.LV[i].files)[0]; }
  fileOf(addr: string, f: Files) { const [t, n] = addr.split('.'), needle = `resource "${t}" "${n}"`; return Object.keys(f).find((k) => f[k].includes(needle)); }
  log(a: Line[]) { this.setState((s) => ({ lines: [...s.lines, ...a].slice(-140) })); }

  // ---- game actions -------------------------------------------------------
  go(i: number) { const L = this.LV[i]; this.setState({ lv: i, sel: null }); this.log([{ t: '', k: 'dim' }, { t: `Loaded 0${i + 1} ${L.a} ${L.b}: ${Object.keys(L.files).length} files, ${L.missions.length} misconfigurations.`, k: 'in' }]); }

  planLines(): Line[] {
    const cf = this.files(), pf = this.appliedFiles(), cur = this.res(this.cat(cf)), prev = this.res(this.cat(pf)), out: Line[] = []; let a = 0, c = 0, d = 0;
    const norm = (s: string) => s.replace(/#[^\n]*/g, '').replace(/\s+/g, ' ').trim();
    Object.keys(cur).forEach((k) => { const f = this.fileOf(k, cf); if (!(k in prev)) { a++; out.push({ t: `  + ${k}  (${f})`, k: 'ok' }); } else if (norm(cur[k]) !== norm(prev[k])) { c++; out.push({ t: `  ~ ${k}  (${f})`, k: 'ok' }); } });
    Object.keys(prev).forEach((k) => { if (!(k in cur)) { d++; out.push({ t: `  - ${k}  will be destroyed`, k: 'bad' }); } });
    out.push(a || c || d ? { t: `Plan: ${a} to add, ${c} to change, ${d} to destroy.`, k: 'hl' } : { t: 'No changes. Infrastructure matches the configuration.', k: 'dim' });
    return out;
  }

  plan() {
    const ev = this.evalF(this.state.lv, this.files()), L = this.LV[this.state.lv];
    this.log([{ t: '> terraform plan', k: 'hl' }, ...this.planLines(), { t: `  predicted: ${ev.m.filter(Boolean).length}/${ev.m.length} misconfigurations fixed`, k: 'in' }, ...L.guards.filter((g, j) => !ev.g[j]).map((g): Line => ({ t: `  ! this would break: ${g.label}`, k: 'bad' }))]);
  }

  apply() {
    const i = this.state.lv, L = this.LV[i], f = this.files(), pl = this.planLines(), ev = this.evalF(i, f), n = (this.state.applies[i] || 0) + 1, win = ev.m.every(Boolean) && ev.g.every(Boolean);
    const out: Line[] = [{ t: '> terraform apply -auto-approve', k: 'hl' }, ...pl, { t: 'Apply complete. Running attack wave…', k: 'dim' }];
    L.missions.forEach((m, j) => out.push({ t: (ev.m[j] ? '  ✓ blocked   ' : '  ✕ breached  ') + m.label, k: ev.m[j] ? 'ok' : 'bad' }));
    L.guards.forEach((g, j) => out.push({ t: (ev.g[j] ? '  ✓ online    ' : '  ✕ offline   ') + g.label, k: ev.g[j] ? 'ok' : 'bad' }));
    if (win) out.push({ t: `Environment 0${i + 1} secured in ${n} apply${n > 1 ? 's' : ''}.`, k: 'good' });
    this.setState((s) => ({ applied: { ...s.applied, [i]: f }, applies: { ...s.applies, [i]: n }, cleared: win ? { ...s.cleared, [i]: true } : s.cleared, wave: s.wave + 1 }));
    this.log(out);
  }

  reset() { const i = this.state.lv; this.setState((s) => ({ files: { ...s.files, [i]: this.LV[i].files } })); this.log([{ t: '> git checkout infra/', k: 'hl' }, { t: '  Files restored. Deployed infrastructure is unchanged.', k: 'dim' }]); }

  hint() {
    const i = this.state.lv, L = this.LV[i], ev = this.evalF(i, this.appliedFiles()), j = ev.m.findIndex((x) => !x), shown = this.state.hints[i] || 0;
    if (j < 0) return this.log([{ t: 'No open misconfigurations. Apply to confirm.', k: 'dim' }]);
    this.setState((s) => ({ hints: { ...s.hints, [i]: Math.min(L.missions.length, shown + 1) } }));
    this.log([{ t: `hint (${L.missions[j].file}): ${L.missions[j].hint}`, k: 'in' }]);
  }

  node(id: string): Node | undefined { const n = this.LV[this.state.lv].nodes.find((x) => x[0] === id); return n && { id: n[0], type: n[1], label: n[2], gx: n[3], gy: n[4], res: n[5] }; }
  openFile(name: string) { const i = this.state.lv; this.setState((s) => ({ active: { ...s.active, [i]: name } })); }

  jump(id: string) {
    const n = this.node(id); if (!n || !n.res) return; const f = this.files(), file = this.fileOf(n.res, f); if (!file) return;
    const [t, r] = n.res.split('.'), needle = `resource "${t}" "${r}"`, idx = f[file].indexOf(needle);
    this.openFile(file);
    clearTimeout(this.jumpTimer);
    this.jumpTimer = setTimeout(() => { const ta = this.taRef.current; if (!ta) return; ta.focus({ preventScroll: true }); ta.setSelectionRange(idx, idx + needle.length); ta.scrollTop = Math.max(0, (f[file].slice(0, idx).split('\n').length - 2) * 18); this.sync(ta); }, 30);
  }

  sync(ta: HTMLTextAreaElement) { if (this.gutRef.current) this.gutRef.current.scrollTop = ta.scrollTop; if (this.preRef.current) { this.preRef.current.scrollTop = ta.scrollTop; this.preRef.current.scrollLeft = ta.scrollLeft; } }

  probe(id: string) {
    const L = this.LV[this.state.lv], ev = this.evalF(this.state.lv, this.appliedFiles()), out: Line[] = [{ t: `> probe ${id}`, k: 'hl' }];
    L.missions.forEach((m, j) => { if (m.nodes.includes(id) && m.route) out.push({ t: `  ${m.route.join(' → ')}  ${ev.m[j] ? 'BLOCKED' : 'OPEN'}`, k: ev.m[j] ? 'ok' : 'bad' }); });
    if (out.length === 1) out.push({ t: '  no external attack path to this node.', k: 'dim' });
    this.log(out);
  }

  inspect(id: string) {
    const n = this.node(id), L = this.LV[this.state.lv], ev = this.evalF(this.state.lv, this.appliedFiles()), iss = L.missions.map((m, j) => ({ m, ok: ev.m[j] })).filter((x) => x.m.nodes.includes(id));
    this.log([{ t: `> inspect ${id}`, k: 'hl' }, { t: `  ${n.label} · ${n.type} · ${n.res || 'managed elsewhere'}${n.res ? ' (' + this.fileOf(n.res, this.files()) + ')' : ''}`, k: 'ok' }, ...(iss.length ? iss.map((x): Line => ({ t: `  ${x.ok ? '✓' : '✕'} ${x.m.label}`, k: x.ok ? 'ok' : 'bad' })) : [{ t: '  no findings', k: 'dim' } as Line])]);
  }

  run(raw: string) {
    const [c, a] = raw.trim().split(/\s+/), L = this.LV[this.state.lv], ids = L.nodes.map((n) => n[0]);
    const alias: Record<string, string> = { db: 'rds', bucket: 'reports', s3: 'reports', lb: 'alb', internet: 'inet', web: 'web1' };
    const id = ids.includes(a) ? a : alias[a];
    this.setState({ cmd: '' });
    if (c === 'help') return this.log([{ t: '> help', k: 'hl' }, { t: '  plan · apply · reset · hint · ls · open <file> · inspect <node> · probe <node> · level <1-5> · clear', k: 'in' }]);
    if (c === 'plan' || (c === 'terraform' && a === 'plan')) return this.plan();
    if (c === 'apply' || (c === 'terraform' && a === 'apply')) return this.apply();
    if (c === 'reset') return this.reset();
    if (c === 'hint') return this.hint();
    if (c === 'clear') return this.setState({ lines: [] });
    if (c === 'ls') return this.log([{ t: '> ls', k: 'hl' }, { t: '  files: ' + Object.keys(this.files()).join('  '), k: 'in' }, { t: '  nodes: ' + ids.filter((x) => x !== 'inet').join('  '), k: 'in' }]);
    if (c === 'open' && Object.prototype.hasOwnProperty.call(this.files(), a)) return this.openFile(a);
    if (c === 'level' && +a >= 1 && +a <= 5) return this.go(+a - 1);
    if ((c === 'inspect' || c === 'probe') && id) { this.setState({ sel: id }); return c === 'inspect' ? this.inspect(id) : this.probe(id); }
    this.log([{ t: '> ' + raw, k: 'hl' }, { t: '  unknown command or target. Try help or ls.', k: 'bad' }]);
  }

  // ---- rendering helpers --------------------------------------------------
  hlLine(s: string) {
    const out: { t: string; c: string; w: number; i: string }[] = [];
    const re = /("(?:[^"\\]|\\.)*")|(#.*$)|\b(true|false|\d+)\b|\b(resource|data|variable|output|jsonencode)\b|([A-Za-z_][\w-]*)(?=\s*=)|([A-Za-z_][\w-]*)(?=\s*\{)|([{}[\]=,()])/g;
    let m, last = 0;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push({ t: s.slice(last, m.index), c: '#d8d4ce', w: 400, i: 'normal' });
      const g = m.slice(1).findIndex((x) => x !== undefined);
      out.push({ t: m[0], c: HL_C[g], w: g === 3 ? 600 : 400, i: g === 1 ? 'italic' : 'normal' });
      last = re.lastIndex; if (!m[0].length) re.lastIndex++;
    }
    if (last < s.length) out.push({ t: s.slice(last), c: '#d8d4ce', w: 400, i: 'normal' });
    return out.length ? out : [{ t: ' ', c: '#d8d4ce', w: 400, i: 'normal' }];
  }

  // Isometric geometry for one node, as a list of SVG paths.
  geo(n: Node, st: { ex: boolean; down: boolean; sel: boolean }): Shape[] {
    const out: Shape[] = [];
    const F = (p: Pt) => p[0].toFixed(1) + ' ' + p[1].toFixed(1), M = (pts: Pt[]) => 'M' + pts.map(F).join(' L') + ' Z', L2 = (a: Pt, b: Pt) => 'M' + F(a) + ' L' + F(b);
    const ell = (x: number, y: number, rx: number, ry: number) => `M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} Z`;
    const S = st.down ? ['#6e6762', '#5a5450', '#4a4542'] : ['#ece0cc', '#d6c7ae', '#b9a78a'], BASE = ['#4d413a', '#3c322c', '#2f2823'];
    const edge = st.sel ? '#ffffff' : st.ex ? RED : 'rgba(20,16,14,.55)', ew = st.sel || st.ex ? 1.3 : 0.8, led = st.ex ? RED : st.down ? '#6e6762' : GREEN, dk = '#5a4a3c';
    const add = (d: string, f: string, o: { s?: string; w?: number; da?: string; o?: number } = {}) => out.push({ d, f, s: o.s ?? edge, w: o.w ?? ew, da: o.da || '', o: o.o ?? 1 });
    const box = (cx: number, cy: number, w: number, d: number, h: number, z: number, c: string[], s?: string) => {
      const p = (u: number, v: number, zz: number) => P(cx + u, cy + v, zz), W = w / 2, D = d / 2, o = s ? { s, w: 0.8 } : {};
      add(M([p(W, -D, z), p(W, D, z), p(W, D, z + h), p(W, -D, z + h)]), c[2], o);
      add(M([p(-W, D, z), p(W, D, z), p(W, D, z + h), p(-W, D, z + h)]), c[1], o);
      add(M([p(-W, -D, z + h), p(W, -D, z + h), p(W, D, z + h), p(-W, D, z + h)]), c[0], o);
    };
    const cyl = (cx: number, cy: number, r: number, h: number, z: number, c: string[]) => {
      const [x, y] = P(cx, cy, z), rx = r * A * 1.414, ry = rx / 2, yt = y - h;
      add(`M ${x - rx} ${yt} L ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x} ${y + ry} L ${x} ${yt + ry} A ${rx} ${ry} 0 0 1 ${x - rx} ${yt} Z`, c[1]);
      add(`M ${x} ${yt + ry} L ${x} ${y + ry} A ${rx} ${ry} 0 0 0 ${x + rx} ${y} L ${x + rx} ${yt} A ${rx} ${ry} 0 0 1 ${x} ${yt + ry} Z`, c[2]);
      add(ell(x, yt, rx, ry), c[0]); return { x, y, rx, ry, yt };
    };
    const line = (a: Pt, b: Pt, c: string, w = 1.2, o = 1) => add(L2(a, b), 'none', { s: c, w, o });
    const { gx, gy, type } = n, [gxp, gyp] = P(gx, gy);
    if (st.ex) add(ell(gxp, gyp, 52, 26), 'rgba(229,72,77,.13)', { s: 'rgba(229,72,77,.65)', w: 1, da: '3 4' });
    else if (st.sel) add(ell(gxp, gyp, 52, 26), 'rgba(255,255,255,.04)', { s: 'rgba(255,255,255,.5)', w: 1, da: '3 4' });
    if (type === 'inet') {
      add(ell(gxp, gyp, 30, 13), 'rgba(0,0,0,.35)', { s: 'none' }); const [x, y] = P(gx, gy, 42);
      add(ell(x, y, 23, 23), S[0]); add(`M ${x} ${y - 23} A 23 23 0 0 1 ${x} ${y + 23} A 11 23 0 0 0 ${x} ${y - 23} Z`, S[2], { s: 'none', o: 0.75 });
      add(ell(x, y, 10, 23), 'none', { s: '#a08560', w: 1 }); add(ell(x, y, 23, 8), 'none', { s: '#a08560', w: 1 }); line([x - 23, y], [x + 23, y], '#a08560', 0.8, 0.6);
      return out;
    }
    box(gx, gy, 1.2, 1.2, 5, 0, BASE, 'rgba(0,0,0,.45)');
    const z = 5, lf = (_w: number, d: number, u: number, zz: number) => P(gx + u, gy + d / 2, zz), rf = (w: number, v: number, zz: number) => P(gx + w / 2, gy + v, zz);
    if (type === 'server') {
      box(gx, gy, 0.78, 0.78, 46, z, S); add(M([lf(.78, .78, -.29, 44), lf(.78, .78, .29, 44), lf(.78, .78, .29, 18), lf(.78, .78, -.29, 18)]), '#26282b', { s: 'rgba(0,0,0,.6)', w: .8 });
      [38, 32, 26].forEach((zz, k) => line(lf(.78, .78, -.22, zz), lf(.78, .78, k === 1 ? .05 : .16, zz), led, 1.6, .9)); const p = rf(.78, .05, 42); add(ell(p[0], p[1], 2.4, 2.4), led, { s: 'none' });
    } else if (type === 'alb') {
      box(gx, gy, 1.05, 0.7, 14, z, S); const t = (u: number, v: number) => P(gx + u, gy + v, z + 14); [-.22, 0, .22].forEach((v) => line(t(-.3, 0), t(.38, v), dk, 1.4)); const c = t(-.3, 0); add(ell(c[0], c[1], 3.2, 1.8), dk, { s: 'none' }); const p = rf(1.05, 0, z + 7); add(ell(p[0], p[1], 2.2, 2.2), led, { s: 'none' });
    } else if (type === 'waf') {
      box(gx, gy, 1.1, 0.24, 36, z, S); const b = (u: number, zz: number) => lf(1.1, .24, u, zz); [15, 25, 35].forEach((zz) => line(b(-.55, zz), b(.55, zz), 'rgba(0,0,0,.22)', 1)); [[-.25, 5, 15], [.2, 5, 15], [0, 15, 25], [.4, 15, 25], [-.4, 15, 25], [-.2, 25, 35], [.25, 25, 35]].forEach(([u, a, c]) => line(b(u, a), b(u, c), 'rgba(0,0,0,.22)', 1)); const p = rf(1.1, 0, z + 38); add(ell(p[0], p[1], 2.4, 2.4), led, { s: 'none' });
    } else if (type === 'ecs') {
      [-.34, 0, .34].forEach((u) => box(gx + u, gy, 0.3, 0.36, 20, z, S)); box(gx, gy, 0.3, 0.36, 14, z + 20, S); const p = P(gx, gy + .18, z + 27); add(ell(p[0], p[1], 2.2, 2.2), led, { s: 'none' });
    } else if (type === 'rds') {
      const c = cyl(gx, gy, 0.34, 40, z, S); [14, 27].forEach((h) => { const yb = c.y - h; add(`M ${c.x - c.rx} ${yb} A ${c.rx} ${c.ry} 0 0 0 ${c.x + c.rx} ${yb}`, 'none', { s: 'rgba(0,0,0,.3)', w: 1 }); }); add(ell(c.x, c.y - 7 + c.ry, 2.4, 2.4), led, { s: 'none' });
    } else if (type === 's3') {
      const c = cyl(gx, gy, 0.42, 26, z, S); add(ell(c.x, c.yt, c.rx * .78, c.ry * .78), dk, { s: 'rgba(0,0,0,.4)', w: .8 }); add(`M ${c.x - c.rx} ${c.y - 12} A ${c.rx} ${c.ry} 0 0 0 ${c.x + c.rx} ${c.y - 12}`, 'none', { s: 'rgba(0,0,0,.28)', w: 1 }); add(ell(c.x, c.y - 5 + c.ry, 2.4, 2.4), led, { s: 'none' });
    } else if (type === 'nat') {
      box(gx - .3, gy, 0.18, 0.44, 30, z, S); box(gx + .3, gy, 0.18, 0.44, 30, z, S); box(gx, gy, 0.82, 0.44, 8, z + 30, S); const p = lf(.82, .44, 0, z + 34); add(ell(p[0], p[1], 2.4, 2.4), led, { s: 'none' });
    } else if (type === 'cdn') {
      box(gx, gy, 1, 1, 6, z, S); box(gx, gy, .72, .72, 6, z + 7, S); box(gx, gy, .44, .44, 6, z + 14, S); const [x, y] = P(gx, gy, z + 32); add(ell(x, y, 9, 9), S[0]); add(ell(x, y, 4, 9), 'none', { s: '#a08560', w: .9 }); add(ell(x, y, 9, 3), 'none', { s: '#a08560', w: .9 });
    } else if (type === 'iam') {
      box(gx, gy, 0.5, 0.5, 8, z, S); box(gx, gy, 0.46, 0.1, 30, z + 8, S); const c = lf(.46, .1, 0, z + 29); add(ell(c[0], c[1], 6, 6), 'none', { s: dk, w: 1.4 }); line(lf(.46, .1, -.13, z + 18), lf(.46, .1, .13, z + 18), dk, 1.4); line(lf(.46, .1, -.09, z + 13), lf(.46, .1, .09, z + 13), dk, 1.4);
    } else if (type === 'kms' || type === 'secrets') {
      box(gx, gy, 0.7, 0.7, 30, z, S); const c = lf(.7, .7, 0, z + 16);
      if (type === 'kms') { add(ell(c[0], c[1], 7, 7), 'none', { s: dk, w: 1.5 }); line(c, [c[0] + 4, c[1] - 4], dk, 1.5); } else { add(ell(c[0], c[1] - 2, 3.5, 3.5), dk, { s: 'none' }); line([c[0], c[1]], [c[0], c[1] + 6], dk, 2); }
      const p = rf(.7, 0, z + 25); add(ell(p[0], p[1], 2.2, 2.2), led, { s: 'none' });
    } else if (type === 'imds') {
      box(gx, gy, 0.62, 0.62, 9, z, ['#4a423d', '#3a3330', '#2c2624']); [-.18, 0, .18].forEach((u) => line(lf(.62, .62, u, z + 2), lf(.62, .62, u, z - 3), '#8a7660', 1.2)); [-.18, 0, .18].forEach((v) => line(rf(.62, v, z + 2), rf(.62, v, z - 3), '#8a7660', 1.2)); box(gx, gy, .3, .3, 3, z + 9, [led, led, led], 'rgba(0,0,0,.4)');
    } else if (type === 'vpce') {
      box(gx - .28, gy, 0.12, 0.3, 30, z, S); box(gx + .28, gy, 0.12, 0.3, 30, z, S); box(gx, gy, 0.7, 0.3, 6, z + 30, S); add(M([P(gx - .22, gy + .15, z + 2), P(gx + .22, gy + .15, z + 2), P(gx + .22, gy + .15, z + 29), P(gx - .22, gy + .15, z + 29)]), led, { s: led, w: 1, o: .25 });
    } else if (type === 'trail') {
      box(gx, gy, 0.46, 0.62, 46, z, S); for (let zz = 12; zz <= 44; zz += 6) line(lf(.46, .62, -.17, z + zz), lf(.46, .62, zz % 12 ? .05 : .17, z + zz), 'rgba(0,0,0,.28)', 1.2); const p = rf(.46, 0, z + 42); add(ell(p[0], p[1], 2.2, 2.2), led, { s: 'none' });
    }
    return out;
  }

  setCode(lv: number, af: string, v: string, after?: () => void) {
    this.setState((s) => ({ files: { ...s.files, [lv]: { ...(s.files[lv] || this.LV[lv].files), [af]: v } } }), after);
  }

  render() {
    const { lv, sel, wave } = this.state, L = this.LV[lv], files = this.files(), af = this.activeFile(), ev = this.evalF(lv, this.appliedFiles());
    const speed = this.props.packetSpeed ?? 2.8, showLabels = this.props.wireLabels ?? true;
    const win = ev.m.every(Boolean) && ev.g.every(Boolean);
    const exposed = new Set<string>(), down = new Set<string>();
    L.missions.forEach((m, j) => { if (!ev.m[j]) m.nodes.forEach((x) => exposed.add(x)); });
    L.guards.forEach((g, j) => { if (!ev.g[j]) down.add(g.node); });
    const N: Record<string, Node> = {}; L.nodes.forEach((r) => { N[r[0]] = { id: r[0], type: r[1], label: r[2], gx: r[3], gy: r[4], res: r[5] }; });

    const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let k = -1; k <= 7; k++) { const a = P(k, -0.6), b = P(k, 5.8), c = P(-0.8, k - 0.5), d = P(6.8, k - 0.5); gridLines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }); }
    const zone = (x0: number, x1: number, label: string) => { const c = [P(x0, -0.5), P(x1, -0.5), P(x1, 5.7), P(x0, 5.7)]; return { d: 'M' + c.map((p) => p.join(' ')).join(' L') + ' Z', label, tx: c[0][0] + 4, ty: c[0][1] - 8 }; };
    const zones = [zone(-0.75, 0.75, 'EDGE'), zone(1.25, 2.75, 'PUBLIC · 10.0.1.0/24'), zone(3.25, 4.75, 'PRIVATE · 10.0.2.0/24'), zone(5.25, 6.75, 'DATA')];

    const WS: Record<string, [string, number, string]> = { net: ['#8a8580', 1.5, ''], data: ['#a08560', 1.4, '5 4'], iam: ['#d6c7ae', 1.6, '1 4'], kms: ['#d6c7ae', 1.6, '1 4'], risk: [RED, 1.5, '6 4'] };
    const poly = (w: (typeof L.wires)[number]): Pt[] => { const a = N[w[0]], b = N[w[1]], c: Pt = w[4] === 'y' ? [a.gx, b.gy] : [b.gx, a.gy]; return ([[a.gx, a.gy], c, [b.gx, b.gy]] as Pt[]).map((g) => P(g[0], g[1])); };
    const wires: { d: string; c: string; sw: number; da: string; o: number }[] = [], wireLabels: { x: string; y: string; t: string; c: string }[] = [];
    L.wires.forEach((w) => {
      const pts = poly(w), [col, sw, da] = WS[w[2]]; let c = col, o = 1, dd = da;
      if (w[2] === 'risk') { const open = (w[5] || []).some((j) => !ev.m[j]); if (!open) { c = '#3a3633'; dd = '2 5'; o = .9; } }
      wires.push({ d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), c, sw, da: dd, o });
      if (showLabels && w[3]) {
        const s1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), s2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), [p, q] = s1 >= s2 ? [pts[0], pts[1]] : [pts[1], pts[2]];
        wireLabels.push({ x: ((p[0] + q[0]) / 2).toFixed(1), y: ((p[1] + q[1]) / 2 - 4).toFixed(1), t: w[3], c: w[2] === 'risk' && c === RED ? RED : '#8a8580' });
      }
    });

    const order = Object.values(N).sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));
    const labels = order.map((n) => { const [x, y] = P(n.gx, n.gy); return { id: n.id, x, y: y + 38, label: n.label + (down.has(n.id) ? ' · offline' : ''), kind: KIND[n.type], c: exposed.has(n.id) || down.has(n.id) ? RED : '#ece9e4' }; });

    const findWire = (a: string, b: string): Pt[] => { const w = L.wires.find((w) => (w[0] === a && w[1] === b) || (w[0] === b && w[1] === a)); if (!w) return [P(N[a].gx, N[a].gy), P(N[b].gx, N[b].gy)]; const p = poly(w); return w[0] === a ? p : p.reverse(); };
    const routePts = (route: string[]): Pt[] => { let pts: Pt[] = []; for (let i = 0; i < route.length - 1; i++) { const seg = findWire(route[i], route[i + 1]); pts = pts.concat(i ? seg.slice(1) : seg); } return pts.map((p) => [p[0], p[1] - 3] as Pt); };
    const cut = (pts: Pt[], frac: number): Pt[] => { const a = pts[pts.length - 2], b = pts[pts.length - 1]; pts = pts.slice(); pts[pts.length - 1] = [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]; return pts; };
    const pathStr = (pts: Pt[]) => `path('M ${pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L ')}')`;
    const packets: { c: string; path: string; anim: string }[] = [], markers: { x: string; y: string; tx: string; ty: string; c: string }[] = [], anim = wave % 2 ? 'ioPkA' : 'ioPkB'; let k = 0;
    const mark = (p: Pt, c: string) => markers.push({ x: (p[0] - 7.5).toFixed(1), y: (p[1] - 7.5).toFixed(1), tx: p[0].toFixed(1), ty: (p[1] + 3.5).toFixed(1), c });
    L.missions.forEach((m, j) => {
      if (!m.route) return; const ok = ev.m[j]; let pts = routePts(m.route); if (ok) { pts = cut(pts, 0.55); mark(pts[pts.length - 1], '#ece9e4'); }
      packets.push({ c: ok ? '#7d7873' : RED, path: pathStr(pts), anim: `${anim} ${(speed * Math.max(1, pts.length / 4)).toFixed(2)}s linear ${(k++ * 0.5).toFixed(2)}s infinite` });
    });
    L.guards.forEach((g, j) => {
      const ok = ev.g[j];
      g.routes.forEach((r, ri) => {
        let pts = routePts(r); if (!ok) { pts = cut(pts, 0.45); mark(pts[pts.length - 1], RED); }
        for (let q = 0; q < 2; q++) packets.push({ c: '#f1efec', path: pathStr(pts), anim: `${anim} ${(speed * 1.1).toFixed(2)}s linear ${(q * speed * 0.55 + ri * 0.35 + j * 0.2).toFixed(2)}s infinite` });
      });
    });

    const hintsShown = this.state.hints[lv] || 0; let hc = 0;
    const missions = L.missions.map((m, j) => { const ok = ev.m[j], show = !ok && hc++ < hintsShown; return { ...m, showHint: show, mark: ok ? '✓' : '●', markC: ok ? GREEN : RED, fg: ok ? '#7d7873' : '#ece9e4', line: ok ? '#2e2c2a' : 'rgba(229,72,77,.55)' }; });
    const guards = L.guards.map((g, j) => ({ label: g.label, mark: ev.g[j] ? '●' : '✕', c: ev.g[j] ? GREEN : RED, fg: ev.g[j] ? '#d8d4ce' : RED }));
    const openFiles = new Set(L.missions.filter((m, j) => !ev.m[j]).map((m) => m.file));
    const code = files[af] || '', codeLines = code.split('\n'), openCount = ev.m.filter((x) => !x).length, sn = sel && N[sel];
    let inspText = 'Click any node to inspect it and open the file that defines it. Or type inspect <node>.';
    if (sn) { const iss = L.missions.filter((m, j) => m.nodes.includes(sel) && !ev.m[j]).length; inspText = `${sn.res ? sn.res + ' in ' + this.fileOf(sn.res, files) : 'not managed in these files'} · ${iss ? iss + ' open finding' + (iss > 1 ? 's' : '') : 'no open findings'}${down.has(sel) ? ' · legit traffic failing' : ''}`; }
    const last = lv === 4;
    const applies = this.state.applies[lv] || 0;

    const onCodeKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); this.apply(); return; }
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault(); const t = e.currentTarget, s = t.selectionStart, v = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
        this.setCode(lv, af, v, () => t.setSelectionRange(s + 2, s + 2));
      }
    };

    return (
      <div className="io-game" style={{ position: 'relative', width: GAME_WIDTH, background: '#161514', color: '#e8e6e3', fontFamily: GROTESK, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(900px 600px at 8% 0%,rgba(255,255,255,.055),transparent 60%),radial-gradient(700px 500px at 60% 40%,rgba(236,224,204,.025),transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .22, mixBlendMode: 'overlay', backgroundImage: NOISE }} />
        <svg width="1480" height="320" style={{ position: 'absolute', left: 0, bottom: 0, pointerEvents: 'none' }} aria-hidden="true">
          {WAVES.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="1" />)}
        </svg>

        <div style={{ position: 'relative' }}>
          {/* Level tabs + progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 500px', alignItems: 'center', padding: '18px 28px' }}>
            <div />
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'nowrap' }}>
              {this.LV.map((l, i) => (
                <button key={i} type="button" className="io-tab" onClick={() => this.go(i)} aria-current={i === lv ? 'true' : undefined}
                  style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '4px 0', border: 0, borderBottom: `1px solid ${i === lv ? '#ece9e4' : 'transparent'}`, background: 'transparent', color: i === lv ? '#f1efec' : '#8a8580', font: `400 12.5px ${MONO}`, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: this.state.cleared[i] ? GREEN : i === lv ? RED : '#3a3633' }} />0{i + 1} {l.a}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '1px solid #2e2c2a', borderRadius: 999, background: 'rgba(255,255,255,.02)', font: `400 12px ${MONO}`, color: '#a8a29c' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }} />{Object.keys(this.state.cleared).length} of 5 environments secured
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 500px', gap: 0, padding: '0 28px 28px' }}>
            {/* Left: brief, missions, guards */}
            <div style={{ display: 'flex', flexDirection: 'column', padding: '14px 28px 0 0' }}>
              <div style={{ width: 72, height: 1, background: '#3a3633', marginBottom: 22 }} />
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 13px', border: '1px solid #2e2c2a', borderRadius: 999, font: `400 11.5px ${MONO}`, color: '#a8a29c' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: win ? GREEN : RED }} />Environment 0{lv + 1} / 05 · {win ? 'secured' : openCount + ' open'}
              </div>
              <div style={{ margin: '22px 0 18px', fontWeight: 700, fontSize: 50, lineHeight: .98, letterSpacing: '-.025em' }}>
                <div style={{ color: '#f1efec', textShadow: '0 0 28px rgba(255,255,255,.18)' }}>{L.a}</div>
                <div style={{ color: 'transparent', WebkitTextStroke: '1px #7d7873' }}>{L.b}</div>
              </div>
              <div style={{ font: `500 13px/1.6 ${MONO}`, color: '#e8e6e3' }}>{L.roleA} <span style={{ color: '#6b6560' }}>|</span> <span style={{ color: '#8a8580' }}>{L.roleB}</span></div>
              <div style={{ margin: '14px 0 22px', fontSize: 14, lineHeight: 1.65, color: '#a8a29c', textWrap: 'pretty' } as React.CSSProperties}>{L.brief}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 26 }}>
                <div style={{ borderLeft: '1px solid #3a3633', paddingLeft: 16 }}><div style={{ font: `600 26px ${MONO}` }}>{ev.m.filter(Boolean).length}/{ev.m.length}</div><div style={{ ...kicker, marginTop: 4 }}>FIXED</div></div>
                <div style={{ borderLeft: '1px solid #3a3633', paddingLeft: 16 }}><div style={{ font: `600 26px ${MONO}` }}>{applies}</div><div style={{ ...kicker, marginTop: 4 }}>APPLIES · PAR 1</div></div>
              </div>
              <div style={{ ...kicker, marginBottom: 10 }}>MISCONFIGURATIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {missions.map((m, j) => (
                  <div key={j} style={{ borderLeft: `1px solid ${m.line}`, padding: '2px 0 2px 14px' }}>
                    <div style={{ display: 'flex', gap: 9, alignItems: 'baseline' }}><span style={{ font: `500 11px ${MONO}`, color: m.markC }}>{m.mark}</span><span style={{ fontSize: 13.5, lineHeight: 1.4, color: m.fg }}>{m.label}</span></div>
                    <div style={{ font: `400 10.5px ${MONO}`, color: '#6b6560', margin: '3px 0 0 20px' }}>{m.file} · {m.res}</div>
                    {m.showHint && <div style={{ margin: '8px 0 0 20px', padding: '8px 10px', border: '1px solid #2e2c2a', borderRadius: 8, background: 'rgba(255,255,255,.02)', font: `400 11px/1.55 ${MONO}`, color: '#d8d4ce' }}>{m.hint}</div>}
                  </div>
                ))}
              </div>
              <div style={{ ...kicker, margin: '24px 0 10px' }}>MUST STAY ONLINE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {guards.map((g, j) => (
                  <div key={j} style={{ display: 'flex', gap: 9, alignItems: 'baseline', borderLeft: '1px solid #3a3633', paddingLeft: 14 }}><span style={{ font: `500 11px ${MONO}`, color: g.c }}>{g.mark}</span><span style={{ fontSize: 13.5, lineHeight: 1.4, color: g.fg }}>{g.label}</span></div>
                ))}
              </div>
              <button type="button" className="io-btn-outline" onClick={() => this.hint()} style={{ alignSelf: 'flex-start', marginTop: 26, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', border: '1px solid #3a3633', borderRadius: 8, background: 'transparent', color: '#e8e6e3', font: `500 14px ${GROTESK}`, cursor: 'pointer' }}>Show a hint</button>
            </div>

            {/* Centre: isometric map */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, borderLeft: '1px solid #232120', borderRight: '1px solid #232120' }}>
              <div style={{ position: 'relative', width: 680, height: 470, alignSelf: 'center' }}>
                <svg width="680" height="470" style={{ position: 'absolute', inset: 0, display: 'block', overflow: 'visible' }}>
                  {gridLines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(255,255,255,.035)" strokeWidth="1" />)}
                  {zones.map((z) => <path key={z.label} d={z.d} fill="rgba(255,255,255,.018)" stroke="#34302d" strokeWidth="1" strokeDasharray="4 5" />)}
                  {wires.map((w, i) => <path key={i} d={w.d} fill="none" stroke={w.c} strokeWidth={w.sw} strokeDasharray={w.da} strokeLinecap="round" strokeLinejoin="round" opacity={w.o} />)}
                  {order.map((n) => (
                    <g key={n.id} onClick={() => { this.setState({ sel: n.id }); this.jump(n.id); }} style={{ cursor: 'pointer' }}>
                      {this.geo(n, { ex: exposed.has(n.id), down: down.has(n.id), sel: sel === n.id }).map((s, i) => (
                        <path key={i} d={s.d} fill={s.f} stroke={s.s} strokeWidth={s.w} strokeDasharray={s.da} opacity={s.o} strokeLinejoin="round" />
                      ))}
                    </g>
                  ))}
                  {markers.map((m, i) => (
                    <React.Fragment key={i}>
                      <rect x={m.x} y={m.y} width="15" height="15" rx="3" fill="#161514" stroke={m.c} strokeWidth="1.4" />
                      <text x={m.tx} y={m.ty} fill={m.c} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" textAnchor="middle">✕</text>
                    </React.Fragment>
                  ))}
                </svg>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: MONO }}>
                  {zones.map((z) => <div key={z.label} style={{ position: 'absolute', left: z.tx, top: z.ty, transform: 'translateY(-100%)', fontSize: 9, letterSpacing: '.12em', color: '#6b6560', whiteSpace: 'nowrap' }}>{z.label}</div>)}
                  {wireLabels.map((w, i) => <div key={i} style={{ position: 'absolute', left: +w.x, top: +w.y, transform: 'translate(-50%,-100%)', fontSize: 9, color: w.c, whiteSpace: 'nowrap', textShadow: '0 0 3px #161514,0 0 3px #161514,0 0 3px #161514' }}>{w.t}</div>)}
                  {labels.map((n) => (
                    <div key={n.id} style={{ position: 'absolute', left: n.x, top: n.y, transform: 'translate(-50%,-75%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, whiteSpace: 'nowrap', textShadow: '0 0 4px #161514,0 0 4px #161514,0 0 4px #161514' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: n.c }}>{n.label}</span>
                      <span style={{ font: `500 8.5px ${GROTESK}`, letterSpacing: '.14em', color: '#7d7873' }}>{n.kind}</span>
                    </div>
                  ))}
                  {packets.map((p, i) => (
                    <div key={`${wave}-${lv}-${i}`} className="io-packet" style={{ position: 'absolute', left: 0, top: 0, width: 7, height: 7, borderRadius: '50%', background: p.c, boxShadow: `0 0 10px ${p.c}`, offsetPath: p.path, offsetRotate: '0deg', animation: p.anim } as React.CSSProperties} />
                  ))}
                </div>
                {win && (
                  <div className="io-banner" style={{ position: 'absolute', left: 24, right: 24, bottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 12, background: '#ece9e4', color: '#161514', boxShadow: '0 18px 50px rgba(0,0,0,.45)' }}>
                    <div>
                      <div style={{ font: `500 11px ${MONO}`, color: '#5f5a55' }}>{last && Object.keys(this.state.cleared).length === this.LV.length ? 'all 5 environments secured' : `environment 0${lv + 1} secured · ${applies} apply`}</div>
                      <div style={{ font: `700 22px/1.15 ${GROTESK}`, marginTop: 3, letterSpacing: '-.01em' }}>{last ? 'Nothing leaves. That’s the job.' : 'Attack wave fully blocked.'}</div>
                    </div>
                    <button type="button" className="io-btn-dark" onClick={() => (last ? (this.log([{ t: '→ /contact', k: 'hl' }]), this.props.onContact?.()) : this.go(lv + 1))}
                      style={{ flex: 'none', padding: '12px 20px', border: 0, borderRadius: 8, background: '#161514', color: '#f1efec', font: `500 14px ${GROTESK}`, cursor: 'pointer' }}>
                      {last ? 'Get in Touch' : 'Next environment →'}
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, padding: '4px 24px 14px', font: `400 10.5px ${MONO}`, color: '#7d7873' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 0, borderTop: '1.5px solid #8a8580' }} />traffic</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 0, borderTop: '1.5px dashed #a08560' }} />data</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 0, borderTop: '2px dotted #d6c7ae' }} />iam / kms</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 0, borderTop: '1.5px dashed #e5484d' }} />exposure</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e5484d', boxShadow: '0 0 8px #e5484d' }} />attack</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f1efec' }} />legit</span>
              </div>
              <div style={{ margin: '0 24px', padding: '16px 18px', border: '1px solid #2a2826', borderRadius: 12, background: 'rgba(255,255,255,.02)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={kicker}>{sn ? `${sn.label.toUpperCase()} · ${KIND[sn.type]}` : 'INSPECTOR'}</div>
                  <div style={{ font: `400 13px/1.5 ${MONO}`, color: '#d8d4ce', marginTop: 6 }}>{inspText}</div>
                </div>
                {sn && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="io-btn-small" onClick={() => sel && this.jump(sel)} style={{ padding: '9px 14px', border: '1px solid #3a3633', borderRadius: 8, background: 'transparent', color: '#e8e6e3', font: `500 12px ${MONO}`, cursor: 'pointer' }}>open file</button>
                    <button type="button" className="io-btn-small" onClick={() => sel && this.probe(sel)} style={{ padding: '9px 14px', border: '1px solid #3a3633', borderRadius: 8, background: 'transparent', color: '#e8e6e3', font: `500 12px ${MONO}`, cursor: 'pointer' }}>probe</button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: editor + terminal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 0 0 24px', minWidth: 0 }}>
              <div style={{ border: '1px solid #2a2826', borderRadius: 12, background: 'rgba(12,11,10,.75)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #2a2826', font: `400 11.5px ${MONO}`, color: '#8a8580' }}><span>~/clients/acme-0423/<span style={{ color: '#e8e6e3' }}>infra</span></span><span>⌘/Ctrl + ↵ apply</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '136px 1fr', height: 372 }}>
                  <div style={{ borderRight: '1px solid #2a2826', padding: '10px 0', font: `400 12px ${MONO}` }}>
                    <div style={{ padding: '4px 14px', color: '#8a8580' }}>▾ infra/</div>
                    {Object.keys(files).map((name) => (
                      <button key={name} type="button" className="io-file" onClick={() => this.openFile(name)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '6px 12px 6px 26px', border: 0, background: name === af ? '#1f1d1b' : 'transparent', color: name === af ? '#f1efec' : '#8a8580', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                        {name}<span style={{ width: 6, height: 6, borderRadius: '50%', background: openFiles.has(name) ? RED : 'transparent' }} />
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #2a2826', overflow: 'hidden' }}>
                      {Object.keys(files).map((name) => (
                        <button key={name} type="button" tabIndex={-1} onClick={() => this.openFile(name)}
                          style={{ flex: 'none', padding: '8px 12px', border: 0, borderRight: '1px solid #2a2826', borderBottom: `1px solid ${name === af ? '#ece0cc' : 'transparent'}`, marginBottom: -1, background: name === af ? 'rgba(255,255,255,.03)' : 'transparent', color: name === af ? '#f1efec' : '#8a8580', font: `400 11px ${MONO}`, cursor: 'pointer' }}>{name}</button>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '34px 1fr', minHeight: 0 }}>
                      <div ref={this.gutRef} aria-hidden="true" style={{ overflow: 'hidden', padding: '10px 8px 10px 0', textAlign: 'right', whiteSpace: 'pre', font: `400 11.5px/18px ${MONO}`, color: '#4a4643' }}>{codeLines.map((_, i) => i + 1).join('\n')}</div>
                      <div style={{ position: 'relative', minWidth: 0 }}>
                        <div ref={this.preRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', padding: '10px 12px', font: `400 11.5px/18px ${MONO}`, whiteSpace: 'pre', tabSize: 2, pointerEvents: 'none' }}>
                          {codeLines.map((s, i) => (
                            <div key={i} style={{ height: 18 }}>{this.hlLine(s).map((t, j) => <span key={j} style={{ color: t.c, fontWeight: t.w, fontStyle: t.i }}>{t.t}</span>)}</div>
                          ))}
                        </div>
                        <textarea ref={this.taRef} value={code} aria-label={`Edit ${af}`} spellCheck={false}
                          onChange={(e) => this.setCode(lv, af, e.target.value)} onKeyDown={onCodeKey} onScroll={(e) => this.sync(e.currentTarget)}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', boxSizing: 'border-box', resize: 'none', border: 0, outline: 'none', background: 'transparent', color: 'transparent', caretColor: '#f1efec', padding: '10px 12px', margin: 0, font: `400 11.5px/18px ${MONO}`, whiteSpace: 'pre', overflow: 'auto', tabSize: 2 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="io-btn-primary" onClick={() => this.apply()} style={{ padding: '13px 24px', border: 0, borderRadius: 8, background: '#ece9e4', color: '#161514', font: `500 15px ${GROTESK}`, cursor: 'pointer', boxShadow: '0 0 24px rgba(255,255,255,.12)' }}>terraform apply</button>
                <button type="button" className="io-btn-outline" onClick={() => this.plan()} style={{ padding: '13px 22px', border: '1px solid #3a3633', borderRadius: 8, background: 'transparent', color: '#e8e6e3', font: `500 15px ${GROTESK}`, cursor: 'pointer' }}>plan</button>
                <button type="button" className="io-btn-ghost" onClick={() => this.reset()} style={{ padding: '13px 18px', border: 0, borderRadius: 8, background: 'transparent', color: '#8a8580', font: `500 15px ${GROTESK}`, cursor: 'pointer' }}>reset files</button>
              </div>
              <div style={{ border: '1px solid #2a2826', borderRadius: 12, background: 'rgba(12,11,10,.75)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...kicker, padding: '9px 14px', borderBottom: '1px solid #2a2826' }}>TERMINAL</div>
                <div ref={this.conRef} role="log" aria-live="polite" style={{ height: 196, overflow: 'auto', padding: '10px 14px', font: `400 11px/1.65 ${MONO}`, whiteSpace: 'pre-wrap' }}>
                  {this.state.lines.map((l, i) => <div key={i} style={{ color: LINE_C[l.k] || LINE_C.ok }}>{l.t || ' '}</div>)}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderTop: '1px solid #2a2826', font: `400 12px ${MONO}` }}>
                  <span style={{ color: '#8a8580' }}>&gt;</span>
                  <input value={this.state.cmd} aria-label="Terminal command" onChange={(e) => this.setState({ cmd: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter' && this.state.cmd.trim()) this.run(this.state.cmd); }}
                    placeholder="help · ls · inspect rds · probe web1 · open iam.tf"
                    style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#e8e6e3', font: 'inherit', padding: 0 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InfraOpsGame;
