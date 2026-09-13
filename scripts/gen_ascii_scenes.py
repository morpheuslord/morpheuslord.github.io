#!/usr/bin/env python3
"""Turn images and hand-drawn art into coloured ASCII scenes for AsciiStage.

Run from the repo root:  python3 scripts/gen_ascii_scenes.py

Writes src/data/asciiScenes.ts. Re-run it whenever avatar.avif, the favicon or
the hand-drawn scenes below change.

Encoding: every scene is a flat list of row strings. Each cell is three
characters, "<glyph><fg><bg>", where fg and bg are base36 indices into a shared
palette. That keeps a 72x43 grid down to ~9KB of string per scene instead of
~43KB of inline hex, and it gzips well.
"""

import os
from PIL import Image

COLS = 72
ROWS = 43                      # COLS * 0.6, so a monospace grid comes out square
BG = (10, 10, 11)              # card background, what edges fade into
B36 = "0123456789abcdefghijklmnopqrstuvwxyz"
RAMP = " .:-=+*#%@"


def clamp(v):
    return max(0, min(255, int(round(v))))


def mix(c1, c2, t):
    return tuple(clamp(a + (b - a) * t) for a, b in zip(c1, c2))


def lum(c):
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255


def saturate(c, k):
    g = sum(c) / 3
    return tuple(clamp(g + (v - g) * k) for v in c)


def vignette(x, y, cols, rows):
    """1 in the middle, 0 at the corners. Blends a square image into the card."""
    dx = (x + 0.5) / cols * 2 - 1
    dy = (y + 0.5) / rows * 2 - 1
    d = (dx * dx + dy * dy) ** 0.5
    if d <= 0.78:
        return 1.0
    if d >= 1.06:
        return 0.0
    return 1.0 - (d - 0.78) / (1.06 - 0.78)


def from_image(path, *, duotone=None, sat=1.0, gamma=1.0, framed=True,
               lo=0.02, hi=0.98):
    """Block-ramp render: one visible glyph per cell, picked by contrast
    stretched luminance, coloured from the pixel. Reads as ASCII art rather
    than as a photo, which is the point."""
    ramp = " .:-=+*oO0#%@"
    blocks = " .:-=+*#%@"
    im = Image.open(path).convert("RGB").resize((COLS, ROWS), Image.LANCZOS)
    px = im.load()

    # Contrast stretch across the actual range in the image, so a dark mark on
    # a dark ground still produces glyphs instead of a field of spaces.
    vals = [lum(px[x, y]) for y in range(ROWS) for x in range(COLS)]
    vals.sort()
    v_lo = vals[int(len(vals) * lo)]
    v_hi = vals[int(len(vals) * hi) - 1]
    span = max(1e-6, v_hi - v_lo)

    cells = []
    for y in range(ROWS):
        row = []
        for x in range(COLS):
            c = px[x, y]
            t = min(1.0, max(0.0, (lum(c) - v_lo) / span)) ** gamma
            if duotone:
                col = mix(duotone[0], duotone[1], t)
            else:
                col = saturate(c, sat)
                # lift the ink so mid-dark pixels still read against the card
                col = mix(col, (255, 255, 255), 0.10)
            v = vignette(x, y, COLS, ROWS)
            if framed:
                col = mix(BG, col, v)
            g = ramp[min(len(ramp) - 1, int(t * len(ramp) * v))]
            row.append((g, col, BG))
        cells.append(row)
    _ = blocks
    return cells


