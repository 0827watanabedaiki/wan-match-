import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Star, Navigation, Loader2, RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// ---- 型定義 ----
interface NearbySpot {
    id: number;
    name: string;
    type: 'run' | 'park' | 'salon' | 'hospital';
    lat: number;
    lng: number;
}

// ---- カテゴリ設定 ----
const CATEGORY_CONFIG = {
    run:      { label: 'ドッグラン', color: '#16a34a' },
    park:     { label: '公園',       color: '#22c55e' },
    salon:    { label: 'サロン',     color: '#ec4899' },
    hospital: { label: '病院',       color: '#ef4444' },
} as const;

type SpotType = keyof typeof CATEGORY_CONFIG;
const ALL_TYPES = Object.keys(CATEGORY_CONFIG) as SpotType[];

// ---- Overpass APIで周辺スポットを取得 ----
const fetchNearbySpots = async (lat: number, lng: number): Promise<NearbySpot[]> => {
    const radius = 3000; // 3km圏内
    const query = `
[out:json][timeout:20];
(
  node["amenity"="veterinary"](around:${radius},${lat},${lng});
  node["shop"~"pet_grooming|pet"](around:${radius},${lat},${lng});
  node["leisure"="dog_park"](around:${radius},${lat},${lng});
  node["leisure"="park"](around:${radius},${lat},${lng});
  way["leisure"="park"](around:${radius},${lat},${lng});
  way["leisure"="dog_park"](around:${radius},${lat},${lng});
);
out center 60;
    `.trim();

    const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
    });

    if (!res.ok) throw new Error('Overpass API error');
    const data = await res.json();

    const spots: NearbySpot[] = [];
    for (const el of data.elements) {
        const slat = el.lat ?? el.center?.lat;
        const slng = el.lon ?? el.center?.lon;
        if (!slat || !slng) continue;

        const name = el.tags?.name ?? el.tags?.['name:ja'];
        if (!name) continue;

        let type: SpotType;
        const amenity = el.tags?.amenity ?? '';
        const shop    = el.tags?.shop ?? '';
        const leisure = el.tags?.leisure ?? '';

        if (amenity === 'veterinary')            type = 'hospital';
        else if (shop === 'pet_grooming' || shop === 'pet') type = 'salon';
        else if (leisure === 'dog_park')         type = 'run';
        else if (leisure === 'park')             type = 'park';
        else continue;

        spots.push({ id: el.id, name, type, lat: slat, lng: slng });
    }
    return spots;
};

// ---- GPS移動コントローラー ----
const FlyTo: React.FC<{ pos: [number, number] | null }> = ({ pos }) => {
    const map = useMap();
    useEffect(() => {
        if (pos) map.flyTo(pos, 14, { duration: 1.2 });
    }, [pos, map]);
    return null;
};

const DEFAULT_CENTER: [number, number] = [35.665, 139.700];

