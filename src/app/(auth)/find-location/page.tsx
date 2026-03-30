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

export default function FindLocationScreen({ onBack, onComplete }: { onBack: () => void; onComplete: (location: string) => void; key?: string }) {
  const [isLocating, setIsLocating] = useState(true);
  const [location, setLocation] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocating(false);
      setLocation('서울특별시 강남구 역삼동');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">현재 위치 찾기</h1>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6">
        {isLocating ? (
          <>
            <div className="w-24 h-24 bg-[#98E446]/10 rounded-full flex items-center justify-center animate-pulse">
              <Search size={40} className="text-[#98E446]" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">현재 위치를 찾고 있어요</h2>
              <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-[#98E446]/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">📍</span>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">위치를 찾았습니다!</h2>
              <p className="text-lg text-[#98E446] font-medium">{location}</p>
              <p className="text-sm text-gray-500 mt-2">이 동네로 설정하시겠어요?</p>
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        <button 
          onClick={() => onComplete(location)} 
          disabled={isLocating}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${isLocating ? 'bg-gray-200 text-gray-400' : 'bg-[#98E446] hover:bg-[#87d335] text-black'}`}
        >
          이 동네로 설정하기
        </button>
      </div>
    </motion.div>
  );
}
