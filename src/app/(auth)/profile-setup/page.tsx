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

export default function ProfileSetupScreen({ showToast, onBack, onComplete }: { showToast: (msg: string) => void; onBack: () => void; onComplete: () => void; key?: string }) {
  const [nickname, setNickname] = useState('비드마스터');
  const [bio, setBio] = useState('안녕하세요! 비드마스터입니다. 좋은 거래 부탁드려요.');

  const isFormValid = nickname.trim().length >= 2;

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
        <h1 className="flex-1 text-center font-bold text-lg mr-10">프로필 설정</h1>
      </div>

      <div className="flex-1 px-8 py-10 space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
              <img src="https://picsum.photos/seed/me/200/200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#98E446] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Camera size={20} className="text-black" />
            </button>
          </div>
          <span className="text-sm font-medium text-gray-400">프로필 사진 수정</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">닉네임</label>
            <div className="flex space-x-2 w-full">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력 (2-10자)"
                className="flex-1 min-w-0 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
              />
              <button onClick={() => showToast('중복 확인')} className="whitespace-nowrap px-4 h-12 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shrink-0">
                중복확인
              </button>
            </div>
            <p className="text-xs text-gray-400">다른 사람에게 보여질 이름이에요</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">소개</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요 (선택)"
              className="w-full h-32 bg-gray-100 rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#98E446] resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button 
          onClick={onComplete}
          disabled={!isFormValid}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            isFormValid 
              ? 'bg-[#98E446] hover:bg-[#87d335] text-black' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          완료
        </button>
      </div>
    </motion.div>
  );
}
