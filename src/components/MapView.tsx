import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Scissors, Stethoscope, Star, Trees, Bone, Search, Loader2, Map as MapIcon, PenLine, ExternalLink, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchSpotsOnly } from '../services/overpassService';
import { friendService } from '../services/friendService';
import { Friend } from '../types';

// Fix for default marker icon in Leaflet + React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { SPOTS, Spot, SpotType } from '../data/spotsData';

// Coordinate Center (Yoyogi Park / Shibuya area)
const CENTER_LAT = 35.665;
const CENTER_LNG = 139.700;

interface Review {
    id: string;
    spotId: number;
    text: string;
    rating: number;
    date: string;
    tags: string[];
}


// Helper to create custom icon
const createCustomIcon = (icon: any, color: string, isSelected: boolean) => {
    // Safety check: if icon is missing or not a function (component), fallback to Bone
    const Icon = (icon && typeof icon === 'object' && '$$typeof' in icon) || typeof icon === 'function' ? icon : Bone;

    const iconMarkup = renderToStaticMarkup(
        <div className={`w-10 h-10 ${color} rounded-full border-4 border-white shadow-lg flex items-center justify-center relative transform transition-transform ${isSelected ? 'scale-110' : ''}`}>
            <Icon size={18} className="text-white" />
            {isSelected && (
                <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-white border-r-[6px] border-r-transparent translate-y-full drop-shadow-sm"></div>
            )}
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-leaflet-icon', // Empty class to remove default styles
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Center bottom
        popupAnchor: [0, -40],
    });
};

interface MapViewProps {
    onAddEvent?: (event: any) => void;
    onNavigateToCalendar?: () => void;
}

