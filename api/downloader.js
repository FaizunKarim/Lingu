import { aio, ttdl, fbdown, youtube, pinterest } from 'btch-downloader';
import instagramdl from 'priyansh-ig-downloader';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let data;
        if (url.includes('instagram.com')) {
            // --- MENGGUNAKAN PUSTAKA BARU UNTUK INSTAGRAM ---
            const result = await instagramdl(url);
            // Mengambil link unduhan dari hasil
            const downloadUrl = result?.[0]?.download_link; 
            if (!downloadUrl) throw new Error('Link unduhan Instagram tidak ditemukan dari pustaka baru.');
            data = { url: downloadUrl };

        } else if (url.includes('tiktok.com')) {
            data = await ttdl(url);
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            data = await fbdown(url);
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            data = await youtube(url);
        } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
            data = await pinterest(url);
        } else {
            try {
                data = await aio(url);
            } catch (aioError) {
                return res.status(400).json({ error: 'URL tidak didukung atau tidak valid.' });
            }
        }
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Downloader error:', error);
        res.status(500).json({ error: `Gagal memproses link: ${error.message}` });
    }
}
