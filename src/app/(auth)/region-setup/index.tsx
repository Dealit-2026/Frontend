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

import { Screen, Tab } from '../../../types/index';
import { ExploreIcon } from '../../../components/common/ExploreIcon';

export default function RegionSetupScreen({ onBack, onNext, onFindLocation, currentLocation }: { onBack: () => void; onNext: () => void; onFindLocation: () => void; currentLocation?: string; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">지역 설정</h1>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-[#98E446]/10 rounded-full flex items-center justify-center">
          <span className="text-4xl">🚩</span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">내 동네 설정하기</h2>
          <p className="text-sm text-gray-500">
            경매 물품을 거래할 동네를 설정해 주세요.<br />
            설정한 동네의 물품을 먼저 보여드려요.
          </p>
        </div>

        {currentLocation && (
          <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#98E446]/20 rounded-full flex items-center justify-center">
                <Home size={16} className="text-[#98E446]" />
              </div>
              <span className="font-bold text-sm">{currentLocation}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold">현재 설정됨</span>
          </div>
        )}
        
        <button onClick={onFindLocation} className="w-full h-14 bg-[#98E446] hover:bg-[#87d335] text-white font-bold rounded-xl transition-colors">
          현재 위치로 찾기
        </button>
        
        <div className="w-full relative">
          <input
            type="text"
            placeholder="동네 이름으로 탐색 (ex. 역삼동)"
            className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
          />
        </div>
      </div>

      <div className="p-6">
        <button 
          onClick={onNext} 
          disabled={!currentLocation}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            currentLocation 
              ? 'bg-[#98E446] hover:bg-[#87d335] text-black' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentLocation ? '수정 완료' : '다음'}
        </button>
      </div>
    </motion.div>
  );
}
