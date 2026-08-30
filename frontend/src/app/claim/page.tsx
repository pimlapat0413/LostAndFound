'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ArrowLeft,
  MapPin, 
  Calendar,
  Image as ImageIcon,
  Search,
  Filter,
  CheckCircle2,
  Package,
  Tag,
  User as UserIcon,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { currentUser, lostItems as initialItems, categories, locations } from '@/data/mockData';
import Badge from '@/components/ui/Badge';
import { LostItem } from '@/types';

export default function ClaimPage() {
  const router = useRouter();
  const [items, setItems] = useState<LostItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(initialItems[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'ออม',
    lastName: 'สุขเจริญ',
    studentId: '65012345',
    department: 'คณะวิศวกรรมศาสตร์',
    claimDate: new Date().toISOString().split('T')[0],
    claimTime: '14:30',
    claimLocation: 'engineering',
    locationDetail: 'อาคารเรียนรวม ชั้น 2 ห้อง 204',
    contact: 'Line ID: aom_123 / 08X-XXX-XXXX',
    note: 'จำได้ว่า วางไว้บนโต๊ะหน้าห้องเรียน ตอนประมาณ 14:30 น.'
  });

  const filteredItems = items.filter((item) => {
    const matchesQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    // Update item status in local state to "returned"
    setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, status: 'returned' } : i));
    setSelectedItem(prev => prev ? { ...prev, status: 'returned' } : null);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const getStatusBadge = (status: LostItem['status']) => {
    switch (status) {
      case 'searching':
        return <Badge variant="searching">กำลังค้นหา</Badge>;
      case 'found':
        return <Badge variant="found">พบแล้ว</Badge>;
      case 'returned':
        return <Badge variant="returned">รับคืนแล้ว</Badge>;
      default:
        return <Badge variant="pending">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Back and Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">รายการของหาย / รับคืน</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">รายการของหายและรับของคืน</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              เลือกสิ่งของที่คุณเป็นเจ้าของ ค้นหาตามหมวดหมู่ หรือกรอกฟอร์มนัดรับของคืนได้ทันที
            </p>
          </div>
          <button 
            onClick={() => router.back()}
            className="self-start sm:self-auto inline-flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> ย้อนกลับ
          </button>
        </div>

        {/* Success Alert Banner */}
        {showSuccess && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">ยืนยันรับของคืนเรียบร้อยแล้ว!</p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  สถานะรายการรหัส <span className="font-mono underline">{selectedItem?.code}</span> เปลี่ยนเป็น <strong className="underline">"รับคืนแล้ว"</strong> ทันที
                </p>
              </div>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-white hover:text-emerald-200 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Content Layout (Catalog Grid on Left, Selected Item & Claim Form on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 Cols) - Items Selection & Search Catalog */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search & Category Filter Box */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ รหัส หรือสถานที่..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ทั้งหมด">สถานะทั้งหมด</option>
                  <option value="searching">กำลังค้นหา</option>
                  <option value="found">พบแล้ว</option>
                  <option value="returned">รับคืนแล้ว</option>
                </select>
              </div>
            </div>

            {/* List of Selectable Items */}
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                เลือกสิ่งของที่ต้องการรับคืน ({filteredItems.length})
              </h3>
              
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-400/20'
                        : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[11px] font-bold text-gray-500">{item.code}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.location}</p>
                    </div>

                    <button 
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {isSelected ? 'กำลังเลือก' : 'เลือก'}
                    </button>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border text-xs text-gray-400">
                  ไม่พบรายการที่ตรงกับการค้นหา
                </div>
              )}
            </div>

          </div>

          {/* Right Column (7 Cols) - Detailed Selected Item & Claim Form */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Selected Item Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>ข้อมูลสิ่งของที่เลือก</span>
                      <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                        {selectedItem.code}
                      </span>
                    </h3>
                    {getStatusBadge(selectedItem.status)}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-36 h-36 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                      {selectedItem.imageUrl ? (
                        <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-xs text-gray-600">
                      <h4 className="text-lg font-bold text-gray-900">{selectedItem.name}</h4>
                      <p className="text-gray-500 text-xs line-clamp-2">{selectedItem.description}</p>
                      
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>หมวดหมู่: <strong className="text-gray-800">{selectedItem.category}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>สถานที่: <strong className="text-gray-800">{selectedItem.location}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>วันที่แจ้ง: <strong className="text-gray-800">{selectedItem.dateLost}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form: Claimer Details */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                  
                  <div>
                    <h3 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">ข้อมูลผู้รับคืน</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อ <span className="text-red-500">*</span></label>
                        <Input 
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="ชื่อผู้รับ"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">นามสกุล <span className="text-red-500">*</span></label>
                        <Input 
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="นามสกุล"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">รหัสนักศึกษา / รหัสพนักงาน <span className="text-red-500">*</span></label>
                        <Input 
                          required
                          value={formData.studentId}
                          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">สังกัดหน่วยงาน / คณะ <span className="text-red-500">*</span></label>
                        <Input 
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">นัดหมายเวลารับคืน</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">วันที่รับคืน <span className="text-red-500">*</span></label>
                        <Input 
                          type="date"
                          required
                          value={formData.claimDate}
                          onChange={(e) => setFormData({...formData, claimDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">เวลารับคืน <span className="text-red-500">*</span></label>
                        <Input 
                          type="time"
                          required
                          value={formData.claimTime}
                          onChange={(e) => setFormData({...formData, claimTime: e.target.value})}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">สถานที่นัดรับ <span className="text-red-500">*</span></label>
                        <Select 
                          options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                          value={formData.claimLocation}
                          onChange={(e) => setFormData({...formData, claimLocation: e.target.value})}
                          placeholder="เลือกสถานที่"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียดสถานที่นัดรับเพิ่มเติม</label>
                        <Input 
                          value={formData.locationDetail}
                          onChange={(e) => setFormData({...formData, locationDetail: e.target.value})}
                          placeholder="เช่น อาคารเรียนรวม ชั้น 2 ห้อง 204"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">ช่องทางติดต่อ & หมายเหตุ</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">ช่องทางติดต่อ <span className="text-red-500">*</span></label>
                        <Input 
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({...formData, contact: e.target.value})}
                          placeholder="Line ID / เบอร์โทรศัพท์ / Email"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">หมายเหตุเพิ่มเติม (ระบุรายละเอียดสัญลักษณ์ของสิ่งของเพิ่มเติม)</label>
                        <textarea 
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          value={formData.note}
                          onChange={(e) => setFormData({...formData, note: e.target.value})}
                          placeholder="ระบุรหัสหรือลักษณะพิเศษเพื่อยืนยันความเป็นเจ้าของ..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-[11px] text-gray-400">
                      * หลังจากกด ยืนยันรับของคืน สถานะรายการจะเปลี่ยนเป็น <strong className="text-emerald-600">"รับคืนแล้ว"</strong> ทันที
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" type="button" onClick={() => router.back()}>
                        ยกเลิก
                      </Button>
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs">
                        ยืนยันรับของคืน
                      </Button>
                    </div>
                  </div>

                </div>

              </form>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">กรุณาเลือกสิ่งของที่ต้องการรับคืน</h3>
                <p className="text-xs text-gray-500">เลือกรายการจากคลังสิ่งของฝั่งซ้ายมือเพื่อกรอกแบบฟอร์มนัดรับของคืน</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
