import { dom } from './dom.js';
import { callGeminiAPI } from './service.js';

const languages = {
    'Indonesian': 'id-ID', 'English': 'en-US', 'Javanese': 'jv-ID', 'Sundanese': 'su-ID',
    'Spanish': 'es-ES', 'French': 'fr-FR', 'German': 'de-DE', 'Japanese': 'ja-JP',
    'Korean': 'ko-KR', 'Arabic': 'ar-SA', 'Chinese (Simplified)': 'zh-CN', 'Russian': 'ru-RU'
};

let isRecognizing = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synthesis = window.speechSynthesis;
let recognition;

function showNotice(message, type = 'yellow') {
    const colors = {
        yellow: 'text-yellow-200 bg-yellow-900 bg-opacity-50 border border-yellow-700',
        red: 'text-red-200 bg-red-900 bg-opacity-50 border border-red-700',
        green: 'text-green-200 bg-green-900 bg-opacity-50 border border-green-700',
    };
    dom.statusNotice.className = `p-3 mx-4 text-sm rounded-lg status-notice ${colors[type]}`;
    dom.statusNotice.innerHTML = `<strong>Pemberitahuan:</strong> ${message}`;
    dom.statusNotice.classList.remove('hidden');
}

function hideNotice() {
    dom.statusNotice.classList.add('hidden');
}

export function populateLanguages() {
    Object.keys(languages).forEach(name => {
        const langCode = languages[name].split('-')[0];
        [dom.sourceLang, dom.targetLang].forEach(select => {
            select.add(new Option(name, langCode));
        });
    });
    dom.sourceLang.value = 'id';
    dom.targetLang.value = 'en';
}

async function handleTranslation() {
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
}

function copyToClipboard(text, buttonElement) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const defaultIcon = buttonElement.innerHTML;
        buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="text-green-400" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/></svg>`;
        setTimeout(() => { buttonElement.innerHTML = defaultIcon; }, 2000);
    }).catch(err => {
        showNotice('Gagal menyalin teks.', 'red');
    });
}

export function initTranslator() {
    dom.translateBtn.addEventListener('click', handleTranslation);
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

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        dom.micBtn.addEventListener('click', () => {
            if (isRecognizing) {
                recognition.stop();
            } else {
                try {
                    const selectedLangName = dom.sourceLang.options[dom.sourceLang.selectedIndex].text;
                    recognition.lang = languages[selectedLangName];
                    recognition.start();
                } catch(e) {
                    showNotice('Bahasa input tidak didukung oleh pengenal suara.', 'red');
                }
            }
        });

        recognition.onstart = () => { isRecognizing = true; dom.micBtn.classList.add('mic-active'); };
        recognition.onresult = (event) => { dom.sourceText.value = event.results[0][0].transcript; };
        recognition.onend = () => { isRecognizing = false; dom.micBtn.classList.remove('mic-active'); };
        recognition.onerror = (event) => {
            showNotice(event.error === 'not-allowed' ? 'Akses mikrofon ditolak.' : `Kesalahan suara: ${event.error}`, 'red');
            isRecognizing = false;
            dom.micBtn.classList.remove('mic-active');
        };
    } else {
        dom.micBtn.style.display = 'none';
    }

    if (synthesis) {
        dom.speakerBtn.addEventListener('click', () => {
            const textToSpeak = dom.targetText.value.trim();
            if (!textToSpeak) return;
            if (synthesis.speaking) { synthesis.cancel(); return; }
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const selectedLangName = dom.targetLang.options[dom.targetLang.selectedIndex].text;
            utterance.lang = languages[selectedLangName];
            utterance.onstart = () => dom.speakerBtn.classList.add('speaker-active');
            utterance.onend = () => dom.speakerBtn.classList.remove('speaker-active');
            utterance.onerror = () => {
                showNotice('Gagal membacakan teks. Bahasa mungkin tidak didukung.', 'red');
                dom.speakerBtn.classList.remove('speaker-active');
            };
            synthesis.speak(utterance);
        });
    }
}