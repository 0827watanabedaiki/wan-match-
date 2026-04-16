import React from 'react';
import { MapPin, Navigation, Search, MessageCircle } from 'lucide-react';

interface HomeViewProps {
    onNavigate: (tab: string) => void;
}

const CARDS = [
    {
        id: 'spot',
        label: 'SPOT GUIDE',
        sub: 'スポットを探す',
        icon: MapPin,
        color: '#F5A623',
        bg: '#FFF8EC',
    },
    {
        id: 'nearby',
        label: 'NEARBY DOGS',
        sub: '近くの犬を見る',
        icon: Navigation,
        color: '#4A90D9',
        bg: '#EEF5FF',
    },
    {
        id: 'discovery',
        label: 'NEW FRIENDS',
        sub: 'ともだちを探す',
        icon: Search,
        color: '#7B68EE',
        bg: '#F0EEFF',
    },
    {
        id: 'qa',
        label: '座談会',
        sub: 'ワンコ座談会',
        icon: MessageCircle,
        color: '#E87461',
        bg: '#FFF0EE',
    },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
    return (
        <div className="h-full w-full flex flex-col overflow-y-auto pb-24 bg-white">
            {/* 装飾ドット */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: i % 3 === 0 ? 6 : 4,
                            height: i % 3 === 0 ? 6 : 4,
                            background: i % 2 === 0 ? '#F5A62340' : '#E8E0D840',
                            top: `${(i * 17 + 5) % 95}%`,
                            left: `${(i * 23 + 8) % 92}%`,
                        }}
                    />
                ))}
            </div>

            <div className="px-4 pt-4 relative">
                {/* グリッド */}
                <div className="grid grid-cols-2 gap-3">
                    {CARDS.map((card) => {
                        const Icon = card.icon;
                        return (
                            <button
                                key={card.id}
                                onClick={() => onNavigate(card.id)}
                                className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform text-center"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{ background: card.bg }}
                                >
                                    <Icon size={26} strokeWidth={1.8} style={{ color: card.color }} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-extrabold text-gray-900 tracking-widest uppercase leading-none">{card.label}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1">{card.sub}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
