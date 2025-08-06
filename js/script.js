import { dom } from './dom.js';
import { initTranslator, populateLanguages } from './translator.js';
import { initChatbot } from './chatbot.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const tabs = [
        { id: 'translator-section', name: 'Penerjemah' },
        { id: 'chatbot-section', name: 'Chatbot' }
    ];
    let currentTabIndex = 1;

    function showTab(index) {
        tabs.forEach(tab => document.getElementById(tab.id).classList.add('hidden'));
        document.getElementById(tabs[index].id).classList.remove('hidden');
        dom.activeTabName.textContent = tabs[index].name;
        currentTabIndex = index;
    }

    function navigateTabs(direction) {
        let newIndex = currentTabIndex + direction;
        if (newIndex >= tabs.length) newIndex = 0;
        if (newIndex < 0) newIndex = tabs.length - 1;
        showTab(newIndex);
    }

    dom.prevTabBtn.addEventListener('click', () => navigateTabs(-1));
    dom.nextTabBtn.addEventListener('click', () => navigateTabs(1));
    
    populateLanguages();
    initTranslator();
    initChatbot();

    showTab(currentTabIndex);
});