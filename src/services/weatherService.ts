
interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export interface WeatherData {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    weatherIcon: string;
}

// Weather Code Interpretation (WMO Code)
const getWeatherDescription = (code: number): { description: string, icon: string } => {
    if (code === 0) return { description: '快晴', icon: '☀️' };
    if (code === 1) return { description: '晴れ', icon: '🌤' };
    if (code === 2) return { description: '一部曇り', icon: '⛅️' };
    if (code === 3) return { description: '曇り', icon: '☁️' };
    if (code === 45 || code === 48) return { description: '霧', icon: '🌫' };
    if (code >= 51 && code <= 55) return { description: '霧雨', icon: '🌦' };
    if (code >= 61 && code <= 65) return { description: '雨', icon: '🌧' };
    if (code === 66 || code === 67) return { description: '雨氷', icon: '🌨' };
    if (code >= 71 && code <= 77) return { description: '雪', icon: '☃️' };
    if (code >= 80 && code <= 82) return { description: 'にわか雨', icon: '☔️' };
    if (code === 85 || code === 86) return { description: 'にわか雪', icon: '🌨' };
    if (code >= 95 && code <= 99) return { description: '雷雨', icon: '⚡️' };
    return { description: '不明', icon: '❓' };
};

// 日本の主要都市・区のローカルマッピング
const JP_CITY_MAP: { keywords: string[]; lat: number; lng: number; name: string }[] = [
    // 東京23区
    { keywords: ['千代田', '丸の内', '大手町'], lat: 35.6940, lng: 139.7536, name: '千代田区' },
    { keywords: ['中央区', '銀座', '築地'], lat: 35.6706, lng: 139.7739, name: '中央区' },
    { keywords: ['港区', '六本木', '赤坂', '青山', '麻布'], lat: 35.6581, lng: 139.7514, name: '港区' },
    { keywords: ['新宿'], lat: 35.6938, lng: 139.7034, name: '新宿区' },
    { keywords: ['文京', '本郷', '後楽'], lat: 35.7078, lng: 139.7520, name: '文京区' },
    { keywords: ['台東', '上野', '浅草'], lat: 35.7116, lng: 139.7803, name: '台東区' },
    { keywords: ['墨田', '両国', '押上'], lat: 35.7101, lng: 139.8017, name: '墨田区' },
    { keywords: ['江東', '豊洲', '清澄'], lat: 35.6725, lng: 139.8172, name: '江東区' },
    { keywords: ['品川', '大崎', '五反田'], lat: 35.6088, lng: 139.7300, name: '品川区' },
    { keywords: ['目黒'], lat: 35.6416, lng: 139.6982, name: '目黒区' },
    { keywords: ['大田', '蒲田', '羽田'], lat: 35.5614, lng: 139.7161, name: '大田区' },
    { keywords: ['世田谷', '三軒茶屋', '下北沢', '二子玉川'], lat: 35.6464, lng: 139.6531, name: '世田谷区' },
    { keywords: ['渋谷', '恵比寿', '原宿', '代官山', '代々木'], lat: 35.6617, lng: 139.7036, name: '渋谷区' },
    { keywords: ['中野'], lat: 35.7075, lng: 139.6638, name: '中野区' },
    { keywords: ['杉並', '高円寺', '荻窪'], lat: 35.6993, lng: 139.6364, name: '杉並区' },
    { keywords: ['豊島', '池袋'], lat: 35.7281, lng: 139.7186, name: '豊島区' },
    { keywords: ['北区', '赤羽', '王子'], lat: 35.7527, lng: 139.7336, name: '北区' },
    { keywords: ['荒川', '三ノ輪'], lat: 35.7362, lng: 139.7836, name: '荒川区' },
    { keywords: ['板橋'], lat: 35.7509, lng: 139.7197, name: '板橋区' },
    { keywords: ['練馬'], lat: 35.7357, lng: 139.6522, name: '練馬区' },
    { keywords: ['足立', '北千住'], lat: 35.7750, lng: 139.8046, name: '足立区' },
    { keywords: ['葛飾', '亀有', '柴又'], lat: 35.7444, lng: 139.8469, name: '葛飾区' },
    { keywords: ['江戸川', '小岩', '葛西'], lat: 35.7063, lng: 139.8683, name: '江戸川区' },
    // 東京市部
    { keywords: ['八王子'], lat: 35.6662, lng: 139.3160, name: '八王子市' },
    { keywords: ['立川'], lat: 35.6973, lng: 139.4130, name: '立川市' },
    { keywords: ['武蔵野', '吉祥寺'], lat: 35.7175, lng: 139.5661, name: '武蔵野市' },
    { keywords: ['三鷹'], lat: 35.6836, lng: 139.5594, name: '三鷹市' },
    { keywords: ['調布'], lat: 35.6517, lng: 139.5443, name: '調布市' },
    // 神奈川
    { keywords: ['横浜'], lat: 35.4437, lng: 139.6380, name: '横浜市' },
    { keywords: ['川崎'], lat: 35.5309, lng: 139.7029, name: '川崎市' },
    { keywords: ['相模原'], lat: 35.5727, lng: 139.3731, name: '相模原市' },
    { keywords: ['鎌倉'], lat: 35.3197, lng: 139.5467, name: '鎌倉市' },
    { keywords: ['藤沢'], lat: 35.3386, lng: 139.4907, name: '藤沢市' },
    // 埼玉
    { keywords: ['さいたま', '浦和', '大宮'], lat: 35.8617, lng: 139.6455, name: 'さいたま市' },
    { keywords: ['川口'], lat: 35.8072, lng: 139.7245, name: '川口市' },
    { keywords: ['所沢'], lat: 35.7992, lng: 139.4688, name: '所沢市' },
    // 千葉
    { keywords: ['千葉市', '千葉駅'], lat: 35.6073, lng: 140.1063, name: '千葉市' },
    { keywords: ['市川'], lat: 35.7210, lng: 139.9305, name: '市川市' },
    { keywords: ['船橋'], lat: 35.6955, lng: 139.9838, name: '船橋市' },
    { keywords: ['柏'], lat: 35.8681, lng: 139.9756, name: '柏市' },
    // 大阪
    { keywords: ['大阪市', '梅田', 'なんば', '難波', '心斎橋'], lat: 34.6937, lng: 135.5023, name: '大阪市' },
    { keywords: ['堺'], lat: 34.5732, lng: 135.4829, name: '堺市' },
    { keywords: ['東大阪'], lat: 34.6795, lng: 135.6008, name: '東大阪市' },
    // 兵庫
    { keywords: ['神戸', 'こうべ'], lat: 34.6901, lng: 135.1956, name: '神戸市' },
    { keywords: ['姫路'], lat: 34.8161, lng: 134.6854, name: '姫路市' },
    // 京都
    { keywords: ['京都市', '京都駅', '四条', '祇園'], lat: 35.0116, lng: 135.7681, name: '京都市' },
    // 愛知
    { keywords: ['名古屋', 'なごや'], lat: 35.1815, lng: 136.9066, name: '名古屋市' },
    // 福岡
    { keywords: ['福岡市', '博多', '天神'], lat: 33.5904, lng: 130.4017, name: '福岡市' },
    { keywords: ['北九州'], lat: 33.8835, lng: 130.8753, name: '北九州市' },
    // 札幌
    { keywords: ['札幌', 'さっぽろ'], lat: 43.0618, lng: 141.3545, name: '札幌市' },
    // 仙台
    { keywords: ['仙台', 'せんだい'], lat: 38.2682, lng: 140.8694, name: '仙台市' },
    // 広島
    { keywords: ['広島', 'ひろしま'], lat: 34.3853, lng: 132.4553, name: '広島市' },
    // 岡山
    { keywords: ['岡山', 'おかやま'], lat: 34.6551, lng: 133.9195, name: '岡山市' },
    // 静岡
    { keywords: ['静岡', 'しずおか'], lat: 34.9769, lng: 138.3831, name: '静岡市' },
    { keywords: ['浜松'], lat: 34.7108, lng: 137.7261, name: '浜松市' },
    // 沖縄
    { keywords: ['那覇', 'なは'], lat: 26.2124, lng: 127.6792, name: '那覇市' },
];

