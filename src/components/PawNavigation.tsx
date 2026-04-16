import React from 'react';
import { Sparkles, MessageSquare, MapPin, Search as Discover, Home } from 'lucide-react';

export const SPOT_TABS = ['spot', 'park', 'salon', 'hospital', 'event', 'all'] as const;
export type SpotTab = typeof SPOT_TABS[number];

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick: () => void;
    imageUrl?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick, imageUrl }) => (
    <button
        role="tab"
        aria-selected={isActive}
        aria-label={label}
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] transition-colors ${
            isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
    >
        <div className={`px-5 py-1.5 rounded-full transition-all duration-200 ${
            isActive ? 'bg-gray-100' : 'bg-transparent'
        }`}>
            {imageUrl ? (
                <div className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    isActive ? 'border-gray-900' : 'border-transparent opacity-90'
                }`}>
                    <img src={imageUrl} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                </div>
            ) : (
                <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                />
            )}
        </div>
        <span
            translate="no"
            className="text-[10px] font-extrabold uppercase tracking-widest leading-none"
        >
            {label}
        </span>
    </button>
);

interface PawNavigationProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
    userProfileImage?: string;
}

export const PawNavigation: React.FC<PawNavigationProps> = ({ currentTab, onTabChange, userProfileImage }) => {
    return (
        <nav aria-label="メインナビゲーション">
            <div
                role="tablist"
                className="border-t border-gray-100 bg-white/95 backdrop-blur-md w-full flex items-center justify-around px-2 pt-2 shrink-0 z-50"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
                <NavItem
                    icon={Home}
                    label="HOME"
                    isActive={currentTab === 'home'}
                    onClick={() => onTabChange('home')}
                />
                <NavItem
                    icon={Discover}
                    label="ともだち"
                    isActive={currentTab === 'discovery'}
                    onClick={() => onTabChange('discovery')}
                />
                <NavItem
                    icon={MapPin}
                    label="SPOTS"
                    isActive={SPOT_TABS.includes(currentTab as SpotTab)}
                    onClick={() => onTabChange('spot')}
                />
                <NavItem
                    icon={MessageSquare}
                    label="メッセージ"
                    isActive={currentTab === 'matches'}
                    onClick={() => onTabChange('matches')}
                />
                <NavItem
                    icon={Sparkles}
                    label="マイページ"
                    isActive={currentTab === 'profile'}
                    onClick={() => onTabChange('profile')}
                    imageUrl={userProfileImage}
                />
            </div>
        </nav>
    );
};
