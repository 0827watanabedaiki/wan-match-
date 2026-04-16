import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SpotCategoryViewProps {
    onSelectCategory: (category: 'park' | 'salon' | 'hospital') => void;
}

export const SpotCategoryView: React.FC<SpotCategoryViewProps> = ({ onSelectCategory }) => {
    const categories = [
        { id: 'park', title: '公園' },
        { id: 'salon', title: 'トリミング' },
        { id: 'hospital', title: '病院' },
        { id: 'event', title: 'イベント' },
        { id: 'all', title: '全て' },
    ];

    return (
        <div className="h-full w-full bg-white flex flex-col items-center pt-8 px-4 overflow-y-auto pb-32">
            {/* Header */}
            <div className="w-full max-w-md flex flex-col items-center mb-6">
                <h2 className="text-[13px] font-extrabold tracking-widest text-gray-900 uppercase">SPOT</h2>
            </div>
            {/* Full-width separator outside the max-w-md if we want, but keeping it simple */}
            <div className="w-full h-px bg-gray-100 mb-4"></div>

            {/* List */}
            <div className="w-full max-w-md flex flex-col gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id as any)}
                        className="w-full bg-[#f4f4f4] rounded-md p-6 flex items-center justify-between hover:bg-[#ebebeb] transition-colors active:scale-[0.99]"
                    >
                        <span className="font-extrabold text-gray-900 tracking-wider text-[13px]">{cat.title}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                ))}
            </div>
        </div>
    );
};
