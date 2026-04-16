import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Camera, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
}

interface ChatViewProps {
    name: string;
    imageUrl: string;
    breed?: string;
    onBack: () => void;
}

const DOG_REPLIES = [
    'ワン！（一緒に遊ぼう！）',
    'くんくん...（いい匂いがする！）',
    'ワフワフ！（公園で会おうよ！）',
    'グルル...（ちょっと恥ずかしい）',
    'ワオーン！（嬉しい！）',
    'ハッハッ...（走りたい気分！）',
    'ワン！（いつ会える？）',
];

export const ChatView: React.FC<ChatViewProps> = ({ name, imageUrl, breed, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `ワン！（${name}だよ、よろしくね！）`,
            sender: 'them',
            time: '10:00',
        },
    ]);
    const [inputText, setInputText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const now = () => {
        const d = new Date();
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const myMsg: Message = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'me',
            time: now(),
        };
        setMessages(prev => [...prev, myMsg]);
        setInputText('');

        // Auto reply after delay
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: DOG_REPLIES[Math.floor(Math.random() * DOG_REPLIES.length)],
                sender: 'them',
                time: now(),
            };
            setMessages(prev => [...prev, reply]);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-md shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 -ml-1 rounded-full hover:bg-gray-100 transition text-gray-700"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-900 text-sm tracking-wide">{name}</p>
                    {breed && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{breed}</p>
                    )}
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <AnimatePresence initial={false}>
                    {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'them' && (
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className={`max-w-[70%] flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                                        msg.sender === 'me'
                                            ? 'bg-gray-900 text-white rounded-br-sm'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-300 font-bold mt-1 tracking-wider">{msg.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-700 transition">
                    <Camera size={20} strokeWidth={2} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                    />
                    <button className="text-gray-400 hover:text-gray-700 transition">
                        <Smile size={18} strokeWidth={2} />
                    </button>
                </div>
                <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        inputText.trim()
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-100 text-gray-300'
                    }`}
                >
                    <Send size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};
