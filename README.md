# Lingu

Aplikasi web penerjemah & chatbot AI berbasis Gemini API.

## Cara Menjalankan

1. Download semua file, lalu buka `index.html` di browser.
2. Dapatkan API_KEY Gemini (lihat di bawah).
3. Buka file `js/script.js`, ganti:
   const GEMINI_API_KEY = "API_KEY";
   menjadi:
   const GEMINI_API_KEY = "API_KEY_YANG_KAMU_DAPATKAN";
4. Kalau mau aman, bisa disimpan di .env

## Cara Mendapatkan API_KEY Gemini

1. Buka https://aistudio.google.com/app/apikey
2. Login dengan akun Google.
3. Klik "Create API Key", salin API Key-nya.
4. Masukkan ke file `js/script.js` seperti langkah di atas.

## Mengganti API_URL untuk AI Agent Lain

- Ganti variabel API_URL di `js/script.js`:
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
- Ubah ke endpoint AI lain, misal OpenAI:
  const API_URL = "https://api.openai.com/v1/chat/completions";
- Pastikan payload & header di fungsi callGeminiAPI sudah sesuai format API baru.

## Struktur Folder
```
Lingu
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

Aplikasi Siap Digunakan !!!!
