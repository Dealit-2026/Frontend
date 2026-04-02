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

export default function PhoneAuthScreen({ showToast, onBack, onComplete }: { showToast: (msg: string) => void; onBack: () => void; onComplete: () => void; key?: string }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isPhoneValid = phone.length >= 10;
  const isCodeValid = code.length === 6;

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
        <h1 className="flex-1 text-center font-bold text-lg">휴대폰 인증</h1>
        <button onClick={onComplete} className="text-sm font-medium text-gray-400 px-2">건너뛰기</button>
      </div>

      <div className="flex-1 px-8 py-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Check size={40} className="text-[#141414]" strokeWidth={3} />
        </motion.div>

        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xl font-bold">본인 인증이 필요해요</h2>
          <p className="text-sm text-gray-400">
            안전한 거래를 위해<br />
            본인 인증을 진행합니다
          </p>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">휴대폰 번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="010-0000-0000"
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
              maxLength={11}
            />
            <button 
              onClick={() => {
                setIsSent(true);
                showToast('인증번호 발송');
              }} 
              disabled={!isPhoneValid}
              className={`w-full h-12 border rounded-lg text-sm font-medium transition-colors ${
                isPhoneValid 
                  ? 'border-[#98E446] text-[#98E446] hover:bg-[#98E446]/5' 
                  : 'border-gray-200 text-gray-300'
              } mt-2`}
            >
              {isSent ? '인증번호 재발송' : '인증번호 받기'}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">인증번호</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="6자리 입력"
                className="flex-1 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
                maxLength={6}
              />
              <div className="w-20 h-12 border border-gray-100 rounded-lg flex items-center justify-center text-[#98E446] font-bold">
                3:00
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button 
          onClick={onComplete}
          disabled={!isCodeValid}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            isCodeValid 
              ? 'bg-[#98E446] hover:bg-[#87d335] text-black' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          인증 완료
        </button>
      </div>
    </motion.div>
  );
}
