require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Kimi API 配置
const KIMI_API_KEY = process.env.KIMI_API_KEY;
const KIMI_API_URL = process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1/chat/completions';

if (!KIMI_API_KEY) {
  console.error('错误：未配置 KIMI_API_KEY，请在 .env 文件中设置');
  process.exit(1);
}

// 使用高速模型
const MODEL = 'kimi-k2.7-code-highspeed';

// 系统提示词 - 简洁版，加速生成
const SYSTEM_PROMPT = `你是技术面试官。回答要求：
1. 直接给要点，不要废话
2. 分1/2/3点列出
3. 每点不超过2句话
4. 突出面试考点
5. 总字数控制在300字以内`;

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);

  socket.on('start-listening', () => {
    socket.emit('status', { status: 'listening', message: '正在监听...' });
  });

  socket.on('stop-listening', () => {
    socket.emit('status', { status: 'ready', message: '就绪' });
  });

  // 接收文本并调用大模型（流式）
  socket.on('text-input', async (text) => {
    console.log('收到问题:', text);
    socket.emit('status', { status: 'processing', message: 'AI思考中...' });
    
    try {
      await callKimiAPIStream(text, socket);
    } catch (error) {
      console.error('调用API失败:', error);
      socket.emit('error', { message: '获取答案失败: ' + error.message });
      socket.emit('status', { status: 'ready', message: '就绪' });
    }
  });

  socket.on('disconnect', () => {
    console.log('客户端已断开:', socket.id);
  });
});

// 流式调用 Kimi API
async function callKimiAPIStream(question, socket) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `面试题：${question}`
        }
      ],
      temperature: 1,
      max_tokens: 800,
      stream: true  // 启用流式输出
    });

    const url = new URL(KIMI_API_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestData)
      },
      timeout: 60000
    };

    let fullAnswer = '';
    let hasStarted = false;

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`API请求失败: ${res.statusCode}`));
        return;
      }

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        // 解析 SSE 流式数据
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              // 流结束
              socket.emit('answer-complete', {
                question: question,
                answer: fullAnswer,
                timestamp: new Date().toLocaleString('zh-CN')
              });
              socket.emit('status', { status: 'ready', message: '就绪' });
              resolve(fullAnswer);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
              
              if (delta && delta.content) {
                const content = delta.content;
                fullAnswer += content;
                
                if (!hasStarted) {
                  hasStarted = true;
                  socket.emit('answer-start', { question: question });
                }
                
                // 实时发送增量内容
                socket.emit('answer-chunk', { chunk: content });
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      });

      res.on('end', () => {
        if (!hasStarted) {
          reject(new Error('未收到有效响应'));
        } else {
          socket.emit('answer-complete', {
            question: question,
            answer: fullAnswer,
            timestamp: new Date().toLocaleString('zh-CN')
          });
          socket.emit('status', { status: 'ready', message: '就绪' });
          resolve(fullAnswer);
        }
      });
    });

    req.on('error', (error) => {
      console.error('请求错误:', error);
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(requestData);
    req.end();
  });
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    model: MODEL,
    stream: true
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎤 面试助手服务器运行在端口 ${PORT}`);
  console.log(`🚀 高速模型: ${MODEL}`);
  console.log(`⚡ 流式输出: 已启用`);
  console.log(`📖 访问 http://localhost:${PORT} 开始使用`);
});
