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

export default function AccountManagementScreen({ onBack, themeColor }: { onBack: () => void; themeColor: string; key?: string }) {
  const [accounts, setAccounts] = useState([
    { id: 1, bank: '신한은행', accountNumber: '110-123-456789', isPrimary: true },
    { id: 2, bank: '국민은행', accountNumber: '987654-32-109876', isPrimary: false }
  ]);

  const setPrimaryAccount = (id: number) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === id
    })));
  };

  const deleteAccount = (id: number) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-gray-50 h-full relative"
    >
      <div className="h-16 flex items-center px-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">계좌 관리</h1>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-gray-800">등록된 계좌</h2>
          <span className="text-xs text-gray-500">최대 3개까지 등록 가능</span>
        </div>

        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className={`bg-white p-5 rounded-2xl border ${account.isPrimary ? 'border-black' : 'border-gray-100'} shadow-sm relative overflow-hidden`}>
                {account.isPrimary && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    주계좌
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-lg mb-1">{account.bank}</p>
                    <p className="text-gray-500 font-mono text-sm tracking-wider">{account.accountNumber}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!account.isPrimary && (
                    <button 
                      onClick={() => setPrimaryAccount(account.id)}
                      className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      주계좌로 설정
                    </button>
                  )}
                  <button 
                    onClick={() => deleteAccount(account.id)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">등록된 계좌가 없습니다.</p>
            <p className="text-xs text-gray-400">판매 대금을 정산받을 계좌를 등록해주세요.</p>
          </div>
        )}

        {accounts.length < 3 && (
          <button 
            className="w-full py-4 mt-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold flex items-center justify-center space-x-2 hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <span className="text-xl">+</span>
            <span>새 계좌 등록하기</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