def from_text(art, fg_for, bg=BG):
    """Hand-drawn scene, centred in the grid both ways."""
    art = list(art)[:ROWS]
    wide = max((len(ln) for ln in art), default=0)
    left = max(0, (COLS - wide) // 2)
    rows = [(" " * left + ln).ljust(COLS)[:COLS] for ln in art]
    pad = ROWS - len(rows)
    top = pad // 2
    rows = [" " * COLS] * top + rows + [" " * COLS] * (pad - top)
    cells = []
    for y, line in enumerate(rows):
        row = []
        for x, ch in enumerate(line):
            row.append((ch, fg_for(ch, x, y) if ch != " " else bg, bg))
        cells.append(row)
    return cells


# ---------------------------------------------------------------- scenes ----

TERMINAL_ART = [
    ".--------------------------------------------------------------.",
    "|  o  o  o                                         chiranjeevi  |",
    "|--------------------------------------------------------------|",
    "|                                                              |",
    "|  $ whoami                                                    |",
    "|  lead security engineer                                      |",
    "|                                                              |",
    "|  $ cat focus.txt                                             |",
    "|  cloud security                                              |",
    "|  devsecops                                                   |",
    "|  secure architecture                                         |",
    "|                                                              |",
    "|  $ uptime --lab                                              |",
    "|  proxmox cluster, up 412 days                                |",
    "|                                                              |",
    "|  $ ls ~/projects | head -3                                   |",
    "|  picotty   gpt-vuln-analyzer   hackbot                       |",
    "|                                                              |",
    "|  $ _                                                         |",
    "|                                                              |",
    "'--------------------------------------------------------------'",
    "          .----------------------------------------.",
    "    .----------------------------------------------------.",
]

HOMELAB_ART = [
    "+==============================================+",
    "|                                              |",
    "|  [####]  proxmox-01    32G   up 412d     o   |",
    "|  [####]  proxmox-02    32G   up 412d     o   |",
    "|  [####]  proxmox-03    16G   rebuild     .   |",
    "|                                              |",
    "+==============================================+",
    "|                                              |",
    "|  [::::]  nas / zfs     24T   healthy     o   |",
    "|  [::::]  picotty hub   pi0   serving     o   |",
    "|                                              |",
    "+==============================================+",
    "|                                              |",
    "|  [----]  switch        8p    link up     o   |",
    "|  [----]  ups           98%   on line     o   |",
    "|                                              |",
    "+==============================================+",
    "",
    "      tailscale mesh  .  no public ingress",
]

AMBER = (255, 176, 46)
GREEN = (94, 234, 130)
CYAN = (56, 210, 232)
DIM = (110, 118, 128)


def terminal_ink(ch, x, y):
    if ch == "$":
        return GREEN
    if ch == "_":
        return GREEN
    if ch in "|'.-o":
        return DIM
    return AMBER


def homelab_ink(ch, x, y):
    if ch == "o":
        return GREEN
    if ch in "+=|":
        return DIM
    if ch in "[]#:-":
        return CYAN
    return (196, 202, 212)


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    scenes = [
        ("me", from_image("avatar.avif", sat=1.18)),
        (
            "logo",
            # The favicon is near-black; a duotone gives it some life without
            # repainting the mark itself.
            from_image(
                "public/favicon-32x32.png",
                duotone=((6, 12, 20), (86, 226, 245)),
                gamma=0.72,
            ),
        ),
        ("terminal", from_text(TERMINAL_ART, terminal_ink)),
        ("homelab", from_text(HOMELAB_ART, homelab_ink)),
    ]

    # Shared palette, quantised to fit base36.
    seen = {}
    for _, grid in scenes:
        for row in grid:
            for _, fg, bg in row:
                for c in (fg, bg):
                    q = (c[0] >> 3 << 3, c[1] >> 3 << 3, c[2] >> 3 << 3)
                    seen[q] = seen.get(q, 0) + 1

    palette = [c for c, _ in sorted(seen.items(), key=lambda kv: -kv[1])][:36]
    if BG not in palette:
        palette[-1] = BG

    def nearest(c):
        q = (c[0] >> 3 << 3, c[1] >> 3 << 3, c[2] >> 3 << 3)
        best, bi = 1 << 30, 0
        for i, p in enumerate(palette):
            d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2
            if d < best:
                best, bi = d, i
        return bi

    cache = {}

    def idx(c):
        if c not in cache:
            cache[c] = nearest(c)
        return cache[c]

    out = [
        "// GENERATED by scripts/gen_ascii_scenes.py. Do not edit by hand.",
        "// Each cell is 3 chars: <glyph><fg base36><bg base36> into PALETTE.",
        "",
        f"export const COLS = {COLS};",
        f"export const ROWS = {ROWS};",
        f'export const BG_HEX = "#{BG[0]:02x}{BG[1]:02x}{BG[2]:02x}";',
        "",
        "export const PALETTE: string[] = [",
    ]
    for c in palette:
        out.append(f'  "#{c[0]:02x}{c[1]:02x}{c[2]:02x}",')
    out.append("];")
    out.append("")
    out.append("export const SCENES: { label: string; rows: string[] }[] = [")
    for label, grid in scenes:
        out.append("  {")
        out.append(f'    label: "{label}",')
        out.append("    rows: [")
        for row in grid:
            s = "".join(
                (ch if ch != '"' else "'") + B36[idx(fg)] + B36[idx(bg)]
                for ch, fg, bg in row
            )
            s = s.replace("\\", "\\\\")
            out.append(f'      "{s}",')
        out.append("    ],")
        out.append("  },")
    out.append("];")
    out.append("")

    with open("src/data/asciiScenes.ts", "w", encoding="utf-8") as f:
        f.write("\n".join(out))

    size = os.path.getsize("src/data/asciiScenes.ts")
    print(f"wrote src/data/asciiScenes.ts  {COLS}x{ROWS}  "
          f"{len(scenes)} scenes  {len(palette)} colours  {size/1024:.1f}KB")


if __name__ == "__main__":
    main()
