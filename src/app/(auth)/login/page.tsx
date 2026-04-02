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

export default function LoginScreen({ showToast, onNavigateSignup, onNavigateFindId, onNavigateFindPassword, onLogin }: { showToast: (msg: string) => void; onNavigateSignup: () => void; onNavigateFindId: () => void; onNavigateFindPassword: () => void; onLogin: () => void; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 flex flex-col px-8 pt-32 pb-10"
    >
      <div className="flex justify-center mb-20">
        <img 
          src="https://i.ibb.co/FLydFL1L/2026-03-22-201249.png" 
          alt="Deal it Logo" 
          className="h-24 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        <input
          type="text"
          placeholder="아이디"
          className="w-full h-14 bg-gray-100 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full h-14 bg-gray-100 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
        />
        
        <button 
          onClick={onLogin}
          className="w-full h-14 bg-[#98E446] hover:bg-[#87d335] text-black font-bold rounded-xl mt-2 transition-colors"
        >
          로그인
        </button>

        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 mt-2">
          <button onClick={onNavigateFindId} className="hover:text-black">아이디 찾기</button>
          <span className="w-px h-3 bg-gray-300"></span>
          <button onClick={onNavigateFindPassword} className="hover:text-black">비밀번호 찾기</button>
          <span className="w-px h-3 bg-gray-300"></span>
          <button onClick={onNavigateSignup} className="hover:text-black">회원가입</button>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">소셜 로그인</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button onClick={() => showToast('카카오 로그인')} className="w-full h-14 bg-[#FEE500] hover:bg-[#fada0a] text-black font-bold rounded-xl flex items-center justify-center transition-colors">
          카카오 로그인
        </button>
        <button onClick={() => showToast('네이버 로그인')} className="w-full h-14 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold rounded-xl flex items-center justify-center transition-colors">
          네이버 로그인
        </button>
        <button onClick={() => showToast('구글 로그인')} className="w-full h-14 bg-white border border-gray-200 hover:bg-gray-50 text-black font-medium rounded-xl flex items-center justify-center transition-colors">
          구글로 시작하기
        </button>
      </div>
    </motion.div>
  );
}
