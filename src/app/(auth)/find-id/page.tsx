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

export default function FindIdScreen({ showToast, onBack }: { showToast: (msg: string) => void; onBack: () => void; key?: string }) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

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
        <h1 className="flex-1 text-center font-bold text-lg mr-10">아이디 찾기</h1>
      </div>

      <div className="flex-1 px-8 py-8 flex flex-col">
        {!isVerified ? (
          <div className="space-y-6">
            <p className="text-gray-600 text-sm">가입 시 등록한 이메일 주소를 입력해주세요.</p>
            <div className="space-y-2">
              <label className="text-sm font-bold">이메일</label>
              <div className="flex space-x-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                  className="flex-1 h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
                />
                <button 
                  onClick={() => setIsSent(true)}
                  disabled={!email}
                  className={`px-4 h-12 rounded-xl font-bold whitespace-nowrap transition-colors ${email ? 'bg-[#98E446] text-black hover:bg-[#87d335]' : 'bg-gray-200 text-gray-400'}`}
                >
                  {isSent ? '재전송' : '인증요청'}
                </button>
              </div>
            </div>

            {isSent && (
              <div className="space-y-2">
                <label className="text-sm font-bold">인증번호</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증번호 6자리 입력"
                  className="w-full h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
                  maxLength={6}
                />
              </div>
            )}

            <button 
              onClick={() => setIsVerified(true)}
              disabled={!isSent || code.length < 6}
              className={`w-full h-14 rounded-xl font-bold mt-8 transition-colors ${isSent && code.length >= 6 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}
            >
              인증 확인
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-[#98E446]/20 rounded-full flex items-center justify-center">
              <Check size={32} className="text-[#98E446]" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">아이디 찾기 성공</h2>
              <p className="text-gray-600">회원님의 아이디는 아래와 같습니다.</p>
            </div>
            <div className="w-full bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <span className="text-xl font-bold tracking-wider">user123**</span>
            </div>
            <button 
              onClick={onBack}
              className="w-full h-14 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors mt-4"
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
