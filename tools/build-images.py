# -*- coding: utf-8 -*-
"""
FUGE 图片构建脚本
把 assets/ 与 产品场景图/ 里的原始大图，输出为 assets/img/ 下按需尺寸的 WebP。
原图保持不动，随时可以重跑。

用法：python tools/build-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = SRC / "img"
OUT.mkdir(parents=True, exist_ok=True)

QUALITY = 80


def save_webp(im, name, quality=QUALITY):
    path = OUT / name
    im.save(path, "WEBP", quality=quality, method=6)
    kb = path.stat().st_size / 1024
    print(f"  {name:34s} {im.size[0]}x{im.size[1]:<5d} {kb:7.1f} KB")
    return path


def resize_w(im, width):
    if im.width <= width:
        return im.copy()
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def crop_ratio(im, ratio, focus_y=0.5, focus_x=0.5):
    """按目标宽高比裁切，focus 决定保留哪一段。"""
    w, h = im.size
    if w / h > ratio:
        new_w = round(h * ratio)
        left = round((w - new_w) * focus_x)
        box = (left, 0, left + new_w, h)
    else:
        new_h = round(w / ratio)
        top = round((h - new_h) * focus_y)
        box = (0, top, w, top + new_h)
    return im.crop(box)


def main():
    print("hero")
    hero = Image.open(SRC / "hero-alt.png").convert("RGB")
    # 桌面：全出血横幅。焦点略偏下，保留桌面与器物的关系
    wide = crop_ratio(hero, 16 / 9, focus_y=0.42)
    save_webp(wide, "hero-1792.webp")
    save_webp(resize_w(wide, 1200), "hero-1200.webp")
    # 移动：竖幅，避免横幅在窄屏被放大到看不出器物
    tall = crop_ratio(hero, 3 / 4, focus_x=0.55)
    save_webp(resize_w(tall, 900), "hero-mobile-900.webp")
    save_webp(resize_w(tall, 600), "hero-mobile-600.webp")

    print("products")
    products = {
        "tri-bowl": "tri-bowl.png",
        "organic-plate": "organic-plate.png",
        "hex-bowl": "hex-bowl.png",
        "square-plate": "square-plate.png",
        "oval-plate": "oval-plate.png",
        "shallow-bowl": "shallow-bowl.jpeg",
        "deep-bowl": "deep-bowl.jpg",
        "petal-bowl": "petal-bowl.png",
    }
    for pid, fname in products.items():
        im = Image.open(SRC / fname).convert("RGB")
        save_webp(resize_w(im, 1400), f"{pid}-1400.webp")
        save_webp(resize_w(im, 800), f"{pid}-800.webp")

    print("material")
    scene = Image.open(ROOT / "产品场景图" / "微信图片_20260826141006_63_80.jpg").convert("RGB")
    scene_34 = crop_ratio(scene, 3 / 4, focus_y=0.5)
    save_webp(resize_w(scene_34, 1200), "material-1200.webp")
    save_webp(resize_w(scene_34, 700), "material-700.webp")

    print("brand")
    logo = Image.open(SRC / "logo.png").convert("RGBA")
    logo128 = logo.resize((128, 128), Image.LANCZOS)
    logo128.save(SRC / "logo-128.png", optimize=True)
    print(f"  {'logo-128.png':34s} 128x128    {(SRC / 'logo-128.png').stat().st_size / 1024:7.1f} KB")

    fav = logo.resize((64, 64), Image.LANCZOS)
    fav.save(SRC / "favicon-64.png", optimize=True)
    apple = Image.new("RGB", (180, 180), (255, 255, 255))
    mark = logo.resize((140, 140), Image.LANCZOS)
    apple.paste(mark, (20, 20), mark)
    apple.save(SRC / "apple-touch-icon.png", optimize=True)
    print("  favicon-64.png / apple-touch-icon.png")

    print("og")
    og = crop_ratio(hero, 1200 / 630, focus_y=0.45).resize((1200, 630), Image.LANCZOS)
    og.save(SRC / "og-cover.jpg", "JPEG", quality=86, optimize=True)
    print(f"  {'og-cover.jpg':34s} 1200x630   {(SRC / 'og-cover.jpg').stat().st_size / 1024:7.1f} KB")


if __name__ == "__main__":
    main()
