"use client";
import React, { useState, useEffect } from "react";
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
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Screen, Tab } from "../../../types/index";
import { ExploreIcon } from "../../../components/common/ExploreIcon";

export default function RegisterScreen({
  onBack,
  onComplete,
  mode,
  initialData,
}: {
  onBack: () => void;
  onComplete: () => void;
  themeColor: string;
  mode: "regular" | "auction";
  initialData?: any;
}) {
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);
  const [saleType, setSaleType] = useState<"regular" | "auction">(
    initialData?.type || mode,
  );
  const [title, setTitle] = useState(initialData?.name || "");
  const [price, setPrice] = useState(
    initialData?.price ? initialData.price.replace(/[^0-9]/g, "") : "",
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [images, setImages] = useState<string[]>(
    initialData?.img ? [initialData.img] : [],
  );

  const themeColor = saleType === "regular" ? "#98E446" : "#F64257";
  const isEditMode = !!initialData;

  useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        setShowLoadDraftModal(true);
      }
    }
  }, [isEditMode]);

  const handleSaveDraft = () => {
    const draft = { saleType, title, price, description, images };
    localStorage.setItem("product_draft", JSON.stringify(draft));
    setShowDraftModal(false);
    onBack();
  };

  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setSaleType(draft.saleType || mode);
        setTitle(draft.title || "");
        setPrice(draft.price || "");
        setDescription(draft.description || "");
        setImages(draft.images || []);
      }
    } catch (e) {
      console.error("Failed to load draft", e);
    }
    setShowLoadDraftModal(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("product_draft");
    setShowLoadDraftModal(false);
  };

  return (
    <div className="flex flex-col min-h-full relative bg-white">
      <div className="h-16 flex items-center px-4 border-b border-gray-50">
        <button onClick={onBack} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-base">
          {isEditMode
            ? "상품 수정"
            : saleType === "auction"
              ? "경매 등록"
              : "상품 등록"}
        </h1>
        {!isEditMode && (
          <button
            onClick={() => setShowDraftModal(true)}
            className="text-sm font-medium text-gray-400 px-2"
          >
            임시저장
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8 no-scrollbar pb-32">
        {/* Photo Upload */}
        <div className="space-y-3">
          <h3 className="font-bold text-base">상품정보</h3>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar">
            <button className="w-20 h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center space-y-1 shrink-0">
              <Camera size={24} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-300">
                {images.length}/10
              </span>
            </button>
            {images.map((img, idx) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative"
              >
                <img
                  src={img}
                  alt="product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Title Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="상품명"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 border-b border-gray-200 outline-none text-base placeholder:text-gray-400"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <div className="relative border-b border-gray-200">
              <input
                type="text"
                placeholder="카테고리"
                readOnly
                value={initialData?.category || ""}
                className="w-full py-2 text-base font-medium outline-none placeholder-gray-400 cursor-pointer"
              />
              {/* AI 추천 빤짝이 아이콘 부분 */}
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] flex items-center"
                style={{ color: themeColor }}
              >
                <Sparkles size={10} className="mr-1" fill="currentColor" /> AI
                추천
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">설명</h3>
              <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                자주 쓰는 문구
              </button>
            </div>
            <div className="relative">
              <textarea
                placeholder="· 브랜드, 모델명, 구매 시기, 하자 유무 등&#10;상품 설명을 최대한 자세히 적어주세요.&#10;· 전화번호, SNS 계정 등 개인정보 입력은&#10;제한될 수 있어요."
                className="w-full h-48 bg-gray-50 rounded-2xl p-4 outline-none resize-none text-sm leading-relaxed placeholder:text-gray-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2500}
              ></textarea>
              <span className="absolute bottom-4 right-4 text-[10px] text-gray-300 font-bold">
                {description.length}/2500
              </span>
            </div>
          </div>

          {/* Sale Type Toggle */}
          <div className="space-y-3">
            <h3 className="font-bold text-base">판매 유형</h3>
            <div className="flex bg-gray-50 p-1 rounded-2xl">
              <button
                onClick={() => !isEditMode && setSaleType("regular")}
                className={`flex-1 py-1.5 text-sm font-bold rounded-xl transition-all ${saleType === "regular" ? "bg-white shadow-md text-gray-900" : "text-gray-300"} ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                일반 판매
              </button>
              <button
                onClick={() => !isEditMode && setSaleType("auction")}
                className={`flex-1 py-1.5 text-sm font-bold rounded-xl transition-all ${saleType === "auction" ? "bg-white shadow-md text-gray-900" : "text-gray-300"} ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Dealit
              </button>
            </div>
          </div>

          {/* Price Setting */}
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base">
                {saleType === "auction" ? "경매 설정" : "가격 설정"}
              </h3>
              <span className="text-xs text-gray-600 block pb-1">
                {saleType === "auction" ? "시작가" : "판매가"}
              </span>
              <div className="relative border-b border-gray-200">
                <input
                  type="text"
                  placeholder="₩ 가격"
                  value={price ? Number(price).toLocaleString() : ""}
                  onChange={(e) =>
                    setPrice(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full py-2 text-base font-medium outline-none placeholder-gray-400"
                />
                {/* AI 추천 빤짝이 아이콘 부분 */}
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] flex items-center"
                  style={{ color: themeColor }}
                >
                  <Sparkles size={10} className="mr-1" fill="currentColor" /> AI
                  추천
                </span>
              </div>
            </div>

            {saleType === "auction" && (
              <div className="space-y-2">
                <span className="text-xs text-gray-300 font-bold">
                  경매 기간 / 날짜 설정
                </span>
                <div className="w-full h-12 bg-gray-50 rounded-2xl flex items-center justify-between px-4 cursor-pointer">
                  <span className="text-base text-gray-400 font-medium">
                    2026.06.11
                  </span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onComplete}
          className="w-full h-12 text-white font-bold rounded-2xl text-base shadow-lg transition-all active:scale-[0.98]"
          style={{ backgroundColor: themeColor }}
        >
          {isEditMode ? "수정 완료" : "등록 완료"}
        </button>
      </div>

      {/* Draft Modal */}
      <AnimatePresence>
        {showDraftModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={() => setShowDraftModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-sm bg-white rounded-2xl p-6 z-50 space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold">임시저장</h3>
                <p className="text-sm text-gray-500">
                  작성 중인 내용을 저장하시겠습니까?
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDraftModal(false);
                    onBack();
                  }}
                  className="flex-1 h-12 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex-1 h-12 text-white font-bold rounded-xl transition-colors"
                  style={{ backgroundColor: themeColor }}
                >
                  예
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Load Draft Modal */}
      <AnimatePresence>
        {showLoadDraftModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-sm bg-white rounded-2xl p-6 z-50 space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold">임시저장 불러오기</h3>
                <p className="text-sm text-gray-500">
                  이어서 작성하시겠습니까?
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDiscardDraft}
                  className="flex-1 h-12 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleLoadDraft}
                  className="flex-1 h-12 text-white font-bold rounded-xl transition-colors"
                  style={{ backgroundColor: themeColor }}
                >
                  예
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
