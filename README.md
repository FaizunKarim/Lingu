# LINGU

Website multifungsi: Chatbot AI, Translator, dan Downloader dalam satu aplikasi web modern.

## Fitur Utama

- Chatbot AI berbasis Gemini API, default bahasa Indonesia
- Translator, include input suara, output suara, salin hasil, dan bersihkan teks
- Downloader, untuk memproses link dari berbagai platform

## Struktur Folder

Lingu  
│  
├── index.html  
├── css/  
│   └── style.css  
├── js/  
│   ├── script.js  
│   ├── dom.js  
│   ├── translator.js  
│   ├── chatbot.js  
│   ├── downloader.js  
│   └── service.js  
└── README.md  

## Cara Menjalankan

1. **Konfigurasi API:**
   - Pastikan sudah memiliki API Gemini, IBM, atau AI Agent lainnya.
   - Simpan API Key Gemini di file `.env`:
    ```
     GEMINI_API_KEY=API_KEY_KAMU
    ```
   - Endpoint backend ada di [`api/gemini.js`](api/gemini.js).
2. **Buka Web Menggunakan Vercel CLI**
   - Instal Vercel CLI: npm install -g vercel
   - Login ke Vercel: vercel login
   - Jalankan server pengembangan: vercel dev
   - Web akan secara otomatis berjalan di server lokal http://localhost:3000 di browser Anda.
   
4. **Dapatkan API Key Gemini:**
   - Gemini : [Google AI Studio](https://aistudio.google.com/app/apikey).
   - IBM Granite : 
   - Login, buat API Key, salin dan simpan di `.env`.

## Konfigurasi API

- **Frontend:** Kode frontend akan mengirim permintaan ke `/api/gemini` menggunakan [`callGeminiAPI`](js/service.js).
- **Backend:** Endpoint di [`api/gemini.js`](api/gemini.js) akan meneruskan permintaan ke Google Gemini API.

## Teknologi

- **Tailwind CSS** untuk styling.
- **Web Speech API** untuk input/output suara.
- **Fetch API** untuk komunikasi dengan backend.
- **Google Gemini API** untuk AI dan penerjemah.
- **Downloader Engine** btch-downloader
  
## Credits

- Dibuat oleh Faizun.
- Deploy di Vercel.

---

## Website: 
[https://lingu-chatbot.vercel.app/](https://lingu-chatbot.vercel.app/)

Aplikasi siap digunakan! 🚀
