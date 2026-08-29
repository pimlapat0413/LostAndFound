'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  PackageCheck, 
  Users, 
  Package, 
  ArrowRight, 
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { lostItems, adminStats } from '@/data/mockData';
import StatCard from '@/components/ui/StatCard';
import { LostItem } from '@/types';

const getStatusBadge = (status: LostItem['status']) => {
  switch (status) {
    case 'searching':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">กำลังค้นหา</span>;
    case 'found':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">พบแล้ว</span>;
    case 'returned':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">รับคืนแล้ว</span>;
    default:
      return null;
  }
};

const popularCategories = [
  'กระเป๋าสตางค์',
  'โทรศัพท์มือถือ',
  'กุญแจ',
  'บัตรประจำตัว',
  'อุปกรณ์ไอที',
  'เครื่องประดับ',
];

export default function DashboardPage() {
  const recentItems = lostItems.slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="mt-2 text-gray-600">ภาพรวมระบบแจ้งของหายและรับคืน</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="รายการทั้งหมด" 
          value={adminStats.totalItems} 
          icon={<FileText className="w-6 h-6 text-blue-600" />} 
          colorScheme="blue"
        />
        <StatCard 
          label="กำลังค้นหา" 
          value={adminStats.searching} 
          icon={<Search className="w-6 h-6 text-orange-600" />} 
          colorScheme="orange"
        />
        <StatCard 
          label="รับคืนแล้ว" 
          value={adminStats.returned} 
          icon={<PackageCheck className="w-6 h-6 text-green-600" />} 
          colorScheme="green"
        />
        <StatCard 
          label="ผู้ใช้ทั้งหมด" 
          value={adminStats.totalUsers} 
          icon={<Users className="w-6 h-6 text-purple-600" />} 
          colorScheme="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/report" className="block group">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">แจ้งของหาย</h3>
              <p className="text-gray-500 mt-1">แจ้งรายการสิ่งของที่สูญหาย</p>
            </div>
          </div>
        </Link>
        <Link href="/search" className="block group">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">ค้นหาของหาย</h3>
              <p className="text-gray-500 mt-1">ค้นหาสิ่งของที่ถูกแจ้ง</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            รายการล่าสุด
          </h2>
          <Link href="/items" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="group block">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(item.dateLost).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">หมวดหมู่ยอดนิยม</h2>
        <div className="flex flex-wrap gap-2">
          {popularCategories.map((category, index) => (
            <Link 
              key={index} 
              href={`/search?category=${encodeURIComponent(category)}`}
              className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
