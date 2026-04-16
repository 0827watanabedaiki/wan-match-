const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export type SpotCategory = 'all' | 'run' | 'park' | 'salon' | 'hospital' | 'cafe';

export interface PlaceSpot {
    id: string;
    name: string;
    category: SpotCategory;
    address: string;
    rating?: number;
    totalRatings?: number;
    lat: number;
    lng: number;
    isOpen?: boolean;
    photoUrl?: string;
    websiteUrl?: string;
}

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; label: string }> => {
    const res = await fetch(
        `/geocoding-api/maps/api/geocode/json?address=${encodeURIComponent(address)}&language=ja&key=${API_KEY}`
    );
    if (!res.ok) throw new Error('ジオコーディング失敗');
    const data = await res.json();
    if (data.status !== 'OK' || !data.results.length) {
        throw new Error(`「${address}」が見つかりませんでした`);
    }
    const { lat, lng } = data.results[0].geometry.location;
    const label = data.results[0].formatted_address;
    return { lat, lng, label };
};

const SEARCH_KEYWORDS: Record<Exclude<SpotCategory, 'all'>, string[]> = {
    run:      ['ドッグラン'],
    park:     ['公園'],
    salon:    ['トリミングサロン', 'ペットサロン'],
    hospital: ['動物病院'],
    cafe:     ['ドッグカフェ', 'ペットカフェ'],
};

const FIELD_MASK = [
    'places.id',
    'places.displayName',
    'places.location',
    'places.formattedAddress',
    'places.rating',
    'places.userRatingCount',
    'places.photos',
    'places.regularOpeningHours',
    'places.websiteUri',
].join(',');

const searchByKeyword = async (
    keyword: string,
    lat: number,
    lng: number,
): Promise<any[]> => {
    const response = await fetch('/places-api/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify({
            textQuery: keyword,
            locationBias: {
                circle: {
                    center: { latitude: lat, longitude: lng },
                    radius: 3000.0,
                },
            },
            languageCode: 'ja',
            maxResultCount: 20,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Places API ${response.status}: ${text.slice(0, 200)}`);
    }

    const data = await response.json();
    return data.places ?? [];
};

const mapToSpot = (place: any, cat: Exclude<SpotCategory, 'all'>): PlaceSpot => {
    const photoName = place.photos?.[0]?.name;
    const photoUrl = photoName
        ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`
        : undefined;

    return {
        id: place.id ?? String(Math.random()),
        name: place.displayName?.text ?? '名称不明',
        category: cat,
        address: place.formattedAddress ?? '',
        rating: place.rating,
        totalRatings: place.userRatingCount,
        lat: place.location?.latitude ?? 0,
        lng: place.location?.longitude ?? 0,
        isOpen: place.regularOpeningHours?.openNow,
        photoUrl,
        websiteUrl: place.websiteUri,
    };
};

export const fetchNearbySpots = async (
    lat: number,
    lng: number,
    category: SpotCategory = 'all',
): Promise<PlaceSpot[]> => {
    const targetCategories: Exclude<SpotCategory, 'all'>[] =
        category === 'all' ? ['run', 'park', 'salon', 'hospital'] : [category];

    const results = await Promise.allSettled(
        targetCategories.flatMap(cat =>
            SEARCH_KEYWORDS[cat].map(async keyword => {
                const places = await searchByKeyword(keyword, lat, lng);
                return places.map(p => mapToSpot(p, cat));
            })
        )
    );

    const rejected = results.filter(r => r.status === 'rejected');
    if (rejected.length === results.length) {
        const reasons = (results as PromiseRejectedResult[]).map(r => r.reason?.message ?? String(r.reason));
        console.error('全クエリ失敗:', reasons);
        throw new Error(reasons[0] ?? 'スポット取得失敗');
    }

    const all: PlaceSpot[] = [];
    const seen = new Set<string>();
    for (const r of results) {
        if (r.status === 'fulfilled') {
            for (const spot of r.value) {
                if (!seen.has(spot.id) && spot.lat && spot.lng) {
                    seen.add(spot.id);
                    all.push(spot);
                }
            }
        }
    }
    return all;
};
