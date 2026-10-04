// AI面试助手 - 前端应用（深灰色不对称布局版）
class InterviewAssistant {
    constructor() {
        this.socket = null;
        this.isListening = false;
        this.recognition = null;
        this.history = [];
        this.currentAnswer = '';
        this.isReceiving = false;
        this.activePanel = null; // 'text' 或 'voice'
        
        this.init();
    }

    init() {
        this.connectSocket();
        this.bindEvents();
        this.initSpeechRecognition();
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('✅ 已连接到服务器');
            this.updateStatus('ready');
        });

        this.socket.on('disconnect', () => {
            this.updateStatus('disconnected');
        });

        this.socket.on('status', (data) => {
            this.updateStatus(data.status);
        });

        // 开始接收答案
        this.socket.on('answer-start', (data) => {
            this.isReceiving = true;
            this.currentAnswer = '';
            this.showAnswerContent(data.question, this.activePanel);
        });

        // 接收增量内容
        this.socket.on('answer-chunk', (data) => {
            if (this.isReceiving) {
                this.currentAnswer += data.chunk;
                this.updateAnswerContent(this.currentAnswer, this.activePanel);
            }
        });

        // 答案完成
        this.socket.on('answer-complete', (data) => {
            this.isReceiving = false;
            this.currentAnswer = data.answer;
            this.updateStatus('ready');
        });

        this.socket.on('error', (data) => {
            this.isReceiving = false;
            this.showError(data.message);
            this.updateStatus('ready');
        });
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('浏览器不支持 Web Speech API');
            this.disableVoiceInput();
            return;
        }

        // 检查是否在安全上下文
        if (!window.isSecureContext) {
            console.warn('不在安全上下文，语音识别需要HTTPS');
            this.disableVoiceInput();
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'zh-CN';

        this.recognition.onstart = () => {
            this.updateStatus('listening');
            document.getElementById('voiceDisplay').classList.add('listening');
            document.getElementById('micBtn').classList.add('active');
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // 使用术语词典纠正
            if (finalTranscript) {
                const corrected = TechDictionary.correct(finalTranscript);
                console.log('识别原文:', finalTranscript);
                console.log('纠正后:', corrected);
                this.showVoiceText(corrected);
                this.activePanel = 'voice';
                this.socket.emit('text-input', corrected);
            } else if (interimTranscript) {
                const correctedInterim = TechDictionary.correct(interimTranscript);
                this.showVoiceText(correctedInterim + '...', true);
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech') return;
            if (event.error === 'audio-capture') {
                this.showToast('无法访问麦克风', 'error');
            } else if (event.error === 'not-allowed') {
                this.showToast('麦克风权限被拒绝', 'error');
            }
        };

        this.recognition.onend = () => {
            document.getElementById('voiceDisplay').classList.remove('listening');
            document.getElementById('micBtn').classList.remove('active');
            if (this.isListening) {
                setTimeout(() => {
                    if (this.isListening) this.recognition.start();
                }, 300);
            }
        };
    }

    bindEvents() {
        // 文字发送
        document.getElementById('sendBtn').addEventListener('click', () => this.submitText());
        document.getElementById('manualInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitText();
            }
        });

        // 麦克风
        document.getElementById('micBtn').addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
    }

    async startListening() {
        try {
            if (!this.recognition) {
                this.showToast('浏览器不支持语音识别', 'error');
                return;
            }

            // 检查是否在安全上下文（HTTPS或localhost）
            if (!window.isSecureContext) {
                this.showToast('语音识别需要HTTPS环境', 'error');
                return;
            }

            // 检查是否有麦克风权限
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showToast('浏览器不支持麦克风访问', 'error');
                return;
            }

            await navigator.mediaDevices.getUserMedia({ audio: true });
            this.isListening = true;
            this.recognition.start();
            this.socket.emit('start-listening');
        } catch (error) {
            console.error('启动语音识别失败:', error);
            let msg = '启动失败';
            if (error.name === 'NotAllowedError') {
                msg = '麦克风权限被拒绝，请检查浏览器权限设置';
            } else if (error.name === 'NotFoundError') {
                msg = '未找到麦克风设备';
            } else if (error.name === 'NotReadableError') {
                msg = '麦克风被其他应用占用';
            } else {
                msg = '启动失败: ' + error.message;
            }
            this.showToast(msg, 'error');
        }
    }

    stopListening() {
        this.isListening = false;
        if (this.recognition) this.recognition.stop();
        this.socket.emit('stop-listening');
    }

    submitText() {
        const input = document.getElementById('manualInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showToast('请输入面试问题', 'error');
            return;
        }
        
        this.activePanel = 'text';
        this.socket.emit('text-input', text);
        input.value = '';
    }

    // 显示语音识别的文字
    showVoiceText(text, isInterim = false) {
        const display = document.getElementById('voiceDisplay');
        if (isInterim) {
            display.innerHTML = `<span class="voice-text interim">${this.escapeHtml(text)}</span>`;
        } else {
            display.innerHTML = `<span class="voice-text">${this.escapeHtml(text)}</span>`;
        }
    }

    // 显示答案内容
    showAnswerContent(question, panel) {
        const contentArea = panel === 'voice' 
            ? document.getElementById('voiceContentArea')
            : document.getElementById('textContentArea');
        
        contentArea.innerHTML = `
            <div class="question-title">Q: ${this.escapeHtml(question)}</div>
            <div class="answer-content" id="${panel}AnswerContent">
                <div class="typing-indicator">● ● ●</div>
            </div>
        `;
    }

    // 更新答案内容（流式）
    updateAnswerContent(content, panel) {
        const answerContent = document.getElementById(`${panel}AnswerContent`);
        if (!answerContent) return;
        
        if (window.marked) {
            answerContent.innerHTML = marked.parse(content);
            if (window.hljs) {
                answerContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } else {
            answerContent.textContent = content;
        }
        
        // 滚动到底部
        const contentArea = panel === 'voice' 
            ? document.getElementById('voiceContentArea')
            : document.getElementById('textContentArea');
        contentArea.scrollTop = contentArea.scrollHeight;
    }

    // 更新状态
    updateStatus(status) {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        
        dot.className = 'status-dot';
        
        switch (status) {
            case 'ready':
            case 'connected':
                dot.classList.add('active');
                text.textContent = '就绪';
                break;
            case 'listening':
                dot.classList.add('listening');
                text.textContent = '识别中...';
                break;
            case 'processing':
                dot.classList.add('processing');
                text.textContent = '生成中...';
                break;
            case 'disconnected':
                text.textContent = '未连接';
                break;
        }
    }

    // 禁用语音输入（当环境不支持时）
    disableVoiceInput() {
        const micBtn = document.getElementById('micBtn');
        const voiceDisplay = document.getElementById('voiceDisplay');
        
        if (micBtn) {
            micBtn.style.opacity = '0.5';
            micBtn.style.cursor = 'not-allowed';
            micBtn.title = '语音识别需要HTTPS环境或浏览器不支持';
        }
        
        if (voiceDisplay) {
            voiceDisplay.innerHTML = '<span class="voice-hint">⚠️ 语音识别需要HTTPS环境</span>';
        }
        
        // 移除麦克风点击事件
        if (micBtn) {
            const newMicBtn = micBtn.cloneNode(true);
            micBtn.parentNode.replaceChild(newMicBtn, micBtn);
        }
    }

    // Toast提示
    showToast(message, type = 'info') {
        const existing = document.getElementById('toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="hand-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InterviewAssistant();
});
