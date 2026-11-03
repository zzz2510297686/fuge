#!/usr/bin/env node
/**
 * SMTP 客户端的离线自测：起一个会说 SMTP 的假服务器，把 lib/smtp.mjs 走一遍，
 * 再解析收到的报文，确认中文主题、正文、Reply-To 都没问题。
 *
 *   node tools/test-smtp.mjs
 *
 * 它不发真实邮件，只验证协议流程与报文格式。
 */

import net from "node:net";
import { sendMail } from "../lib/smtp.mjs";

const PORT = 2525;
let received = "";
let finished;
const done = new Promise((resolve) => (finished = resolve));

const server = net.createServer((socket) => {
  socket.setEncoding("utf8");
  socket.write("220 mock.smtp ESMTP ready\r\n");
  let buffer = "";
  let inData = false;
  let authStep = 0;

  socket.on("data", (chunk) => {
    buffer += chunk;
    let idx;
    // DATA 阶段按 "CRLF.CRLF" 结束，其余按行
    while (true) {
      if (inData) {
        idx = buffer.indexOf("\r\n.\r\n");
        if (idx === -1) break;
        received += buffer.slice(0, idx);
        buffer = buffer.slice(idx + 5);
        inData = false;
        socket.write("250 2.0.0 Ok: queued as ABC123\r\n");
        continue;
      }
      idx = buffer.indexOf("\r\n");
      if (idx === -1) break;
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      if (/^EHLO/i.test(line)) {
        socket.write("250-mock.smtp\r\n250-AUTH LOGIN PLAIN\r\n250-8BITMIME\r\n250 OK\r\n");
      } else if (/^AUTH LOGIN/i.test(line)) {
        socket.write("334 VXNlcm5hbWU6\r\n"); // "Username:"
        authStep = 1;
      } else if (authStep === 1) {
        socket.write("334 UGFzc3dvcmQ6\r\n"); // "Password:"
        authStep = 2;
      } else if (authStep === 2) {
        socket.write("235 2.7.0 Authentication successful\r\n");
        authStep = 3;
      } else if (/^MAIL FROM/i.test(line) || /^RCPT TO/i.test(line)) {
        socket.write("250 2.1.0 Ok\r\n");
      } else if (/^DATA/i.test(line)) {
        inData = true;
        socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
      } else if (/^QUIT/i.test(line)) {
        socket.write("221 2.0.0 Bye\r\n");
        socket.end();
        server.close();
        finished();
      } else {
        socket.write("250 OK\r\n");
      }
    }
  });
});

server.listen(PORT, async () => {
  const started = Date.now();
  try {
    await sendMail(
      { host: "127.0.0.1", port: PORT, secure: false, user: "noreply@example.com", pass: "secret" },
      {
        from: "noreply@example.com",
        fromName: "浮格 FUGE 官网",
        to: ["sales@example.com", "boss@example.com"],
        subject: "[官网询盘] 张测试 · 测试餐饮 · 碗类",
        text: "姓名：张测试\n公司：测试餐饮\n\n需求描述：\n需要一个婚宴用的碗类套装，米白色纸浆材质。",
        replyTo: "customer@example.com",
      }
    );
    console.log(`协议流程通过，耗时 ${Date.now() - started}ms`);
  } catch (err) {
    console.error("发送失败：", err.message);
    server.close();
    process.exit(1);
  }

  await done;
  await new Promise((r) => setTimeout(r, 120));

  const checks = [];
  const check = (name, pass, detail = "") => {
    checks.push(pass);
    console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  };

  const [head, bodyBase64 = ""] = received.split("\r\n\r\n");
  const headerLines = head.split("\r\n");
  const header = (key) => {
    const line = headerLines.find((l) => l.toLowerCase().startsWith(key.toLowerCase() + ":"));
    return line ? line.slice(key.length + 1).trim() : "";
  };

  check("包含 From 且带显示名", /=\?UTF-8\?B\?/.test(header("From")), header("From"));
  check("两个收件人都在 To 里", header("To").includes("sales@example.com") && header("To").includes("boss@example.com"));
  check("Reply-To 指向客户邮箱", header("Reply-To") === "customer@example.com");
  check("Subject 为 RFC2047 编码", /^=\?UTF-8\?B\?.+\?=$/.test(header("Subject")));

  const decode = (s) => {
    const m = s.match(/=\?UTF-8\?B\?(.+)\?=/);
    return m ? Buffer.from(m[1], "base64").toString("utf8") : s;
  };
  const subject = decode(header("Subject"));
  check("主题中文解码正确", subject === "[官网询盘] 张测试 · 测试餐饮 · 碗类", subject);

  const body = Buffer.from(bodyBase64.replace(/\r\n/g, ""), "base64").toString("utf8");
  check("正文中文完整", body.includes("需要一个婚宴用的碗类套装，米白色纸浆材质。"));
  check("正文换行保留", body.split("\n").length >= 5, `${body.split("\n").length} 行`);
  check("声明 UTF-8 与 base64", /charset="UTF-8"/.test(header("Content-Type")) && /base64/.test(header("Content-Transfer-Encoding")));
  check("有 Date 与 Message-ID", Boolean(header("Date")) && Boolean(header("Message-ID")));

  const failed = checks.filter((c) => !c).length;
  console.log(`\n${checks.length - failed}/${checks.length} 通过`);
  process.exit(failed ? 1 : 0);
});
