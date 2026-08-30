'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  Tag,
  CheckCircle,
  Edit,
  AlertTriangle,
  User
} from 'lucide-react';
import { lostItems } from '@/data/mockData';

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const item = lostItems?.find(i => i.id === id || i.id.toString() === id);

  if (!item) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800">ไม่พบรายการ</h2>
        <Link href="/search" className="text-blue-600 hover:underline mt-4 inline-block">กลับไปหน้าค้นหา</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === 'กำลังค้นหา') return <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-medium">กำลังค้นหา</span>;
    if (status === 'พบแล้ว') return <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium">พบแล้ว</span>;
    if (status === 'รอรับคืน') return <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-sm font-medium">รอรับคืน</span>;
    if (status === 'รับคืนแล้ว') return <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium">รับคืนแล้ว</span>;
    return <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium">{status}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
        <ChevronRight size={16} />
        <Link href="/search" className="hover:text-blue-600">ข้อมูลของหาย</Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">รายละเอียด</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center border border-gray-200 overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-32 h-32 text-gray-300" />
            )}
          </div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 cursor-pointer hover:border-blue-500 transition">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            {getStatusBadge(item.status)}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">หมวดหมู่</span>
                <span className="text-gray-900">{item.category}</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-gray-500 text-sm block">รายละเอียด</span>
                <span className="text-gray-900">
                  {item.color && `สี: ${item.color} `}
                  {item.brand && `แบรนด์: ${item.brand} `}
                  {item.description}
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">สถานที่</span>
                <span className="text-gray-900">
                  {item.building && `ตึก/อาคาร: ${item.building} `}
                  {item.floor && `ชั้น: ${item.floor} `}
                  {item.room && `ห้อง: ${item.room} `}
                  {item.location} {item.locationDetail}
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">วันที่หาย</span>
                <span className="text-gray-900">{item.dateLost}</span>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">เวลาหาย</span>
                <span className="text-gray-900">{item.timeLost || '-'}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          <div className="space-y-4 mb-10">
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">ผู้แจ้งหาย</span>
                <span className="text-gray-900">{item.reporterName || 'ไม่ระบุ'}</span>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">เบอร์โทรศัพท์</span>
                <span className="text-gray-900">{item.reporterPhone || '-'}</span>
              </div>
            </div>

            <div className="flex items-start">
              <MessageCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-gray-500 text-sm block">ช่องทางติดต่ออื่นๆ (Line ID)</span>
                <span className="text-gray-900">{item.reporterContact || '-'}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition cursor-pointer">
              <CheckCircle className="w-5 h-5 mr-2" />
              แจ้งว่าเป็นของคุณ
            </button>
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition cursor-pointer">
                <Edit className="w-5 h-5 mr-2" />
                แก้ไขข้อมูล
              </button>
              <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition cursor-pointer">
                <AlertTriangle className="w-5 h-5 mr-2" />
                รายงานปัญหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">รายละเอียดเพิ่มเติม</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {item.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
        </p>
      </div>
    </div>
  );
}
