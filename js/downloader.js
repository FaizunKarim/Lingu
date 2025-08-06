import { dom } from './dom.js';

async function handleDownload() {
    const url = dom.downloaderUrlInput.value.trim();
    if (!url) {
        dom.downloaderResult.innerHTML = `<p class="text-red-400">Silakan masukkan URL terlebih dahulu.</p>`;
        return;
    }

    dom.downloaderResult.innerHTML = `<div class="w-6 h-6 border-3 border-dashed rounded-full animate-spin border-indigo-400 mx-auto"></div>`;
    dom.downloadBtn.disabled = true;

    try {
        const response = await fetch('/api/downloader', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Terjadi kesalahan pada server.');
        }

        displayResult(data);

    } catch (error) {
        dom.downloaderResult.innerHTML = `<p class="text-red-400">Gagal: ${error.message}</p>`;
    } finally {
        dom.downloadBtn.disabled = false;
    }
}

function displayResult(data) {
    dom.downloaderResult.innerHTML = '';
    
    let videoLink, audioLink, imageLink, fileLink;
    let title = data.title || data.filename || 'Hasil Unduhan';

    videoLink = data.url || data.video?.[0] || data.HD || data.Normal_video || data.hd || data.sd || data.mp4 || data.video_ori;
    audioLink = data.mp3;
    imageLink = data.image;
    fileLink = data.link;

    const titleElement = document.createElement('h3');
    titleElement.className = 'text-white font-semibold mb-3 break-words';
    titleElement.textContent = title;
    dom.downloaderResult.appendChild(titleElement);
    
    let found = false;

    if (videoLink) {
        createDownloadButton(videoLink, 'Unduh Video');
        found = true;
    }
    if (audioLink) {
        createDownloadButton(audioLink, 'Unduh Audio (.mp3)');
        found = true;
    }
    if (imageLink) {
        createDownloadButton(imageLink, 'Unduh Gambar');
        found = true;
    }
    if (fileLink) {
        createDownloadButton(fileLink, `Unduh File (${data.filesize})`);
        found = true;
    }

    if (!found) {
        dom.downloaderResult.innerHTML = `<p class="text-yellow-400">Tidak dapat menemukan link unduhan dari respons. Coba periksa kembali link Anda.</p>`;
    }
}

function createDownloadButton(href, text) {
    const linkElement = document.createElement('a');
    linkElement.href = href;
    linkElement.textContent = text;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = 'block w-full max-w-xs mx-auto mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300';
    dom.downloaderResult.appendChild(linkElement);
}

export function initDownloader() {
    if (dom.downloadBtn) {
        dom.downloadBtn.addEventListener('click', handleDownload);
    }
}