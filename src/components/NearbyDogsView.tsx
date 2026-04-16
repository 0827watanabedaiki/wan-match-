import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, RefreshCcw, Loader2, List, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DogProfile {
    id: string | number;
    name: string;
    breed: string;
    age: number;
    imageUrl: string;
}

interface NearbyDog {
    dog: DogProfile;
    distance: number;
    direction: string;
    lat: number;
    lng: number;
}

const DEMO_DOGS: DogProfile[] = [
    { id: 'demo1', name: 'ポチ', breed: '柴犬', age: 3, imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400' },
    { id: 'demo2', name: 'ミル', breed: 'トイプードル', age: 2, imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400' },
    { id: 'demo3', name: 'ハナ', breed: 'ゴールデンレトリバー', age: 4, imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
    { id: 'demo4', name: 'クロ', breed: 'ラブラドール', age: 1, imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
];

const DIRECTION_DEGREES: Record<string, number> = {
    '北': 0, '北東': 45, '東': 90, '南東': 135,
    '南': 180, '南西': 225, '西': 270, '北西': 315,
};
const DIRECTIONS = Object.keys(DIRECTION_DEGREES);

// 距離(m)・方角 → lat/lng オフセット
const offsetLatLng = (lat: number, lng: number, distanceM: number, directionDeg: number) => {
    const rad = (directionDeg * Math.PI) / 180;
    const dLat = (distanceM * Math.cos(rad)) / 111000;
    const dLng = (distanceM * Math.sin(rad)) / (111000 * Math.cos((lat * Math.PI) / 180));
    return { lat: lat + dLat, lng: lng + dLng };
};

const getRandomNearby = (dogs: DogProfile[], userLat: number, userLng: number): NearbyDog[] => {
    return dogs.map(dog => {
        const distance = Math.floor(Math.random() * 750) + 50;
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const pos = offsetLatLng(userLat, userLng, distance, DIRECTION_DEGREES[direction]);
        return { dog, distance, direction, lat: pos.lat, lng: pos.lng };
    }).sort((a, b) => a.distance - b.distance);
};

const formatDistance = (m: number) => m < 1000 ? `約${m}m` : `約${(m / 1000).toFixed(1)}km`;

const getStatusColor = (m: number) => m < 150 ? 'bg-green-500' : m < 400 ? 'bg-yellow-400' : 'bg-gray-300';
const getStatusLabel = (m: number) => m < 150 ? 'すぐそこ！' : m < 400 ? '近くにいる' : 'この辺にいる';

// 犬アイコン (DivIcon)
const createDogIcon = (imageUrl: string, name: string) => L.divIcon({
    className: '',
    html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:3px solid #111;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
                <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover" />
            </div>
            <div style="background:#111;color:#fff;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;white-space:nowrap">${name}</div>
        </div>
    `,
    iconSize: [44, 60],
    iconAnchor: [22, 60],
});

// 自分アイコン
const userIcon = L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

interface Props {
    likedDogs: DogProfile[];
}

export const NearbyDogsView: React.FC<Props> = ({ likedDogs }) => {
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nearbyDogs, setNearbyDogs] = useState<NearbyDog[]>([]);
    const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedDog, setSelectedDog] = useState<NearbyDog | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const activeDogs = likedDogs.length > 0 ? likedDogs : DEMO_DOGS;

    const handleLocate = () => {
        if (!navigator.geolocation) { setError('位置情報が使えません'); return; }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setTimeout(() => {
                    setUserPos({ lat, lng });
                    setNearbyDogs(getRandomNearby(activeDogs, lat, lng));
                    setHasSearched(true);
                    setLoading(false);
                }, 1000);
            },
            () => { setError('位置情報を取得できませんでした'); setLoading(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="h-full bg-white flex flex-col">
            {/* ヘッダー */}
            <div className="pt-8 pb-3 px-4 flex flex-col items-center border-b border-gray-100 shrink-0">
                <h2 className="text-[13px] font-extrabold tracking-widest text-gray-900 uppercase">NEARBY DOGS</h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">近くにいるフレンズ</p>

                {/* リスト/マップ切替 */}
                {hasSearched && (
                    <div className="flex mt-3 bg-gray-100 rounded-full p-1 gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                        >
                            <List size={12} /> リスト
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest transition-all ${viewMode === 'map' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                        >
                            <Map size={12} /> マップ
                        </button>
                    </div>
                )}
            </div>

            {/* 未検索 */}
            {!hasSearched && !loading && !error && (
                <div className="flex flex-col items-center justify-center flex-1 pb-10 text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-3xl">🐾</div>
                    <h3 className="font-extrabold text-gray-900 text-sm tracking-widest uppercase mb-2">お散歩レーダー</h3>
                    <p className="text-[11px] text-gray-400 font-bold tracking-wider mb-6 leading-relaxed">
                        GPSをオンにすると<br />フレンズが近くにいるか確認できます
                    </p>
                    <button
                        onClick={handleLocate}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-md active:scale-95 transition-transform"
                    >
                        <Navigation size={14} strokeWidth={2.5} />
                        現在地を取得
                    </button>
                </div>
            )}

            {/* ローディング */}
            {loading && (
                <div className="flex flex-col items-center justify-center flex-1 pb-10 gap-4">
                    <Loader2 size={32} className="text-gray-400 animate-spin" />
                    <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">周辺を確認中...</p>
                </div>
            )}

            {/* エラー */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center flex-1 pb-10 text-center">
                    <p className="text-sm text-gray-500 font-bold mb-4">{error}</p>
                    <button onClick={handleLocate} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-md">
                        <RefreshCcw size={14} strokeWidth={2.5} /> 再試行
                    </button>
                </div>
            )}

            {/* 結果：リスト */}
            {hasSearched && !loading && viewMode === 'list' && (
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-3">
                        {nearbyDogs.length}匹のフレンズが見つかりました
                    </p>
                    <div className="space-y-3">
                        {nearbyDogs.map((item, i) => (
                            <motion.div
                                key={item.dog.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => setSelectedDog(item)}
                                className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 cursor-pointer active:scale-[0.98] transition-transform border border-gray-100 hover:border-gray-300"
                            >
                                <div className="relative shrink-0">
                                    <img src={item.dog.imageUrl} alt={item.dog.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
                                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(item.distance)} ${item.distance < 150 ? 'animate-pulse' : ''}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-extrabold text-gray-900 text-sm">{item.dog.name}</h3>
                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${item.distance < 150 ? 'bg-green-100 text-green-700' : item.distance < 400 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {getStatusLabel(item.distance)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-bold">{item.dog.breed} · {item.dog.age}歳</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-extrabold text-gray-900">{formatDistance(item.distance)}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{item.direction}の方向</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* 結果：マップ */}
            {hasSearched && !loading && viewMode === 'map' && userPos && (
                <div className="flex-1 relative">
                    <MapContainer
                        center={[userPos.lat, userPos.lng]}
                        zoom={15}
                        className="w-full h-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* 自分の位置 */}
                        <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                            <Popup>現在地</Popup>
                        </Marker>
                        <Circle
                            center={[userPos.lat, userPos.lng]}
                            radius={800}
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.05, weight: 1 }}
                        />
                        {/* 犬のマーカー */}
                        {nearbyDogs.map(item => (
                            <Marker
                                key={item.dog.id}
                                position={[item.lat, item.lng]}
                                icon={createDogIcon(item.dog.imageUrl, item.dog.name)}
                                eventHandlers={{ click: () => setSelectedDog(item) }}
                            />
                        ))}
                    </MapContainer>
                </div>
            )}

            {/* 再検索ボタン */}
            {hasSearched && !loading && (
                <div className="absolute bottom-24 right-4 z-[1000]">
                    <button
                        onClick={handleLocate}
                        className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <RefreshCcw size={18} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* 詳細モーダル */}
            <AnimatePresence>
                {selectedDog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-end justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDog(null)} />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="relative w-full max-w-sm bg-white rounded-t-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className="h-48 bg-gray-100 relative">
                                <img src={selectedDog.dog.imageUrl} alt={selectedDog.dog.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h2 className="text-xl font-extrabold text-white">{selectedDog.dog.name}</h2>
                                    <p className="text-sm text-white/80">{selectedDog.dog.breed} · {selectedDog.dog.age}歳</p>
                                </div>
                            </div>
                            <div className="p-6 pb-24">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">現在地から</p>
                                        <p className="text-2xl font-extrabold text-gray-900">{formatDistance(selectedDog.distance)}</p>
                                        <p className="text-[11px] text-gray-400 font-bold">{selectedDog.direction}の方向</p>
                                    </div>
                                    <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full ${selectedDog.distance < 150 ? 'bg-green-100 text-green-700' : selectedDog.distance < 400 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {getStatusLabel(selectedDog.distance)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedDog(null)}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl text-[11px] font-extrabold tracking-widest uppercase active:scale-95 transition-transform"
                                >
                                    閉じる
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
