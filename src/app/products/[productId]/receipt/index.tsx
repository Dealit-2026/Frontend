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

export default function ReceiptScreen({ onBack, onWriteReview, themeColor }: { onBack: () => void; onWriteReview: () => void; themeColor: string; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col bg-gray-50"
    >
      <div className="h-16 flex items-center px-4 justify-between">
        <button onClick={onBack} className="p-2"><X size={24} /></button>
        <h1 className="font-bold text-lg">결제 영수증</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check size={32} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">결제가 완료되었습니다</h2>
                <p className="text-sm text-gray-400">2026.03.22 13:00</p>
              </div>
            </div>

            <div className="h-px bg-dashed bg-gray-100"></div>

            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50">
                <img src="https://picsum.photos/seed/p1/200/200" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-gray-400">상품명</p>
                <p className="font-bold">아이폰 14 Pro 256GB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제 금액</span>
                <span className="font-black text-lg">₩850,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">거래 상태</span>
                <span className="font-bold text-green-600">완료</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">판매자</span>
                <span className="font-bold">비드마스터 (99.9%)</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button 
                onClick={onBack}
                className="w-full h-14 bg-black text-white font-bold rounded-2xl"
              >
                확인
              </button>
              <button 
                onClick={onWriteReview}
                className="w-full h-14 bg-white border border-gray-200 text-black font-bold rounded-2xl"
              >
                리뷰 작성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
