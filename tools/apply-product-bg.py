#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
把 Lovart 生成的产品图落成站点资产。

做的事（全部是几何/颜色标定，不重新绘制内容）：
  1. 取四角中位数作为背景色，整体偏移到精确 #f4f4f4，保证与 .card-image 的
     --mount 底色无缝；
  2. 裁/补到 4:5（与 .card-image 的 aspect-ratio 一致，避免 cover 二次裁切）；
  3. 以器物外接框为准做统一缩放，让它占画面宽度的 80%，并把外接框中心放到
     (0.50, 0.57)，这样 8 件在网格里的视觉体量一致；
  4. 输出 1400 / 800 两个宽度的 webp。
"""

import glob
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT, "tools", "ai-raw2")
OUT_DIR = os.path.join(ROOT, "assets", "img")

TARGET_BG = 244          # #f4f4f4
ASPECT = 4 / 5           # 宽 / 高
TARGET_WIDTH_FRAC = 0.72  # 器物宽度占画面宽度
MAX_HEIGHT_FRAC = 0.62    # 器物高度上限：保证首页 5:4 容器的 cover 裁切不切到器物
ANCHOR = (0.50, 0.50)    # 器物外接框中心在画面中的相对位置
SIZES = (1400, 800)

IDS = [
    "tri-bowl", "petal-bowl", "oval-plate", "square-plate",
    "hex-bowl", "deep-bowl", "shallow-bowl", "organic-plate",
]


def corner_bg(im):
    """四角小块的中位数亮度，作为背景估计。"""
    w, h = im.size
    box = 48
    vals = []
    for bx, by in ((0, 0), (w - box, 0), (0, h - box), (w - box, h - box)):
        patch = im.crop((bx, by, bx + box, by + box)).convert("L")
        vals.extend(patch.getdata())
    vals.sort()
    return vals[len(vals) // 2]


def fit_aspect(im, bg):
    """裁或补到 4:5。"""
    w, h = im.size
    ratio = w / h
    if abs(ratio - ASPECT) < 0.01:
        return im
    if ratio > ASPECT:                      # 太宽 → 左右裁
        nw = int(round(h * ASPECT))
        left = (w - nw) // 2
        return im.crop((left, 0, left + nw, h))
    nh = int(round(w / ASPECT))             # 太高 → 上下补
    canvas = Image.new("RGB", (w, nh), (bg, bg, bg))
    canvas.paste(im, (0, (nh - h) // 2))
    return canvas


def product_bbox(im, bg):
    """器物（含接触阴影）外接框。"""
    m = im.convert("L").point(lambda v: 255 if abs(v - bg) > 5 else 0)
    bb = m.getbbox()
    return bb or (0, 0, im.size[0], im.size[1])


def normalize(im, bg):
    w, h = im.size
    x0, y0, x1, y1 = product_bbox(im, bg)
    bw, bh = x1 - x0, y1 - y0

    # 统一按「器物宽度 = 画面宽度的 72%」缩放；若高度超过上限则按高度回退，
    # 这样首页 5:4 容器做 cover 裁切时不会切到器物。
    s = (TARGET_WIDTH_FRAC * w) / bw
    if bh * s > MAX_HEIGHT_FRAC * h:
        s = (MAX_HEIGHT_FRAC * h) / bh
    s = max(0.70, min(1.80, s))

    nw, nh = int(round(w * s)), int(round(h * s))
    scaled = im.resize((nw, nh), Image.LANCZOS)

    cx, cy = (x0 + x1) / 2 * s, (y0 + y1) / 2 * s
    px = int(round(ANCHOR[0] * w - cx))
    py = int(round(ANCHOR[1] * h - cy))

    canvas = Image.new("RGB", (w, h), (bg, bg, bg))
    canvas.paste(scaled, (px, py))
    return canvas, s


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"{'id':14s} {'source':12s} {'bg':>4s} {'scale':>6s}  输出")
    for pid in IDS:
        matches = glob.glob(os.path.join(RAW_DIR, pid + ".*"))
        if not matches:
            print(f"{pid:14s} 缺少生成结果")
            continue
        im = Image.open(matches[0]).convert("RGB")
        src_size = f"{im.size[0]}x{im.size[1]}"

        bg = corner_bg(im)
        # 整体偏移，让背景精确等于 TARGET_BG（器件只移动 ≤2 级，肉眼不可见）
        shift = TARGET_BG - bg
        if shift:
            im = im.point(lambda v: max(0, min(255, v + shift)))
        bg = TARGET_BG

        im = fit_aspect(im, bg)
        im, s = normalize(im, bg)

        written = []
        for target_w in SIZES:
            scale = target_w / im.size[0]
            out = im.resize((target_w, int(round(im.size[1] * scale))), Image.LANCZOS)
            path = os.path.join(OUT_DIR, f"{pid}-{target_w}.webp")
            out.save(path, "WEBP", quality=82, method=6)
            written.append(f"{target_w}({os.path.getsize(path)//1024}KB)")
        print(f"{pid:14s} {src_size:12s} {bg:4d} {s:6.2f}  {' '.join(written)}")


if __name__ == "__main__":
    main()
