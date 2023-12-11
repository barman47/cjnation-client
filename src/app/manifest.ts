import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CJNation Entertainment',
        short_name: 'CJNation Ent',
        start_url: './',
        icons: [
            {
                src: '/.android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/.android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ],
        theme_color: '#7E57C2',
        background_color: '#ffffff',
        display: 'standalone'
    };
}