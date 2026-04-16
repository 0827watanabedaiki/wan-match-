import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, MapPin, Calendar as CalendarIcon, Stethoscope, Bone, Scissors, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
    events: any[];
    onAddEvent: (event: any) => void;
    onDeleteEvent: (id: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onDeleteEvent }) => {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form inputs state
    const [newEventDate, setNewEventDate] = useState(now.getDate());
    const [newEventTime, setNewEventTime] = useState('14:00');
    // Added 'other' to the type union
    const [newEventType, setNewEventType] = useState<'grooming' | 'vet' | 'play' | 'other'>('play');
    // Added state for custom title input
    const [customTitle, setCustomTitle] = useState('');

    const submitEvent = () => {
        const titleMap: Record<string, string> = {
            'grooming': 'トリミング',
            'vet': '病院',
            'play': 'ドッグラン',
            'other': customTitle || '予定' // Fallback if empty
        };

        const id = Date.now();

        onAddEvent({
            id,
            date: newEventDate,
            // Use custom title for 'other', otherwise use the mapped title
            title: newEventType === 'other' ? (customTitle || '予定') : titleMap[newEventType],
            type: newEventType,
            time: newEventTime
        });

        // Reset custom title and close modal
        setCustomTitle('');
        setIsModalOpen(false);
    };

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleDateClick = (day: number) => {
        setNewEventDate(day);
        setIsModalOpen(true);
    };

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const MONTH_NAMES = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ];

    // Sort events by date then time
    const sortedEvents = [...events].sort((a, b) => {
        if (a.date !== b.date) return a.date - b.date;
        return a.time.localeCompare(b.time);
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vet': return 'bg-rose-100 text-rose-600 border-rose-200';
            case 'play': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'grooming': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'other': return 'bg-orange-100 text-orange-600 border-orange-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'vet': return <Stethoscope size={16} />;
            case 'play': return <Bone size={16} />;
            case 'grooming': return <Scissors size={16} />;
            case 'other': return <Star size={16} />;
            default: return <Calendar size={16} />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-dog-bg relative">
            {/* Header Area */}
            <div className="pt-6 pb-4 px-6 flex justify-between items-end bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div>
                    <p className="text-sm font-bold text-gray-400 mb-0.5">{viewYear}年</p>
                    <h2 className="text-3xl font-extrabold text-dog-text flex items-center gap-2">
                        {MONTH_NAMES[viewMonth]} <CalendarIcon size={24} className="text-dog-primary opacity-20" />
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-3 bg-white border border-dog-border shadow-sm rounded-2xl hover:bg-dog-bg transition active:scale-95">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button onClick={handleNextMonth} className="p-3 bg-white border border-dog-border shadow-sm rounded-2xl hover:bg-dog-bg transition active:scale-95">
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-32">
                {/* Calendar Grid Card */}
                <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-dog-border mb-8">
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4">
                        <span>日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span>
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 gap-x-1">
                        {blanks.map((_, i) => (
                            <div key={`blank-${i}`} className="aspect-square"></div>
                        ))}
                        {days.map(day => {
                            const event = events.find(e => e.date === day);
                            const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl transition-all ${isToday
                                        ? 'bg-dog-primary text-white shadow-lg scale-105'
                                        : 'text-gray-700 hover:bg-dog-bg'
                                        }`}
                                >
                                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                                        {day}
                                    </span>
                                    {event && (
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${event.type === 'vet' ? 'bg-red-400' :
                                            event.type === 'play' ? 'bg-green-400' :
                                                event.type === 'other' ? 'bg-orange-400' : 'bg-blue-400'
                                            } `} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="px-2">
                    <h3 className="font-bold text-dog-text text-lg mb-6 flex items-center gap-2">
                        今月の予定
                        <span className="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs">{events.length}</span>
                    </h3>

                    <div className="relative pl-4 border-l-2 border-dog-border space-y-8">
                        {sortedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-6"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-lg z-10 ${event.type === 'vet' ? 'bg-rose-100' :
                                    event.type === 'play' ? 'bg-emerald-100' :
                                        event.type === 'other' ? 'bg-orange-100' : 'bg-blue-100'
                                    }`}>
                                    {getTypeIcon(event.type)}
                                </div>

                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-dog-border relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(event.type)} mb-2 inline-block`}>
                                                {event.date}日 (
                                                {['日', '月', '火', '水', '木', '金', '土'][new Date(viewYear, viewMonth, event.date).getDay()]}
                                                )
                                            </span>
                                            <h4 className="font-bold text-dog-text text-lg leading-tight">{event.title}</h4>
                                        </div>
                                        <button
                                            onClick={() => onDeleteEvent(event.id)}
                                            className="p-2 text-gray-300 hover:text-rose-500 bg-dog-bg rounded-full transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            {event.time}
                                        </div>
                                        {/* Mock Location based on type for visual */}
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} />
                                            {event.type === 'vet' ? '代々木ペットクリニック' :
                                                event.type === 'grooming' ? 'Doggy Style 渋谷' :
                                                    event.type === 'play' ? '代々木公園' : '場所未定'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {sortedEvents.length === 0 && (
                            <div className="text-center py-10 pl-4">
                                <p className="text-gray-400 font-bold mb-2">予定がありません 🍃</p>
                                <p className="text-xs text-gray-300">右下のボタンから追加してね</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-24 right-6 z-40">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-dog-primary text-white p-5 rounded-full shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center shadow-orange-500/30"
                >
                    <Plus size={28} />
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white w-full rounded-t-[2.5rem] p-8 pb-12 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />

                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-dog-text">予定を追加</h3>
                                <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"><Plus size={24} className="rotate-45" /></button>
                            </div>

                            <div className="space-y-6">
                                {/* Date & Time */}
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-bold text-gray-400 ml-1">日付 ({viewMonth + 1}月)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={newEventDate}
                                                onChange={(e) => setNewEventDate(parseInt(e.target.value))}
                                                className="w-full bg-dog-bg border-2 border-transparent focus:border-dog-primary focus:bg-white transition rounded-2xl p-4 font-bold text-xl text-center text-gray-800 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-bold text-gray-400 ml-1">時間</label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                value={newEventTime}
                                                onChange={(e) => setNewEventTime(e.target.value)}
                                                className="w-full bg-dog-bg border-2 border-transparent focus:border-dog-primary focus:bg-white transition rounded-2xl p-4 font-bold text-xl text-center text-gray-800 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Title Input - Only shows when 'other' is selected */}
                                {newEventType === 'other' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-gray-400 ml-1">予定の名前</label>
                                        <input
                                            type="text"
                                            placeholder="例：オフ会、誕生日..."
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            className="w-full bg-dog-bg border-2 border-transparent focus:border-dog-primary focus:bg-white transition rounded-2xl p-4 font-bold text-gray-800 outline-none placeholder:text-gray-300"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}

                                {/* Type Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 ml-1">種類</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        <button
                                            onClick={() => setNewEventType('grooming')}
                                            className={`flex justify-center items-center py-4 rounded-xl border transition font-bold text-xs ${newEventType === 'grooming' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            トリミング
                                        </button>
                                        <button
                                            onClick={() => setNewEventType('vet')}
                                            className={`flex justify-center items-center py-4 rounded-xl border transition font-bold text-xs ${newEventType === 'vet' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            病院
                                        </button>
                                        <button
                                            onClick={() => setNewEventType('play')}
                                            className={`flex justify-center items-center py-4 rounded-xl border transition font-bold text-xs ${newEventType === 'play' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            ドッグラン
                                        </button>
                                        <button
                                            onClick={() => setNewEventType('other')}
                                            className={`flex justify-center items-center py-4 rounded-xl border transition font-bold text-xs ${newEventType === 'other' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            その他
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={submitEvent}
                                    className="w-full bg-dog-primary text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-orange-500/20 mt-4 active:scale-95 transition"
                                >
                                    予定を追加
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
