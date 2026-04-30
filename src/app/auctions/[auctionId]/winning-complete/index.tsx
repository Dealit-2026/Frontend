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
          <p className="text-gray-500">낙찰된 경매 상품이 없습니다.</p>
        </div>

        <div className="w-full rounded-3xl border border-dashed border-gray-200 p-8 text-center text-sm font-medium text-gray-400">
          낙찰 완료 데이터가 없습니다
        </div>

        <div className="w-full space-y-3">
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
