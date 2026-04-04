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

export default function PaymentScreen({ showToast, onBack, onComplete, themeColor }: { showToast: (msg: string) => void; onBack: () => void; onComplete: () => void; themeColor: string; key?: string }) {
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'direct'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'bidpay' | 'card' | 'simple'>('bidpay');
  const [simplePaymentType, setSimplePaymentType] = useState<'kakao' | 'naver' | 'toss'>('kakao');
  
  const currentPrice = 850000;
  const shippingFee = deliveryMethod === 'delivery' ? 3000 : 0;
  const totalPrice = currentPrice + shippingFee;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-gray-50 h-full relative"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">결제하기</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Product Info */}
        <div className="bg-white p-6 mb-2">
          <h2 className="font-bold mb-4">주문 상품</h2>
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
              <img src={`https://picsum.photos/seed/product/200/200`} alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-medium text-sm mb-1 line-clamp-2">아이폰 14 Pro 256GB 딥퍼플</p>
              <p className="font-bold text-lg">₩{currentPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white p-6 mb-2 space-y-4">
          <h2 className="font-bold">거래 방식</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setDeliveryMethod('delivery')}
              className={`flex-1 h-12 rounded-xl text-sm font-bold border transition-all ${deliveryMethod === 'delivery' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
            >
              택배배송
            </button>
            <button 
              onClick={() => setDeliveryMethod('direct')}
              className={`flex-1 h-12 rounded-xl text-sm font-bold border transition-all ${deliveryMethod === 'direct' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
            >
              직거래
            </button>
          </div>

          {deliveryMethod === 'delivery' ? (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">배송지 정보</label>
                <button className="text-xs text-gray-500 underline">변경</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-sm">비드마스터</span>
                  <span className="text-xs text-gray-400">010-1234-5678</span>
                </div>
                <p className="text-sm text-gray-600">서울특별시 강남구 역삼동 123-45</p>
                <p className="text-sm text-gray-600">101동 202호</p>
              </div>
              <div className="pt-2">
                <select className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-black">
                  <option>배송 요청사항을 선택해주세요</option>
                  <option>문 앞에 놓아주세요</option>
                  <option>경비실에 맡겨주세요</option>
                  <option>배송 전 연락주세요</option>
                  <option>직접 입력</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <label className="text-sm font-bold text-gray-700">직거래 장소</label>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-sm">서울 강남구</span>
                </div>
                <p className="text-xs text-gray-500">상세 장소는 채팅으로 협의 가능합니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 mb-2 space-y-4">
          <h2 className="font-bold">결제 수단</h2>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setPaymentMethod('bidpay')}
              className={`h-12 border rounded-xl text-xs font-bold transition-all ${paymentMethod === 'bidpay' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
            >
              비드페이
            </button>
            <button 
              onClick={() => setPaymentMethod('simple')}
              className={`h-12 border rounded-xl text-xs font-bold transition-all ${paymentMethod === 'simple' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
            >
              간편결제
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`h-12 border rounded-xl text-xs font-bold transition-all ${paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
            >
              신용카드
            </button>
          </div>

          {paymentMethod === 'simple' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-3 gap-2 pt-2"
            >
              <button 
                onClick={() => setSimplePaymentType('kakao')}
                className={`h-10 rounded-lg text-[10px] font-bold transition-all ${simplePaymentType === 'kakao' ? 'bg-[#FEE500] text-[#3C1E1E]' : 'bg-gray-50 text-gray-400'}`}
              >
                카카오페이
              </button>
              <button 
                onClick={() => setSimplePaymentType('naver')}
                className={`h-10 rounded-lg text-[10px] font-bold transition-all ${simplePaymentType === 'naver' ? 'bg-[#03C75A] text-white' : 'bg-gray-50 text-gray-400'}`}
              >
                네이버페이
              </button>
              <button 
                onClick={() => setSimplePaymentType('toss')}
                className={`h-10 rounded-lg text-[10px] font-bold transition-all ${simplePaymentType === 'toss' ? 'bg-[#0064FF] text-white' : 'bg-gray-50 text-gray-400'}`}
              >
                토스페이
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 space-y-4">
          <h2 className="font-bold">결제 금액</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">낙찰 금액</span>
              <span>₩{currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">배송비</span>
              <span>{shippingFee === 0 ? '무료' : `+₩${shippingFee.toLocaleString()}`}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold">총 결제 금액</span>
            <span className="text-xl font-bold" style={{ color: themeColor }}>₩{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
        <button 
          onClick={() => {
            const methodText = paymentMethod === 'simple' ? `${simplePaymentType === 'kakao' ? '카카오페이' : simplePaymentType === 'naver' ? '네이버페이' : '토스페이'}` : paymentMethod === 'bidpay' ? '비드페이' : '신용카드';
            const deliveryText = deliveryMethod === 'delivery' ? '배송' : '직거래';
            showToast(`${methodText}로 ${deliveryText} 구매 결제가 완료되었습니다.`);
            onComplete();
          }} 
          className="w-full h-14 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]" 
          style={{ backgroundColor: themeColor }}
        >
          {totalPrice.toLocaleString()}원 결제하기
        </button>
      </div>
    </motion.div>
  );
}
