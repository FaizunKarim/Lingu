import { dom } from './dom.js';
import { initTranslator, populateLanguages } from './translator.js';
import { initChatbot } from './chatbot.js';
import { initDownloader } from './downloader.js';

document.addEventListener('DOMContentLoaded', () => {

    const tabs = [
        { id: 'translator-section', name: 'Penerjemah' },
        { id: 'chatbot-section', name: 'Chatbot' },
        { id: 'downloader-section', name: 'Downloader' }
    ];
    
    let currentTabIndex = 1;

    function showTab(index) {
        tabs.forEach(tabInfo => {
            const element = document.getElementById(tabInfo.id);
            if (element) {
                element.classList.add('hidden');
            }
        });

        const activeTabInfo = tabs[index];
        if (activeTabInfo) {
            const activeTabElement = document.getElementById(activeTabInfo.id);
            if (activeTabElement) {
                activeTabElement.classList.remove('hidden');
            }
            if (dom.activeTabName) {
                dom.activeTabName.textContent = activeTabInfo.name;
            }
        }
        
        currentTabIndex = index;
        
        if (dom.inputArea) {
            if (activeTabInfo && activeTabInfo.id === 'chatbot-section') {
                dom.inputArea.style.display = 'flex';
            } else {
                dom.inputArea.style.display = 'none';
            }
        }

        if (dom.modelSelector) {
            if (activeTabInfo && activeTabInfo.id === 'chatbot-section') {
                dom.modelSelector.classList.remove('hidden');
            } else {
                dom.modelSelector.classList.add('hidden');
            }
        }
    }

    function navigateTabs(direction) {
        let newIndex = currentTabIndex + direction;
        if (newIndex >= tabs.length) {
            newIndex = 0;
        }
        if (newIndex < 0) {
            newIndex = tabs.length - 1;
        }
        showTab(newIndex);
    }

    if (dom.prevTabBtn) {
        dom.prevTabBtn.addEventListener('click', () => navigateTabs(-1));
    }
    if (dom.nextTabBtn) {
        dom.nextTabBtn.addEventListener('click', () => navigateTabs(1));
    }

    populateLanguages();
    initTranslator();
    initChatbot();
    initDownloader();

    showTab(currentTabIndex);
});