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

export default function ProductDetailScreen({ 
  productId, 
  onBack,
  onBidStatusClick,
  onChatClick,
  onReportClick,
  onPurchaseClick,
  themeColor,
  mode,
  showToast,
  onBidComplete
}: { 
  productId: number | null; 
  onBack: () => void;
  onBidStatusClick: () => void;
  onChatClick: () => void;
  onReportClick: () => void;
  onBidComplete: (data: { productId: number; productName: string; sellerName: string; bidAmount: number; remainingTime: string }) => void;
  onPurchaseClick?: () => void;
  themeColor: string;
  mode: 'regular' | 'auction';
  showToast: (msg: string) => void;
  key?: string;
}) {
  const [showBidSheet, setShowBidSheet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(850000);
  const [bidCount, setBidCount] = useState(23);
  const [inputBidAmount, setInputBidAmount] = useState(860000);
  const isRegular = mode === 'regular';
  const bidUnit = 10000;
  const minBidAmount = currentPrice + bidUnit;

  useEffect(() => {
    if (showBidSheet) {
      setInputBidAmount(currentPrice + bidUnit);
    }
  }, [showBidSheet, currentPrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex-1 flex flex-col relative h-full overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 justify-between z-10">
        <button onClick={onBack} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setIsLiked(!isLiked);
              if (!isLiked) showToast('관심 목록에 추가되었습니다.');
            }}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart size={20} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "currentColor"} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
            >
              <MoreVertical size={20} />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <button 
                  onClick={() => {
                    setShowMoreMenu(false);
                    onReportClick();
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-gray-50"
                >
                  신고하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="aspect-square bg-gray-100">
          <img src={`https://picsum.photos/seed/${productId}/600/600`} alt="Product" className="w-full h-full object-cover" />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-white text-[10px] font-bold rounded" style={{ backgroundColor: themeColor }}>
                {isRegular ? '일반 판매' : '진행중'}
              </span>
              <span className="text-xs text-gray-400">전자제품</span>
            </div>
            <h2 className="text-xl font-bold">아이폰 14 Pro 256GB 딥퍼플</h2>
            
            <div 
              className={`rounded-2xl p-6 space-y-2 cursor-pointer transition-transform active:scale-[0.98] ${!isRegular ? 'hover:brightness-95' : ''}`}
              style={{ backgroundColor: `${themeColor}10` }}
              onClick={() => !isRegular && onBidStatusClick()}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: themeColor }}>{isRegular ? '판매가' : '현재가'}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold" style={{ color: themeColor }}>₩{currentPrice.toLocaleString()}</span>
                  {!isRegular && <ChevronRight size={20} style={{ color: themeColor }} />}
                </div>
              </div>
              
              {isRegular ? (
                <div className="flex items-center space-x-4 text-xs text-gray-400 pt-1">
                  <div className="flex items-center space-x-1">
                    <Eye size={12} />
                    <span>조회 128</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={12} />
                    <span>채팅 5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart size={12} />
                    <span>찜 {isLiked ? 13 : 12}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>입찰 {bidCount}회</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>2시간 35분 남음</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div 
            className="flex items-center justify-between py-4 border-y border-gray-50 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded-xl transition-colors"
            onClick={() => setShowSellerProfile(true)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                <img src="https://picsum.photos/seed/seller/100/100" alt="Seller" />
              </div>
              <div>
                <p className="font-bold text-sm">판매자123</p>
                <div className="flex items-center space-x-1 text-[10px] text-gray-400">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span>4.8 (거래 34회)</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium">프로필</button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">상품 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">상태</span>
                <span>중고 A급 (거의 새것)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">거래지역</span>
                <span>서울 강남구</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">배송비</span>
                <span>착불</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pt-2">
              아이폰 14 Pro 256GB 딥퍼플 색상입니다. 구매한지 6개월 정도 되었고 항상 케이스와 필름을 부착하여 상태 매우 깨끗합니다. 배터리 효율은 98%이며 모든 기능 정상 작동합니다. 박스와 구성품 모두 포함된 풀박스 구성입니다. 직거래는 강남역 인근에서 가능하며 택배 거래 시 배송비는 별도입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center px-6 space-x-3">
        {isRegular ? (
          <>
            <button 
              onClick={onChatClick} 
              className="w-14 h-14 bg-gray-100 text-gray-900 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle size={24} />
            </button>
            <button 
              onClick={onPurchaseClick} 
              className="flex-1 h-14 text-white font-bold rounded-xl transition-colors shadow-lg" 
              style={{ backgroundColor: themeColor }}
            >
              구매하기
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={onChatClick} 
              className="w-14 h-14 bg-gray-100 text-gray-900 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle size={24} />
            </button>
            <button 
              onClick={() => setShowBidSheet(true)} 
              className="flex-1 h-14 text-white font-bold rounded-xl transition-colors shadow-lg" 
              style={{ backgroundColor: themeColor, shadowColor: `${themeColor}40` }}
            >
              입찰하기
            </button>
          </>
        )}
      </div>

      {/* Bid Sheet */}
      <AnimatePresence>
        {showBidSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBidSheet(false)}
              className="absolute inset-0 bg-black/50 z-20"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-30 p-8 space-y-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold">입찰하기</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">현재가</span>
                    <span className="font-bold">₩{currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">입찰 단위</span>
                    <span className="font-bold">₩10,000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">입찰가 입력</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={inputBidAmount} 
                        onChange={(e) => setInputBidAmount(Number(e.target.value))}
                        className="w-full h-14 bg-gray-100 rounded-xl px-5 pr-12 font-bold outline-none" 
                        placeholder="입찰가 입력"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] text-gray-400">최소 입찰가: ₩{minBidAmount.toLocaleString()}</p>
                      <button 
                        onClick={() => setInputBidAmount(minBidAmount)}
                        className="text-[10px] text-blue-500 font-bold"
                      >
                        최소가로 초기화
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => setInputBidAmount(prev => prev + 10000)}
                        className="h-10 border border-gray-200 rounded-xl text-[11px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        +1만
                      </button>
                      <button 
                        onClick={() => setInputBidAmount(prev => prev + 50000)}
                        className="h-10 border border-gray-200 rounded-xl text-[11px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        +5만
                      </button>
                      <button 
                        onClick={() => setInputBidAmount(prev => prev + 100000)}
                        className="h-10 border border-gray-200 rounded-xl text-[11px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        +10만
                      </button>
                      <button 
                        onClick={() => setInputBidAmount(prev => prev + 1000000)}
                        className="h-10 border border-gray-200 rounded-xl text-[11px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        +100만
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold">AI 추천 입찰가</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">추천</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setCurrentPrice(prev => prev + 30000);
                        setBidCount(prev => prev + 1);
                        setShowBidSheet(false);
                        onBidComplete({
                          productId: productId || 0,
                          productName: "아이폰 14 Pro 256GB 딥퍼플",
                          sellerName: "판매자123",
                          bidAmount: currentPrice + 30000,
                          remainingTime: "2시간 35분"
                        });
                      }}
                      className="h-12 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                    >
                      ₩{(currentPrice + 30000).toLocaleString()} (빠른 낙찰)
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPrice(prev => prev + 10000);
                        setBidCount(prev => prev + 1);
                        setShowBidSheet(false);
                        onBidComplete({
                          productId: productId || 0,
                          productName: "아이폰 14 Pro 256GB 딥퍼플",
                          sellerName: "판매자123",
                          bidAmount: currentPrice + 10000,
                          remainingTime: "2시간 35분"
                        });
                      }}
                      className="h-12 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                      ₩{(currentPrice + 10000).toLocaleString()} (최소 입찰)
                    </button>
                  </div>
                </div>

                <button 
                  disabled={inputBidAmount < minBidAmount}
                  onClick={() => {
                    setCurrentPrice(inputBidAmount);
                    setBidCount(prev => prev + 1);
                    setShowBidSheet(false);
                    onBidComplete({
                      productId: productId || 0,
                      productName: "아이폰 14 Pro 256GB 딥퍼플",
                      sellerName: "판매자123",
                      bidAmount: inputBidAmount,
                      remainingTime: "2시간 35분"
                    });
                  }} 
                  className={`w-full h-14 text-white font-bold rounded-xl transition-all ${inputBidAmount < minBidAmount ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'shadow-lg'}`}
                  style={{ backgroundColor: inputBidAmount < minBidAmount ? undefined : themeColor }}
                >
                  입찰하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Seller Profile Modal */}
      <AnimatePresence>
        {showSellerProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSellerProfile(false)}
              className="absolute inset-0 bg-black/50 z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 p-8 space-y-6"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                  <img src="https://picsum.photos/seed/seller/100/100" alt="Seller" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">판매자123</h3>
                  <p className="text-sm text-gray-500 mt-1">안녕하세요! 좋은 물건 많이 팝니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">거래 별점</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">4.8 / 5.0</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">경고 횟수</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-bold">0회 (클린 유저)</span>
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-xs text-gray-400">주소지</span>
                  <p className="font-bold text-sm">서울특별시 강남구 역삼동</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm">상대 판매내역 (최근 3건)</h4>
                <div className="space-y-2">
                  {[
                    { title: '맥북 프로 16인치 M2', price: '2,100,000원', status: '판매완료' },
                    { title: '에어팟 프로 2세대', price: '210,000원', status: '판매완료' },
                    { title: '애플워치 울트라', price: '850,000원', status: '판매중' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-800">{item.title}</span>
                      <div className="text-right">
                        <p className="text-xs font-bold">{item.price}</p>
                        <p className={`text-[10px] ${item.status === '판매완료' ? 'text-gray-400' : 'text-blue-500'}`}>{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowSellerProfile(false)} 
                className="w-full h-14 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
