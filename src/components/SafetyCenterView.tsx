import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Clock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { SOSAlert } from './SOSAlert';

interface SafetyCenterViewProps {
    onClose: () => void;
}

export const SafetyCenterView: React.FC<SafetyCenterViewProps> = ({ onClose }) => {
    const [showSOS, setShowSOS] = useState(false);

    const lostDogs = [
        {
            id: 1,
            name: 'ポチ',
            breed: 'トイプードル',
            age: 3,
            location: '代々木公園周辺',
            missingTime: '今日 14:00頃',
            features: '赤い首輪をしています',
            imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 2,
            name: 'ハナ',
            breed: '柴犬',
            age: 5,
            location: '渋谷駅近く',
            missingTime: '昨日 18:00頃',
            features: '人懐っこいです',
            imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
        }
    ];

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-40 bg-dog-bg flex flex-col pt-12 pb-24"
        >
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-10">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-dog-text flex items-center gap-2">
                        <Shield className="text-red-500 fill-red-100" />
                        安心・安全センター
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* Bulletin Board Section */}
                <div className="mb-8">
                    <h3 className="font-bold text-dog-text mb-4 flex items-center gap-2">
                        📋 迷子犬掲示板
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">捜索中 {lostDogs.length}件</span>
                    </h3>

                    <div className="space-y-4">
                        {lostDogs.map(dog => (
                            <div key={dog.id} className="bg-white rounded-2xl p-4 shadow-sm border border-dog-border flex gap-4">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-lg text-dog-text">{dog.name} <span className="text-sm font-normal text-gray-500">({dog.breed})</span></h4>
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">捜索中</span>
                                    </div>

                                    <div className="space-y-1 text-xs text-gray-600 mb-2">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} className="text-red-400" />
                                            {dog.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} className="text-red-400" />
                                            {dog.missingTime}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 bg-dog-bg p-2 rounded-lg">
                                        {dog.features}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Section - Moved to Bottom */}
                <div className="mt-8 pt-8 border-t border-dog-border text-center">
                    <h4 className="font-bold text-dog-text mb-2">緊急時の方はこちら</h4>
                    <p className="text-xs text-gray-500 mb-4">
                        愛犬が迷子になってしまった場合は、<br />
                        SOSアラートを発信して近くのユーザーに協力を求めましょう。
                    </p>
                    <button
                        onClick={() => setShowSOS(true)}
                        className="w-full bg-red-50 text-red-600 border-2 border-red-100 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition"
                    >
                        <AlertTriangle size={20} />
                        SOSアラートを発信する
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">※ 誤操作にご注意ください</p>
                </div>
            </div>

            {/* SOS Trigger Overlay */}
            <AnimatePresence>
                {showSOS && <SOSAlert onClose={() => setShowSOS(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};
