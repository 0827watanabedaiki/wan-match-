
const https = require('https');

const places = [
    "DCR Dog Cafe & Run 名古屋",
    "空と緑のDogRun GreenHands",
    "庄内緑地ドッグラン",
    "BARNABAS ドッグラン",
    "アンドシー 名古屋",
    "大高緑地 ドッグラン",
    "新宝緑地ドッグラン",
    "わんスマイル 千代田",
    "ドッグカフェ ももカフェ",
    "カインズ名古屋守山店 ドッグラン",
    "ペットのスマイル徳重店",
    "写真館・スタジオドッグラン 名古屋",
    "ドッグウィズ 長久手",
    "プリティー・ワン 古出来町店",
    "チャオ！カーネ 名古屋",
    "ドッグタッチリンク矢場動物堂店",
    "Dog cafe FLAT 名古屋",
    "ワンズカフェ 名古屋",
    "貸切わんわん広場 北名古屋"
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function geocode(query) {
    return new Promise((resolve, reject) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const options = {
            headers: {
                'User-Agent': 'WanMatchApp/1.0 (test@example.com)'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', err => resolve(null));
    });
}

(async () => {
    const results = [];
    console.log("Starting Geocoding...");

    for (const place of places) {
        console.log(`Processing: ${place}`);
        const coords = await geocode(place);
        if (coords) {
            console.log(`  Found: ${coords.lat}, ${coords.lng}`);
            results.push({
                id: Date.now() + Math.floor(Math.random() * 10000), // Random ID
                name: place.replace(' 名古屋', ''), // Clean up name
                type: place.includes('Cafe') || place.includes('カフェ') ? 'run' : 'run', // Default to run for now, user can edit
                description: '人気スポット',
                lat: coords.lat,
                lng: coords.lng,
                color: 'bg-green-600',
                icon: 'Bone' // String representation
            });
        } else {
            console.log("  Not Found");
        }
        await sleep(1500); // Respect Nominatim rate limits (1 sec)
    }

    console.log("\n--- JSON Result ---");
    console.log(JSON.stringify(results, null, 2));
})();
