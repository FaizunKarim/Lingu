import { ttdl as ttdlB, fbdown as fbdownB, twitter as twitterB, youtube as youtubeB, mediafire, capcut, gdrive, pinterest as pinterestB, igdl as igdlB } from 'btch-downloader';
import { instagramdl, tiktokdl, facebookdl, youtubedl, twitterdl, pinterestdl } from '@bochilteam/scraper-sosmed';

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
            try { data = await instagramdl(url).then(r => ({ url: r[0].download_link })); }
            catch (e) { data = await igdlB(url); }
        
        } else if (url.includes('tiktok.com')) {
            try { data = await tiktokdl(url); }
            catch (e) { data = await ttdlB(url); }

        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            try { data = await facebookdl(url); }
            catch (e) { data = await fbdownB(url); }

        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            try { data = await twitterdl(url); }
            catch (e) { data = await twitterB(url); }

        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            try { data = await youtubedl(url).then(r => ({ url: r.video['360p'] })); }
            catch (e) { data = await youtubeB(url); }

        } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
            try { data = await pinterestdl(url); }
            catch (e) { data = await pinterestB(url); }
        
        } else if (url.includes('mediafire.com')) {
            data = await mediafire(url);
        } else if (url.includes('capcut.com')) {
            data = await capcut(url);
        } else if (url.includes('drive.google.com')) {
            data = await gdrive(url);
            
        } else {
            return res.status(400).json({ error: 'URL tidak didukung.' });
        }
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Semua metode downloader gagal:', error);
        res.status(500).json({ error: `Gagal memproses link setelah mencoba semua metode yang ada.` });
    }
}