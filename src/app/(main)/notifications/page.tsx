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

export default function NotificationScreen({ 
  onBack, 
  onChatClick, 
  onReviewClick, 
  onReceiptClick, 
  onProductClick,
  onWinningBidClick,
  onOutbidClick,
  themeColor 
}: { 
  onBack: () => void; 
  onChatClick: (id: number) => void;
  onReviewClick: () => void;
  onReceiptClick: () => void;
  onProductClick: (id: number) => void;
  onWinningBidClick: () => void;
  onOutbidClick: () => void;
  themeColor: string; 
  key?: string;
}) {
  const [activeTab, setActiveTab] = useState('전체');
  const [notifications, setNotifications] = useState([
    { type: 'chat', title: '채팅 알림', desc: '[이경석] 아이폰 14 Pro ~ 내용의 채팅이 도착했습니다', time: '5분 전', unread: true, targetId: 1 },
    { type: 'bid_outbid', title: '입찰 추월 알림', desc: '에어팟 프로 경매에서 다른 사용자가 더 높은 금액을 제시했습니다.', time: '10분 전', unread: true, targetId: 101 },
    { type: 'bid_win', title: '낙찰 알림', desc: '축하합니다! 맥북 에어 M2 경매에 낙찰되었습니다.', time: '30분 전', unread: true, targetId: 102 },
    { type: 'payment', title: '결제 알림', desc: '아이폰 14 Pro 결제가 완료되었습니다. 영수증을 확인하세요.', time: '2시간 전', unread: false, targetId: 201 },
    { type: 'review', title: '리뷰 알림', desc: '판매자가 리뷰를 남겼습니다. 리뷰를 확인해보세요.', time: '1일 전', unread: false, targetId: 301 },
    { type: 'deadline', title: '경매 마감 임박 🔥', desc: '찜한 상품의 경매가 1시간 후 종료됩니다.', time: '2일 전', unread: false, targetId: 103 },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter(noti => {
    if (activeTab === '전체') return true;
    if (activeTab === '경매') return noti.type.startsWith('bid');
    if (activeTab === '거래') return noti.type === 'payment';
    if (activeTab === '채팅') return noti.type === 'chat';
    if (activeTab === '리뷰') return noti.type === 'review';
    if (activeTab === '찜') return noti.type === 'deadline';
    return true;
  });

  const handleNotiClick = (noti: any) => {
    switch (noti.type) {
      case 'chat':
        onChatClick(noti.targetId);
        break;
      case 'review':
        onReviewClick();
        break;
      case 'payment':
        onReceiptClick();
        break;
      case 'bid_win':
        onWinningBidClick();
        break;
      case 'bid_outbid':
        onOutbidClick();
        break;
      default:
        onProductClick(noti.targetId);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">알림</h1>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2"
        >
          모두 읽음
        </button>
      </div>

      <div className="flex space-x-2 px-6 py-4 border-b border-gray-50 overflow-x-auto no-scrollbar">
        {['전체', '경매', '거래', '채팅', '리뷰', '공지', '찜'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-full text-xs font-bold transition-colors shrink-0"
            style={{ 
              backgroundColor: activeTab === tab ? themeColor : '#F3F4F6',
              color: activeTab === tab ? 'black' : '#9CA3AF'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredNotifications.map((noti, idx) => (
          <div 
            key={idx} 
            onClick={() => handleNotiClick(noti)}
            className={`px-6 py-5 border-b border-gray-50 flex space-x-4 cursor-pointer hover:bg-gray-50 transition-colors ${noti.unread ? 'bg-red-50/30' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${noti.unread ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
              <Bell size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{noti.title}</span>
                {noti.unread && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{noti.desc}</p>
              <span className="text-[10px] text-gray-400">{noti.time}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
