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

export default function NotificationSettingsScreen({ onBack, themeColor }: { onBack: () => void; themeColor: string; key?: string }) {
  const [settings, setSettings] = useState({
    all: true,
    auction: true,
    like: true,
    views: true,
    chat: true,
    review: true,
    payment: true,
    notice: true,
  });

  const [retention, setRetention] = useState('30일');

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">알림 설정</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="space-y-1">
            <p className="font-bold">전체 알림</p>
            <p className="text-[10px] text-gray-400">모든 알림을 켜거나 끕니다</p>
          </div>
          <button 
            onClick={() => toggle('all')}
            className={`w-12 h-6 rounded-full relative transition-colors ${settings.all ? 'bg-black' : 'bg-gray-200'}`}
          >
            <motion.div 
              animate={{ x: settings.all ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 px-2">보관 기간</p>
          <div className="flex space-x-2">
            {['7일', '30일', '무제한'].map((v) => (
              <button 
                key={v}
                onClick={() => setRetention(v)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${retention === v ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-bold text-gray-400 px-2">유형별 설정</p>
          {[
            { key: 'auction', label: '경매 알림', desc: '입찰, 낙찰, 추월, 마감 알림' },
            { key: 'like', label: '찜 알림', desc: '가격 인하, 마감 임박 알림' },
            { key: 'views', label: '조회수 증가 알림', desc: '내 상품의 조회수 증가 알림' },
            { key: 'chat', label: '채팅 알림', desc: '새로운 채팅 메시지 알림' },
            { key: 'review', label: '리뷰 알림', desc: '새로운 리뷰 등록 알림' },
            { key: 'payment', label: '결제 알림', desc: '결제 완료 및 영수증 알림' },
            { key: 'notice', label: '시스템 공지', desc: '서비스 업데이트 및 공지사항' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
              <button 
                onClick={() => toggle(item.key as keyof typeof settings)}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-black' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings[item.key as keyof typeof settings] ? 20 : 4 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
