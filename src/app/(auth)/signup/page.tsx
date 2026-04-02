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

export default function SignupScreen({ showToast, onBack, onNext }: { showToast: (msg: string) => void; onBack: () => void; onNext: () => void; key?: string }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: ''
  });

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 8;
  };

  const isFormValid = 
    formData.userId.trim() !== '' &&
    isPasswordValid(formData.password) &&
    formData.password === formData.confirmPassword &&
    isEmailValid(formData.email) &&
    formData.name.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">회원가입</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold">아이디</label>
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="아이디 입력"
              className="flex-1 min-w-0 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
            <button onClick={() => showToast('중복 확인')} className="whitespace-nowrap px-4 h-12 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shrink-0">
              중복확인
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">비밀번호</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="8자 이상 입력"
            className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
          />
          <p className="text-[10px] text-gray-400">영문, 숫자, 특수문자 조합</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">비밀번호 확인</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="비밀번호 재입력"
            className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-[10px] text-red-500">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@email.com"
            className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">이름</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="실명 입력"
            className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <button 
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            isFormValid 
              ? 'bg-[#98E446] hover:bg-[#87d335] text-black' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </motion.div>
  );
}
