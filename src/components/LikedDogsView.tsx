import React from 'react';
import { ArrowLeft, Heart, MapPin } from 'lucide-react';
import { DogProfile } from './DogCard';
import { motion } from 'framer-motion';

interface LikedDogsViewProps {
    likedDogs: DogProfile[];
    onBack: () => void;
    onOpenChat: (dog: DogProfile) => void;
}

export const LikedDogsView: React.FC<LikedDogsViewProps> = ({ likedDogs, onBack, onOpenChat }) => {
    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 -ml-1 rounded-full hover:bg-gray-100 transition text-gray-700"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div>
                    <h2 className="font-extrabold text-gray-900 text-[13px] tracking-widest uppercase">LIKED DOGS</h2>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{likedDogs.length} dogs</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {likedDogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-8 pb-20">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Heart size={28} className="text-gray-300" strokeWidth={2} />
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-sm tracking-widest uppercase mb-2">NO LIKES YET</h3>
                        <p className="text-[11px] text-gray-400 font-bold tracking-wider uppercase leading-relaxed">
                            Discovery画面でスワイプして<br />いいね！してみよう
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-8">
                        {likedDogs.map((dog, i) => (
                            <motion.div
                                key={dog.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => onOpenChat(dog)}
                                className="relative rounded-lg overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-sm border border-gray-100"
                                style={{ aspectRatio: '3/4' }}
                            >
                                <img
                                    src={dog.imageUrl}
                                    alt={dog.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                {/* Like badge */}
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
                                    <Heart size={14} className="text-gray-900 fill-gray-900" />
                                </div>
                                {/* Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="font-extrabold text-white text-sm tracking-tight leading-none">
                                        {dog.name} <span className="font-bold text-gray-300 text-xs">{dog.age}歳</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{dog.breed}</p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <MapPin size={10} className="text-gray-400" />
                                        <span className="text-[10px] text-gray-400 font-bold">{dog.distance}km</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