// ---- メインコンポーネント ----
export const SimpleMapView: React.FC = () => {
    const [spots, setSpots]           = useState<NearbySpot[]>([]);
    const [category, setCategory]     = useState<SpotType | 'all'>('all');
    const [selected, setSelected]     = useState<NearbySpot | null>(null);
    const [userPos, setUserPos]       = useState<[number, number] | null>(null);
    const [flyTo, setFlyTo]           = useState<[number, number] | null>(null);
    const [loading, setLoading]       = useState(false);
    const [statusMsg, setStatusMsg]   = useState<string | null>('GPS ボタンで現在地周辺を検索');

    const filtered = category === 'all'
        ? spots
        : spots.filter(s => s.type === category);

    const loadSpots = async (lat: number, lng: number) => {
        setLoading(true);
        setStatusMsg('周辺スポットを検索中...');
        setSelected(null);
        try {
            const result = await fetchNearbySpots(lat, lng);
            setSpots(result);
            setStatusMsg(result.length > 0 ? null : 'この周辺にスポットが見つかりませんでした');
        } catch {
            setStatusMsg('スポットの取得に失敗しました。再試行してください');
        } finally {
            setLoading(false);
        }
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            setStatusMsg('位置情報が使えません');
            return;
        }
        setStatusMsg('現在地を取得中...');
        navigator.geolocation.getCurrentPosition(
            pos => {
                const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(p);
                setFlyTo(p);
                loadSpots(p[0], p[1]);
            },
            () => setStatusMsg('位置情報を取得できませんでした。設定を確認してください'),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const googleMapsUrl = (spot: NearbySpot) =>
        `https://maps.google.com/?q=${spot.lat},${spot.lng}`;

    return (
        <div className="h-full w-full relative overflow-hidden">

            {/* カテゴリフィルター */}
            <div className="absolute top-4 left-0 right-0 z-[1000] flex gap-2 px-4 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => { setCategory('all'); setSelected(null); }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest shadow-md border transition-all ${
                        category === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                    すべて
                </button>
                {ALL_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => { setCategory(type); setSelected(null); }}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest shadow-md border transition-all ${
                            category === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
                        }`}
                    >
                        {CATEGORY_CONFIG[type].label}
                    </button>
                ))}
            </div>

            {/* ステータスメッセージ */}
            <AnimatePresence>
                {statusMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-16 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
                    >
                        {loading && <Loader2 size={13} className="animate-spin text-gray-500 shrink-0" />}
                        <span className="flex-1">{statusMsg}</span>
                        {!loading && (
                            <button onClick={() => setStatusMsg(null)} className="text-gray-400">
                                <X size={13} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GPS ボタン */}
            <button
                onClick={handleLocate}
                disabled={loading}
                className="absolute bottom-32 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
            >
                {loading
                    ? <Loader2 size={20} className="text-gray-500 animate-spin" />
                    : <Navigation size={20} className="text-gray-700" strokeWidth={2.5} />
                }
            </button>

            {/* スポット数バッジ */}
            {spots.length > 0 && !loading && (
                <div className="absolute bottom-32 left-4 z-[1000] bg-gray-900 text-white text-[10px] font-extrabold tracking-widest px-3 py-2 rounded-full shadow-md flex items-center gap-1.5">
                    <MapPin size={11} />
                    {filtered.length}件
                    {userPos && (
                        <button onClick={handleLocate} className="ml-1 opacity-60 hover:opacity-100">
                            <RefreshCcw size={11} />
                        </button>
                    )}
                </div>
            )}

            {/* 凡例 */}
            {spots.length > 0 && (
                <div className="absolute bottom-44 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 px-3 py-2 flex flex-col gap-1">
                    {ALL_TYPES.map(type => (
                        <div key={type} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: CATEGORY_CONFIG[type].color }} />
                            <span className="text-[10px] font-bold text-gray-600">{CATEGORY_CONFIG[type].label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Leaflet Map */}
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={14}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <FlyTo pos={flyTo} />

                {/* 現在地 */}
                {userPos && (
                    <CircleMarker
                        center={userPos}
                        radius={8}
                        pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 3 }}
                    />
                )}

                {/* スポット */}
                {filtered.map(spot => (
                    <CircleMarker
                        key={spot.id}
                        center={[spot.lat, spot.lng]}
                        radius={selected?.id === spot.id ? 12 : 8}
                        pathOptions={{
                            color: 'white',
                            fillColor: CATEGORY_CONFIG[spot.type].color,
                            fillOpacity: 1,
                            weight: 2,
                        }}
                        eventHandlers={{ click: () => setSelected(spot) }}
                    />
                ))}
            </MapContainer>

            {/* スポット詳細シート */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'tween', duration: 0.22 }}
                        className="absolute bottom-20 left-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-full shrink-0 mt-0.5"
                                style={{ background: CATEGORY_CONFIG[selected.type].color }}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-gray-900 text-sm leading-tight mb-1">{selected.name}</h3>
                                <span className="text-[10px] font-extrabold text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm">
                                    {CATEGORY_CONFIG[selected.type].label}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-1 text-gray-400 hover:text-gray-700 transition shrink-0"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        <a
                            href={googleMapsUrl(selected)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-[11px] font-extrabold tracking-widest py-3 rounded-lg active:scale-95 transition-transform"
                        >
                            <MapPin size={14} strokeWidth={2.5} />
                            Googleマップで開く
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
