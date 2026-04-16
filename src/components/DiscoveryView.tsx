import React, { useState, useMemo } from 'react';
import { RefreshCcw, X, Check, Dog, Filter, MapPin, Heart } from 'lucide-react';
import { DogCard, DogProfile } from './DogCard';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_DOGS: DogProfile[] = [
    {
        id: '1',
        name: 'モチ',
        age: 2,
        breed: '柴犬',
        gender: 'male',
        weight: 12,
        distance: 1.2,
        location: '東京都渋谷区',
        bio: 'ランニングパートナー募集中！走るの大好きだけど、匂い嗅ぎでよく止まります。',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: '4',
        name: 'ハナ',
        age: 3,
        breed: 'トイプードル',
        gender: 'female',
        weight: 4,
        distance: 0.8,
        location: '東京都港区',
        bio: 'ふわふわです。抱っこが大好き。おしゃれしてカフェに行くのが趣味です♪',
        imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: '6',
        name: 'チョコ',
        age: 2,
        breed: 'ダックスフンド',
        gender: 'male',
        weight: 5,
        distance: 1.5,
        location: '東京都世田谷区',
        bio: '短い足で一生懸命歩きます！穴掘りが得意技。',
        imageUrl: 'https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: '2',
        name: 'ココ',
        age: 4,
        breed: 'ゴールデンレトリバー',
        gender: 'female',
        weight: 28,
        distance: 3.5,
        location: '神奈川県横浜市',
        bio: 'ボール遊びが命。おやつくれたら尻尾振ります！',
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: '5',
        name: 'レオ',
        age: 1,
        breed: 'チワワ',
        gender: 'male',
        weight: 2.5,
        distance: 0.3,
        location: '東京都新宿区',
        bio: '小さいけど勇敢！大きなワンちゃんとも仲良くしたいな。',
        imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: '3',
        name: 'ロッキー',
        age: 1,
        breed: 'フレンチブルドッグ',
        gender: 'male',
        weight: 11,
        distance: 0.5,
        location: '東京都渋谷区',
        bio: '小さいけどタフだよ。イビキうるさいって言われる。',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1000',
    }
];

// 30 Popular Breeds in Japan
const BREED_SELECTORS = [
    { id: '指定なし', label: '指定なし' },
    { id: 'トイプードル', label: 'トイプードル' },
    { id: 'チワワ', label: 'チワワ' },
    { id: 'MIX犬(10kg未満)', label: 'MIX犬(小)' },
    { id: '柴犬', label: '柴犬' },
    { id: 'ミニチュアダックス', label: 'Mダックス' },
    { id: 'ポメラニアン', label: 'ポメラニアン' },
    { id: 'ミニチュアシュナウザー', label: 'Mシュナウザー' },
    { id: 'フレンチブルドッグ', label: 'フレブル' },
    { id: 'ヨークシャーテリア', label: 'ヨーキー' },
    { id: 'シーズー', label: 'シーズー' },
    { id: 'マルチーズ', label: 'マルチーズ' },
    { id: 'パグ', label: 'パグ' },
    { id: 'ゴールデンレトリバー', label: 'ゴールデン' },
    { id: 'カニヘンダックス', label: 'Kダックス' },
    { id: 'ラブラドール', label: 'ラブラドール' },
    { id: 'パピヨン', label: 'パピヨン' },
    { id: 'ジャックラッセル', label: 'ジャック' },
    { id: 'コーギー', label: 'コーギー' },
    { id: 'ペキニーズ', label: 'ペキニーズ' },
    { id: 'イタグレ', label: 'イタグレ' },
    { id: 'ビーグル', label: 'ビーグル' },
    { id: 'ボーダーコリー', label: 'ボーダー' },
    { id: 'ビションフリーゼ', label: 'ビション' },
    { id: '秋田犬', label: '秋田犬' },
    { id: 'ボストンテリア', label: 'ボストン' },
    { id: 'アメリカンコッカー', label: 'アメコカ' },
    { id: 'シェルティ', label: 'シェルティ' },
    { id: 'キャバリア', label: 'キャバリア' },
    { id: '豆柴', label: '豆柴' },
    { id: 'その他', label: 'その他' },
];

const AGES = ['指定なし', 'パピー（1歳未満）', 'ヤング（1~3歳）', 'アダルト（4~7歳）', 'シニア（8歳以上）'];
const DISTANCE_OPTIONS = [
    { label: '指定なし', value: null },
    { label: '1km以内', value: 1 },
    { label: '3km以内', value: 3 },
    { label: '5km以内', value: 5 },
    { label: '10km以内', value: 10 },
];

