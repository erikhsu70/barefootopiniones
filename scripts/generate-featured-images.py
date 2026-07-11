from __future__ import annotations

import hashlib
import re
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path.cwd()
IMPORTED_ROOT = ROOT / "src" / "imported"
OUT_ROOT = ROOT / "src" / "assets" / "generated" / "featured"

W, H = 1200, 675

PALETTES = [
    ("#15120f", "#c6503d", "#f4c95d", "#fffaf2"),
    ("#20302a", "#687a43", "#e8b15d", "#fffefd"),
    ("#1d2740", "#274c77", "#f4c95d", "#fffaf2"),
    ("#2f2420", "#a84736", "#e7c58a", "#fffefd"),
    ("#182d34", "#4c7f8a", "#f0c267", "#fffaf2"),
    ("#211a2b", "#8c5a7a", "#e8c36d", "#fffefd"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_DISPLAY = font(68, True)
FONT_TITLE = font(58, True)
FONT_LABEL = font(24, True)
FONT_SMALL = font(22, False)


def split_frontmatter(raw: str) -> tuple[str, str]:
    if not raw.startswith("---\n"):
        return "", raw
    end = raw.find("\n---", 4)
    if end == -1:
        return "", raw
    return raw[: end + 4], raw[end + 4 :].lstrip("\n")


def get_field(frontmatter: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*(.*)$", frontmatter, re.M)
    if not match:
        return ""
    value = match.group(1).strip()
    if value in {"|", ">"}:
        return ""
    if value.startswith(("'", '"')) and value.endswith(("'", '"')):
        value = value[1:-1]
    return value


def set_field(frontmatter: str, key: str, value: str) -> str:
    quoted = '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'
    pattern = rf"^{re.escape(key)}:[^\n]*(?:\n  .*)*"
    replacement = f"{key}: {quoted}"
    if re.search(rf"^{re.escape(key)}:", frontmatter, re.M):
        return re.sub(pattern, replacement, frontmatter, count=1, flags=re.M)
    return frontmatter.replace("\n---", f"\n{replacement}\n---", 1)


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "imagen"


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def blend(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def wrapped_lines(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:4]


def draw_shoe(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str, light: str, seed: int) -> None:
    accent_rgb = hex_to_rgb(accent)
    light_rgb = hex_to_rgb(light)
    outline = (*light_rgb, 225)
    fill = (*accent_rgb, 145)
    sole = [
        (x + int(20 * scale), y + int(230 * scale)),
        (x + int(90 * scale), y + int(160 * scale)),
        (x + int(210 * scale), y + int(115 * scale)),
        (x + int(355 * scale), y + int(130 * scale)),
        (x + int(470 * scale), y + int(205 * scale)),
        (x + int(515 * scale), y + int(290 * scale)),
        (x + int(480 * scale), y + int(350 * scale)),
        (x + int(310 * scale), y + int(370 * scale)),
        (x + int(125 * scale), y + int(335 * scale)),
        (x + int(35 * scale), y + int(285 * scale)),
    ]
    draw.polygon(sole, fill=fill)
    draw.line(sole + [sole[0]], fill=outline, width=max(3, int(5 * scale)), joint="curve")

    for i in range(5):
        cx = x + int((150 + i * 48 + (seed % 9)) * scale)
        cy = y + int((180 - i * 9) * scale)
        r = int((18 - i * 1.4) * scale)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*light_rgb, 215))

    for i in range(4):
        sx = x + int((170 + i * 72) * scale)
        sy = y + int((265 + (i % 2) * 24) * scale)
        draw.arc((sx, sy, sx + int(70 * scale), sy + int(42 * scale)), 190, 345, fill=outline, width=max(2, int(4 * scale)))


def draw_card(title: str, label: str, output: Path, seed_text: str, homepage: bool = False) -> None:
    digest = hashlib.sha1(seed_text.encode("utf-8")).hexdigest()
    seed = int(digest[:8], 16)
    dark, mid, accent, light = PALETTES[seed % len(PALETTES)]
    dark_rgb = hex_to_rgb(dark)
    mid_rgb = hex_to_rgb(mid)
    accent_rgb = hex_to_rgb(accent)
    light_rgb = hex_to_rgb(light)

    gradient_w, gradient_h = 96, 54
    gradient = Image.new("RGB", (gradient_w, gradient_h), dark_rgb)
    px = gradient.load()
    for yy in range(gradient_h):
        for xx in range(gradient_w):
            t = (xx / gradient_w) * 0.72 + (yy / gradient_h) * 0.28
            px[xx, yy] = blend(dark_rgb, mid_rgb, t * 0.72)
    img = gradient.resize((W, H), Image.Resampling.BICUBIC)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    for i in range(7):
        rx = (seed // (i + 3)) % W
        ry = (seed // (i + 7)) % H
        radius = 110 + ((seed >> i) % 160)
        color = (*accent_rgb, 24 + i * 8)
        draw.ellipse((rx - radius, ry - radius, rx + radius, ry + radius), fill=color)

    draw_shoe(draw, 680, 120, 0.9, accent, light, seed)
    draw_shoe(draw, 780, 310, 0.55, mid, light, seed // 3)

    img = Image.alpha_composite(img.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(img)

    margin = 72
    badge = "BAREFOOTOPINIONES"
    draw.rounded_rectangle((margin, 56, margin + 300, 102), radius=23, fill=(*light_rgb, 232), outline=(*light_rgb, 255), width=1)
    draw.text((margin + 20, 66), badge, font=FONT_LABEL, fill=dark_rgb)

    draw.text((margin, 134), label.upper(), font=FONT_LABEL, fill=accent_rgb)

    if homepage:
        lines = ["BarefootOpiniones"]
        title_font = FONT_DISPLAY
    else:
        title_font = FONT_TITLE
        lines = wrapped_lines(draw, title, title_font, 650)

    y = 182
    for line in lines:
        draw.text((margin, y), line, font=title_font, fill=light_rgb)
        y += int(title_font.size * 1.08)

    subtitle = "Isabel, una loca por las barefoot" if homepage else "Guía y reseña barefoot por Isabel"
    draw.text((margin, H - 92), subtitle, font=FONT_SMALL, fill=blend(light_rgb, accent_rgb, 0.18))

    output.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(output, "JPEG", quality=86, optimize=True, progressive=True)


def type_folder(path: Path) -> str:
    if "/posts/" in path.as_posix():
        return "posts"
    if "/faqs/" in path.as_posix():
        return "faqs"
    return "pages"


def main() -> None:
    files = sorted(IMPORTED_ROOT.glob("**/*.md"))
    changed = 0

    for path in files:
        raw = path.read_text(encoding="utf-8")
        frontmatter, body = split_frontmatter(raw)
        if not frontmatter:
            continue

        title = get_field(frontmatter, "title") or path.stem
        permalink = get_field(frontmatter, "permalink") or f"/{path.stem}/"
        content_type = get_field(frontmatter, "contentType") or get_field(frontmatter, "sourceType") or "Artículo"
        slug = slugify(get_field(frontmatter, "sourceSlug") or permalink.strip("/") or path.stem)

        if permalink == "/":
            output = OUT_ROOT / "homepage.jpg"
            public_path = "/assets/generated/featured/homepage.jpg"
            draw_card("BarefootOpiniones", "Soy Isabel", output, "homepage", homepage=True)
            alt = "Imagen destacada de BarefootOpiniones, la guía barefoot de Isabel"
        else:
            folder = type_folder(path)
            output = OUT_ROOT / folder / f"{slug}.jpg"
            public_path = f"/assets/generated/featured/{folder}/{slug}.jpg"
            draw_card(title, content_type, output, f"{permalink}|{title}")
            alt = f"Imagen destacada de {title}"

        next_frontmatter = set_field(frontmatter, "image", public_path)
        next_frontmatter = set_field(next_frontmatter, "imageAlt", alt)
        next_raw = f"{next_frontmatter}\n{body}"
        if next_raw != raw:
            path.write_text(next_raw, encoding="utf-8")
            changed += 1

    print(f"Generated featured images for {len(files)} files")
    print(f"Updated frontmatter in {changed} files")


if __name__ == "__main__":
    main()
