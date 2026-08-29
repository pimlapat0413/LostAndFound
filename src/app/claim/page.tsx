'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ArrowLeft,
  MapPin, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { currentUser, lostItems, locations } from '@/data/mockData';

export default function ClaimPage() {
  const router = useRouter();
  const item = lostItems[0]; // Example item
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    department: '',
    claimDate: '',
    claimTime: '',
    claimLocation: '',
    locationDetail: '',
    contact: '',
    note: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    alert('เมื่อรายการถูกรับคืน สถานะรายการจะเปลี่ยนเป็น "รับคืนแล้ว" ทันที');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back and Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
          </button>
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">รับของคืน</span>
          </nav>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">รับของคืน</h1>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center">
            เมื่อรายการถูกรับคืน สถานะรายการจะเปลี่ยนเป็น "รับคืนแล้ว" ทันที
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Item Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลรายการของหาย</h3>
                
                {item && (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    
                    <div>
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-2">
                        กำลังค้นหา
                      </span>
                      <h4 className="font-medium text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>พบที่: {item.location} {item.locationDetail ? `(${item.locationDetail})` : ''}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>วันที่หาย: {item.dateLost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-4 h-4"/> หน้าแรก</Link></li>
                  <li><Link href="/report" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-4 h-4"/> แจ้งของหาย</Link></li>
                  <li><Link href="/search" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-4 h-4"/> ค้นหา</Link></li>
                  <li><Link href="/items" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-4 h-4"/> ข้อมูลของหาย</Link></li>
                </ul>
              </div>

              {/* User Profile */}
              {currentUser && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Claim Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4">ข้อมูลผู้รับคืน</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="ชื่อ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="นามสกุล"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักศึกษา <span className="text-red-500">*</span></label>
                      <Input 
                        required
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">สังกัดหน่วยงาน <span className="text-red-500">*</span></label>
                      <Input 
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่รับคืน <span className="text-red-500">*</span></label>
                    <Input 
                      type="date"
                      required
                      value={formData.claimDate}
                      onChange={(e) => setFormData({...formData, claimDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เวลารับคืน <span className="text-red-500">*</span></label>
                    <Input 
                      type="time"
                      required
                      value={formData.claimTime}
                      onChange={(e) => setFormData({...formData, claimTime: e.target.value})}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4">สถานที่นัดรับ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่รับ <span className="text-red-500">*</span></label>
                    <Select 
                      options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                      value={formData.claimLocation}
                      onChange={(e) => setFormData({...formData, claimLocation: e.target.value})}
                      placeholder="เลือกสถานที่"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสถานที่นัดรับ</label>
                    <Input 
                      value={formData.locationDetail}
                      onChange={(e) => setFormData({...formData, locationDetail: e.target.value})}
                      placeholder="เช่น ชั้น 1 หน้าลิฟต์"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4">ข้อมูลเพิ่มเติม</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ช่องทางติดต่อ</label>
                    <Input 
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      placeholder="Line ID / Email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุผู้คืน (ทำไม)</label>
                    <textarea 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      placeholder="ระบุหมายเหตุเพิ่มเติม"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                  <Button variant="secondary" type="button">ยกเลิก</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">ยืนยันรับของคืน</Button>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
