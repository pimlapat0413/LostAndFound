'use client';

import React from 'react';
import { Menu, Bell, Settings, User } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 mr-4 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          title="สลับเมนูข้าง"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block text-lg font-semibold text-gray-800">
          Lost & Found Dashboard
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
