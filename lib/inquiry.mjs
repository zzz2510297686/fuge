/**
 * 询盘处理：校验 → 落盘 → 发邮件。
 *
 * 顺序刻意这样排：先落盘再发信。邮件挂了询盘也不会丢，用户看到的仍然是「已收到」。
 */

import fs from "node:fs/promises";
import path from "node:path";
import { sendMail } from "./smtp.mjs";

const FIELD_LIMITS = {
  name: 80,
  company: 120,
  email: 160,
  contact: 80,
  productType: 40,
  quantity: 60,
  timeline: 60,
  useCase: 120,
  message: 4000,
};

const PRODUCT_LABELS = {
  plates: "盘类 / Plates",
  bowls: "碗类 / Bowls",
  mixed: "组合项目 / Mixed set",
  other: "其他 / Other",
};

/** 每个 IP 的提交频率限制，纯内存，重启即清零 */
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  entry.count += 1;
  hits.set(ip, entry);
  // 顺手清理过期记录，避免 Map 无限增长
  if (hits.size > 500) {
    for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
  }
  return entry.count > MAX_PER_WINDOW;
}

function clean(value, max) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

export function validate(raw) {
  const errors = [];
  const data = {};

  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    data[key] = clean(raw?.[key], max);
  }

  if (data.name.length < 1) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push("email");
  if (data.message.length < 4) errors.push("message");

  return { ok: errors.length === 0, errors, data };
}

/** 把询盘写成一封信，纯文本，手机上一眼能看完 */
export function formatMail(data, meta = {}) {
  const lines = [
    "浮格 FUGE · 官网新的定制询盘",
    "",
    `姓名：${data.name}`,
    `公司：${data.company || "—"}`,
    `邮箱：${data.email}`,
    `微信 / 电话：${data.contact || "—"}`,
    "",
    `产品类型：${PRODUCT_LABELS[data.productType] || data.productType || "—"}`,
    `预计数量：${data.quantity || "—"}`,
    `项目时间：${data.timeline || "—"}`,
    `使用场景：${data.useCase || "—"}`,
    "",
    "需求描述：",
    data.message,
    "",
    "———",
    `提交时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
    `来源页面：${meta.page || "contact.html"}`,
    meta.ip ? `IP：${meta.ip}` : "",
  ].filter(Boolean);

  return {
    subject: `[官网询盘] ${data.name}${data.company ? " · " + data.company : ""} · ${PRODUCT_LABELS[data.productType]?.split(" / ")[0] || "定制需求"}`,
    text: lines.join("\n"),
  };
}

/** 追加一行 JSON。即使并发也只是一次 O_APPEND，不会互相覆盖。 */
export async function persist(root, record) {
  const dir = path.join(root, "data");
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(path.join(dir, "inquiries.jsonl"), JSON.stringify(record) + "\n", "utf8");
}

/** 读邮件配置；文件不存在就返回 null，走「只落盘」模式 */
export async function loadMailConfig(root) {
  try {
    const raw = await fs.readFile(path.join(root, "config", "email.json"), "utf8");
    const cfg = JSON.parse(raw);
    if (!cfg?.smtp?.host || !Array.isArray(cfg?.mail?.to) || cfg.mail.to.length === 0) return null;
    return cfg;
  } catch {
    return null;
  }
}

export async function deliver(root, data, meta) {
  const cfg = await loadMailConfig(root);
  if (!cfg) return { delivered: false, reason: "未配置 config/email.json，仅保存到 data/inquiries.jsonl" };

  const { subject, text } = formatMail(data, meta);
  await sendMail(
    {
      host: cfg.smtp.host,
      port: cfg.smtp.port ?? 465,
      secure: cfg.smtp.secure ?? (cfg.smtp.port ?? 465) === 465,
      user: cfg.smtp.user,
      pass: cfg.smtp.pass,
    },
    {
      from: cfg.mail.from || cfg.smtp.user,
      fromName: cfg.mail.fromName || "浮格 FUGE 官网",
      to: cfg.mail.to,
      subject: `${cfg.mail.subjectPrefix ?? ""}${subject}`,
      text,
      replyTo: data.email,
    }
  );
  return { delivered: true };
}
