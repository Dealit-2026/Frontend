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

export default function FindPasswordScreen({ showToast, onBack }: { showToast: (msg: string) => void; onBack: () => void; key?: string }) {
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isVerified, setIsVerified] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSent && timeLeft > 0 && !isVerified) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSent, timeLeft, isVerified]);

  const handleSendCode = () => {
    setIsSent(true);
    setTimeLeft(180);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
        <h1 className="flex-1 text-center font-bold text-lg mr-10">비밀번호 찾기</h1>
      </div>

      <div className="flex-1 px-8 py-8 flex flex-col">
        {!isVerified ? (
          <div className="space-y-6">
            <p className="text-gray-600 text-sm">가입 시 등록한 휴대폰 번호를 입력해주세요.</p>
            <div className="space-y-2">
              <label className="text-sm font-bold">휴대폰 번호</label>
              <div className="flex space-x-2 w-full">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="숫자만 입력"
                  className="flex-1 h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
                  maxLength={11}
                />
                <button 
                  onClick={handleSendCode}
                  disabled={phone.length < 10}
                  className={`px-4 h-12 rounded-xl font-bold whitespace-nowrap transition-colors ${phone.length >= 10 ? 'bg-[#98E446] text-black hover:bg-[#87d335]' : 'bg-gray-200 text-gray-400'}`}
                >
                  {isSent ? '재전송' : '인증요청'}
                </button>
              </div>
            </div>

            {isSent && (
              <div className="space-y-2">
                <label className="text-sm font-bold">인증번호</label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="인증번호 6자리 입력"
                    className="w-full h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all pr-16"
                    maxLength={6}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F64257] font-medium text-sm">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}

            <button 
              onClick={() => setIsVerified(true)}
              disabled={!isSent || code.length < 6 || timeLeft === 0}
              className={`w-full h-14 rounded-xl font-bold mt-8 transition-colors ${isSent && code.length >= 6 && timeLeft > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}
            >
              인증 확인
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="text-center space-y-2 mt-4">
              <h2 className="text-xl font-bold">새 비밀번호 설정</h2>
              <p className="text-gray-600 text-sm">새롭게 사용할 비밀번호를 입력해주세요.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">새 비밀번호</label>
                <input
                  type="password"
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  className="w-full h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">새 비밀번호 확인</label>
                <input
                  type="password"
                  placeholder="비밀번호 다시 입력"
                  className="w-full h-12 bg-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#98E446] transition-all"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                showToast('비밀번호가 성공적으로 변경되었습니다.');
                onBack();
              }}
              className="w-full h-14 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors mt-auto"
            >
              비밀번호 변경 완료
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
