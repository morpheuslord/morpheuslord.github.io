"""Render public/og-image.jpg, the 1200x630 card shown when the site link is shared.

Run from the repo root:  python3 scripts/gen_og_image.py
Needs Pillow with AVIF support. Fonts (OFL, from google/fonts) are fetched into
~/.cache/og-fonts on first run.
"""

import random
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og-image.jpg"
AVATAR = ROOT / "avatar.avif"

FONT_DIR = Path.home() / ".cache" / "og-fonts"
FONTS = {
    "grotesk": "https://github.com/google/fonts/raw/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf",
    "mono": "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf",
}

# Supersample, then downscale, so rounded corners and thin rules stay clean.
S = 2
W, H = 1200 * S, 630 * S

BG = (8, 8, 8)
FG = (242, 242, 242)
MUTED = (140, 140, 140)
DIM = (82, 82, 82)
LINE = (38, 38, 38)
GREEN = (16, 185, 129)


def font(name: str, size: int, weight: str) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / f"{name}.ttf"
    if not path.exists():
        FONT_DIR.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(FONTS[name], path)
    f = ImageFont.truetype(str(path), size * S)
    f.set_variation_by_name(weight)
    return f


def px(v: float) -> int:
    return int(v * S)


def main() -> None:
    img = Image.new("RGB", (W, H), BG)

    # Ambient light from the top left, the same soft white bloom the hero uses.
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((px(-260), px(-360), px(760), px(420)), fill=34)
    glow = glow.filter(ImageFilter.GaussianBlur(px(140)))
    img.paste((255, 255, 255), mask=glow)

    d = ImageDraw.Draw(img)

    # Faint grid, the same 48px rhythm as the hero background.
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = px(48)
    for x in range(0, W, step):
        gd.line((x, 0, x, H), fill=(255, 255, 255, 12), width=S)
    for y in range(0, H, step):
        gd.line((0, y, W, y), fill=(255, 255, 255, 12), width=S)
    img.paste(grid, mask=grid)

    # Top bar: prompt-style domain on the left, availability on the right.
    mono_s = font("mono", 20, "Medium")
    d.text((px(72), px(58)), ">", font=mono_s, fill=DIM)
    d.text((px(94), px(58)), "chiranjeevi.site", font=mono_s, fill=FG)

    avail = "Available for opportunities"
    mono_xs = font("mono", 16, "Regular")
    aw = d.textlength(avail, font=mono_xs)
    pill_r = px(1128)
    pill_l = pill_r - aw - px(52)
    d.rounded_rectangle((pill_l, px(50), pill_r, px(88)), radius=px(19), outline=LINE, width=S, fill=(14, 14, 14))
    d.ellipse((pill_l + px(18), px(65), pill_l + px(26), px(73)), fill=GREEN)
    d.text((pill_l + px(36), px(59)), avail, font=mono_xs, fill=MUTED)

    # Name, set like the hero: first name bright, surname receding.
    name = font("grotesk", 104, "Bold")
    d.text((px(66), px(132)), "Chiranjeevi", font=name, fill=FG)
    d.text((px(66), px(242)), "Naidu", font=name, fill=DIM)

    # Role line.
    role = font("mono", 24, "Bold")
    d.text((px(72), px(392)), "Lead Security Engineer", font=role, fill=FG)
    sub = font("mono", 20, "Regular")
    d.text((px(72), px(432)), "Cloud Security · DevSecOps · Secure Architecture", font=sub, fill=MUTED)

    # Stats strip.
    d.line((px(72), px(492), px(1128), px(492)), fill=LINE, width=S)
    stats = [("3 Years", "EXPERIENCE"), ("1,665", "GITHUB STARS"), ("7", "RESEARCH PAPERS"), ("CEH v12, CND", "CERTIFICATIONS")]
    val_f = font("mono", 28, "Bold")
    lab_f = font("mono", 13, "Medium")
    x = px(72)
    for value, label in stats:
        d.text((x, px(516)), value, font=val_f, fill=FG)
        d.text((x, px(560)), label, font=lab_f, fill=MUTED)
        x += max(d.textlength(value, font=val_f), d.textlength(label, font=lab_f)) + px(56)

    # Avatar panel with corner brackets, echoing the site's framed ASCII stage.
    box = (px(828), px(128), px(1128), px(428))
    d.rounded_rectangle(box, radius=px(20), fill=(13, 13, 13), outline=LINE, width=S)
    avatar = Image.open(AVATAR).convert("RGBA").resize((px(236), px(236)), Image.NEAREST)
    img.paste(avatar, (box[0] + px(32), box[1] + px(32)), avatar)
    b = px(22)
    for cx, cy, dx, dy in [(box[0], box[1], 1, 1), (box[2], box[1], -1, 1), (box[0], box[3], 1, -1), (box[2], box[3], -1, -1)]:
        ox, oy = cx - dx * px(12), cy - dy * px(12)
        d.line((ox, oy, ox + dx * b, oy), fill=MUTED, width=px(2))
        d.line((ox, oy, ox, oy + dy * b), fill=MUTED, width=px(2))

    img = img.resize((1200, 630), Image.LANCZOS)

    # Fine grain so the flat black doesn't band in chat-app recompression.
    rnd = random.Random(7)
    noise = Image.new("L", img.size)
    noise.putdata([rnd.randint(0, 255) for _ in range(img.size[0] * img.size[1])])
    img = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.025)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, quality=90, optimize=True, progressive=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
