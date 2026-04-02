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

import { Screen, Tab } from '../../types/index';
import { ExploreIcon } from '../../components/common/ExploreIcon';

export default function ChatListScreen({ themeColor, onChatClick }: { themeColor: string; onChatClick: (id: number) => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    { id: 1, name: '이경석', product: '아이폰 14 Pro 256GB', type: 'auction', msg: '네, 직거래 가능합니다', time: '5분 전', unread: 2, img: 'https://picsum.photos/seed/user1/100/100' },
    { id: 2, name: '이동녕', product: '맥북 프로 16인치', type: 'regular', msg: '직거래 안됩니다...', time: '1시간 전', unread: 0, img: 'https://picsum.photos/seed/user2/100/100' },
    { id: 3, name: '이다윤', product: '에어팟 프로 2세대', type: 'regular', msg: '입금 확인했습니다', time: '3시간 전', unread: 1, img: 'https://picsum.photos/seed/user3/100/100' },
    { id: 4, name: '김준현', product: '애플워치 울트라', type: 'auction', msg: '맥북 언제 와요?', time: '1일 전', unread: 0, img: 'https://picsum.photos/seed/user4/100/100' },
  ];

  const filteredChats = chats.filter(chat => {
    const query = searchQuery.toLowerCase();
    const typeLabel = chat.type === 'auction' ? 'deal it!' : '일반 판매';
    return (
      chat.name.toLowerCase().includes(query) || 
      chat.product.toLowerCase().includes(query) ||
      chat.msg.toLowerCase().includes(query) ||
      typeLabel.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col border-b border-gray-50 sticky top-0 bg-white z-10">
        <div className="h-16 flex items-center px-6 justify-between">
          <h1 className="text-xl font-bold">채팅</h1>
          {!isSearching && (
            <button onClick={() => setIsSearching(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Search size={24} />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="px-6 pb-4 flex items-center space-x-3">
            <div className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center px-3 space-x-2">
              <Search size={18} className="text-gray-400" />
              <input 
                autoFocus
                type="text" 
                placeholder="대화 상대, 상품명 탐색" 
                className="flex-1 bg-transparent outline-none text-sm" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button 
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }} 
              className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div key={chat.id} onClick={() => onChatClick(chat.id)} className="flex items-center px-6 py-4 space-x-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50/50">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img src={chat.img} alt={chat.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{chat.name}</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[100px]">{chat.product}</span>
                    <span 
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${chat.type === 'auction' ? 'bg-red-50 text-red-500' : ''}`} 
                      style={chat.type !== 'auction' ? { backgroundColor: `${themeColor}15`, color: themeColor } : undefined}
                    >
                      {chat.type === 'auction' ? 'Deal it!' : '일반 판매'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">{chat.msg}</p>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: themeColor }}>
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <MessageCircle size={32} />
            </div>
            <p className="text-sm font-medium">탐색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
