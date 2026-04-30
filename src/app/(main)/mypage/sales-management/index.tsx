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
import AuctionRegisterScreen from '../../../products/register/AuctionRegisterScreen';
import RegularRegisterScreen from '../../../products/register/RegularRegisterScreen';
import {
  fetchAuctionEditInitialData,
  fetchMySellingAuctions,
  removeMySellingAuction,
} from '../../../../services/mypage/service';
import type { MySellingAuctionViewModel } from '../../../../services/mypage/types';

type ManagedProduct =
  | MySellingAuctionViewModel
  | {
      id: number;
      name: string;
      type: 'regular';
      status: string;
      price: string;
      img: string | null;
      description: string;
      category: string;
      categoryId: number | null;
      canEdit: boolean;
      canDelete: boolean;
    };

export default function SalesManagementScreen({ onBack, themeColor }: { onBack: () => void; themeColor: string; key?: string }) {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [filter, setFilter] = useState<'all' | 'regular' | 'auction'>('all');
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingAuctionId, setEditingAuctionId] = useState<number | null>(null);

  const loadSellingAuctions = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetchMySellingAuctions();
      setProducts(response.content);
    } catch (error) {
      console.error('Failed to load selling auctions', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSellingAuctions();
  }, []);

  const handleEditClick = async (item: ManagedProduct) => {
    if (item.type !== 'auction' || !item.canEdit) {
      return;
    }

    setEditingAuctionId(item.auctionId);

    try {
      const editInitialData = await fetchAuctionEditInitialData(item.auctionId);

      if (!editInitialData.canEdit) {
        window.alert('입찰자가 있어 수정할 수 없습니다.');
        return;
      }

      setEditingItem(editInitialData);
    } catch (error) {
      console.error('Failed to load auction edit detail', error);
      window.alert('경매 수정 정보를 불러오지 못했습니다.');
    } finally {
      setEditingAuctionId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) {
      return;
    }

    const targetItem = products.find(p => p.id === itemToDelete);
    if (!targetItem || targetItem.type !== 'auction') {
      setItemToDelete(null);
      return;
    }

    setIsDeleting(true);

    try {
      await removeMySellingAuction(targetItem.auctionId);
      setProducts(products.filter(p => p.id !== itemToDelete));
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete selling auction', error);
      window.alert('경매 상품 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => filter === 'all' || p.type === filter);

  if (editingItem) {
    const RegisterComponent =
      editingItem.type === 'auction' ? AuctionRegisterScreen : RegularRegisterScreen;

    return (
      <RegisterComponent 
        onBack={() => setEditingItem(null)} 
        onComplete={() => {
          setEditingItem(null);
          void loadSellingAuctions();
        }} 
        themeColor={themeColor} 
        initialData={editingItem} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col relative"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">판매 관리</h1>
      </div>

      {/* Filter Toggle */}
      <div className="px-6 pt-6">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(['all', 'regular', 'auction'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                filter === f 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f === 'all' ? '전체' : f === 'regular' ? '일반' : '경매'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">판매 중인 경매 상품을 불러오는 중입니다</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">판매 중인 경매 상품을 불러오지 못했습니다</p>
            <button
              onClick={() => void loadSellingAuctions()}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-2xl space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={28} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                      {item.type === 'regular' ? '일반' : '경매'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                      {item.status}
                    </span>
                    {item.type === 'auction' && item.bidders !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                        입찰 {item.bidders}명
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <p className="font-black text-sm">{item.price}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {item.canEdit && item.canDelete ? (
                  <>
                    <button 
                      onClick={() => void handleEditClick(item)}
                      disabled={item.type === 'auction' && editingAuctionId === item.auctionId}
                      className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-60 rounded-xl text-xs font-bold transition-colors"
                    >
                      {item.type === 'auction' && editingAuctionId === item.auctionId ? '불러오는 중...' : '수정'}
                    </button>
                    <button 
                      onClick={() => setItemToDelete(item.id)}
                      className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-red-500 transition-colors"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <div className="flex-1 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-400 text-center">
                    입찰자가 있어 수정 및 삭제가 불가능합니다
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">판매 중인 상품이 없습니다</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setItemToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-xl"
            >
              <h3 className="text-lg font-bold text-center mb-6">삭제하겠습니까?</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 disabled:opacity-60 transition-colors"
                >
                  {isDeleting ? '삭제 중...' : '예'}
                </button>
                <button 
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
