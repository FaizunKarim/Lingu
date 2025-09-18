# LINGU

Website multifungsi: Chatbot AI, Translator, dan Downloader dalam satu aplikasi web.

## Fitur Utama

- Chatbot AI berbasis Gemini dan IBM Granite, menggunakan default bahasa Indonesia.
- Translator, include input suara, output suara, salin hasil, dan bersihkan teks.
- Downloader, untuk memproses link dari youtube, facebook, instagram, tiktok, dan X menjadi file mp3 atau mp4.

## Struktur Folder

```
Lingu   
 │   
 ├── index.html  
 ├── api/ 
 │   ├── gemini.js   
 │   ├── downloader.js   
 │   └── ibm.js   
 ├── css/   
 │   └── style.css   
 ├── js/   
 │   ├── script.js   
 │   ├── dom.js   
 │   ├── translator.js   
 │   ├── chatbot.js   
 │   ├── downloader.js   
 │   └── service.js   
 ├── gitignore 
 ├── favicon.ico 
 └── README.md 
```

## Cara Menjalankan

1. **Konfigurasi API:**
   - Pastikan sudah memiliki API Gemini, IBM Granite, atau AI Agent lainnya.
   - Simpan API Key Gemini di file `.env`:
    ```
    GEMINI_API_KEY=API_KEY_KAMU
    REPLICATE_API_TOKEN=API_KEY_REPLICATE_ANDA
    ```
   
2. **Buka Web Menggunakan Vercel CLI:**
   - Instal Vercel CLI: npm install -g vercel
   - Login ke Vercel: vercel login
   - Jalankan server pengembangan: vercel dev
   - Web akan secara otomatis berjalan di server lokal http://localhost:3000 di browser Anda.
   
3. **Cara Mendapatkan API Key Gemini dan IBM:**
   - Gemini : [Google AI Studio](https://aistudio.google.com/app/apikey).
   - IBM Granite : [Replicate AI]([http://replicate.com/account](https://replicate.com/ibm-granite/granite-3.3-8b-instruct))
   - Login, buat API Key, salin dan simpan di `.env`.

## Alur Chatbot

Alur kerja chatbot telah diperbarui untuk mendukung dua model AI:
  - Frontend (Sisi Klien):
     Pengguna memilih model AI (Gemini atau IBM Granite) melalui antarmuka (UI). Logika di chatbot.js mendeteksi model yang dipilih.
     Berdasarkan pilihan, service.js akan memanggil fungsi yang sesuai:
     - callGeminiAPI() jika modelnya Gemini.
     - callIbmAPI() jika modelnya IBM Granite.
  
  - Backend (Sisi Server di Vercel):
     Permintaan dari service.js diterima oleh salah satu dari dua endpoint di folder /api/gemini untuk Google Gemini dan juga /api/ibm untuk Replicate.
     Kedua endpoint kemudian mengirimkan kembali respons dari AI ke frontend.
    
## Teknologi

- **Styling :** Tailwind CSS
- **Speech API :** Web Speech API untuk input/output suara Translator
- **AI Models :**
  - **Replicate IBM API** untuk AI chatbot
  - **Google Gemini API** untuk AI dan penerjemah.
- **Downloader Engine :** btch-downloader.
- **Deployment :** Vercel
  
## Credits
- Dibuat oleh Faizun.

---

## Website: 
[https://lingu-chatbot.vercel.app/](https://lingu-chatbot.vercel.app/)
