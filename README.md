# Lingu

Aplikasi web **Chatbot AI**, **Downloader**, dan **Translator**

## Fitur

- **Penerjemah Bahasa:** Mendukung banyak bahasa (Indonesia, Inggris, Jawa, Sunda, Spanyol, Prancis, Jerman, Jepang, Korea, Arab, Mandarin, Rusia).
- **Input Suara & Output Suara:** Bisa input teks via mikrofon dan mendengarkan hasil terjemahan.
- **Chatbot AI:** Chat dengan AI bernama Lingu, karakter sarkas dan sinis, default bahasa Indonesia.
- **Downloader Media:** Mengunduh video dan media dari berbagai platform seperti TikTok, YouTube, Instagram, dan lainnya.
- **Tab Navigasi:** Pindah antar fitur dengan tombol tab.

## Struktur Folder

```
Lingu
│
├── index.html                # Halaman utama
├── css/
│   └── style.css             # Style kustom
├── js/
│   ├── script.js             # Inisialisasi aplikasi
│   ├── dom.js                # Referensi elemen DOM
│   ├── translator.js         # Logika penerjemah
│   ├── downloader.js         # Backend untuk fitur Downloader
│   ├── downloader.js         # Logika Downloader
│   ├── chatbot.js            # Logika chatbot
│   ├── service.js            # Koneksi ke Gemini API
├── api/
│   └── gemini.js             # API backend Gemini (untuk Vercel/Node.js)
├── site.webmanifest          # Konfigurasi PWA
├── .env                      # Simpan API Key (jika pakai backend)
├── .gitignore
└── README.md
```

## Cara Menjalankan

1. **Frontend Saja (Tanpa Backend Javascript):**
   - Buka `index.html` di browser.

2. **Dengan Backend (Node.js/Vercel):**
   - Pastikan sudah memiliki API Gemini atau AI Agent lainnya.
   - Simpan API Key Gemini di file `.env`:
     ```
     GEMINI_API_KEY=API_KEY_KAMU
     ```
   - Endpoint backend ada di [`api/gemini.js`](api/gemini.js).
   - Instal Vercel CLI: npm install -g vercel
   - Login ke Vercel: vercel login
   - Jalankan server pengembangan: vercel dev
   - Web akan secara otomatis berjalan di server lokal http://localhost:3000 di browser Anda.

4. **Dapatkan API Key Gemini:**
   - Kunjungi [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Login, buat API Key, salin dan simpan di `.env`.

## Konfigurasi API

- **Frontend:** Kode frontend akan mengirim permintaan ke `/api/gemini` menggunakan [`callGeminiAPI`](js/service.js).
- **Backend:** Endpoint di [`api/gemini.js`](api/gemini.js) akan meneruskan permintaan ke Google Gemini API.

## Teknologi

- **Tailwind CSS** untuk styling.
- **Web Speech API** untuk input/output suara.
- **Fetch API** untuk komunikasi dengan backend.
- **Google Gemini API** untuk AI dan penerjemah.

## Credits

- Dibuat oleh Faizun.
- Deploy di Vercel.

---

Aplikasi siap digunakan! 🚀