// Controller for Animations & Events
// Moved outside to prevent re-renders/infinite loops
const MapController: React.FC<{
    isAddingMode: boolean;
    setTempSpotLocation: (loc: { lat: number; lng: number }) => void;
}> = ({ isAddingMode, setTempSpotLocation }) => {
    const map = useMap();

    // Handle Map Clicks for Adding Spots
    useEffect(() => {
        if (!isAddingMode) return;

        const handleClick = (e: L.LeafletMouseEvent) => {
            setTempSpotLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        };

        map.on('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [isAddingMode, map, setTempSpotLocation]);

    return null;
};

// Inner Component for Map Controls (must be inside MapContainer)
// Moved outside to prevent re-renders/infinite loops
interface MapControlsProps {
    isSearching: boolean;
    setIsSearching: (isSearching: boolean) => void;
    category: SpotType;
    setCategory: (category: SpotType) => void;
    setFetchedSpots: React.Dispatch<React.SetStateAction<Spot[]>>;
    userLocation: { lat: number; lng: number } | null;
    isAddingMode: boolean;
    setIsAddingMode: (mode: boolean) => void;
    setTempSpotLocation: (loc: { lat: number; lng: number } | null) => void;
    showFriends: boolean;
    setShowFriends: (show: boolean) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
    isSearching,
    setIsSearching,
    category,
    setCategory,
    setFetchedSpots,
    userLocation,
    isAddingMode,
    setIsAddingMode,
    setTempSpotLocation,
    showFriends,
    setShowFriends
}) => {
    const map = useMap();
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleCategorySearch = async (targetType: SpotType) => {
        if (isSearching) return; // Prevent double trigger
        setIsSearching(true);
        setIsMenuOpen(false);
        setCategory(targetType);

        try {
            const bounds = map.getBounds();

            // Fetch real spots
            const newSpots = await fetchSpotsOnly(
                bounds.getSouth(),
                bounds.getWest(),
                bounds.getNorth(),
                bounds.getEast()
            );

            // Merge avoiding duplicates (simple ID check)
            if (newSpots.length > 0) {
                setFetchedSpots(prev => {
                    const newIds = new Set(newSpots.map(s => s.id));
                    // Keep old spots that are NOT in the new batch
                    const keptOldSpots = prev.filter(s => !newIds.has(s.id));
                    return [...keptOldSpots, ...newSpots];
                });
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const flyToUser = () => {
        if (userLocation) {
            map.flyTo([userLocation.lat, userLocation.lng], 15, {
                duration: 1.5
            });
        } else {
            alert("位置情報を取得できませんでした");
        }
    };

    const categories: { id: SpotType; label: string; icon: React.ElementType; color: string }[] = [
        { id: 'all', label: 'すべて', icon: Search, color: 'bg-blue-500' },
        { id: 'run', label: 'ドッグラン', icon: Bone, color: 'bg-green-600' },
        { id: 'park', label: '公園', icon: Trees, color: 'bg-green-400' },
        { id: 'salon', label: 'サロン', icon: Scissors, color: 'bg-pink-500' },
        { id: 'hospital', label: '病院', icon: Stethoscope, color: 'bg-red-500' },
    ];

    // Auto-search on mount
    // Auto-search on mount (Disabled by Request)
    /*
    const hasSearchedRef = useRef(false);

    useEffect(() => {
        if (hasSearchedRef.current) return;
        hasSearchedRef.current = true;

        const timer = setTimeout(() => {
            handleCategorySearch(category);
        }, 1500);
        return () => clearTimeout(timer);
    }, []); // Run once on mount
    */

    return (
        <div className="absolute top-0 left-0 w-full h-full z-[1000] pointer-events-none">
            {/* Search Menu / Button */}
            {/* Pointer events auto for interactive elements */}
            <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[600] flex flex-col items-center gap-2 pointer-events-auto">
                <div className="flex gap-2">
                    {/* Search Button (Hidden by Request) */}
                    {/*
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        disabled={isSearching}
                        className="bg-white text-dog-primary px-4 py-2 rounded-full shadow-md font-bold text-xs flex items-center gap-2 transition hover:bg-gray-50 active:scale-95 disabled:opacity-70 border border-dog-border"
                    >
                        {isSearching ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={14} />
                                <span>検索中...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Search size={14} />
                                <span>エリア検索</span>
                            </div>
                        )}
                    </button>
                    */}

                    <button
                        onClick={() => {
                            if (!showFriends) {
                                // Turning ON: Generate friends at current map center
                                const center = map.getCenter();
                                friendService.generateFriendsAround(center.lat, center.lng);
                                friendService.startSimulation();
                                setShowFriends(true);
                            } else {
                                // Turning OFF
                                friendService.stopSimulation();
                                setShowFriends(false);
                            }
                        }}
                        className={`px-4 py-2 rounded-full shadow-md font-bold text-xs flex items-center gap-2 transition active:scale-95 border ${showFriends
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-blue-500 border-blue-200'
                            }`}
                    >
                        <Users size={14} />
                        <span>{showFriends ? 'ワン友表示中' : 'ワン友を表示'}</span>
                    </button>
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div
                        className="bg-white p-2 rounded-xl shadow-xl border border-dog-border flex flex-col gap-1 w-40"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySearch(cat.id)}
                                className={`px-3 py-2 rounded-lg transition hover:bg-gray-50 text-left w-full`}
                            >
                                <span className="text-xs font-bold text-gray-700">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-[400] items-end pointer-events-auto">
                {/* Add Spot Toggle */}
                <button
                    onClick={() => {
                        setIsAddingMode(!isAddingMode);
                        setTempSpotLocation(null);
                    }}
                    className={`p-3 rounded-full shadow-lg border-2 transition-all duration-300 ${isAddingMode ? 'bg-dog-accent border-white text-white rotate-45' : 'bg-white border-dog-border text-dog-primary hover:bg-dog-bg'}`}
                >
                    <div className="relative">
                        <span className="text-xl font-bold leading-none">+</span>
                    </div>
                </button>

                {/* Current Location */}
                <button
                    onClick={flyToUser}
                    className="bg-white p-3 rounded-full shadow-lg border border-dog-border text-dog-text hover:bg-dog-bg active:scale-95 transition"
                >
                    <Navigation size={20} className={userLocation ? "text-blue-500 fill-blue-100" : "text-gray-400"} />
                </button>
            </div>
        </div>
    );
};

// You-Are-Here Marker Component
const LocationMarker = ({ userLocation }: { userLocation: { lat: number; lng: number } | null }) => {
    if (!userLocation) return null;

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute w-full h-full bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
    );

    const customIcon = L.divIcon({
        html: iconMarkup,
        className: 'custom-location-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    return <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon} />;
};

export const MapView: React.FC<MapViewProps> = ({ onAddEvent, onNavigateToCalendar }) => {
    // Parse query params for initial center/zoom
    const searchParams = new URLSearchParams(window.location.search);
    const initialLat = parseFloat(searchParams.get('lat') || '') || CENTER_LAT;
    const initialLng = parseFloat(searchParams.get('lng') || '') || CENTER_LNG;
    const initialZoom = parseInt(searchParams.get('zoom') || '14', 10);

    const [category, setCategory] = useState<SpotType>('all');
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([initialLat, initialLng]);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [savedOverrides, setSavedOverrides] = useState<Record<string, Partial<Spot>>>(() => {
        return JSON.parse(localStorage.getItem('custom_spot_overrides') || '{}');
    });
    const [editingSpotId, setEditingSpotId] = useState<number | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Mock Reviews State
    const [allReviews, setAllReviews] = useState<Review[]>([
        { id: '1', spotId: 1, text: '広くて最高でした！週末は混んでます。', rating: 5, date: '2025-01-20', tags: ['広々 🌳', 'ワンコが多い 🐕'] },
        { id: '2', spotId: 1, text: '大型犬エリアが充実してます。', rating: 4, date: '2025-02-01', tags: ['綺麗 ✨'] },
        { id: '3', spotId: 3, text: '芝生が気持ちいいです。カフェも近くにあって便利。', rating: 5, date: '2025-02-02', tags: ['綺麗 ✨', '広々 🌳'] },
    ]);

    const handleSubmitReview = () => {
        if (!selectedSpot) return;

        const newReview: Review = {
            id: Date.now().toString(),
            spotId: selectedSpot.id,
            text: reviewText,
            rating: reviewRating,
            date: new Date().toISOString(),
            tags: selectedTags
        };

        setAllReviews(prev => [newReview, ...prev]);

        setIsReviewing(false);
        setReviewText('');
        setSelectedTags([]);

        alert("口コミを投稿しました！ありがとうございます 🐶");
    };

    const reviewTags = ['綺麗', '広々', 'ワンコが多い', 'ゴミが落ちてる', '地面が荒れてる', '要リード'];

    // Custom Spot State
    const [spots, setSpots] = useState<Spot[]>(() => {
        try {
            const saved = localStorage.getItem('custom_spots');
            if (!saved) return SPOTS;

            const customSpots = JSON.parse(saved);
            // Must re-attach icon components since they don't survive JSON serialization
            const restoredSpots = customSpots.map((s: any) => ({
                ...s,
                icon: s.type === 'run' ? Bone : s.type === 'park' ? Trees : s.type === 'salon' ? Scissors : Stethoscope
            }));
            return [...SPOTS, ...restoredSpots];
        } catch (e) {
            console.error("Failed to load spots", e);
            return SPOTS;
        }
    });

    // Real World Spots State
    const [fetchedSpots, setFetchedSpots] = useState<Spot[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Friend Location State
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showFriends, setShowFriends] = useState(false);

    useEffect(() => {
        if (!showFriends) {
            setFriends([]); // Clear friends when toggled off
            return;
        }

        // Just subscribe to updates. Generation is triggered by MapControls.
        const unsubscribe = friendService.subscribe((updatedFriends) => {
            setFriends(updatedFriends);
        });

        // Loop adjustment: In case we mount with friends already showing (persistence), we should get current state
        friendService.getFriends().then(current => {
            if (current.length > 0) setFriends(current);
        });

        return () => {
            unsubscribe();
        };
    }, [showFriends]); // Re-run if showFriends changes. Note: we might want to re-run on mapCenter change too, but that would be too chaotic during drag.

    const [isAddingMode, setIsAddingMode] = useState(false);
    const [tempSpotLocation, setTempSpotLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [newSpotName, setNewSpotName] = useState('');
    const [newSpotType, setNewSpotType] = useState<SpotType>('park');
    const [newSpotDesc, setNewSpotDesc] = useState('');

    // Geolocation Effect
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setGeoError("お使いのブラウザは位置情報をサポートしていません");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLoc = { lat: latitude, lng: longitude };
                setUserLocation(newLoc);
                setMapCenter([latitude, longitude]);
                setGeoError(null);
            },
            (error) => {
                console.warn("Geolocation error:", error);
                let msg = "位置情報の取得に失敗しました";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "位置情報の利用が許可されていません。設定を確認してください";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "位置情報を特定できませんでした";
                        break;
                    case error.TIMEOUT:
                        msg = "位置情報の取得がタイムアウトしました";
                        break;
                }
                setGeoError(msg);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    const filteredSpots = (category === 'all'
        ? [...spots, ...fetchedSpots]
        : [...spots, ...fetchedSpots].filter(spot => spot.type === category))
        .map(spot => {
            const override = savedOverrides[spot.id];
            if (override) {
                // If overwritten, we should also probably update the icon if the type changed
                return {
                    ...spot,
                    ...override,
                    icon: override.type === 'run' ? Bone : override.type === 'park' ? Trees : override.type === 'salon' ? Scissors : Stethoscope
                };
            }
            return spot;
        });

    const handleReserve = (spot: Spot) => {
        if (onAddEvent && onNavigateToCalendar) {
            const today = new Date().getDate();
            const date = (today + 1) > 28 ? 1 : today + 1;

            onAddEvent({
                id: Date.now(),
                date: date,
                title: `${spot.name}の予約`,
                type: spot.type === 'hospital' ? 'vet' : spot.type === 'salon' ? 'grooming' : 'play',
                time: '10:00'
            });
            onNavigateToCalendar();
        }
    };

    const handleAddSpot = () => {
        if (!tempSpotLocation) return;

        const newSpot: Spot = {
            id: Date.now(),
            name: newSpotName,
            type: newSpotType,
            description: newSpotDesc || 'カスタムスポット',
            lat: tempSpotLocation.lat,
            lng: tempSpotLocation.lng,
            color: newSpotType === 'run' ? 'bg-green-600' : newSpotType === 'park' ? 'bg-green-400' : newSpotType === 'salon' ? 'bg-pink-500' : 'bg-red-500',
            icon: newSpotType === 'run' ? Bone : newSpotType === 'park' ? Trees : newSpotType === 'salon' ? Scissors : Stethoscope
        };

        if (editingSpotId) {
            // Editing existing spot (Override)
            const overrides = {
                ...savedOverrides, [editingSpotId]: {
                    name: newSpotName,
                    description: newSpotDesc,
                    type: newSpotType,
                    // Keep original lat/lng unless we want to allow moving (which is hard with this UI)
                }
            };
            setSavedOverrides(overrides);
            localStorage.setItem('custom_spot_overrides', JSON.stringify(overrides));
            setEditingSpotId(null);
        } else {
            // Creating new custom spot
            const updatedSpots = [...spots, newSpot];
            setSpots(updatedSpots);
            const currentCustom = JSON.parse(localStorage.getItem('custom_spots') || '[]');
            localStorage.setItem('custom_spots', JSON.stringify([...currentCustom, newSpot]));
        }

        // Reset UI
        setTempSpotLocation(null);
        setIsAddingMode(false);
        setNewSpotName('');
        setNewSpotDesc('');

        // Select the edited/new spot
        setCategory(newSpotType);
        // We need to find the spot object to select it. For new spots it works, for edits we need to reconstruct or finding it.
        // For simplicity, just close the add modal. The map will update.
    };

    const handleStartEdit = (spot: Spot) => {
        setEditingSpotId(spot.id);
        setNewSpotName(spot.name);
        setNewSpotDesc(spot.description);
        setNewSpotType(spot.type === 'all' ? 'park' : spot.type); // fallback
        setTempSpotLocation({ lat: spot.lat, lng: spot.lng });
        setIsAddingMode(true);
        setSelectedSpot(null); // Close detail modal
    };

    return (
        <div className="h-full w-full relative bg-dog-bg overflow-hidden z-0">


            {/* Instruction Banner for Adding Mode */}
            <AnimatePresence>
                {isAddingMode && !tempSpotLocation && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 bg-dog-accent text-white pl-4 pr-1 py-1.5 rounded-full shadow-lg z-[500] font-bold text-xs flex items-center gap-2 w-auto max-w-[90%] pointer-events-auto border-2 border-white"
                    >
                        <span className="shrink-0">{editingSpotId ? 'スポット情報を編集' : '地図をタップして登録'}</span>
                        <button
                            onClick={() => {
                                setIsAddingMode(false);
                                setTempSpotLocation(null);
                                setEditingSpotId(null);
                            }}
                            className="bg-white text-dog-accent px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition hover:bg-gray-100 shrink-0"
                        >
                            やめる
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence>
                {geoError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-28 left-4 right-4 bg-red-500/90 backdrop-blur-sm p-3 rounded-xl z-[450] flex items-center gap-2 text-white shadow-md pointer-events-none"
                    >
                        <Navigation className="off" size={16} />
                        <span className="text-xs font-bold">{geoError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Leaflet Map */}
            {/* Force CSS injection to ensure visibility */}
            <style>{`
                .leaflet-container {
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }
                .custom-leaflet-icon {
                    background: transparent;
                    border: none;
                }
                .custom-location-icon {
                    background: transparent;
                    border: none;
                }
                /* Pulse animation for temp marker */
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 1; }
                    80%, 100% { transform: scale(2); opacity: 0; }
                }
                .pulse-ring {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    border: 3px solid #F08A76;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
            `}</style>

            <MapContainer
                center={mapCenter}
                zoom={initialZoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Controllers & Custom Layers */}
                <MapController isAddingMode={isAddingMode} setTempSpotLocation={setTempSpotLocation} />
                <MapControls
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    category={category}
                    setCategory={setCategory}
                    setFetchedSpots={setFetchedSpots}
                    userLocation={userLocation}
                    isAddingMode={isAddingMode}
                    setIsAddingMode={setIsAddingMode}
                    setTempSpotLocation={setTempSpotLocation}
                    showFriends={showFriends}
                    setShowFriends={setShowFriends}
                />
                <LocationMarker userLocation={userLocation} />

                {/* Friend Markers */}
                {showFriends && friends.map(friend => {
                    const friendIconMarkup = renderToStaticMarkup(
                        <div className="relative flex flex-col items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full border-2 border-blue-500 shadow-md flex items-center justify-center text-xl overflow-hidden">
                                {friend.avatar}
                            </div>
                            <div className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full -mt-2 shadow-sm font-bold whitespace-nowrap z-10">
                                {friend.name}
                            </div>
                        </div>
                    );

                    const friendIcon = L.divIcon({
                        html: friendIconMarkup,
                        className: 'custom-friend-icon',
                        iconSize: [40, 50],
                        iconAnchor: [20, 50], // Anchor at bottom center
                        popupAnchor: [0, -50]
                    });

                    return (
                        <Marker key={friend.id} position={[friend.location.lat, friend.location.lng]} icon={friendIcon}>
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-lg mb-1">{friend.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">Status: {friend.status}</p>
                                    <p className="text-xs text-gray-400">Last seen: {friend.lastActive}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Valid Spots Rendering (Hidden by Request) */}
                {/*
                {filteredSpots.map(spot => (
                    <Marker
                        key={spot.id}
                        position={[spot.lat, spot.lng]}
                        icon={createCustomIcon(spot.icon, spot.color, selectedSpot?.id === spot.id)}
                        eventHandlers={{
                            click: () => setSelectedSpot(spot),
                        }}
                    />
                ))}
                */}

                {/* Temporary Marker for New Spot */}
                {tempSpotLocation && (
                    <Marker
                        position={[tempSpotLocation.lat, tempSpotLocation.lng]}
                        icon={L.divIcon({
                            html: '<div class="w-8 h-8 bg-dog-accent rounded-full border-4 border-white shadow-xl relative"><div class="pulse-ring"></div></div>',
                            className: 'custom-leaflet-icon',
                            iconSize: [32, 32],
                            iconAnchor: [16, 16]
                        })}
                    />
                )}
            </MapContainer>

            {/* Add Spot Modal */}
            <AnimatePresence>
                {tempSpotLocation && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-white p-6 rounded-3xl shadow-2xl border border-dog-border z-[600]"
                    >
                        <h3 className="text-lg font-bold text-dog-text mb-4">新しいスポットを登録</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">スポット名</label>
                                <input
                                    type="text"
                                    value={newSpotName}
                                    onChange={(e) => setNewSpotName(e.target.value)}
                                    placeholder="例: 〇〇公園"
                                    className="w-full bg-dog-bg border border-dog-border rounded-xl px-4 py-3 font-bold text-dog-text focus:outline-none focus:ring-2 focus:ring-dog-primary"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">カテゴリ</label>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {[
                                        { id: 'run', label: 'ドッグラン', icon: Bone, color: 'text-green-600' },
                                        { id: 'park', label: '公園', icon: Trees, color: 'text-green-500' },
                                        { id: 'salon', label: 'サロン', icon: Scissors, color: 'text-pink-500' },
                                        { id: 'hospital', label: '病院', icon: Stethoscope, color: 'text-red-500' }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setNewSpotType(type.id as SpotType)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${newSpotType === type.id
                                                ? 'bg-dog-text text-white border-dog-text'
                                                : 'bg-white text-gray-400 border-gray-200'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">メモ</label>
                                <textarea
                                    value={newSpotDesc}
                                    onChange={(e) => setNewSpotDesc(e.target.value)}
                                    placeholder="特徴や感想など..."
                                    className="w-full bg-dog-bg border border-dog-border rounded-xl px-4 py-3 text-sm text-dog-text focus:outline-none focus:ring-2 focus:ring-dog-primary resize-none h-20"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setTempSpotLocation(null)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleAddSpot}
                                    disabled={!newSpotName}
                                    className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${!newSpotName ? 'bg-gray-300' : 'bg-dog-primary'}`}
                                >
                                    登録する
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spot Detail Request */}
            <AnimatePresence>
                {selectedSpot && !tempSpotLocation && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-3xl shadow-xl border border-dog-border z-[500]"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${selectedSpot.color}`}>
                                        {selectedSpot.type === 'run' && 'ドッグラン'}
                                        {selectedSpot.type === 'park' && '公園'}
                                        {selectedSpot.type === 'salon' && 'サロン'}
                                        {selectedSpot.type === 'hospital' && '病院'}
                                    </span>
                                    {selectedSpot.rating && (
                                        <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                                            <Star size={12} fill="currentColor" /> {selectedSpot.rating}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-dog-text">{selectedSpot.name}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedSpot(null)}
                                className="bg-dog-bg p-1 rounded-full text-gray-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{selectedSpot.description}</p>

                        {/* Reviews Section */}
                        <div className="mb-4 border-t border-gray-100 pt-3">
                            <h4 className="text-xs font-bold text-gray-400 mb-2">みんなの口コミ</h4>
                            <div className="space-y-3 max-h-40 overflow-y-auto">
                                {allReviews.filter(r => r.spotId === selectedSpot.id).length === 0 ? (
                                    <p className="text-xs text-gray-400">まだ口コミはありません</p>
                                ) : (
                                    allReviews.filter(r => r.spotId === selectedSpot.id).map(review => (
                                        <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            {review.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-1">
                                                    {review.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-xs text-dog-text font-medium">{review.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleStartEdit(selectedSpot)}
                                className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                            >
                                編集する
                            </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedSpot.lat},${selectedSpot.lng}`, '_blank')}
                                className="flex-1 bg-dog-bg text-gray-600 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                            >
                                GoogleMapで見る
                            </button>
                            <button
                                onClick={() => setIsReviewing(true)}
                                className="flex-1 bg-dog-primary text-white text-xs font-bold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition"
                            >
                                口コミを書く
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {isReviewing && selectedSpot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[700] bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setIsReviewing(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm border-2 border-dog-border shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-dog-text mb-4">
                                口コミを書く
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 font-bold">{selectedSpot.name}</p>

                            {/* Rating */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className="transition transform active:scale-125 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {reviewTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(prev => prev.filter(t => t !== tag));
                                            } else {
                                                setSelectedTags(prev => [...prev, tag]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${selectedTags.includes(tag)
                                            ? 'bg-dog-accent text-white border-dog-accent'
                                            : 'bg-white text-gray-500 border-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            {/* Text Area */}
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="ここでの体験を教えてください..."
                                className="w-full bg-dog-bg border border-dog-border rounded-xl px-4 py-3 text-sm text-dog-text mb-4 focus:outline-none focus:ring-2 focus:ring-dog-primary resize-none h-24"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsReviewing(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    className="flex-1 bg-dog-primary text-white py-3 rounded-xl font-bold shadow-lg transition active:scale-95"
                                >
                                    投稿する
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
