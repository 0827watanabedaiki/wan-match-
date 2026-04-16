import React, { useState, useEffect } from 'react';
import { MapPin, Star, X, Clock, Loader2, Navigation, RefreshCcw, Globe, Search, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNearbySpots, geocodeAddress, PlaceSpot, SpotCategory } from '../services/placesService';
import { MapPickerModal } from './MapPickerModal';

const CATEGORIES: { id: SpotCategory; label: string }[] = [
    { id: 'all',      label: 'すべて'     },
    { id: 'run',      label: 'ドッグラン' },
    { id: 'park',     label: '公園'       },
    { id: 'cafe',     label: 'カフェ'     },
    { id: 'salon',    label: 'サロン'     },
    { id: 'hospital', label: '病院'       },
];

const CATEGORY_LABELS: Record<SpotCategory, string> = {
    all:      'スポット',
    run:      'ドッグラン',
    park:     '公園',
    cafe:     'ドッグカフェ',
    salon:    'サロン',
    hospital: '病院',
};

interface SpotDirectoryViewProps {
    initialCategory?: SpotCategory;
}

export const SpotDirectoryView: React.FC<SpotDirectoryViewProps> = ({ initialCategory = 'all' }) => {
    const [category, setCategory]     = useState<SpotCategory>(initialCategory);
    const [spots, setSpots]           = useState<PlaceSpot[]>([]);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [debugError, setDebugError] = useState<string | null>(null);
    const [userPos, setUserPos]       = useState<{ lat: number; lng: number } | null>(null);
    const [locationLabel, setLocationLabel] = useState<string | null>(null);
    const [searchInput, setSearchInput]     = useState('');
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [selected, setSelected]     = useState<PlaceSpot | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const filtered = category === 'all'
        ? spots
        : spots.filter(s => s.category === category);

    const loadSpots = async (lat: number, lng: number, cat: SpotCategory = category) => {
        setLoading(true);
        setError(null);
        setDebugError(null);
        setHasSearched(true);
        try {
            const result = await fetchNearbySpots(lat, lng, cat);
            setSpots(result);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setDebugError(msg);
            setError('スポットの取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            setError('位置情報が使えません');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserPos(p);
                setLocationLabel('現在地');
                loadSpots(p.lat, p.lng);
            },
            () => setError('位置情報を取得できませんでした。設定を確認してください。'),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleMapConfirm = async (lat: number, lng: number) => {
        setShowMapPicker(false);
        setLoading(true);
        setError(null);
        setDebugError(null);
        setHasSearched(true);
        try {
            // 逆ジオコーディングで地名を取得
            const res = await fetch(
                `/geocoding-api/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
            );
            const data = await res.json();
            const label = data.results?.[0]?.formatted_address ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setUserPos({ lat, lng });
            setLocationLabel(label);
            const result = await fetchNearbySpots(lat, lng, category);
            setSpots(result);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setDebugError(msg);
            setError('スポットの取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const handleAreaSearch = async () => {
        const query = searchInput.trim();
        if (!query) return;
        setLoading(true);
        setError(null);
        setDebugError(null);
        setHasSearched(true);
        try {
            const { lat, lng, label } = await geocodeAddress(query);
            setUserPos({ lat, lng });
            setLocationLabel(label);
            const result = await fetchNearbySpots(lat, lng, category);
            setSpots(result);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setDebugError(msg);
            setError('場所を見つけられませんでした。');
        } finally {
            setLoading(false);
        }
    };

    // カテゴリ変更時、取得済みなら再取得
    const handleCategoryChange = (cat: SpotCategory) => {
        setCategory(cat);
        setSelected(null);
        if (userPos) loadSpots(userPos.lat, userPos.lng, cat);
    };

    const googleMapsUrl = (spot: PlaceSpot) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}&query_place_id=${spot.id}`;

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Header */}
            <div className="pt-8 pb-3 px-4 flex flex-col items-center border-b border-gray-100 shrink-0">
                {/* エリア検索バー */}
                <div className="flex gap-2 w-full">
                    <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                        <Search size={13} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAreaSearch()}
                            placeholder="エリアで検索（例：京都、軽井沢）"
                            className="flex-1 bg-transparent text-[11px] font-bold text-gray-700 placeholder-gray-400 outline-none"
                        />
                        {searchInput && (
                            <button onClick={() => setSearchInput('')}>
                                <X size={12} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleAreaSearch}
                        disabled={!searchInput.trim() || loading}
                        className="bg-gray-900 text-white px-4 rounded-full text-[10px] font-extrabold tracking-widest disabled:opacity-40 active:scale-95 transition-transform"
                    >
                        検索
                    </button>
                    <button
                        onClick={() => setShowMapPicker(true)}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
                        title="マップで選択"
                    >
                        <Map size={16} className="text-gray-600" strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={handleLocate}
                        disabled={loading}
                        className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0 disabled:opacity-40"
                        title="現在地を取得"
                    >
                        <Navigation size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* カテゴリフィルター */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-100 shrink-0">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest border transition-all ${
                            category === cat.id
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-36">

                {/* 未検索状態 */}
                {!hasSearched && !loading && (
                    <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <MapPin size={28} strokeWidth={2} className="text-red-500" />
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-sm tracking-widest uppercase mb-2">スポットを探す</h3>
                        <p className="text-[11px] text-gray-400 font-bold tracking-wider mb-6 leading-relaxed">
                            GPSで現在地を取得するか<br />上の検索バーでエリアを入力してください
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
                    <div className="flex flex-col items-center justify-center h-full pb-20 gap-4">
                        <Loader2 size={32} className="text-gray-400 animate-spin" />
                        <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">周辺を検索中...</p>
                    </div>
                )}

                {/* エラー */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center h-full pb-20 text-center px-6">
                        <p className="text-sm text-gray-500 font-bold mb-2">{error}</p>
                        {debugError && (
                            <p className="text-[10px] text-red-400 font-mono mb-4 bg-red-50 px-3 py-2 rounded-lg break-all">
                                {debugError}
                            </p>
                        )}
                        <button
                            onClick={handleLocate}
                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-md active:scale-95 transition-transform"
                        >
                            <RefreshCcw size={14} strokeWidth={2.5} />
                            再試行
                        </button>
                    </div>
                )}

                {/* スポット一覧 */}
                {!loading && !error && hasSearched && (
                    <>
                        {filtered.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-3">
                                    {filtered.length}件のスポットが見つかりました
                                </p>
                                {filtered.map((spot, i) => (
                                    <motion.div
                                        key={spot.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => setSelected(spot)}
                                        className="bg-gray-50 rounded-xl p-4 cursor-pointer active:scale-[0.98] transition-transform border border-gray-100 hover:border-gray-300"
                                    >
                                        <div className="flex gap-3">
                                            {/* 写真 */}
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                {spot.photoUrl ? (
                                                    <img src={spot.photoUrl} alt={spot.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <MapPin size={22} strokeWidth={2} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* 情報 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{spot.name}</h3>
                                                    {spot.rating && (
                                                        <div className="flex items-center gap-0.5 shrink-0">
                                                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                                                            <span className="text-[11px] font-extrabold text-gray-700">{spot.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-extrabold text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded-sm tracking-wider">
                                                    {CATEGORY_LABELS[spot.category]}
                                                </span>
                                                <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-1">{spot.address}</p>
                                                {spot.isOpen !== undefined && (
                                                    <span className={`text-[10px] font-extrabold mt-1 block ${spot.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {spot.isOpen ? '● 営業中' : '● 営業時間外'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
                                <p className="text-sm font-bold text-gray-400">この周辺にスポットが見つかりませんでした</p>
                                <button
                                    onClick={handleLocate}
                                    className="mt-4 text-[11px] font-bold text-gray-500 underline"
                                >
                                    再検索
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>


            {/* 詳細モーダル */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="relative w-full max-w-sm bg-white rounded-t-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
                        >
                            {/* 写真ヘッダー */}
                            <div className="h-44 bg-gray-100 shrink-0 relative">
                                {selected.photoUrl ? (
                                    <img src={selected.photoUrl} alt={selected.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <MapPin size={40} strokeWidth={1.5} className="text-gray-300" />
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                                {selected.isOpen !== undefined && (
                                    <span className={`absolute bottom-4 left-4 text-[10px] font-extrabold px-2 py-1 rounded-full ${selected.isOpen ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {selected.isOpen ? '営業中' : '営業時間外'}
                                    </span>
                                )}
                            </div>

                            {/* 詳細情報 */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <span className="text-[10px] font-extrabold text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm tracking-wider uppercase">
                                    {CATEGORY_LABELS[selected.category]}
                                </span>
                                <h2 className="text-xl font-extrabold text-gray-900 mt-2 mb-1 tracking-tight">{selected.name}</h2>

                                {selected.rating && (
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-extrabold text-gray-900">{selected.rating.toFixed(1)}</span>
                                        {selected.totalRatings && (
                                            <span className="text-xs text-gray-400">({selected.totalRatings}件)</span>
                                        )}
                                    </div>
                                )}

                                {selected.address && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-6">
                                        <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                        <span className="font-medium">{selected.address}</span>
                                    </div>
                                )}

                                {selected.websiteUrl && (
                                    <a
                                        href={selected.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 text-[11px] font-extrabold tracking-widest uppercase py-4 rounded-xl active:scale-95 transition-transform mb-3"
                                    >
                                        <Globe size={14} strokeWidth={2.5} />
                                        ホームページを開く
                                    </a>
                                )}
                                <a
                                    href={googleMapsUrl(selected)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-[11px] font-extrabold tracking-widest py-4 rounded-xl active:scale-95 transition-transform shadow-md"
                                >
                                    <MapPin size={14} strokeWidth={2.5} />
                                    Googleマップで開く
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* マップピッカー */}
            <AnimatePresence>
                {showMapPicker && (
                    <MapPickerModal
                        initialCenter={userPos ? [userPos.lat, userPos.lng] : [35.6762, 139.6503]}
                        onConfirm={handleMapConfirm}
                        onClose={() => setShowMapPicker(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
