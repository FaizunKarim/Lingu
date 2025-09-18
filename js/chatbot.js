import { dom } from './dom.js';
import { callGeminiAPI } from './service.js';

let chatHistory = [];

const systemInstruction = {
    role: "user",
    parts: [{ text: "PENTING: Anda adalah AI bernama Lingu. Kamu harus bisa menjawab semua pertanyaan dan percakapan dengan bahasa yang santai dan bersahabat tapi harus sesuai fakta dan jujur (by default). Tetap jaga kesopanan dalam berbicara." }]
};

function showNotice(message, type = 'yellow') {
    const colors = {
        yellow: 'text-yellow-200 bg-yellow-900 bg-opacity-50 border border-yellow-700',
        red: 'text-red-200 bg-red-900 bg-opacity-50 border border-red-700'
    };
    dom.statusNotice.className = `p-3 mx-4 text-sm rounded-lg status-notice ${colors[type]}`;
    dom.statusNotice.innerHTML = `<strong>Pemberitahuan:</strong> ${message}`;
    dom.statusNotice.classList.remove('hidden');
}

function appendChatMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-bubble', 'text-white', 'text-sm', 'relative', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    dom.chatMessages.appendChild(messageDiv);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

async function handleChatMessage() {
    const userMessage = dom.chatbotInput.value.trim();
    if (!userMessage) return;

    appendChatMessage('user', userMessage);
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    dom.chatbotInput.value = '';
    dom.chatbotLoader.classList.remove('hidden');
    dom.sendChatBtn.disabled = true;
    dom.chatbotInput.disabled = true;

    try {
        const payload = { contents: [systemInstruction, ...chatHistory] };
        const botResponse = await callGeminiAPI(payload);
        appendChatMessage('bot', botResponse);
        chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
    } catch (error) {
        const errorMessage = `Maaf, saya mengalami masalah. (${error.message})`;
        appendChatMessage('bot', errorMessage);
        showNotice(`Gagal menghubungi Chatbot: ${error.message}`, 'red');
    } finally {
        dom.chatbotLoader.classList.add('hidden');
        dom.sendChatBtn.disabled = false;
        dom.chatbotInput.disabled = false;
        dom.chatbotInput.focus();
    }
}

export function initChatbot() {
    dom.sendChatBtn.addEventListener('click', handleChatMessage);
    dom.chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatMessage();
        }
    });
}
