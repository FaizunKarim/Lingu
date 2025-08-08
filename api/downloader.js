import { aio, ttdl, fbdown, youtube } from 'btch-downloader';
import { instagram, pinterest } from 'bima-sky';

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
            const result = await instagram(url);
            const downloadUrl = result?.url;
            if (!downloadUrl) throw new Error('Link unduhan Instagram tidak ditemukan dari bima-sky.');
            data = { url: downloadUrl };

        } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
            // --- MENGGUNAKAN BIMA-SKY UNTUK PINTEREST ---
            const result = await pinterest(url);
            const downloadUrl = result?.url;
            if (!downloadUrl) throw new Error('Link unduhan Pinterest tidak ditemukan dari bima-sky.');
            data = { url: downloadUrl };

        } else if (url.includes('tiktok.com')) {
            data = await ttdl(url);
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            data = await fbdown(url);
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            data = await youtube(url);
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
