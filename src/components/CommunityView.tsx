import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ChatView } from './ChatView';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatContact {
    id: number;
    name: string;
    message: string;
    time: string;
    unread: boolean;
    img: string;
    breed?: string;
}

export const CommunityView: React.FC = () => {
    const matches = [
        { id: 1, name: 'ココ', breed: 'ゴールデンレトリバー', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, name: 'バスター', breed: 'ビーグル', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200' },
    ];

    const [messages, setMessages] = useState<ChatContact[]>([
        { id: 1, name: 'ココ', breed: 'ゴールデンレトリバー', message: 'ワン！（ボール遊びしよ！）', time: '2分前', unread: true, img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, name: 'バスター', breed: 'ビーグル', message: 'グルル...（今日は気分じゃないな）', time: '1時間前', unread: false, img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200' },
        { id: 3, name: 'ルナ', breed: 'ポメラニアン', message: 'ワホワホ！（新しい公園見つけた？）', time: '1日前', unread: false, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200' },
    ]);

    const [openChat, setOpenChat] = useState<ChatContact | null>(null);

    const handleDeleteMessage = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setMessages(messages.filter(msg => msg.id !== id));
    };

    const handleOpenChat = (msg: ChatContact) => {
        // Mark as read
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
        setOpenChat(msg);
    };

    return (
        <div className="h-full w-full relative">
            {/* Chat Screen Overlay */}
            <AnimatePresence>
                {openChat && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25 }}
                        className="absolute inset-0 z-50 bg-white"
                    >
                        <ChatView
                            name={openChat.name}
                            imageUrl={openChat.img}
                            breed={openChat.breed}
                            onBack={() => setOpenChat(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Messages List */}
            <div className="h-full w-full bg-white flex flex-col pt-8 pb-20 items-center">
                <div className="w-full max-w-md px-4 py-4 z-10 flex flex-col items-center mb-4">
                    <h2 className="text-[13px] font-extrabold tracking-widest text-gray-900 uppercase">MESSAGES</h2>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                <div className="w-full max-w-md flex-1 overflow-y-auto px-4 pb-20">
                    {/* New Matches */}
                    <div className="mb-10">
                        <h2 translate="no" className="text-[10px] font-extrabold text-gray-400 mb-4 tracking-widest uppercase border-l-2 border-gray-900 pl-2">新しいともだち</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {matches.map(match => (
                                <div
                                    key={match.id}
                                    onClick={() => handleOpenChat({ id: match.id, name: match.name, breed: match.breed, message: '', time: '', unread: false, img: match.img })}
                                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-gray-900 p-0.5 group-hover:scale-105 transition-transform">
                                        <img src={match.img} alt={match.name} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <span className="text-[10px] font-extrabold mt-2 text-gray-900 uppercase tracking-widest">{match.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div>
                        <h2 translate="no" className="text-[10px] font-extrabold text-gray-400 mb-4 tracking-widest uppercase border-l-2 border-gray-900 pl-2">メッセージ一覧</h2>
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleOpenChat(msg)}
                                    className="flex items-center gap-4 bg-white active:scale-[0.99] transition-transform cursor-pointer group border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-2"
                                >
                                    <div className="relative shrink-0">
                                        <img src={msg.img} alt={msg.name} className="w-14 h-14 rounded-full object-cover" />
                                        {msg.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-gray-900 rounded-full border-2 border-white"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-gray-900 tracking-wide text-sm">{msg.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{msg.time}</span>
                                        </div>
                                        <p className={`text-xs truncate ${msg.unread ? 'font-bold text-gray-900' : 'text-gray-500 font-medium'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteMessage(msg.id, e)}
                                        className="p-3 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-full transition relative z-20"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
