import React from 'react';
import { Search, Camera } from 'lucide-react';

export const MatchesView: React.FC = () => {
    const matches = [
        { id: 1, name: 'ココ', type: 'ゴールデンレトリバー', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, name: 'バスター', type: 'ビーグル', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200' },
    ];

    const messages = [
        { id: 1, name: 'ココ', message: 'ワン！（ボール遊びしよ！）', time: '2分前', unread: true, img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, name: 'バスター', message: 'グルル...（今日は気分じゃないな）', time: '1時間前', unread: false, img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200' },
        { id: 3, name: 'ルナ', message: 'ワホワホ！（新しい公園見つけた？）', time: '1日前', unread: false, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-dog-text mb-4">新しい仲間</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {matches.map(match => (
                        <div key={match.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                            <div className="w-16 h-16 rounded-full border-2 border-dog-primary p-0.5">
                                <img src={match.img} alt={match.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <span className="text-sm font-semibold mt-1 text-gray-700">{match.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 flex-1">
                <h2 className="text-xl font-bold text-dog-text mb-4">メッセージ</h2>
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-dog-border active:scale-98 transition-transform cursor-pointer">
                            <div className="relative">
                                <img src={msg.img} alt={msg.name} className="w-14 h-14 rounded-full object-cover" />
                                {msg.unread && <div className="absolute -top-1 -right-1 w-4 h-4 bg-dog-primary rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-dog-text">{msg.name}</span>
                                    <span className="text-xs text-gray-400">{msg.time}</span>
                                </div>
                                <p className={`text-sm truncate ${msg.unread ? 'font-semibold text-dog-text' : 'text-gray-500'}`}>
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
