'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  CalendarRange, 
  FileText, 
  Search, 
  PackageCheck, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  ClipboardList, 
  RefreshCw, 
  UserCog, 
  History, 
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { lostItems as initialItems, adminStats } from '@/data/mockData'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { LostItem } from '@/types'

export default function AdminDashboardPage() {
  const [items, setItems] = useState<LostItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewingItem, setViewingItem] = useState<LostItem | null>(null)
  const [editingItem, setEditingItem] = useState<LostItem | null>(null)
  const [newStatus, setNewStatus] = useState<LostItem['status']>('searching')
  const [notification, setNotification] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStatusChange = (id: string, status: LostItem['status']) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item))
    setEditingItem(null)
    showToast('อัปเดตสถานะรายการสำเร็จ!')
  }

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบรายการ "${name}" ใช่หรือไม่?`)) {
      setItems(prev => prev.filter(item => item.id !== id))
      showToast(`ลบรายการ "${name}" เรียบร้อยแล้ว`)
    }
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const managementMenus = [
    {
      title: 'จัดการรายการของหาย',
      subtitle: 'ดูรายการ จัดการรายการของหายทั้งหมด',
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/search'
    },
    {
      title: 'จัดการสถานะ',
      subtitle: 'อัปเดตสถานะรายการของหาย',
      icon: RefreshCw,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/claim'
    },
    {
      title: 'จัดการผู้ใช้งาน',
      subtitle: 'จัดการบัญชีผู้ใช้งานในระบบ',
      icon: UserCog,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '#'
    },
    {
      title: 'ประวัติการรับคืน',
      subtitle: 'ดูประวัติรายการที่รับคืนแล้ว',
      icon: History,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/search'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">แผงควบคุมผู้ดูแลระบบ (Admin Dashboard)</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลสิ่งของสูญหาย สถานะรายการ และผู้ใช้งานในระบบ</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 shadow-xs">
            <CalendarRange className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">01/04/2024 - 30/04/2024</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3.5 bg-blue-50 rounded-xl">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{adminStats.totalItems}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รายการทั้งหมด</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3.5 bg-amber-50 rounded-xl">
              <Search className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{adminStats.searching}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รอรับคืน / ค้นหา</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3.5 bg-emerald-50 rounded-xl">
              <PackageCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{adminStats.returned}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รับคืนแล้ว</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3.5 bg-purple-50 rounded-xl">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{adminStats.totalUsers}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">ผู้ใช้ทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Main Content (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Recent Items Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>รายการล่าสุด</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {filteredItems.length} รายการ
                </span>
              </h2>

              {/* Table search filter */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ รหัส หรือผู้แจ้ง..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">รหัสรายการ</th>
                    <th className="p-4">ชื่อสิ่งของ</th>
                    <th className="p-4">ผู้แจ้ง</th>
                    <th className="p-4">วันที่แจ้ง</th>
                    <th className="p-4">สถานะ</th>
                    <th className="p-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredItems.slice(0, 6).map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-mono font-medium text-gray-900 text-xs">{item.code}</td>
                      <td className="p-4 font-medium text-gray-900">{item.name}</td>
                      <td className="p-4 text-gray-600">{item.reporterName}</td>
                      <td className="p-4 text-gray-500 text-xs">{item.dateLost}</td>
                      <td className="p-4">{getStatusBadge(item.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setEditingItem(item); setNewStatus(item.status); }}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="แก้ไขสถานะ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                        ไม่พบรายการที่ตรงกับการค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-center">
              <Link 
                href="/search" 
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline"
              >
                <span>ดูรายการทั้งหมด</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column - Management Menu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">เมนูจัดการระบบ</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {managementMenus.map((menu, index) => {
                const Icon = menu.icon
                return (
                  <Link 
                    key={index} 
                    href={menu.href}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className={`p-3 rounded-xl ${menu.bgColor} group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${menu.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {menu.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{menu.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>

        </div>

      </div>

      {/* View Item Details Modal */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title={`รายละเอียดรายการ ${viewingItem.code}`}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-semibold text-gray-900">{viewingItem.name}</span>
              {getStatusBadge(viewingItem.status)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong className="text-gray-500">หมวดหมู่:</strong> {viewingItem.category}</div>
              <div><strong className="text-gray-500">สถานที่:</strong> {viewingItem.location}</div>
              <div><strong className="text-gray-500">วันที่หาย:</strong> {viewingItem.dateLost}</div>
              <div><strong className="text-gray-500">เวลา:</strong> {viewingItem.timeLost}</div>
              <div><strong className="text-gray-500">ผู้แจ้ง:</strong> {viewingItem.reporterName}</div>
              <div><strong className="text-gray-500">ติดต่อ:</strong> {viewingItem.reporterPhone}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border text-xs text-gray-600">
              <strong>รายละเอียดเพิ่มเติม:</strong> {viewingItem.description}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Status Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title={`อัปเดตสถานะ: ${editingItem.name}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              กรุณาเลือกสถานะใหม่สำหรับรายการรหัส <strong className="text-gray-900">{editingItem.code}</strong>
            </p>
            <div className="space-y-2">
              {[
                { value: 'searching', label: 'กำลังค้นหา', desc: 'ยังไม่พบของ/อยู่ระหว่างค้นหา' },
                { value: 'found', label: 'พบสิ่งของแล้ว', desc: 'พบของแล้ว รอนัดรับคืน' },
                { value: 'returned', label: 'ส่งคืนเจ้าของแล้ว', desc: 'เจ้าของมารับคืนเรียบร้อยแล้ว' }
              ].map((opt) => (
                <label 
                  key={opt.value} 
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    newStatus === opt.value ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={newStatus === opt.value}
                    onChange={() => setNewStatus(opt.value as LostItem['status'])}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleStatusChange(editingItem.id, newStatus)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                บันทึกสถานะ
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}
