import { aio, capcut, fbdown, gdrive, igdl, mediafire, pinterest, ttdl, twitter, youtube } from 'btch-downloader';

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
        if (url.includes('tiktok.com')) {
            data = await ttdl(url);
        } else if (url.includes('instagram.com')) {
            data = await igdl(url);
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            data = await fbdown(url);
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            data = await twitter(url);
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            data = await youtube(url);
        } else if (url.includes('mediafire.com')) {
            data = await mediafire(url);
        } else if (url.includes('capcut.com')) {
            data = await capcut(url);
        } else if (url.includes('drive.google.com')) {
            data = await gdrive(url);
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