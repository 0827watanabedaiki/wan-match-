import React, { ReactNode } from 'react';

interface MobileContainerProps {
    children: ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-neutral-100 flex justify-center overflow-hidden">
            <div className="w-full max-w-md bg-white shadow-xl h-screen flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};
