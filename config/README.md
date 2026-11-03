# 询盘邮件配置

表单提交后，服务端会先把询盘写进 `data/inquiries.jsonl`，再根据这里的配置发一封邮件到你的邮箱。
**即使邮件发不出去，询盘也不会丢**，只是不会主动通知你。

## 启用步骤

1. 复制模板：

   ```bash
   cp config/email.example.json config/email.json
   ```

2. 填入真实参数：

   | 字段 | 说明 |
   |---|---|
   | `smtp.host` | 邮箱服务商的 SMTP 地址 |
   | `smtp.port` / `smtp.secure` | 465 配 `secure: true`；587 配 `false`（会自动 STARTTLS） |
   | `smtp.user` | 发信账号，通常是完整邮箱地址 |
   | `smtp.pass` | **授权码**，不是登录密码 |
   | `mail.from` | 发件人地址，一般与 `smtp.user` 相同 |
   | `mail.to` | 收件人数组，可以填多个 |
   | `mail.subjectPrefix` | 主题前缀，例如 `"[官网] "`，不需要就留空 |

3. 重启服务，页面上提交一次测试询盘。

## 常见服务商参数

| 服务商 | host | 端口 |
|---|---|---|
| 腾讯企业邮 | `smtp.exmail.qq.com` | 465 |
| QQ 邮箱 | `smtp.qq.com` | 465 |
| 网易 163 | `smtp.163.com` | 465 |
| 阿里云企业邮 | `smtp.qiye.aliyun.com` | 465 |
| Gmail | `smtp.gmail.com` | 465 |

授权码在各家邮箱后台的「设置 → 账户 → POP3/SMTP 服务」里开启后生成。

## 安全提醒

`config/email.json` 里是明文凭据，不要提交到公开仓库，也不要放进静态托管目录。
本站的 `.gitignore` 已经排除它，服务端也禁止通过 HTTP 访问 `/config`。
