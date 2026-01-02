import React from 'react';
import { APP_CONFIG } from '@/constants/app';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <h1 className="text-xl font-bold text-white">
              {APP_CONFIG.name}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
