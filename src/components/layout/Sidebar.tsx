'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Home, FileText, PackageCheck, Search, Database, LogOut, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'หน้าแรก', icon: Home, href: '/' },
    { label: 'แจ้งของหาย', icon: FileText, href: '/report' },
    { label: 'รับของคืน', icon: PackageCheck, href: '/claim' },
    { label: 'ค้นหา', icon: Search, href: '/search' },
    { label: 'ข้อมูลของหาย', icon: Database, href: '/items' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col shadow-xl`}
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center justify-center h-24 px-4 border-b border-blue-600/50">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Shield className="w-8 h-8 text-blue-300" />
            <span>Lost & Found</span>
          </div>
          <span className="text-xs text-blue-200 mt-1">ระบบแจ้งของหายและรับคืน</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-800/50 text-white font-medium'
                    : 'text-blue-100 hover:bg-blue-800/30'
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t border-blue-600/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Aom</p>
              <p className="text-xs text-blue-200 truncate">aom123@gmail.com</p>
            </div>
          </div>
          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
