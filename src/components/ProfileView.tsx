import React, { useState } from 'react';
import { Settings, Edit2, Shield, Heart, Clock, GraduationCap, MapPin, Check, X, ChevronDown, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

export interface DogProfileData {
    name: string;
    age: number;
    breed: string;
    weight: number;
    gender: 'male' | 'female';
    imageUrl: string;
}

interface ProfileViewProps {
    walkTimeMorning: string;
    onWalkTimeMorningChange: (time: string) => void;
    walkTimeEvening: string;
    onWalkTimeEveningChange: (time: string) => void;
    walkLocation: string;
    onWalkLocationChange: (location: string) => void;
    bio: string;
    onBioChange: (bio: string) => void;
    ownerName: string;
    onOwnerNameChange: (name: string) => void;
    ownerBio: string;
    onOwnerBioChange: (bio: string) => void;
    dogProfile: DogProfileData;
    onDogProfileChange: (profile: DogProfileData) => void;
    onSOSClick: () => void;
    onGuideClick: () => void;
    onLikedDogsClick: () => void;
    onCalendarClick: () => void;

}

const BREEDS = [
    'トイプードル', 'チワワ', '柴犬', 'ミニチュアダックス', 'ポメラニアン',
    'ミニチュアシュナウザー', 'フレンチブルドッグ', 'ヨークシャーテリア', 'シーズー',
    'マルチーズ', 'パグ', 'ゴールデンレトリバー', 'ラブラドール', 'コーギー',
    'ボーダーコリー', 'ビーグル', '秋田犬', '豆柴', 'MIX犬', 'その他',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
    walkTimeMorning,
    onWalkTimeMorningChange,
    walkTimeEvening,
    onWalkTimeEveningChange,
    walkLocation,
    onWalkLocationChange,
    bio,
    onBioChange,
    ownerName,
    onOwnerNameChange,
    ownerBio,
    onOwnerBioChange,
    dogProfile,
    onDogProfileChange,
    onSOSClick,
    onGuideClick,
    onLikedDogsClick,
    onCalendarClick,
}) => {
    const [isOwnerMode, setIsOwnerMode] = useState(false);
    const [isEditingDog, setIsEditingDog] = useState(false);
    const [editDraft, setEditDraft] = useState<DogProfileData>(dogProfile);
    const [showBreedPicker, setShowBreedPicker] = useState(false);

    const handleEditOpen = () => {
        setEditDraft(dogProfile);
        setIsEditingDog(true);
    };

    const handleEditSave = () => {
        onDogProfileChange(editDraft);
        setIsEditingDog(false);
    };

    const handleEditCancel = () => {
        setIsEditingDog(false);
    };

    return (
        <div className="pb-8">
            {/* Dog Edit Modal */}
            <AnimatePresence>
                {isEditingDog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-end justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleEditCancel} />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="relative w-full max-w-sm bg-white rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto z-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-extrabold text-gray-900 text-[13px] tracking-widest uppercase">DOG PROFILE EDIT</h3>
                                <button onClick={handleEditCancel} className="p-2 text-gray-400 hover:text-gray-900 transition">
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">NAME</label>
                                    <input
                                        type="text"
                                        value={editDraft.name}
                                        onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        placeholder="わんちゃんの名前"
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">AGE（歳）</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        value={editDraft.age}
                                        onChange={e => setEditDraft(d => ({ ...d, age: Number(e.target.value) }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Breed */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">BREED（犬種）</label>
                                    <button
                                        onClick={() => setShowBreedPicker(!showBreedPicker)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 flex items-center justify-between"
                                    >
                                        <span>{editDraft.breed}</span>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showBreedPicker ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {showBreedPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {BREEDS.map(breed => (
                                                        <button
                                                            key={breed}
                                                            onClick={() => {
                                                                setEditDraft(d => ({ ...d, breed }));
                                                                setShowBreedPicker(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-sm font-bold transition hover:bg-gray-50 flex items-center justify-between ${editDraft.breed === breed ? 'text-gray-900' : 'text-gray-500'}`}
                                                        >
                                                            {breed}
                                                            {editDraft.breed === breed && <Check size={14} className="text-gray-900" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">WEIGHT（kg）</label>
                                    <input
                                        type="number"
                                        min={0.1}
                                        max={100}
                                        step={0.1}
                                        value={editDraft.weight}
                                        onChange={e => setEditDraft(d => ({ ...d, weight: Number(e.target.value) }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-2">GENDER</label>
                                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                                        {(['male', 'female'] as const).map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setEditDraft(d => ({ ...d, gender: g }))}
                                                className={`flex-1 py-2.5 rounded-md text-[10px] uppercase tracking-widest font-extrabold transition-all ${
                                                    editDraft.gender === g
                                                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                                        : 'text-gray-400'
                                                }`}
                                            >
                                                {g === 'male' ? '♂ 男の子' : '♀ 女の子'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={handleEditCancel}
                                    className="flex-1 py-3 border border-gray-200 rounded-lg text-[11px] font-extrabold text-gray-500 tracking-widest uppercase transition hover:bg-gray-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleEditSave}
                                    className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-[11px] font-extrabold tracking-widest uppercase transition active:scale-95 shadow-md"
                                >
                                    SAVE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header */}
            <div className={`relative h-48 rounded-b-[2.5rem] mb-12 shadow-md transition-colors duration-500 ${isOwnerMode
                ? 'bg-gray-800'
                : 'bg-gray-100 border-b border-gray-200'
                }`}>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] overflow-hidden relative group bg-white border-2 border-white">
                        {isOwnerMode ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-extrabold text-[10px] tracking-widest uppercase">
                                OWNER
                            </div>
                        ) : (
                            <img
                                src={dogProfile.imageUrl}
                                alt={dogProfile.name}
                                className="w-full h-full object-cover grayscale"
                            />
                        )}
                        {!isOwnerMode && (
                            <div
                                onClick={handleEditOpen}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Edit2 className="text-white" />
                            </div>
                        )}
                    </div>
                </div>
                <button className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition">
                    <Settings className="text-white" size={20} />
                </button>
            </div>

            <div className="text-center mb-8 px-4 mt-4">
                {isOwnerMode ? (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="text"
                            value={ownerName}
                            onChange={(e) => onOwnerNameChange(e.target.value)}
                            className="text-2xl font-black text-gray-900 tracking-tighter text-center bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-900 focus:outline-none w-full max-w-[200px]"
                        />
                        <Edit2 size={16} className="text-gray-300" />
                    </div>
                ) : (
                    <div>
                        <button onClick={handleEditOpen} className="group flex items-baseline justify-center gap-2 tracking-tighter mx-auto">
                            <h1 className="text-3xl font-black text-gray-900">
                                {dogProfile.name}
                                <span className="text-gray-400 font-bold text-sm tracking-widest uppercase ml-2">{dogProfile.age} YRS</span>
                            </h1>
                            <Edit2 size={14} className="text-gray-300 group-hover:text-gray-900 transition mb-1" />
                        </button>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                            {dogProfile.breed}
                        </p>
                    </div>
                )}
                {isOwnerMode && (
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">OWNER</p>
                )}
            </div>

            {/* Bio Section */}
            <div className="px-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 relative group transition-colors hover:border-gray-200">
                    <textarea
                        value={isOwnerMode ? ownerBio : bio}
                        onChange={(e) => isOwnerMode ? onOwnerBioChange(e.target.value) : onBioChange(e.target.value)}
                        className="w-full text-center text-gray-600 bg-transparent border-none focus:ring-0 p-0 resize-none font-medium leading-relaxed"
                        rows={3}
                        placeholder={isOwnerMode ? "飼い主さんの自己紹介を書いてね..." : "わんちゃんの自己紹介を書いてね..."}
                    />
                    <Edit2 size={14} className="absolute bottom-4 right-4 text-gray-300 pointer-events-none group-hover:text-gray-900 transition-colors" />
                </div>
            </div>

            {/* Content Switcher based on Mode */}
            {isOwnerMode ? (
                <div className="px-6 mb-8 text-center text-gray-400">
                    <p className="text-sm">
                        飼い主プロフィールの設定項目は<br />今後追加される予定です✨
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 px-6 mb-8">
                        <div
                            onClick={handleEditOpen}
                            className="bg-white p-4 rounded-sm border border-gray-200 text-center shadow-sm cursor-pointer hover:border-gray-900 transition-colors"
                        >
                            <span className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">WEIGHT</span>
                            <span className="text-2xl font-black text-gray-900">
                                {dogProfile.weight}<span className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">kg</span>
                            </span>
                        </div>
                        <div
                            onClick={handleEditOpen}
                            className="bg-white p-4 rounded-sm border border-gray-200 text-center shadow-sm cursor-pointer hover:border-gray-900 transition-colors"
                        >
                            <span className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">GENDER</span>
                            <span className="text-2xl font-black text-gray-900">
                                {dogProfile.gender === 'male' ? 'MALE' : 'FEMALE'}
                            </span>
                        </div>
                    </div>

                    {/* Walk Support Card */}
                    <div className="px-6 mb-6">
                        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-900 px-4 py-3 flex items-center justify-center gap-2">
                                <span className="font-extrabold text-[10px] text-white tracking-widest uppercase">WALK WEATHER SETTINGS</span>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Location Row */}
                                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} strokeWidth={2.5} className="text-gray-900" />
                                        <div>
                                            <span className="font-extrabold text-gray-900 block text-xs tracking-wider uppercase">LOCATION</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Forecast Area</span>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={walkLocation}
                                        onChange={(e) => onWalkLocationChange(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-gray-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 w-32 text-right uppercase tracking-wider"
                                        placeholder="区市町村"
                                    />
                                </div>

                                {/* Time Row (Morning) */}
                                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} strokeWidth={2.5} className="text-gray-900" />
                                        <div>
                                            <span className="font-extrabold text-gray-900 block text-xs tracking-wider uppercase">MORNING WALK</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Alert Time</span>
                                        </div>
                                    </div>
                                    <input
                                        type="time"
                                        value={walkTimeMorning}
                                        onChange={(e) => onWalkTimeMorningChange(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-gray-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Time Row (Evening) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} strokeWidth={2.5} className="text-gray-900" />
                                        <div>
                                            <span className="font-extrabold text-gray-900 block text-xs tracking-wider uppercase">EVENING WALK</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Alert Time</span>
                                        </div>
                                    </div>
                                    <input
                                        type="time"
                                        value={walkTimeEvening}
                                        onChange={(e) => onWalkTimeEveningChange(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-gray-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Menu Items */}
            <div className="px-6 space-y-3">
                <div
                    onClick={onSOSClick}
                    className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <Shield size={20} className="text-gray-900 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        <span className="font-extrabold text-xs text-gray-900 tracking-widest uppercase">SAFETY CENTER</span>
                    </div>
                </div>


                <div
                    onClick={onLikedDogsClick}
                    className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <Heart size={20} className="text-gray-900 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        <span className="font-extrabold text-xs text-gray-900 tracking-widest uppercase">LIKED DOGS</span>
                    </div>
                </div>

                <div
                    onClick={onCalendarClick}
                    className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <GraduationCap size={20} className="text-gray-900 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        <span className="font-extrabold text-xs text-gray-900 tracking-widest uppercase">DOG MASTER GUIDE</span>
                    </div>
                </div>
            </div>

            {/* ログアウト */}
            <div className="px-6 mt-3">
                <div
                    onClick={() => supabase.auth.signOut()}
                    className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-red-400 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <LogOut size={20} className="text-red-400 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        <span className="font-extrabold text-xs text-red-400 tracking-widest uppercase">LOGOUT</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center pb-8">
                <button
                    onClick={() => setIsOwnerMode(!isOwnerMode)}
                    className={`px-8 py-4 text-[10px] tracking-widest uppercase font-extrabold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 mx-auto ${isOwnerMode
                        ? 'bg-gray-900 text-white rounded-sm'
                        : 'bg-white border-2 border-gray-900 text-gray-900 rounded-sm'
                        }`}
                >
                    {isOwnerMode ? "SWITCH TO DOG PROFILE" : "SWITCH TO OWNER PROFILE"}
                </button>
            </div>
        </div>
    );
};
