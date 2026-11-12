"""Generate the web-ready copies of the photographs in public/gallery/.

The originals are never touched. Their upload-safe twins are written to
gallery-web/ with '~' replaced by '-', scaled to a sane web size, which keeps
the Sites bundle under its 10 MiB limit. Re-run this after adding a photo:

    python3 scripts/build-gallery-web.py    # requires Pillow

The build itself needs no Python: `npm run build` copies gallery-web/ into
dist/gallery/ (see scripts/prepare-gallery.mjs).
"""
import glob
import os

from PIL import Image

SRC = "public/gallery"
OUT = "gallery-web"
MAX_EDGE = 1400

os.makedirs(OUT, exist_ok=True)

for path in sorted(glob.glob(os.path.join(SRC, "*"))):
    name = os.path.basename(path)
    if name.startswith("."):
        continue
    safe = name.replace("~", "-")
    img = Image.open(path)
    img.load()
    fmt, (w, h) = img.format, img.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    if scale < 1.0:
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    dest = os.path.join(OUT, safe)
    if fmt == "JPEG":
        img.convert("RGB").save(dest, "JPEG", quality=82, optimize=True, progressive=True)
    else:
        img.convert("RGB").quantize(
            colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG
        ).save(dest, "PNG", optimize=True)
    print(f"{name} -> {safe}")
