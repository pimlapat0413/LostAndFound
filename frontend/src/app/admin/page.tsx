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
  CheckCircle,
  ShieldAlert,
  UserCheck,
  Plus,
  X
} from 'lucide-react'
import { lostItems as initialItems, adminStats } from '@/data/mockData'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { LostItem } from '@/types'

// Mock user list for User Management
const initialUsers = [
  { id: '1', name: 'Aom', studentId: '65012345', email: 'aom123@gmail.com', role: 'user', status: 'active' },
  { id: '2', name: 'Bank', studentId: '65012890', email: 'bank_b@gmail.com', role: 'user', status: 'active' },
  { id: '3', name: 'Mint', studentId: '65013004', email: 'mint_m@gmail.com', role: 'admin', status: 'active' },
  { id: '4', name: 'Film', studentId: '65014112', email: 'film_f@gmail.com', role: 'user', status: 'active' },
  { id: '5', name: 'John', studentId: '65015998', email: 'john_j@gmail.com', role: 'user', status: 'active' },
]

export default function AdminDashboardPage() {
  const [items, setItems] = useState<LostItem[]>(initialItems)
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'returned'>('all')
  const [viewingItem, setViewingItem] = useState<LostItem | null>(null)
  const [editingItem, setEditingItem] = useState<LostItem | null>(null)
  const [newStatus, setNewStatus] = useState<LostItem['status']>('searching')
  const [showUserModal, setShowUserModal] = useState(false)
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

  const toggleUserRole = (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin'
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u))
    showToast(`เปลี่ยนสิทธิ์ผู้ใช้เป็น ${nextRole === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้ทั่วไป (User)'} เรียบร้อย`)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilterTab === 'pending') {
      return matchesSearch && item.status !== 'returned'
    }
    if (activeFilterTab === 'returned') {
      return matchesSearch && item.status === 'returned'
    }
    return matchesSearch
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in text-xs font-semibold">
          <CheckCircle className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">แผงควบคุมผู้ดูแลระบบ (Admin Dashboard)</h1>
            <p className="text-xs text-gray-500 mt-1">จัดการข้อมูลรายการของหาย อัปเดตสถานะ และบริหารสิทธิ์ผู้ใช้งานในระบบ</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
            <CalendarRange className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-gray-700">01/04/2024 - 30/04/2024</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveFilterTab('all')}
            className={`bg-white rounded-2xl p-6 border cursor-pointer transition-all ${
              activeFilterTab === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-gray-100 hover:shadow-xs'
            } flex items-center gap-4`}
          >
            <div className="p-3.5 bg-blue-50 rounded-xl">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รายการทั้งหมด</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilterTab('pending')}
            className={`bg-white rounded-2xl p-6 border cursor-pointer transition-all ${
              activeFilterTab === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md' : 'border-gray-100 hover:shadow-xs'
            } flex items-center gap-4`}
          >
            <div className="p-3.5 bg-amber-50 rounded-xl">
              <Search className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{items.filter(i => i.status !== 'returned').length}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รอดำเนินการ / ค้นหา</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilterTab('returned')}
            className={`bg-white rounded-2xl p-6 border cursor-pointer transition-all ${
              activeFilterTab === 'returned' ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-gray-100 hover:shadow-xs'
            } flex items-center gap-4`}
          >
            <div className="p-3.5 bg-emerald-50 rounded-xl">
              <PackageCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{items.filter(i => i.status === 'returned').length}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">รับคืนแล้ว</p>
            </div>
          </div>

          <div 
            onClick={() => setShowUserModal(true)}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="p-3.5 bg-purple-50 rounded-xl">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">ผู้ใช้ทั้งหมด (คลิกเพื่อจัดการ)</p>
            </div>
          </div>
        </div>

        {/* Main Content (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Recent Items Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-xs">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  {activeFilterTab === 'all' && 'รายการทั้งหมดในระบบ'}
                  {activeFilterTab === 'pending' && 'รายการที่รอดำเนินการ / กำลังค้นหา'}
                  {activeFilterTab === 'returned' && 'ประวัติรายการที่รับคืนแล้ว'}
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {filteredItems.length}
                </span>
              </div>

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
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-mono font-medium text-gray-900 text-xs">{item.code}</td>
                      <td className="p-4 font-medium text-gray-900">{item.name}</td>
                      <td className="p-4 text-gray-600 text-xs">{item.reporterName}</td>
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
          </div>

          {/* Right Column - Management Menu */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs h-fit space-y-1">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">เมนูจัดการระบบ Admin</h2>
            </div>
            
            <div className="p-3 space-y-2">
              <button 
                onClick={() => setActiveFilterTab('all')}
                className={`w-full text-left flex items-center gap-3.5 p-3.5 rounded-xl transition-all ${
                  activeFilterTab === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">จัดการรายการของหายทั้งหมด</p>
                  <p className="text-xs text-gray-500 truncate">ดูรายการและแก้ไขสิ่งของทั้งหมด ({items.length})</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveFilterTab('pending')}
                className={`w-full text-left flex items-center gap-3.5 p-3.5 rounded-xl transition-all ${
                  activeFilterTab === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">จัดการสถานะ (รอดำเนินการ)</p>
                  <p className="text-xs text-gray-500 truncate">อัปเดตสถานะของที่ยังไม่ได้คืน</p>
                </div>
              </button>

              <button 
                onClick={() => setShowUserModal(true)}
                className="w-full text-left flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-all border border-transparent hover:border-purple-200"
              >
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                  <UserCog className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">จัดการผู้ใช้งาน ({users.length})</p>
                  <p className="text-xs text-gray-500 truncate">จัดการบัญชีและสิทธิ์ผู้ใช้งานในระบบ</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveFilterTab('returned')}
                className={`w-full text-left flex items-center gap-3.5 p-3.5 rounded-xl transition-all ${
                  activeFilterTab === 'returned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <History className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">ประวัติการรับคืนแล้ว</p>
                  <p className="text-xs text-gray-500 truncate">ดูประวัติรายการที่รับส่งมอบสำเร็จแล้ว</p>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="จัดการผู้ใช้งานในระบบ (User Management)"
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              รายชื่อนักศึกษาและผู้ใช้งานที่ลงทะเบียนในระบบทั้งหมด สามารถปรับเปลี่ยนสิทธิ์ (User / Admin) ได้
            </p>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 border-b font-semibold">
                  <tr>
                    <th className="p-3">ชื่อ-นามสกุล</th>
                    <th className="p-3">รหัสนักศึกษา</th>
                    <th className="p-3">อีเมล</th>
                    <th className="p-3">สิทธิ์ใช้งาน</th>
                    <th className="p-3 text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                      <td className="p-3 font-mono text-gray-600">{u.studentId}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleUserRole(u.id, u.role)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-700 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          สลับสิทธิ์ {u.role === 'admin' ? '-> User' : '-> Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </Modal>
      )}

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
