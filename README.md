# 🎤 AI面试助手

基于 Node.js + Kimi AI 的实时面试辅助工具，支持语音识别和智能答题。

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ 功能特性

- 🎙️ **语音识别**：实时语音转文字，支持编程术语自动纠正
- 🤖 **AI 智能回答**：对接 Kimi 大模型，流式输出，1秒首字响应
- ⌨️ **文字输入**：支持手动输入面试问题
- 📱 **双栏布局**：左侧文字输入，右侧语音输入，独立显示 AI 回答
- 🎨 **深色主题**：深灰色背景，橙色强调色，护眼设计
- ⚡ **极速响应**：高速模型 + 流式输出，2秒内完成回答

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- 现代浏览器（Chrome/Edge/Firefox/Safari）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/interview-assistant.git
cd interview-assistant
```

2. **安装依赖**
```bash
npm install
```

3. **配置 API Key**

复制 `.env.example` 为 `.env`，填入你的 Kimi API Key：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
KIMI_API_KEY=your_kimi_api_key_here
KIMI_API_URL=https://api.moonshot.cn/v1/chat/completions
PORT=3000
```

> 💡 获取 Kimi API Key：[Moonshot AI 开放平台](https://platform.moonshot.cn/)

4. **启动服务**
```bash
npm start
```

5. **访问应用**

打开浏览器访问：`http://localhost:3000`

## 📖 使用说明

### 文字输入模式

1. 在左侧输入框输入面试问题
2. 按回车或点击发送按钮
3. AI 回答显示在左侧上方区域

### 语音输入模式

1. 点击右侧麦克风按钮 🎤
2. 允许浏览器访问麦克风
3. 对着麦克风说出面试问题
4. AI 回答显示在右侧上方区域

> ⚠️ **注意**：语音识别需要 HTTPS 环境或 localhost。部署到云服务器时，请配置 HTTPS 证书。

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送文字问题 |
| `Shift + Enter` | 输入框换行 |

## 🏗️ 项目结构

```
interview-assistant/
├── server.js              # Express 服务器
├── package.json           # 项目配置
├── .env                   # 环境变量（需自行创建）
├── .env.example           # 环境变量示例
├── README.md              # 项目说明
├── data/
│   └── questions.json     # 面试题库（备用）
└── public/
    ├── index.html         # 前端页面
    ├── style.css          # 样式文件
    ├── app.js             # 前端逻辑
    └── tech-dictionary.js # 编程术语词典
```

## 🔧 技术栈

### 后端
- **Express.js**: Web 服务器框架
- **Socket.io**: 实时通信
- **Kimi API**: AI 大模型接口

### 前端
- **原生 JavaScript**: 应用逻辑
- **Web Speech API**: 语音识别（浏览器内置）
- **Socket.io Client**: 实时通信
- **Marked.js**: Markdown 渲染
- **Highlight.js**: 代码高亮

### AI 模型
- **Kimi k2.7-code-highspeed**: 高速模型，快速响应

## 🌐 部署指南

### 使用 PM2 部署（推荐）

1. **安装 PM2**
```bash
npm install -g pm2
```

2. **启动服务**
```bash
pm2 start server.js --name interview-assistant
```

3. **保存配置**
```bash
pm2 save
pm2 startup
```

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```bash
docker build -t interview-assistant .
docker run -d -p 3000:3000 --env-file .env interview-assistant
```

### Nginx 反向代理（配置 HTTPS）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ⚠️ 常见问题

### 1. 语音识别无法启动

**原因**：浏览器安全策略要求麦克风访问必须在 HTTPS 或 localhost 环境下。

**解决**：
- 本地开发：使用 `http://localhost:3000`
- 生产环境：配置 HTTPS 证书
- 云服务器：语音按钮会自动禁用，使用文字输入即可

### 2. API 请求超时

**原因**：Kimi API 响应时间较长。

**解决**：已优化为流式输出，首字响应约 1-2 秒。

### 3. 术语识别不准确

**原因**：Web Speech API 对编程术语识别有限。

**解决**：已内置编程术语词典，自动纠正常见错误（如"必报"→"闭包"）。

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/xxx`
5. 创建 Pull Request

## 📄 许可证

[MIT](LICENSE) License © 2024

## 🙏 致谢

- [Kimi AI](https://platform.moonshot.cn/) - 提供大模型 API
- [Socket.io](https://socket.io/) - 实时通信
- [Marked.js](https://marked.js.org/) - Markdown 渲染

---

⭐ 如果这个项目对你有帮助，请给个 Star 吧！
