"use client";
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  ChevronRight, 
  User, 
  Camera, 
  Search, 
  Home, 
  PlusCircle, 
  MessageCircle, 
  Heart, 
  Bell, 
  Filter, 
  Settings,
  MoreVertical, 
  Send, 
  Star,
  Clock,
  ArrowUpRight,
  X,
  Trash2,
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Menu,
  ShoppingBag,
  Store,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Screen, Tab } from '../../../../types/index';
import { ExploreIcon } from '../../../../components/common/ExploreIcon';

export default function PurchaseHistoryScreen({ onBack, themeColor }: { onBack: () => void; themeColor: string; key?: string }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const purchases = [
    { 
      id: 'ORD-20260325-01', 
      date: '2026.03.25 14:30', 
      item: '빈티지 데님 자켓', 
      price: 45000, 
      status: '배송완료',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=200',
      history: [
        { time: '2026.03.21 10:00', action: '입찰 참여', detail: '40,000원' },
        { time: '2026.03.23 18:00', action: '낙찰 성공', detail: '45,000원' },
        { time: '2026.03.23 18:30', action: '결제 완료', detail: '신용카드' },
        { time: '2026.03.24 14:00', action: '상품 발송', detail: 'CJ대한통운' },
        { time: '2026.03.25 14:30', action: '배송 완료', detail: '수령 완료' },
      ]
    },
    { 
      id: 'ORD-20260320-02', 
      date: '2026.03.20 09:15', 
      item: '나이키 에어포스 1', 
      price: 120000, 
      status: '구매확정',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=200',
      history: [
        { time: '2026.03.18 11:00', action: '즉시 구매', detail: '120,000원' },
        { time: '2026.03.18 11:05', action: '결제 완료', detail: '카카오페이' },
        { time: '2026.03.19 10:00', action: '상품 발송', detail: '우체국택배' },
        { time: '2026.03.20 09:15', action: '배송 완료', detail: '수령 완료' },
        { time: '2026.03.20 09:20', action: '구매 확정', detail: '포인트 적립 완료' },
      ]
    },
    { 
      id: 'ORD-20260315-03', 
      date: '2026.03.15 18:45', 
      item: '애플워치 스트랩', 
      price: 25000, 
      status: '구매확정',
      image: 'https://images.unsplash.com/photo-1558126311-86ea32cb3c58?auto=format&fit=crop&q=80&w=200',
      history: [
        { time: '2026.03.13 14:00', action: '즉시 구매', detail: '25,000원' },
        { time: '2026.03.13 14:02', action: '결제 완료', detail: '네이버페이' },
        { time: '2026.03.14 11:30', action: '상품 발송', detail: '로젠택배' },
        { time: '2026.03.15 18:45', action: '배송 완료', detail: '수령 완료' },
        { time: '2026.03.15 19:00', action: '구매 확정', detail: '리뷰 작성 완료' },
      ]
    },
  ];

  if (selectedItem) {
    return (
      <div className="flex-1 flex flex-col bg-gray-100 h-full">
        <div className="h-14 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => setSelectedItem(null)} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2">거래 상세 내역</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          <div className="w-full max-w-md bg-white shadow-sm relative overflow-hidden">
            {/* Jagged top edge effect */}
            <div className="w-full h-3 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle at 6px 0, transparent 6px, white 7px)', backgroundSize: '12px 12px' }}></div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-widest text-gray-800">RECEIPT</h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">TRANSACTION DETAILS</p>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mb-6"></div>

              <div className="flex flex-col items-center mb-6">
                <img src={selectedItem.image} alt={selectedItem.item} className="w-20 h-20 object-cover rounded-lg mb-4" />
                <span className="font-medium text-gray-800 text-lg text-center">{selectedItem.item}</span>
                <span className="font-bold text-xl mt-1">{selectedItem.price.toLocaleString()}원</span>
                <span className="text-xs font-medium mt-2 px-2 py-1 bg-gray-100 rounded-md" style={{ color: themeColor }}>{selectedItem.status}</span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mb-6"></div>
              
              <div className="mb-2 text-xs font-bold text-gray-400 tracking-wider">HISTORY</div>
              <div className="space-y-4">
                {selectedItem.history.map((hist: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-mono">{hist.time}</span>
                      <span className="font-medium text-sm text-gray-800">{hist.action}</span>
                    </div>
                    <span className="text-sm font-bold">{hist.detail}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mt-6 mb-6"></div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono">ORDER ID</span>
                <span className="font-mono">{selectedItem.id}</span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 mt-6 mb-6"></div>

              <div className="text-center flex flex-col items-center space-y-3">
                <p className="text-[10px] text-gray-400 font-mono tracking-widest">THANK YOU</p>
                {/* Barcode mock */}
                <div className="h-12 w-full flex justify-center space-x-0.5 opacity-60">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="bg-black h-full" style={{ width: `${Math.random() * 3 + 1}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Jagged bottom edge effect */}
            <div className="w-full h-3 bg-repeat-x rotate-180" style={{ backgroundImage: 'radial-gradient(circle at 6px 0, transparent 6px, white 7px)', backgroundSize: '12px 12px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      <div className="h-14 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">구매 내역</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 font-mono">{purchase.date}</span>
              <span className="text-xs font-medium" style={{ color: themeColor }}>{purchase.status}</span>
            </div>
            <div className="flex space-x-4">
              <img src={purchase.image} alt={purchase.item} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
              <div className="flex-1 flex flex-col justify-center">
                <span className="font-medium text-gray-800 line-clamp-1">{purchase.item}</span>
                <span className="font-bold mt-1">{purchase.price.toLocaleString()}원</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedItem(purchase)}
              className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <span>자세히 보기</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