const findLocalCity = (city: string): GeocodingResult | null => {
    for (const entry of JP_CITY_MAP) {
        if (entry.keywords.some(kw => city.includes(kw))) {
            return {
                id: 0,
                name: entry.name,
                latitude: entry.lat,
                longitude: entry.lng,
                country: 'Japan',
            };
        }
    }
    return null;
};

export const getCoordinates = async (city: string): Promise<GeocodingResult | null> => {
    // 1. ローカルマッピングで検索（日本の主要都市・区）
    const local = findLocalCity(city);
    if (local) return local;

    // 2. Open-Meteo Geocoding API でローマ字・英語名検索
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ja&format=json`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // 日本の結果のみ使う（誤ヒット防止）
            const result = data.results[0];
            if (result.country_code === 'JP' || result.country === '日本' || result.country === 'Japan') {
                return result;
            }
        }
    } catch (error) {
        console.error('Geocoding API error:', error);
    }

    // 3. 「都」「道」「府」「県」が含まれる場合、都道府県名だけで再試行
    const prefMatch = city.match(/(.+[都道府県])/);
    if (prefMatch) {
        const prefOnly = prefMatch[1];
        const prefLocal = findLocalCity(prefOnly);
        if (prefLocal) return prefLocal;
    }

    return null;
};

export const getWeather = async (lat: number, lng: number, targetHour?: number): Promise<WeatherData | null> => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FTokyo&forecast_days=1`
        );
        const data = await response.json();

        if (targetHour !== undefined && data.hourly) {
            const index = targetHour; // 0-23、Open-Meteoは forecast_days=1 で 24エントリ返す
            if (index >= 0 && index < data.hourly.time.length) {
                const weatherCode = data.hourly.weather_code[index];
                const { description, icon } = getWeatherDescription(weatherCode);
                return {
                    temperature: Math.round(data.hourly.temperature_2m[index] * 10) / 10,
                    windSpeed: data.hourly.wind_speed_10m[index],
                    weatherCode,
                    weatherDescription: description,
                    weatherIcon: icon,
                };
            }
        }

        if (data.current) {
            const { description, icon } = getWeatherDescription(data.current.weather_code);
            return {
                temperature: Math.round(data.current.temperature_2m * 10) / 10,
                windSpeed: data.current.wind_speed_10m,
                weatherCode: data.current.weather_code,
                weatherDescription: description,
                weatherIcon: icon,
            };
        }
        return null;
    } catch (error) {
        console.error('Weather API error:', error);
        return null;
    }
};
