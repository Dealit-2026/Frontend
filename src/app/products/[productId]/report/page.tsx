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

export default function ReportScreen({ productId, onBack, themeColor, showToast }: { productId: number | null; onBack: () => void; themeColor: string; showToast: (msg: string) => void; key?: string }) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  
  const reasons = [
    '부적절한 상품 (가품, 불법 등)',
    '사기 의심 (직거래 유도 등)',
    '허위 매물 / 중복 게시물',
    '전문 판매업자 의심',
    '욕설 / 비하 발언',
    '기타'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-50">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">신고하기</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {/* Product Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
            <img src={`https://picsum.photos/seed/${productId}/200/200`} alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">신고 대상 상품</p>
            <h3 className="font-bold text-sm truncate">아이폰 14 Pro 256GB 딥퍼플</h3>
            <p className="text-xs font-bold mt-1 text-black">₩1,250,000</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">신고 사유를 선택해주세요</h3>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full p-4 text-left rounded-2xl border transition-all ${
                  selectedReason === reason 
                    ? 'border-red-500 bg-red-50 text-red-600 font-bold' 
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">상세 내용 (선택)</h3>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="신고 사유에 대한 구체적인 내용을 입력해주세요."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            • 신고하신 내용은 운영팀에서 검토 후 조치됩니다.
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            • 허위 신고일 경우 서비스 이용이 제한될 수 있습니다.
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-gray-50">
        <button
          disabled={!selectedReason}
          onClick={() => {
            showToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
            onBack();
          }}
          className={`w-full h-14 rounded-2xl font-bold transition-all ${
            selectedReason 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:opacity-90' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          신고하기
        </button>
      </div>
    </motion.div>
  );
}
