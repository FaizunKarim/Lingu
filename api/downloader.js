import { fbdown, ttdl, youtube } from 'btch-downloader';
import { instagramdl, pinterestdl } from '@bochilteam/scraper-sosmed';

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
            const result = await instagramdl(url);
            data = { url: result[0].download_link }; 
        } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
            data = await pinterestdl(url);
        } else if (url.includes('tiktok.com')) {
            data = await ttdl(url);
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            data = await fbdown(url);
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            data = await youtube(url);
        } else {
            return res.status(400).json({ error: 'URL tidak didukung.' });
        }
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Downloader error:', error);
        res.status(500).json({ error: `Gagal memproses link: ${error.message}` });
    }
}