interface DiscoveryViewProps {
    onLikeDog?: (dog: DogProfile) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onLikeDog }) => {
    // Existing Dog States
    const [dogs, setDogs] = useState<DogProfile[]>(MOCK_DOGS);
    const [showFilter, setShowFilter] = useState(false);
    const [matchedDog, setMatchedDog] = useState<DogProfile | null>(null);

    // Filter States
    const [filterBreed, setFilterBreed] = useState('指定なし');
    const [filterAge, setFilterAge] = useState('指定なし');
    const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
    const [filterDistance, setFilterDistance] = useState<number | null>(null);

    // Filtering Logic
    const filteredDogs = useMemo(() => {
        return dogs.filter(dog => {
            // Gender Filter
            if (filterGender !== 'all' && dog.gender !== filterGender) return false;

            // Breed Filter
            if (filterBreed !== '指定なし' && dog.breed !== filterBreed) return false;

            // Distance Filter
            if (filterDistance !== null && dog.distance > filterDistance) return false;

            // Age Filter
            if (filterAge !== '指定なし') {
                if (filterAge === 'パピー（1歳未満）' && dog.age >= 1) return false;
                if (filterAge === 'ヤング（1~3歳）' && (dog.age < 1 || dog.age > 3)) return false;
                if (filterAge === 'アダルト（4~7歳）' && (dog.age < 4 || dog.age > 7)) return false;
                if (filterAge === 'シニア（8歳以上）' && dog.age < 8) return false;
            }

            return true;
        });
    }, [dogs, filterBreed, filterAge, filterGender, filterDistance]);

    const handleSwipe = (id: string, direction: 'left' | 'right') => {
        const dog = dogs.find(d => d.id === id);
        setDogs(prev => prev.filter(d => d.id !== id));
        if (direction === 'right' && dog) {
            onLikeDog?.(dog);
            // Show match notification (simulate mutual match)
            setMatchedDog(dog);
            setTimeout(() => setMatchedDog(null), 3000);
        }
    };

    const handleReset = () => {
        setDogs(MOCK_DOGS);
    };

    return (
        <div className="relative w-full h-full flex flex-col bg-gray-50 pt-14">
            {/* Match Notification */}
            <AnimatePresence>
                {matchedDog && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="absolute inset-x-4 top-20 z-50 bg-gray-900 text-white rounded-2xl p-5 shadow-2xl flex items-center gap-4"
                        translate="no"
                    >
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shrink-0">
                            <img src={matchedDog.imageUrl} alt={matchedDog.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Heart size={14} className="text-white fill-white" />
                                <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-300">IT'S A MATCH!</span>
                            </div>
                            <p className="font-extrabold text-white text-sm tracking-wide">{matchedDog.name}もいいね！しました</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">メッセージを送ってみよう</p>
                        </div>
                        <button
                            onClick={() => setMatchedDog(null)}
                            className="p-1 text-gray-500 hover:text-white transition shrink-0"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                        {/* Filter Button (Floating) */}
                        <div className="absolute top-4 right-4 z-40">
                            <button
                                onClick={() => setShowFilter(true)}
                                className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-md border border-gray-100 text-gray-900 hover:scale-105 active:scale-95 transition-transform"
                            >
                                <Filter size={20} className="text-gray-900" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Main Swipe Area */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <AnimatePresence>
                                {filteredDogs.length > 0 ? (
                                    filteredDogs.map((dog, index) => (
                                        /* Only render top 2 cards for performance */
                                        index >= filteredDogs.length - 2 && (
                                            <div
                                                key={dog.id}
                                                className="absolute inset-0 z-10"
                                                style={{ zIndex: index }}
                                            >
                                                <DogCard
                                                    dog={dog}
                                                    onSwipe={(dir) => handleSwipe(dog.id, dir)}
                                                />
                                            </div>
                                        )
                                    ))
                                ) : (
                                    <div className="text-center p-8 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-200">
                                        <div className="text-4xl mb-4 grayscale">🐶</div>
                                        <h3 className="text-[13px] font-extrabold text-gray-900 tracking-wider uppercase mb-2">NO FRIENDS FOUND</h3>
                                        <p className="text-[10px] text-gray-400 font-bold mb-6 tracking-widest uppercase">Try changing filters</p>
                                        <button
                                            onClick={handleReset}
                                            className="px-6 py-3 bg-gray-900 text-white rounded-md text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform"
                                        >
                                            <RefreshCcw size={16} strokeWidth={2.5} /> RESET LIST
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
            </div>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilter(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-60 max-h-[85vh] overflow-y-auto mt-auto sm:rounded-2xl sm:mt-0"
                        >
                            <div className="flex justify-between items-center mb-6 py-2 border-b border-gray-100 pb-4">
                                <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <Filter size={16} className="text-gray-900" strokeWidth={2.5} />
                                    FILTER
                                </h3>
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition text-gray-500"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Genre / Breed (List) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-3 flex items-center gap-2" translate="no">
                                        <Dog size={16} /> 犬種
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto pr-2">
                                        {BREED_SELECTORS.map((breed) => (
                                            <button
                                                key={breed.id}
                                                onClick={() => setFilterBreed(breed.id)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-left flex items-center justify-between ${filterBreed === breed.id
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-600 border-dog-border hover:border-gray-200'
                                                    }`}
                                            >
                                                <span>{breed.label}</span>
                                                {filterBreed === breed.id && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Distance Filter (NEW) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-3 flex items-center gap-2" translate="no">
                                        <MapPin size={16} /> 距離
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {DISTANCE_OPTIONS.map(option => (
                                            <button
                                                key={option.label}
                                                onClick={() => setFilterDistance(option.value)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filterDistance === option.value
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-3" translate="no">年齢</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AGES.map(age => (
                                            <button
                                                key={age}
                                                onClick={() => setFilterAge(age)}
                                                className={`px-4 py-2 rounded border text-xs font-bold transition-all uppercase tracking-wider ${filterAge === age
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-400 border-gray-200'
                                                    }`}
                                            >
                                                {age.split('（')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 mb-3 tracking-widest uppercase" translate="no">GENDER</label>
                                    <div className="flex bg-gray-50 p-1 rounded-md border border-gray-100">
                                        {(['all', 'male', 'female'] as const).map((gender) => (
                                            <button
                                                key={gender}
                                                onClick={() => setFilterGender(gender)}
                                                className={`flex-1 py-3 rounded text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${filterGender === gender
                                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {gender === 'all' && '指定なし'}
                                                {gender === 'male' && (<><span>♂</span> 男の子</>)}
                                                {gender === 'female' && (<><span>♀</span> 女の子</>)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4">
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="w-full bg-gray-900 text-white text-xs tracking-widest uppercase font-bold py-4 rounded-md shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                                >
                                    APPLY FILTERS
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
