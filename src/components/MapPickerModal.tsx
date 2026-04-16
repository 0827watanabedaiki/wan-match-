import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { X, MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet デフォルトアイコン修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Props {
    initialCenter?: [number, number];
    onConfirm: (lat: number, lng: number) => void;
    onClose: () => void;
}

const ClickHandler: React.FC<{ onPinDrop: (lat: number, lng: number) => void }> = ({ onPinDrop }) => {
    useMapEvents({
        click(e) {
            onPinDrop(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

export const MapPickerModal: React.FC<Props> = ({
    initialCenter = [35.6762, 139.6503],
    onConfirm,
    onClose,
}) => {
    const [pin, setPin] = useState<[number, number] | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
        >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-gray-100 shrink-0 bg-white">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                    <X size={20} strokeWidth={2.5} />
                </button>
                <div className="text-center">
                    <p className="text-[12px] font-extrabold tracking-widest text-gray-900 uppercase">エリアを選択</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">地図をタップしてピンを立ててください</p>
                </div>
                <div className="w-9" />
            </div>

            {/* マップ */}
            <div className="flex-1 relative">
                <MapContainer
                    center={initialCenter}
                    zoom={13}
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onPinDrop={(lat, lng) => setPin([lat, lng])} />
                    {pin && <Marker position={pin} />}
                </MapContainer>

                {/* ピン未設置の案内 */}
                {!pin && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow text-[11px] font-bold text-gray-600 pointer-events-none">
                        <MapPin size={12} className="inline mr-1 text-gray-500" />
                        検索したい場所をタップ
                    </div>
                )}
            </div>

            {/* 確定ボタン */}
            <div className="p-4 pb-28 bg-white border-t border-gray-100 shrink-0">
                <button
                    onClick={() => pin && onConfirm(pin[0], pin[1])}
                    disabled={!pin}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl text-[11px] font-extrabold tracking-widest uppercase shadow-md active:scale-95 transition-transform disabled:opacity-30"
                >
                    <Navigation size={14} className="inline mr-2" strokeWidth={2.5} />
                    この場所で検索
                </button>
            </div>
        </motion.div>
    );
};
