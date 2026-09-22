"""Produce web-sized variants of the HarborIQ brand PNGs.

The originals (495px mark / 908px lockup) stay in client/src/assets as the
source of truth; the UI imports these lighter variants so the nav/footer logo
isn't a 200-440KB download.
"""
from PIL import Image

A = "/home/user/workspace/harboriq-marketing/client/src/assets"

# Mark: tight-cropped, rendered at up to ~40px CSS height -> 160px covers 4x DPR.
mark = Image.open(f"{A}/harboriq-logo-mark-tight.png").convert("RGBA")
w, h = mark.size
scale = 160 / h
mark.resize((round(w * scale), 160), Image.LANCZOS).save(
    f"{A}/harboriq-mark-web.png", optimize=True
)

# Full lockup: rendered at up to ~56px CSS height -> 224px covers 4x DPR.
full = Image.open(f"{A}/harboriq-logo-full.png").convert("RGBA")
w, h = full.size
scale = 224 / h
full.resize((round(w * scale), 224), Image.LANCZOS).save(
    f"{A}/harboriq-lockup-web.png", optimize=True
)

for n in ("harboriq-mark-web.png", "harboriq-lockup-web.png"):
    im = Image.open(f"{A}/{n}")
    print(n, im.size)
