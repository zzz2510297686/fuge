/**
 * 极简 SMTP 客户端 —— 只为「把一条询盘发出去」这一个场景服务。
 *
 * 不引第三方依赖，原因：这个站点要能直接扔到任何一台装了 Node 的机器上跑，
 * 不想让它背 node_modules。支持 465 隐式 TLS、587 STARTTLS、25 明文三种连法，
 * 认证支持 AUTH LOGIN（QQ/163/腾讯企业邮/阿里云邮都支持），失败回退 AUTH PLAIN。
 *
 * 只做纯文本正文 + 单个收件人列表，不做附件、不做 HTML。
 */

import net from "node:net";
import tls from "node:tls";
import crypto from "node:crypto";

const CRLF = "\r\n";
const TIMEOUT = 20000;

/** 读一个完整 SMTP 响应（可能是多行 250-xxx ... 250 xxx） */
function readReply(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      // 最后一行必须是 "ddd " 或 "ddd\r\n"
      const lines = buffer.split(CRLF).filter(Boolean);
      const last = lines[lines.length - 1];
      if (last && /^\d{3}(?: |$)/.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), text: buffer });
      }
    };
    const onError = (err) => { cleanup(); reject(err); };
    const onClose = () => { cleanup(); reject(new Error("SMTP connection closed unexpectedly")); };
    function cleanup() {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    }
    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

function connect({ host, port, secure }) {
  return new Promise((resolve, reject) => {
    const socket = secure
      ? tls.connect({ host, port, servername: host, rejectUnauthorized: false })
      : net.connect({ host, port });
    socket.setTimeout(TIMEOUT);
    socket.once("connect", () => resolve(socket));
    socket.once("secureConnect", () => resolve(socket));
    socket.once("error", reject);
    socket.once("timeout", () => reject(new Error(`SMTP 连接超时：${host}:${port}`)));
  });
}

/** 用 TLS 升级现有明文连接（STARTTLS） */
function upgradeToTls(socket, host) {
  return new Promise((resolve, reject) => {
    const secured = tls.connect({ socket, servername: host, rejectUnauthorized: false });
    secured.once("secureConnect", () => resolve(secured));
    secured.once("error", reject);
    secured.once("timeout", () => reject(new Error("STARTTLS 握手超时")));
  });
}

/** 把用户输入压成单行，防止头部注入 */
function oneLine(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function encodeHeaderUtf8(text) {
  return `=?UTF-8?B?${Buffer.from(text, "utf8").toString("base64")}?=`;
}

function wrap76(base64) {
  return base64.replace(/.{1,76}/g, (m) => m + CRLF).trimEnd();
}

function buildMessage({ from, fromName, to, subject, text, replyTo }) {
  const headers = [
    `From: ${fromName ? `${encodeHeaderUtf8(oneLine(fromName))} <${oneLine(from)}>` : oneLine(from)}`,
    `To: ${to.map(oneLine).join(", ")}`,
    `Subject: ${encodeHeaderUtf8(oneLine(subject))}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${crypto.randomUUID()}@${oneLine(from).split("@")[1] || "localhost"}>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ];
  if (replyTo) headers.splice(1, 0, `Reply-To: ${oneLine(replyTo)}`);
  return headers.join(CRLF) + CRLF + CRLF + wrap76(Buffer.from(text, "utf8").toString("base64")) + CRLF;
}

async function command(socket, line, expect = [250]) {
  socket.write(line + CRLF);
  const reply = await readReply(socket);
  if (!expect.includes(reply.code)) {
    throw new Error(`SMTP 命令失败：${line.split(" ")[0]} → ${reply.code} ${reply.text.trim().slice(0, 200)}`);
  }
  return reply;
}

/**
 * @param {object} opts { host, port, secure, user, pass }
 * @param {object} msg  { from, fromName, to, subject, text, replyTo }
 */
export async function sendMail(opts, msg) {
  const { host, port = 465, secure = port === 465, user, pass } = opts;
  let socket = await connect({ host, port, secure });
  const greeting = await readReply(socket);
  if (greeting.code !== 220) throw new Error(`SMTP 拒绝连接：${greeting.text.trim()}`);

  let ehlo = await command(socket, "EHLO fuge-site");
  const caps = ehlo.text.toUpperCase();

  if (!secure && caps.includes("STARTTLS")) {
    await command(socket, "STARTTLS", [220]);
    socket = await upgradeToTls(socket, host);
    ehlo = await command(socket, "EHLO fuge-site");
  }

  if (user && pass) {
    const authHint = ehlo.text.toUpperCase();
    try {
      if (authHint.includes("LOGIN") || !authHint.includes("PLAIN")) {
        await command(socket, "AUTH LOGIN", [334]);
        await command(socket, Buffer.from(oneLine(user), "utf8").toString("base64"), [334]);
        await command(socket, Buffer.from(String(pass), "utf8").toString("base64"), [235]);
      } else {
        const token = Buffer.from(`\u0000${oneLine(user)}\u0000${pass}`, "utf8").toString("base64");
        await command(socket, `AUTH PLAIN ${token}`, [235]);
      }
    } catch (err) {
      throw new Error(`SMTP 认证失败（检查账号与授权码）：${err.message}`);
    }
  }

  const data = buildMessage(msg);
  await command(socket, `MAIL FROM:<${oneLine(msg.from)}>`);
  for (const rcpt of msg.to) await command(socket, `RCPT TO:<${oneLine(rcpt)}>`, [250, 251]);
  await command(socket, "DATA", [354]);
  // 正文里单独一行的 "." 需要转义
  const stuffed = data.replace(/\r\n\./g, "\r\n..");
  socket.write(stuffed.endsWith(CRLF) ? stuffed : stuffed + CRLF);
  socket.write("." + CRLF);
  const accepted = await readReply(socket);
  if (accepted.code !== 250) throw new Error(`SMTP 拒收邮件：${accepted.text.trim().slice(0, 200)}`);

  try {
    socket.write("QUIT" + CRLF);
    socket.end();
  } catch { /* 收尾失败不影响已投递的事实 */ }

  return true;
}
