# PandaMobo 熊猫新媒官网

## 本地运行

```bash
npm install
npm run dev -- --port 3456
```

访问 http://localhost:3456 。开发预览会显示带来源说明的通案指标，咨询表单不会发送信息。

## 正式运行

```bash
CONTENT_MODE=production npm run build
CONTENT_MODE=production npm run start
```

生产模式只发布已通过内容门控的资料。部署时可设置 `NEXT_PUBLIC_SITE_URL` 生成绝对 canonical。

咨询表单通过 `POST /api/consult` 提交。设置服务器环境变量 `CONSULT_WEBHOOK_URL`，指向团队可接收咨询线索的 HTTPS 接口。若接收端需要 Bearer 令牌，再设置 `CONSULT_WEBHOOK_TOKEN`。接收端收到的 JSON 包含 `name`、`company`、`role`、`email`、`phone`、`service`、`message`、`privacy`。接收端确认接受线索后返回 2xx，网页才显示成功。发布前用测试线索确认接收端和实际跟进流程。

## 验证

```bash
npm run typecheck
CONTENT_MODE=production npm run build
```
