'use client'

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  MapPin, 
  Image as ImageIcon, 
  Upload, 
  X, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Phone, 
  Mail, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { categories, locations } from '@/data/mockData';
import Modal from '@/components/ui/Modal';

interface UploadedPhoto {
  id: string;
  name: string;
  size: string;
  url: string;
}

export default function ReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: 'electronics',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    faculty: 'engineering',
    building: 'eng-1',
    room: '',
    locationDetail: '',
    contactName: 'ออม สุขเจริญ',
    contactPhone: '081-234-5678',
    contactOther: 'Line ID: aom_123'
  });

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdItem, setCreatedItem] = useState<any>(null);

  // Handle Real File Upload from Device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPhotos: UploadedPhoto[] = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        url: URL.createObjectURL(file)
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  // Handle Drag and Drop Upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      const newPhotos: UploadedPhoto[] = droppedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        url: URL.createObjectURL(file)
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Get buildings list for selected faculty
  const selectedFacultyObj = locations.find((l) => l.id === formData.faculty) || locations[0];
  const buildingOptions = selectedFacultyObj.buildings.map((b) => ({
    value: b.id,
    label: b.name
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedCode = `LF-2024-000${Math.floor(Math.random() * 90) + 10}`;
    const selectedCat = categories.find(c => c.id === formData.categoryId)?.name || 'ทั่วไป';
    const selectedFac = locations.find(l => l.id === formData.faculty)?.name || '';
    const selectedBld = selectedFacultyObj.buildings.find(b => b.id === formData.building)?.name || '';

    const newPost = {
      code: generatedCode,
      name: formData.name,
      description: formData.description,
      category: selectedCat,
      location: `${selectedFac} (${selectedBld} ${formData.room ? `ห้อง ${formData.room}` : ''})`,
      dateLost: formData.date,
      timeLost: formData.time,
      reporterName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactOther: formData.contactOther,
      imageUrl: photos.length > 0 ? photos[0].url : '',
      photoCount: photos.length
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedItem(newPost);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">แจ้งของหาย</span>
        </nav>

        {/* Header Title */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">แบบฟอร์มแจ้งของหาย / พบของหาย</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              กรอกรายละเอียด อัปโหลดรูปถ่ายจริง และระบุสถานที่ เพื่อให้เจ้าของหรือผู้พบเห็นสามารถติดต่อส่งคืนได้
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl shrink-0 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>สร้างรายการใหม่</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (5 Cols) - Real Photos Upload & Location Selection */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. Real Image Upload Box */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>รูปภาพสิ่งของ (ถ่ายจริง / อัปโหลด)</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {photos.length} รูปที่เลือก
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  className="hidden"
                />

                {/* Dropzone Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-blue-50/40 hover:bg-blue-50/80 cursor-pointer transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-blue-700">คลิกเลือกรูปภาพจากมือถือ / คอมพิวเตอร์</p>
                  <p className="text-[11px] text-gray-500 mt-1">หรือลากไฟล์ภาพมาวางที่นี่ (JPG, PNG, WEBP)</p>
                </div>

                {/* Real Uploaded Photo Thumbnails */}
                {photos.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-gray-700">รูปภาพที่พร้อมโพสต์:</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {photos.map((photo) => (
                        <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100">
                          <img 
                            src={photo.url} 
                            alt={photo.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-xs"
                            title="ลบรูปนี้"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Location Details (Cleaned up: Map removed as requested) */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>สถานที่พบหรือทำหาย</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">คณะ / หน่วยงาน <span className="text-red-500">*</span></label>
                    <Select 
                      options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                      value={formData.faculty}
                      onChange={(e) => {
                        const newFac = e.target.value;
                        const facObj = locations.find(l => l.id === newFac) || locations[0];
                        setFormData({
                          ...formData, 
                          faculty: newFac,
                          building: facObj.buildings[0]?.id || ''
                        });
                      }}
                      placeholder="เลือกคณะ"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">อาคาร / ตึก <span className="text-red-500">*</span></label>
                    <Select 
                      options={buildingOptions}
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      placeholder="เลือกอาคาร"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">ห้อง / ชั้น</label>
                    <Input 
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      placeholder="เช่น ชั้น 2 ห้อง 204 หรือ หน้าลิฟต์"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">รายละเอียดสถานที่เพิ่มเติม</label>
                    <Input 
                      value={formData.locationDetail}
                      onChange={(e) => setFormData({...formData, locationDetail: e.target.value})}
                      placeholder="เช่น วางลืมไว้บนโต๊ะแถวหลังสุด"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (7 Cols) - Item Details & Contact Channels */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Item Details Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100 space-y-5">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>ข้อมูลสิ่งของ</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อสิ่งของ <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="เช่น iPhone 15 Pro สีดำ, กระเป๋าสตางค์หนังสีน้ำตาล"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
                    <Select 
                      options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      placeholder="เลือกหมวดหมู่"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">วันที่ทำหาย / พบ <span className="text-red-500">*</span></label>
                    <Input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">เวลาโดยประมาณ</label>
                    <Input 
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียดและลักษณะพิเศษ</label>
                    <textarea 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="ระบุ สี ยี่ห้อ สัญลักษณ์ รอยตำหนิ หรือเคส เพื่อให้จำแนกได้ชัดเจน..."
                    />
                  </div>
                </div>

                {/* Contact Channels Card */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>ช่องทางติดต่อผู้แจ้ง</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อผู้ติดต่อ <span className="text-red-500">*</span></label>
                      <Input 
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        placeholder="ชื่อ-นามสกุล"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                      <Input 
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">ช่องทางอื่นๆ (Line ID, Facebook, Email)</label>
                      <Input 
                        value={formData.contactOther}
                        onChange={(e) => setFormData({...formData, contactOther: e.target.value})}
                        placeholder="เช่น Line ID: aom_123 / Email: student@university.ac.th"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => router.back()}
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-xs"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกและโพสต์ข้อมูล'}
                  </Button>
                </div>

              </div>

            </div>

          </div>
        </form>

      </div>

      {/* Success Modal Preview after submission */}
      {createdItem && (
        <Modal
          isOpen={!!createdItem}
          onClose={() => setCreatedItem(null)}
          title="บันทึกข้อมูลสิ่งของสูญหายสำเร็จ!"
        >
          <div className="space-y-4 text-xs text-gray-700">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-900">โพสต์รายการเรียบร้อยแล้ว</p>
                <p className="text-emerald-700 mt-0.5">
                  รหัสรายการของคุณคือ <strong className="font-mono text-emerald-900 font-bold">{createdItem.code}</strong> ข้อมูลจะถูกนำไปแสดงในคลังของหายทันที
                </p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex gap-4 items-center">
              {createdItem.imageUrl ? (
                <img src={createdItem.imageUrl} alt="preview" className="w-16 h-16 rounded-xl object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 truncate">{createdItem.name}</p>
                <p className="text-gray-500">{createdItem.category} • {createdItem.location}</p>
                <p className="text-gray-400 text-[11px] mt-0.5">ผู้แจ้ง: {createdItem.reporterName} ({createdItem.contactPhone})</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  setCreatedItem(null);
                  setFormData({
                    name: '',
                    description: '',
                    categoryId: 'electronics',
                    date: new Date().toISOString().split('T')[0],
                    time: '12:00',
                    faculty: 'engineering',
                    building: 'eng-1',
                    room: '',
                    locationDetail: '',
                    contactName: 'ออม สุขเจริญ',
                    contactPhone: '081-234-5678',
                    contactOther: 'Line ID: aom_123'
                  });
                  setPhotos([]);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
              >
                แจ้งรายการอื่นเพิ่ม
              </button>
              <Link
                href="/claim"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
              >
                <span>ดูรายการของหายทั้งหมด</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
