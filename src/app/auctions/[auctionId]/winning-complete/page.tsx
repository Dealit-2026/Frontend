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

export default function WinningBidCompletionScreen({ onBack, onPaymentClick, themeColor }: { onBack: () => void; onPaymentClick: () => void; themeColor: string; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">낙찰 완료</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <Star size={48} fill="currentColor" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">축하합니다!</h2>
          <p className="text-gray-500">맥북 에어 M2 경매에 최종 낙찰되었습니다.</p>
        </div>

        <div className="w-full bg-gray-50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
              <img src="https://picsum.photos/seed/p2/200/200" alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">최종 낙찰가</p>
              <p className="text-xl font-black">₩1,250,000</p>
            </div>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">판매자</span>
              <span className="font-bold">맥매니아</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">거래 방식</span>
              <span className="font-bold">직거래 / 택배</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={onPaymentClick}
            className="w-full h-16 bg-black text-white font-bold rounded-2xl text-lg shadow-lg"
          >
            결제하러 가기
          </button>
          <button 
            onClick={onBack}
            className="w-full h-16 bg-gray-100 text-gray-500 font-bold rounded-2xl"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
