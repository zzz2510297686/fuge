import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validate, rateLimited, persist, deliver } from "./lib/inquiry.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};

// 这些目录是工程资料，不该通过 HTTP 暴露出去
const BLOCKED = /^\/(data|config|lib|tools|evidence|\.workbuddy)(\/|$)/i;

function sendJson(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

function readBody(req, limit = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("请求体过大"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (raw?.split(",")[0] || req.socket.remoteAddress || "unknown").trim();
}

async function handleInquiry(req, res) {
  const ip = clientIp(req);

  if (rateLimited(ip)) {
    sendJson(res, 429, { ok: false, error: "too_many_requests" });
    return;
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (err) {
    sendJson(res, err.status || 400, { ok: false, error: "bad_request" });
    return;
  }

  // 隐藏字段只有机器人会填；填了就静默当成功，不给它任何反馈
  if (String(body?._gotcha ?? "").trim() !== "") {
    sendJson(res, 200, { ok: true, delivered: true });
    return;
  }

  const { ok, errors, data } = validate(body);
  if (!ok) {
    sendJson(res, 422, { ok: false, error: "validation_failed", fields: errors });
    return;
  }

  const record = {
    ...data,
    submittedAt: new Date().toISOString(),
    ip,
    userAgent: String(req.headers["user-agent"] ?? "").slice(0, 240),
    referer: String(req.headers["referer"] ?? "").slice(0, 240),
  };

  let saved = true;
  try {
    await persist(root, record);
  } catch (err) {
    saved = false;
    console.error("[inquiry] 写入失败：", err.message);
  }

  let delivered = false;
  let reason = "";
  try {
    const result = await deliver(root, data, { ip, page: record.referer });
    delivered = result.delivered;
    reason = result.reason ?? "";
  } catch (err) {
    reason = err.message;
    console.error("[inquiry] 邮件发送失败：", err.message);
  }

  if (!saved && !delivered) {
    sendJson(res, 500, { ok: false, error: "delivery_failed" });
    return;
  }

  console.log(`[inquiry] ${data.name} <${data.email}> 保存=${saved} 邮件=${delivered}${reason ? " · " + reason : ""}`);
  sendJson(res, 200, { ok: true, delivered });
}

const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);

  if (url === "/api/inquiry") {
    if (req.method !== "POST") {
      res.writeHead(405, { Allow: "POST" });
      res.end();
      return;
    }
    await handleInquiry(req, res);
    return;
  }

  if (url === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (BLOCKED.test(url)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const rel = url === "/" ? "/index.html" : url;
  const file = path.join(root, rel);

  // 防目录穿越
  if (!file.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=604800",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`FUGE preview server running at http://localhost:${port}`);
  console.log(`询盘接口：POST /api/inquiry · 数据落在 data/inquiries.jsonl`);
});
