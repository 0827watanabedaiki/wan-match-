import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';

export interface DogProfile {
    id: string;
    name: string;
    age: number;
    breed: string;
    gender: 'male' | 'female';
    weight: number;
    distance: number; // km
    location: string;
    imageUrl: string;
    bio: string;
}

interface DogCardProps {
    dog: DogProfile;
    onSwipe: (direction: 'left' | 'right') => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Overlay colors for feedback
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden shadow-2xl bg-white select-none"
        >
            {/* Background Image */}
            <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${dog.imageUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none" />

            {/* Action Indicators */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-[6px] border-white rounded-md px-6 py-2 rotate-[-15deg] shadow-lg">
                <span className="text-white font-black text-4xl uppercase tracking-widest drop-shadow-md">LIKE</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-[6px] border-white/50 rounded-md px-6 py-2 rotate-[15deg]">
                <span className="text-white/50 font-black text-4xl uppercase tracking-widest">SKIP</span>
            </motion.div>

            {/* Info Content */}
            <div className="absolute bottom-0 w-full p-6 text-white pointer-events-none flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold flex items-baseline gap-2 tracking-tight">
                            {dog.name} <span className="text-xl font-bold text-gray-300">{dog.age}歳</span>
                        </h2>
                        <p className="text-sm font-bold text-gray-300 tracking-wider uppercase mt-1">{dog.breed}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1.5 rounded-sm backdrop-blur-md">
                        <MapPin size={14} className="text-white" />
                        <span className="text-xs font-bold tracking-widest">{dog.distance}km</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <span className="bg-white text-gray-900 border border-white px-3 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-widest">
                        {dog.gender === 'male' ? 'MALE' : 'FEMALE'}
                    </span>
                    <span className="bg-transparent border border-white/30 text-white px-3 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
                        {dog.weight}kg
                    </span>
                </div>

                <p className="line-clamp-2 text-xs text-gray-300 font-medium leading-relaxed my-2 pr-4">{dog.bio}</p>

                <div className="w-full h-1 mt-2 bg-white/20 overflow-hidden">
                    <div className="w-1/3 h-full bg-white"></div>
                </div>
            </div>
        </motion.div>
    );
};
