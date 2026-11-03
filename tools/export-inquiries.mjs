#!/usr/bin/env node
/**
 * 查看 / 导出询盘。
 *
 *   node tools/export-inquiries.mjs            表格形式打印最近 30 条
 *   node tools/export-inquiries.mjs --all      打印全部
 *   node tools/export-inquiries.mjs --csv out.csv   导出 CSV
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const file = path.join(root, "data", "inquiries.jsonl");

const args = process.argv.slice(2);
const all = args.includes("--all");
const csvIndex = args.indexOf("--csv");
const csvPath = csvIndex >= 0 ? args[csvIndex + 1] : "";

let raw = "";
try {
  raw = await fs.readFile(file, "utf8");
} catch {
  console.log("还没有询盘记录（data/inquiries.jsonl 不存在）。");
  process.exit(0);
}

const rows = raw
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  })
  .filter(Boolean);

if (rows.length === 0) {
  console.log("还没有询盘记录。");
  process.exit(0);
}

if (csvPath) {
  const cols = ["submittedAt", "name", "company", "email", "contact", "productType", "quantity", "timeline", "useCase", "message"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => escape(r[c])).join(","))].join("\n");
  // 加 BOM，Excel 打开中文不乱码
  await fs.writeFile(csvPath, "\uFEFF" + csv, "utf8");
  console.log(`已导出 ${rows.length} 条到 ${csvPath}`);
  process.exit(0);
}

const list = all ? rows : rows.slice(-30);
console.log(`共 ${rows.length} 条，显示 ${list.length} 条\n`);
for (const r of list) {
  const when = new Date(r.submittedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  console.log(`${when}  ${r.name}${r.company ? " / " + r.company : ""}  <${r.email}>`);
  console.log(`  ${r.productType || "-"} · 数量 ${r.quantity || "-"} · 时间 ${r.timeline || "-"} · 场景 ${r.useCase || "-"}`);
  console.log(`  ${String(r.message || "").replace(/\s+/g, " ").slice(0, 120)}`);
  console.log("");
}
