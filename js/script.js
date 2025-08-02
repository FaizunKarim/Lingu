document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api/gemini';
    const config = {
        languages: {
            'Indonesian': 'id-ID', 'English': 'en-US', 'Javanese': 'jv-ID', 'Sundanese': 'su-ID',
            'Spanish': 'es-ES', 'French': 'fr-FR', 'German': 'de-DE', 'Japanese': 'ja-JP',
            'Korean': 'ko-KR', 'Arabic': 'ar-SA', 'Chinese (Simplified)': 'zh-CN', 'Russian': 'ru-RU'
        },
        tabs: [
            { id: 'translator-section', name: 'Penerjemah' },
            { id: 'chatbot-section', name: 'Chatbot' }
        ]
    };
    let state = {
        currentTabIndex: 0,
        chatHistory: [],
        isRecognizing: false,
        isSpeaking: false,
    };
    const dom = {
        statusNotice: document.getElementById('status-notice'),
        prevTabBtn: document.getElementById('prev-tab-btn'),
        nextTabBtn: document.getElementById('next-tab-btn'),
        activeTabName: document.getElementById('active-tab-name'),
        translatorSection: document.getElementById('translator-section'),
        sourceLang: document.getElementById('source-lang'),
        targetLang: document.getElementById('target-lang'),
        swapBtn: document.getElementById('swap-btn'),
        sourceText: document.getElementById('source-text'),
        targetText: document.getElementById('target-text'),
        translateBtn: document.getElementById('translate-btn'),
        copyBtn: document.getElementById('copy-btn'),
        clearBtn: document.getElementById('clear-btn'),
        loader: document.getElementById('loader'),
        micBtn: document.getElementById('mic-btn'),
        speakerBtn: document.getElementById('speaker-btn'),
        chatbotSection: document.getElementById('chatbot-section'),
        chatMessages: document.getElementById('chat-messages'),
        chatbotInput: document.getElementById('chatbot-input'),
        sendChatBtn: document.getElementById('send-chat-btn'),
        chatbotLoader: document.getElementById('chatbot-loader'),
    };
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synthesis = window.speechSynthesis;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
    } else {
        dom.micBtn.style.display = 'none';
    }
    const showNotice = (message, type = 'yellow') => {
        const colors = {
            yellow: 'text-yellow-200 bg-yellow-900 bg-opacity-50 border border-yellow-700',
            red: 'text-red-200 bg-red-900 bg-opacity-50 border border-red-700',
            green: 'text-green-200 bg-green-900 bg-opacity-50 border border-green-700',
        };
        dom.statusNotice.className = `p-3 mx-4 text-sm rounded-lg status-notice ${colors[type]}`;
        dom.statusNotice.innerHTML = `<strong>Pemberitahuan:</strong> ${message}`;
        dom.statusNotice.classList.remove('hidden');
    };
    const hideNotice = () => dom.statusNotice.classList.add('hidden');
    const showTab = (index) => {
        config.tabs.forEach(tab => document.getElementById(tab.id).classList.add('hidden'));
        document.getElementById(config.tabs[index].id).classList.remove('hidden');
        dom.activeTabName.textContent = config.tabs[index].name;
        state.currentTabIndex = index;
    };
    const navigateTabs = (direction) => {
        let newIndex = state.currentTabIndex + direction;
        if (newIndex >= config.tabs.length) newIndex = 0;
        if (newIndex < 0) newIndex = config.tabs.length - 1;
        showTab(newIndex);
    };
    const populateLanguages = () => {
        Object.keys(config.languages).forEach(name => {
            const langCode = config.languages[name].split('-')[0];
            [dom.sourceLang, dom.targetLang].forEach(select => {
                select.add(new Option(name, langCode));
            });
        });
        dom.sourceLang.value = 'id';
        dom.targetLang.value = 'en';
    };
    const copyToClipboard = (text, buttonElement) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const defaultIcon = buttonElement.innerHTML;
            buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="text-green-400" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/></svg>`;
            setTimeout(() => { buttonElement.innerHTML = defaultIcon; }, 2000);
        }).catch(err => {
            showNotice('Gagal menyalin teks.', 'red');
        });
    };
    const appendChatMessage = (sender, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-bubble', 'text-white', 'text-sm', 'relative', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        dom.chatMessages.appendChild(messageDiv);
        dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    };
    const callGeminiAPI = async (payload) => {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) {
            const errorMsg = result.error?.message || `HTTP Error ${response.status}`;
            throw new Error(`API Error: ${errorMsg}`);
        }
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            return text.trim();
        } else {
             if (result.promptFeedback?.safetyRatings?.length > 0) {
                throw new Error("Konten diblokir karena alasan keamanan.");
            }
            throw new Error("Respons dari API tidak valid atau kosong.");
        }
    };
    const handleTranslation = async () => {
        hideNotice();
        const textToTranslate = dom.sourceText.value.trim();
        if (!textToTranslate) {
            showNotice('Masukkan teks untuk diterjemahkan.', 'yellow');
            return;
        }
        dom.loader.classList.remove('hidden');
        dom.translateBtn.disabled = true;
        dom.targetText.value = '';
        try {
            const fromLang = dom.sourceLang.options[dom.sourceLang.selectedIndex].text;
            const toLang = dom.targetLang.options[dom.targetLang.selectedIndex].text;
            const prompt = `Translate the following text from ${fromLang} to ${toLang}. Only provide the translated text, without any additional explanation or introduction.\n\nText: "${textToTranslate}"\n\nTranslation:`;
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const translatedText = await callGeminiAPI(payload);
            dom.targetText.value = translatedText;
        } catch (error) {
            dom.targetText.value = `Terjadi kesalahan.`;
            showNotice(`Gagal menerjemahkan: ${error.message}`, 'red');
        } finally {
            dom.loader.classList.add('hidden');
            dom.translateBtn.disabled = false;
        }
    };
    const handleChatMessage = async () => {
        hideNotice();
        const userMessage = dom.chatbotInput.value.trim();
        if (!userMessage) return;
        appendChatMessage('user', userMessage);
        state.chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        dom.chatbotInput.value = '';
        dom.chatbotLoader.classList.remove('hidden');
        dom.sendChatBtn.disabled = true;
        dom.chatbotInput.disabled = true;
        try {
            const payload = { contents: state.chatHistory };
            const botResponse = await callGeminiAPI(payload);
            appendChatMessage('bot', botResponse);
            state.chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
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
    };
    dom.prevTabBtn.addEventListener('click', () => navigateTabs(-1));
    dom.nextTabBtn.addEventListener('click', () => navigateTabs(1));
    dom.translateBtn.addEventListener('click', handleTranslation);
    dom.sendChatBtn.addEventListener('click', handleChatMessage);
    dom.chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatMessage();
        }
    });
    dom.clearBtn.addEventListener('click', () => {
        dom.sourceText.value = '';
        dom.targetText.value = '';
        hideNotice();
    });
    dom.copyBtn.addEventListener('click', () => copyToClipboard(dom.targetText.value, dom.copyBtn));
    dom.swapBtn.addEventListener('click', () => {
        dom.swapBtn.classList.add('scale-active');
        setTimeout(() => dom.swapBtn.classList.remove('scale-active'), 300);
        [dom.sourceLang.value, dom.targetLang.value] = [dom.targetLang.value, dom.sourceLang.value];
        [dom.sourceText.value, dom.targetText.value] = [dom.targetText.value, dom.sourceText.value];
    });
    if (recognition) {
        dom.micBtn.addEventListener('click', () => {
            if (state.isRecognizing) {
                recognition.stop();
            } else {
                try {
                    const selectedLangName = dom.sourceLang.options[dom.sourceLang.selectedIndex].text;
                    recognition.lang = config.languages[selectedLangName];
                    recognition.start();
                } catch(e) {
                    showNotice('Bahasa input tidak didukung oleh pengenal suara.', 'red');
                }
            }
        });
        recognition.onstart = () => { state.isRecognizing = true; dom.micBtn.classList.add('mic-active'); };
        recognition.onresult = (event) => { dom.sourceText.value = event.results[0][0].transcript; };
        recognition.onend = () => { state.isRecognizing = false; dom.micBtn.classList.remove('mic-active'); };
        recognition.onerror = (event) => {
            showNotice(event.error === 'not-allowed' ? 'Akses mikrofon ditolak. Mohon izinkan akses mikrofon di pengaturan browser.' : `Kesalahan suara: ${event.error}`, 'red');
            state.isRecognizing = false;
            dom.micBtn.classList.remove('mic-active');
        };
    }
    if(synthesis){
        dom.speakerBtn.addEventListener('click', () => {
            const textToSpeak = dom.targetText.value.trim();
            if (!textToSpeak) return;
            if (synthesis.speaking) { synthesis.cancel(); return; }
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const selectedLangName = dom.targetLang.options[dom.targetLang.selectedIndex].text;
            utterance.lang = config.languages[selectedLangName];
            utterance.onstart = () => dom.speakerBtn.classList.add('speaker-active');
            utterance.onend = () => dom.speakerBtn.classList.remove('speaker-active');
            utterance.onerror = (e) => {
                showNotice('Gagal membacakan teks. Bahasa mungkin tidak didukung.', 'red');
                dom.speakerBtn.classList.remove('speaker-active');
            };
            synthesis.speak(utterance);
        });
    }
    populateLanguages();
    showTab(state.currentTabIndex);
});
