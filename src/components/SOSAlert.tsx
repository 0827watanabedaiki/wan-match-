import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, X } from 'lucide-react';

interface SOSAlertProps {
    onClose: () => void;
}

export const SOSAlert: React.FC<SOSAlertProps> = ({ onClose }) => {
    const [status, setStatus] = useState<'idle' | 'broadcasting'>('idle');

    const handleBroadcast = () => {
        setStatus('broadcasting');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-red-500 flex flex-col items-center justify-center p-6 text-center text-white"
        >
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
                <X size={24} />
            </button>

            <div className="mb-8">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Shield size={48} />
                </div>
                <h2 className="text-3xl font-extrabold mb-2">安心・安全センター</h2>
                <p className="text-white/80 font-medium">
                    迷子犬SOSアラート
                </p>
            </div>

            {status === 'idle' ? (
                <div className="w-full max-w-sm">
                    <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
                        <h4 className="font-bold text-lg mb-2">⚠️ 緊急時のみ使用してください</h4>
                        <p className="text-sm opacity-90 leading-relaxed">
                            このボタンを押すと、半径5km以内のすべてのWanMatchユーザーに、モチちゃんの位置情報と特徴が一斉送信されます。
                        </p>
                    </div>

                    <button
                        onClick={handleBroadcast}
                        className="w-full bg-white text-red-600 font-extrabold text-xl py-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3"
                    >
                        <Radio className="animate-pulse" />
                        SOSを発信する
                    </button>
                    <p className="mt-4 text-xs opacity-60">※ いたずらでの使用はアカウント停止の対象となります</p>
                </div>
            ) : (
                <div className="w-full max-w-sm">
                    <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                        {/* Radar Waves */}
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute inset-4 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>

                        <div className="bg-white rounded-full p-6 relative z-10 shadow-xl">
                            <Radio size={48} className="text-red-500 animate-pulse" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">発信中...</h3>
                    <p className="mb-8 text-lg">
                        近くのユーザー <span className="font-bold text-4xl">12</span> 人に<br />
                        通知を送りました
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full border-2 border-white/50 bg-transparent text-white font-bold py-4 rounded-full hover:bg-white/10"
                    >
                        捜索を終了する
                    </button>
                </div>
            )}
        </motion.div>
    );
};
