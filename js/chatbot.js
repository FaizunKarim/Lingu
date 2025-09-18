import { dom } from './dom.js';
import { callGeminiAPI, callIbmAPI } from './service.js';

let chatHistory = [];
let currentSelectedModel = 'gemini';
let resetMessageTimer = null;

function removeResetMessages() {
    if (resetMessageTimer) {
        clearTimeout(resetMessageTimer);
        resetMessageTimer = null;
    }
    const notices = document.querySelectorAll('.reset-notice');
    notices.forEach(notice => notice.remove());
}

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

function resetChat(newModelName) {
    dom.chatMessages.innerHTML = '';
    removeResetMessages();

    const newChatHeading = document.createElement('div');
    newChatHeading.className = 'text-center text-gray-400 text-xs my-2 reset-notice';
    newChatHeading.textContent = 'New chat';
    dom.chatMessages.appendChild(newChatHeading);

    const modelChangeNotice = document.createElement('div');
    modelChangeNotice.className = 'text-center text-gray-400 text-xs mb-3 reset-notice';
    modelChangeNotice.textContent = `Model telah diganti ke ${newModelName}`;
    dom.chatMessages.appendChild(modelChangeNotice);

    appendChatMessage('bot', 'Halo saya Lingu, Ada yang bisa dibantu ?');

    chatHistory = [];
    dom.chatbotInput.focus();

    resetMessageTimer = setTimeout(removeResetMessages, 10000);
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
        let botResponse;

        if (currentSelectedModel === 'gemini') {
            const payload = { contents: [systemInstruction, ...chatHistory] };
            botResponse = await callGeminiAPI(payload);
        } else {
            const payload = { messages: [systemInstruction, ...chatHistory] };
            botResponse = await callIbmAPI(payload);
        }

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
    appendChatMessage('bot', 'Halo saya Lingu, Ada yang bisa dibantu ?');

    dom.sendChatBtn.addEventListener('click', handleChatMessage);
    dom.chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatMessage();
        }
    });

    dom.chatbotInput.addEventListener('input', removeResetMessages);

    dom.currentModelBtn.addEventListener('click', () => {
        dom.modelOptionsContainer.classList.toggle('hidden');
    });

    dom.modelOptionBtns.forEach(button => {
        button.addEventListener('click', () => {
            const selectedModel = button.getAttribute('data-model');
            const modelName = button.textContent.trim();

            if (currentSelectedModel !== selectedModel) {
                currentSelectedModel = selectedModel;
                dom.currentModelText.textContent = modelName;
                resetChat(modelName);
            }

            dom.modelOptionsContainer.classList.add('hidden');
        });
    });

    document.addEventListener('click', (event) => {
        if (!dom.customModelSwitcher.contains(event.target)) {
            dom.modelOptionsContainer.classList.add('hidden');
        }
    });
}