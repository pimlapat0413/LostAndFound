'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  Settings, 
  User as UserIcon, 
  Shield, 
  GraduationCap, 
  Briefcase, 
  Check, 
  X, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface TopBarProps {
  onMenuClick: () => void;
}

type UserRole = 'student' | 'teacher' | 'admin';

export default function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  
  // State for user role
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // State for notifications
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'มีผู้แจ้งพบสิ่งของตรงกับที่คุณแจ้ง',
      desc: 'พบหูฟัง AirPods Pro บริเวณอาคารเรียนรวม ชั้น 2',
      time: '10 นาทีที่แล้ว',
      read: false
    },
    {
      id: 2,
      title: 'คำขอนัดรับของคืนได้รับการยืนยัน',
      desc: 'รายการ LF-2024-00048 ได้รับการยืนยันสถานที่นัดรับแล้ว',
      time: '1 ชั่วโมงที่แล้ว',
      read: false
    },
    {
      id: 3,
      title: 'ยินดีต้อนรับสู่ระบบ Lost & Found',
      desc: 'ระบบแจ้งและติดตามสิ่งของสูญหายของมหาวิทยาลัย',
      time: 'เมื่อวานนี้',
      read: false
    }
  ]);

  // State for settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(false);
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsUserMenuOpen(false);
    if (role === 'admin') {
      router.push('/admin');
    }
  };

  const markAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'student': return { title: 'นักศึกษา (Student)', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'teacher': return { title: 'อาจารย์ / บุคลากร (Staff)', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'admin': return { title: 'ผู้ดูแลระบบ (Admin)', icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-200' };
    }
  };

  const currentRoleInfo = getRoleLabel(currentRole);
  const RoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white shadow-xs border-b border-gray-100">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 mr-3 text-gray-600 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          title="สลับเมนูข้าง"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            Lost & Found
          </span>
          <span className="hidden md:inline-block text-xs text-gray-400 font-normal">
            | ระบบแจ้งของหายและรับคืน
          </span>
        </div>
      </div>

      {/* Right side: Notifications, Settings & User Profile with Role Selection */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* 1. Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
            title="การแจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">การแจ้งเตือน</h4>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotifsAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    อ่านทั้งหมดแล้ว
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-3.5 hover:bg-gray-50 transition-colors flex gap-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <span className="text-[11px] text-gray-400">ระบบจะอัปเดตแจ้งเตือนอัตโนมัติเมื่อมีความคืบหน้า</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
          title="ตั้งค่าระบบ"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 3. User Avatar & Role Switcher Menu */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none border border-transparent hover:border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              A
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-gray-800 leading-tight">Aom</span>
              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                {currentRole === 'admin' ? 'แอดมิน' : currentRole === 'teacher' ? 'อาจารย์' : 'นักศึกษา'}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in space-y-4">
              {/* User Info Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">Aom (ออม สุขเจริญ)</h4>
                  <p className="text-xs text-gray-500 truncate">aom123@gmail.com</p>
                  <span className="inline-block font-mono text-[11px] text-gray-400 mt-0.5">รหัสนักศึกษา: 65012345</span>
                </div>
              </div>

              {/* Role Selection Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">เลือกตำแหน่ง / ยศ (Role):</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">สลับสิทธิ์</span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 'admin', label: 'ผู้ดูแลระบบ (Admin)', icon: Shield, desc: 'จัดการระบบและข้อมูลทั้งหมด', color: 'text-purple-600' },
                    { id: 'teacher', label: 'อาจารย์ / บุคลากร', icon: Briefcase, desc: 'สิทธิ์เจ้าหน้าที่และอาจารย์', color: 'text-emerald-600' },
                    { id: 'student', label: 'นักศึกษา (Student)', icon: GraduationCap, desc: 'แจ้งของหายและขอรับคืน', color: 'text-blue-600' },
                  ].map((roleItem) => {
                    const ItemIcon = roleItem.icon;
                    const isSelected = currentRole === roleItem.id;
                    return (
                      <button
                        key={roleItem.id}
                        onClick={() => handleRoleChange(roleItem.id as UserRole)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'bg-blue-50/70 border-blue-500 shadow-xs text-blue-900' 
                            : 'bg-gray-50/50 border-gray-100 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{roleItem.label}</p>
                            <p className="text-[10px] text-gray-400">{roleItem.desc}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Direct Access Shortcut */}
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>เข้าสู่หน้าแอดมิน (Admin Panel)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Modal
          isOpen={isSettingsOpen}
          onClose={() => { setIsSettingsOpen(false); setSettingsSaved(false); }}
          title="การตั้งค่าระบบ (System Settings)"
        >
          <div className="space-y-5 text-xs text-gray-700">
            {settingsSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-2 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
              </div>
            )}

            {/* Notification Settings */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 border-b pb-2 text-sm">การแจ้งเตือน</h4>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">แจ้งเตือนผ่านอีเมล</p>
                  <p className="text-[11px] text-gray-500">รับอีเมลแจ้งเตือนเมื่อมีคนพบสิ่งของที่ตรงกับที่คุณแจ้ง</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNotif} 
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">เสียงแจ้งเตือนในระบบ</p>
                  <p className="text-[11px] text-gray-500">เล่นเสียงแจ้งเตือนสั้นๆ เมื่อมีข้อความใหม่</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundNotif} 
                  onChange={(e) => setSoundNotif(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 border-b pb-2 text-sm">ภาษาและการแสดงผล</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('th')}
                  className={`flex-1 p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    language === 'th' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  ภาษาไทย (TH)
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    language === 'en' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>

            {/* Privacy & Account */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                <span>เวอร์ชันระบบ: <strong>v1.0.4 (Frontend Demo)</strong></span>
                <span>ผู้ใช้งาน: <strong>aom123@gmail.com</strong></span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  setSettingsSaved(true);
                  setTimeout(() => {
                    setSettingsSaved(false);
                    setIsSettingsOpen(false);
                  }, 1200);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
}
