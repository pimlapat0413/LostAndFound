'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Eye, 
  CheckCircle2, 
  Tag, 
  User as UserIcon,
  ArrowUpRight
} from 'lucide-react'
import { lostItems, categories } from '@/data/mockData'
import Badge from '@/components/ui/Badge'
import { LostItem } from '@/types'

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'searching' | 'found' | 'returned'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter items based on status, category, and search query
  const filteredItems = lostItems.filter((item) => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  const getStatusBadge = (status: LostItem['status']) => {
    switch (status) {
      case 'searching':
        return <Badge variant="searching">กำลังค้นหา</Badge>
      case 'found':
        return <Badge variant="found">พบแล้ว</Badge>
      case 'returned':
        return <Badge variant="returned">รับคืนแล้ว</Badge>
      default:
        return <Badge variant="pending">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">ข้อมูลของหาย</span>
        </nav>

        {/* Page Title & Main Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-blue-200 mb-3 border border-blue-400/30">
                <Package className="w-3.5 h-3.5" />
                <span>คลังข้อมูลรายการสิ่งของสูญหาย</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ข้อมูลสิ่งของสูญหายทั้งหมด</h1>
              <p className="text-blue-100 text-sm mt-2 max-w-2xl">
                รวมรายการสิ่งของสูญหายที่ได้รับการแจ้งในระบบ สามารถค้นหา กรองสถานะ หรือเลือกดูรายละเอียดเพื่อรับคืนได้ตลอด 24 ชั่วโมง
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-5 py-3 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span>แจ้งของหายใหม่</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          
          {/* Top Row: Status Tabs & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'ทั้งหมด', count: lostItems.length },
                { id: 'searching', label: 'กำลังค้นหา', count: lostItems.filter(i => i.status === 'searching').length },
                { id: 'found', label: 'พบแล้ว', count: lostItems.filter(i => i.status === 'found').length },
                { id: 'returned', label: 'รับคืนแล้ว', count: lostItems.filter(i => i.status === 'returned').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedStatus === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    selectedStatus === tab.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="มุมมองการ์ด (Grid View)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="มุมมองรายการ (List View)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Bottom Row: Search Box & Category Select */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสิ่งของ รหัสรายการ สถานที่ หรือคำอธิบาย..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>พบทั้งหมด <strong className="text-gray-900 font-semibold">{filteredItems.length}</strong> รายการ</span>
          {(selectedStatus !== 'all' || selectedCategory !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedStatus('all')
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {/* Catalog Content - Grid View vs List View */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
                >
                  {/* Image Header & Status */}
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                        <Package className="w-10 h-10 mb-1" />
                        <span className="text-xs">ไม่มีรูปภาพ</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 shadow-xs">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
                      {item.code}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{item.category}</span>
                      </div>
                      <Link href={`/items/${item.id}`}>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.dateLost}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>{item.reporterName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/items/${item.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition-colors border border-gray-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูรายละเอียด</span>
                      </Link>
                      {item.status !== 'returned' && (
                        <Link
                          href="/claim"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>รับของคืน</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-blue-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-500 font-semibold">{item.code}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-blue-600 font-medium">{item.category}</span>
                      </div>
                      <Link href={`/items/${item.id}`}>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {item.dateLost}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                          {item.reporterName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Badge + Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div>{getStatusBadge(item.status)}</div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/items/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition-colors border border-gray-200"
                      >
                        <span>รายละเอียด</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      {item.status !== 'returned' && (
                        <Link
                          href="/claim"
                          className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                        >
                          <span>รับของคืน</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">ไม่พบรายการสิ่งของที่ค้นหา</h3>
              <p className="text-sm text-gray-500 mt-1">ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่และสถานะใหม่อีกครั้ง</p>
            </div>
            <button
              onClick={() => {
                setSelectedStatus('all')
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              รีเซ็ตการค้นหา
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredItems.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <div className="text-xs text-gray-500">
              แสดง 1 ถึง {filteredItems.length} จาก {filteredItems.length} รายการ
            </div>
            <div className="flex items-center gap-1">
              <button disabled className="px-3 py-1.5 text-xs text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed font-medium">
                ก่อนหน้า
              </button>
              <button className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg font-semibold shadow-xs">
                1
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                2
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                ถัดไป
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
