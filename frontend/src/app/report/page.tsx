'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  MapPin, 
  Image as ImageIcon, 
  Upload, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { currentUser, categories, locations } from '@/data/mockData';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    date: '',
    faculty: '',
    building: '',
    locationDetail: '',
    contactName: '',
    contactPhone: '',
    contactOther: ''
  });

  const [images, setImages] = useState<string[]>([]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Simulate image upload for preview
    const newImages = [...images, 'blob:preview'];
    setImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('บันทึกข้อมูลสำเร็จ!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">แจ้งของหาย</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">แจ้งของหาย</h1>
          <p className="text-gray-500 mt-1">กรอกข้อมูลสิ่งของที่คุณทำหาย เพื่อให้ผู้พบเห็นสามารถติดต่อคืนได้</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Image Upload */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-medium text-gray-900 mb-4">รูปภาพสิ่งของ <span className="text-red-500">*</span></h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-blue-600">คลิกเพื่อเลือกรูปภาพ</p>
                  <p className="text-xs text-gray-500 mt-1">รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)</p>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 bg-gray-200 rounded-md relative flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setImages([])}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-medium text-gray-900 mb-4">สถานที่หาย</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">คณะ <span className="text-red-500">*</span></label>
                    <Select 
                      options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                      placeholder="เลือกคณะ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">อาคาร</label>
                    <Select 
                      options={[]}
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      placeholder="เลือกอาคาร"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสถานที่เพิ่มเติม</label>
                    <Input 
                      value={formData.locationDetail}
                      onChange={(e) => setFormData({...formData, locationDetail: e.target.value})}
                      placeholder="เช่น ห้องสมุด ชั้น 2"
                    />
                  </div>
                  <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center flex-col">
                    <MapPin className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">แผนที่แสดงตำแหน่ง</span>
                  </div>
                </div>
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
                  <button type="button" className="text-sm text-red-500 hover:text-red-600">ออกจากระบบ</button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4">ข้อมูลสิ่งของที่หาย</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสิ่งของ <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="เช่น iPhone 15 Pro"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                    <textarea 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="เช่น สีดำ ยี่ห้อ Apple"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
                    <Select 
                      options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      placeholder="เลือกหมวดหมู่"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่หาย <span className="text-red-500">*</span></label>
                    <Input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 mb-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ช่องทางติดต่อ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ติดต่อ <span className="text-red-500">*</span></label>
                      <Input 
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        placeholder="ชื่อ-นามสกุล"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                      <Input 
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ช่องทางอื่นๆ</label>
                      <Input 
                        value={formData.contactOther}
                        onChange={(e) => setFormData({...formData, contactOther: e.target.value})}
                        placeholder="เช่น Line ID, Email"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button variant="secondary" type="button">ยกเลิก</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">บันทึกข้อมูล</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
