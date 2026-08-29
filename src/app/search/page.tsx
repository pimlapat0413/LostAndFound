'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Calendar, User, ChevronRight, Package } from 'lucide-react';
import { lostItems, popularSearches } from '@/data/mockData';

// Mock options for dropdowns
const categories = ['ทั้งหมด', 'อิเล็กทรอนิกส์', 'เครื่องเขียน', 'ของใช้ส่วนตัว', 'อื่นๆ'];
const faculties = ['ทั้งหมด', 'วิศวกรรมศาสตร์', 'วิทยาศาสตร์', 'สถาปัตยกรรมศาสตร์'];
const buildings = ['ทั้งหมด', 'ตึก 1', 'ตึก 2', 'ตึก 3'];
const floors = ['ทั้งหมด', '1', '2', '3', '4'];
const statuses = ['ทั้งหมด', 'กำลังค้นหา', 'พบแล้ว', 'รับคืนแล้ว'];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedFaculty, setSelectedFaculty] = useState('ทั้งหมด');
  const [selectedBuilding, setSelectedBuilding] = useState('ทั้งหมด');
  const [selectedFloor, setSelectedFloor] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
  };

  const filteredItems = lostItems?.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus;
    // Mock simple matches for others
    return matchesQuery && matchesCategory && matchesStatus;
  }) || [];

  const getStatusStyle = (status: string) => {
    if (status === 'กำลังค้นหา') return 'bg-yellow-100 text-yellow-800';
    if (status === 'พบแล้ว') return 'bg-green-100 text-green-800';
    if (status === 'รับคืนแล้ว') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">ค้นหา</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">ค้นหาของหาย</h1>

      {/* Search Section */}
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="ค้นหาสิ่งของ คำอธิบาย หรือสถานที่..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer">
          ค้นหา
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="ทั้งหมด">หมวดหมู่</option>
          {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedFaculty} 
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="ทั้งหมด">คณะ</option>
          {faculties.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedBuilding} 
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="ทั้งหมด">ตึก/อาคาร</option>
          {buildings.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedFloor} 
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="ทั้งหมด">ชั้น</option>
          {floors.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="ทั้งหมด">สถานะ</option>
          {statuses.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center cursor-pointer">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Popular Searches */}
      <div className="mb-10">
        <h3 className="text-gray-700 font-medium mb-3">ตัวอย่าง</h3>
        <div className="flex flex-wrap gap-2">
          {popularSearches?.map((term) => (
            <button
              key={term}
              onClick={() => handlePopularSearch(term)}
              className="bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-full px-4 py-2 text-sm transition cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ผลการค้นหา ({filteredItems.length} รายการ)</h2>
        <div className="flex flex-col space-y-4">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`}>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-6 cursor-pointer">
                {/* Left: Image */}
                <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                </div>

                {/* Middle: Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex flex-col space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{item.location} {item.locationDetail ? `(${item.locationDetail})` : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{item.dateLost} {item.timeLost && `เวลา ${item.timeLost}`}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                    <span>{item.reporterName || 'ไม่ระบุผู้แจ้ง'}</span>
                  </div>
                </div>

                {/* Right: Status */}
                <div className="flex items-start sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500">ไม่พบรายการที่ค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="flex justify-center items-center space-x-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 cursor-pointer">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium cursor-pointer">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 font-medium cursor-pointer">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 font-medium cursor-pointer">3</button>
          <span className="px-2 text-gray-500">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 font-medium cursor-pointer">6</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
