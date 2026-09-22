"""Generate favicon PNGs from the HarborIQ shield mark.

The source PNG was background-removed from a dark navy render, so it carries
faint dark glow artifacts. We composite it onto a rounded brand-navy tile
(#0B1E30) so those artifacts read as intended glow rather than grey fringing.
"""
from PIL import Image, ImageDraw

SRC = "/home/user/workspace/logo_extract/harboriq-logo-mark.png"
OUT_DIR = "/home/user/workspace/harboriq-marketing/client/public"
NAVY = (11, 30, 48, 255)

mark = Image.open(SRC).convert("RGBA")

# Tight-crop to the mark's actual bounding box so it fills the tile.
bbox = mark.getbbox()
mark = mark.crop(bbox)


def build(size: int, radius_ratio: float = 0.22, inset_ratio: float = 0.10) -> Image.Image:
    ss = size * 8  # supersample for clean rounded corners
    tile = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    mask = Image.new("L", (ss, ss), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, ss - 1, ss - 1], radius=int(ss * radius_ratio), fill=255
    )
    bg = Image.new("RGBA", (ss, ss), NAVY)
    tile = Image.composite(bg, tile, mask)

    inset = int(ss * inset_ratio)
    box = ss - 2 * inset
    w, h = mark.size
    scale = min(box / w, box / h)
    m = mark.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    tile.alpha_composite(m, ((ss - m.width) // 2, (ss - m.height) // 2))
    return tile.resize((size, size), Image.LANCZOS)


for s in (32, 64, 180):
    name = "apple-touch-icon.png" if s == 180 else f"favicon-{s}.png"
    build(s).save(f"{OUT_DIR}/{name}")
    print("wrote", name)
