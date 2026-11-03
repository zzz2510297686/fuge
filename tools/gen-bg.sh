#!/usr/bin/env bash
# 调用 Lovart GPT Image 2.5 Sunburst 把产品图背景换成统一纯色 #F4F4F4
# 用法: gen-bg.sh <product-id> <attachment-url>
set -u

SKILL_DIR="C:/Users/Administrator/.workbuddy/skills/lovart-api"
OUT_DIR="C:/Users/Administrator/AppData/Local/Temp/lovart-out"
THREAD_ID="c9c8f47d-d85e-40b9-ace9-f11a30566d62"
RAW_DIR="D:/FUGE/tools/ai-raw2"

ID="$1"
URL="$2"
mkdir -p "$RAW_DIR"

PROMPT='Replace the background with a perfectly flat uniform #F4F4F4. Absolutely no cast shadow, no drop shadow, no grounding shadow, no gradient, no vignette, no texture: the background must be identical edge to edge. Keep the object exactly as in the reference photo: same camera angle, same silhouette, same size, same position in frame, same surface texture and same lighting. Do not add any props, text, watermark or decoration. Aspect ratio same as input.'

JSON_FILE="/tmp/gen-$ID.json"

# 凭据从环境变量读取，不写进文件（仓库可能被公开）
if [ -z "${LOVART_ACCESS_KEY:-}" ] || [ -z "${LOVART_SECRET_KEY:-}" ]; then
  echo "缺少 LOVART_ACCESS_KEY / LOVART_SECRET_KEY，请先 export 再运行" >&2
  exit 1
fi
export LOVART_ACCESS_KEY LOVART_SECRET_KEY
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
export NO_PROXY="*" no_proxy="*"

cd "$SKILL_DIR" || exit 1
timeout 520 python scripts/agent_skill.py chat \
  --thread-id "$THREAD_ID" \
  --prompt "$PROMPT" \
  --attachments "$URL" \
  --json --download --output-dir "$OUT_DIR" > "$JSON_FILE" 2>&1

python - "$JSON_FILE" "$ID" "$RAW_DIR" <<'PY'
import json, sys, shutil, os
jf, pid, raw = sys.argv[1], sys.argv[2], sys.argv[3]
txt = open(jf, encoding='utf-8', errors='replace').read()
start = txt.find('{')
if start < 0:
    print(f"{pid}\tFAIL\tno json\t{txt[-200:]}"); sys.exit(0)
try:
    d = json.loads(txt[start:])
except Exception as e:
    print(f"{pid}\tFAIL\tparse {e}"); sys.exit(0)

news = [x for x in d.get('downloaded', []) if x.get('new')]
if not news:
    print(f"{pid}\tFAIL\t{ d.get('final_status') } / { d.get('warning','no artifact') }"); sys.exit(0)
src = news[-1]['local_path']
ext = os.path.splitext(src)[1]
dst = os.path.join(raw, f"{pid}{ext}")
shutil.copyfile(src, dst)
print(f"{pid}\tOK\t{dst}")
PY
