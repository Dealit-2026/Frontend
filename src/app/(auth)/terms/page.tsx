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

export default function TermsAgreementScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void; key?: string }) {
  const [showDummy, setShowDummy] = useState(false);
  const [agreements, setAgreements] = useState([false, false, false, false]);

  const terms = [
    "(필수) 서비스 이용약관",
    "(필수) 개인정보 처리방침",
    "(필수) 위치기반 서비스 이용약관",
    "(선택) 마케팅 정보 수신 동의"
  ];

  const handleAllCheck = (checked: boolean) => {
    setAgreements([checked, checked, checked, checked]);
  };

  const handleCheck = (index: number, checked: boolean) => {
    const newAgreements = [...agreements];
    newAgreements[index] = checked;
    setAgreements(newAgreements);
  };

  const isAllChecked = agreements.every(Boolean);
  const isRequiredChecked = agreements[0] && agreements[1] && agreements[2];

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
        <h1 className="flex-1 text-center font-bold text-lg mr-10">약관 동의</h1>
      </div>

      <div className="flex-1 px-8 py-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">서비스 이용을 위해</h2>
          <p className="text-gray-400">약관에 동의해주세요</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 flex items-center space-x-4 cursor-pointer" onClick={() => handleAllCheck(!isAllChecked)}>
          <input 
            type="checkbox" 
            checked={isAllChecked}
            onChange={(e) => handleAllCheck(e.target.checked)}
            className="w-6 h-6 rounded-md border-gray-300 text-[#98E446] focus:ring-[#98E446]" 
          />
          <span className="font-bold text-lg">전체 동의</span>
        </div>

        <div className="space-y-4 px-2">
          {terms.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreements[idx]}
                  onChange={(e) => handleCheck(idx, e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#98E446] focus:ring-[#98E446]" 
                />
                <span className="text-gray-600">{item}</span>
              </label>
              <button onClick={() => setShowDummy(true)} className="p-1 text-gray-300 hover:text-gray-600">
                <ChevronRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showDummy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xs space-y-4">
            <h3 className="font-bold text-lg">상세 약관 내용</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              여기에 상세 약관 내용이 들어갑니다. 이용약관에 대한 자세한 설명과 법적 고지 사항들이 포함될 예정입니다.
            </p>
            <button 
              onClick={() => setShowDummy(false)}
              className="w-full py-3 bg-gray-100 rounded-xl font-bold"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        <button 
          onClick={onNext}
          disabled={!isRequiredChecked}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${isRequiredChecked ? 'bg-[#98E446] hover:bg-[#87d335] text-black' : 'bg-gray-200 text-gray-400'}`}
        >
          다음
        </button>
      </div>
    </motion.div>
  );
}
