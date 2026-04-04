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

export default function BidPlacementCompleteScreen({ 
  productName, 
  sellerName, 
  bidAmount, 
  remainingTime, 
  productId,
  onBrowseOther, 
  onProductDetail, 
  themeColor 
}: { 
  productName: string; 
  sellerName: string; 
  bidAmount: number; 
  remainingTime: string; 
  productId: number;
  onBrowseOther: () => void; 
  onProductDetail: () => void; 
  themeColor: string; 
  key?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <h1 className="flex-1 text-center font-bold text-lg">입찰 완료</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
          <Check size={48} strokeWidth={3} />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">입찰 완료!</h2>
          <p className="text-gray-500">성공적으로 입찰이 접수되었습니다.</p>
        </div>

        <div className="w-full bg-gray-50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
              <img src={`https://picsum.photos/seed/${productId}/200/200`} alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">내 입찰가</p>
              <p className="text-xl font-black">₩{bidAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">상품명</span>
              <span className="font-bold truncate max-w-[180px]">{productName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">판매자</span>
              <span className="font-bold">{sellerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">남은 시간</span>
              <span className="font-bold text-red-500">{remainingTime}</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 pt-4">
          <button 
            onClick={onBrowseOther}
            className="w-full h-16 bg-black text-white font-bold rounded-2xl text-lg shadow-lg active:scale-[0.98] transition-all"
          >
            다른 상품 둘러보기
          </button>
          <button 
            onClick={onProductDetail}
            className="w-full h-16 bg-gray-100 text-gray-900 font-bold rounded-2xl active:scale-[0.98] transition-all"
          >
            상품 상세보기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
