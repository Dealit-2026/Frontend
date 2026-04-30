"use client";

import React from "react";
import { Camera, ChevronLeft, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type {
  AuctionFormValues,
  ProductCategory,
  ProductImagePayload,
  SaleType,
} from "@/services/auction/register/types";

export interface RegisterScreenViewProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showDraftModal: boolean;
  showLoadDraftModal: boolean;
  saleType: SaleType;
  name: string;
  categories: ProductCategory[];
  selectedPrimaryCategoryId: number | null;
  selectedSecondaryCategoryId: number | null;
  selectedTertiaryCategoryId: number | null;
  categoryName: string;
  price: string;
  description: string;
  images: ProductImagePayload[];
  auction: AuctionFormValues;
  isEditMode: boolean;
  themeColor: string;
  auctionFieldContent: {
    sectionTitle: string;
    priceLabel: string;
    helperText: string;
  };
  isUploadingImage: boolean;
  deletingImageIds: number[];
  isSavingDraft: boolean;
  isSubmitting: boolean;
  isLoadingCategories: boolean;
  categoryLoadError: string | null;
  showCategoryError: boolean;
  isRegisterDisabled: boolean;
  onBack: () => void;
  onOpenDraftModal: () => void;
  onCloseDraftModal: () => void;
  onCloseLoadDraftModal: () => void;
  onNameChange: (value: string) => void;
  onPrimaryCategoryChange: (value: string) => void;
  onSecondaryCategoryChange: (value: string) => void;
  onTertiaryCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSaleTypeChange: (value: SaleType) => void;
  onPriceChange: (value: string) => void;
  onAuctionDurationChange: (value: string) => void;
  onImageButtonClick: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (sortOrder: number) => void;
  onRecommendPrice: () => void;
  onSaveDraft: () => void;
  onDiscardDraft: () => void;
  onLoadDraft: () => void;
  onRegister: () => void;
  formatDisplayPrice: (value: string) => string;
  formatAuctionSchedule: (auction: AuctionFormValues) => string;
}

export default function RegisterScreenView({
  fileInputRef,
  showDraftModal,
  showLoadDraftModal,
  saleType,
  name,
  categories,
  selectedPrimaryCategoryId,
  selectedSecondaryCategoryId,
  selectedTertiaryCategoryId,
  categoryName,
  price,
  description,
  images,
  auction,
  isEditMode,
  themeColor,
  auctionFieldContent,
  isUploadingImage,
  deletingImageIds,
  isSavingDraft,
  isSubmitting,
  isLoadingCategories,
  categoryLoadError,
  showCategoryError,
  isRegisterDisabled,
  onBack,
  onOpenDraftModal,
  onCloseDraftModal,
  onCloseLoadDraftModal,
  onNameChange,
  onPrimaryCategoryChange,
  onSecondaryCategoryChange,
  onTertiaryCategoryChange,
  onDescriptionChange,
  onSaleTypeChange,
  onPriceChange,
  onAuctionDurationChange,
  onImageButtonClick,
  onImageUpload,
  onRemoveImage,
  onRecommendPrice,
  onSaveDraft,
  onDiscardDraft,
  onLoadDraft,
  onRegister,
  formatDisplayPrice,
  formatAuctionSchedule,
}: RegisterScreenViewProps) {
  const primaryCategories = categories;
  const secondaryCategories =
    primaryCategories.find((category) => category.id === selectedPrimaryCategoryId)
      ?.children ?? [];
  const tertiaryCategories =
    secondaryCategories.find(
      (category) => category.id === selectedSecondaryCategoryId,
    )?.children ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageUpload}
      />

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
            onClick={onOpenDraftModal}
            className="text-sm font-medium text-gray-400 px-2"
          >
            임시저장
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 space-y-8 no-scrollbar pb-6">
        <div className="space-y-3">
          <h3 className="font-bold text-base">상품정보</h3>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={onImageButtonClick}
              disabled={isUploadingImage || images.length >= 10}
              className="w-20 h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center space-y-1 shrink-0"
            >
              <Camera size={24} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-300">
                {isUploadingImage ? "..." : `${images.length}/10`}
              </span>
            </button>
            {images.map((image) => (
              <div
                key={`${image.imageId}-${image.sortOrder}`}
                className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative"
              >
                <img
                  src={image.imageUrl}
                  alt="product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveImage(image.sortOrder)}
                  disabled={deletingImageIds.includes(image.imageId)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X
                    size={12}
                    className={
                      deletingImageIds.includes(image.imageId)
                        ? "opacity-40"
                        : ""
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="상품명"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full h-10 border-b border-gray-200 outline-none text-base placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-base">카테고리</h3>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="text-[10px] flex items-center text-gray-300 cursor-not-allowed"
                >
                  <Sparkles size={10} className="mr-1" /> AI 추천
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <select
                  value={selectedPrimaryCategoryId ?? ""}
                  onChange={(event) => onPrimaryCategoryChange(event.target.value)}
                  disabled={isLoadingCategories}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">1차 카테고리 선택</option>
                  {primaryCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameKo}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSecondaryCategoryId ?? ""}
                  onChange={(event) => onSecondaryCategoryChange(event.target.value)}
                  disabled={!selectedPrimaryCategoryId || isLoadingCategories}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">2차 카테고리 선택</option>
                  {secondaryCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameKo}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedTertiaryCategoryId ?? ""}
                  onChange={(event) => onTertiaryCategoryChange(event.target.value)}
                  disabled={!selectedSecondaryCategoryId || isLoadingCategories}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">3차 카테고리 선택</option>
                  {tertiaryCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameKo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                {selectedTertiaryCategoryId ? (
                  <p className="text-xs font-medium text-gray-500">
                    선택됨: {categoryName}
                  </p>
                ) : categoryName ? (
                  <p className="text-xs font-medium text-gray-400">
                    선택 중: {categoryName}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    3차 카테고리까지 선택해야 등록할 수 있습니다.
                  </p>
                )}
                {isLoadingCategories && (
                  <p className="text-xs text-gray-400">
                    카테고리 목록을 불러오는 중입니다.
                  </p>
                )}
                {!isLoadingCategories && !categoryLoadError && (
                  <p className="text-xs text-gray-400">
                    AI 추천 기능은 준비 중입니다.
                  </p>
                )}
                {categoryLoadError && (
                  <p className="text-xs font-medium text-red-500">
                    {categoryLoadError}
                  </p>
                )}
                {showCategoryError && !categoryLoadError && !isLoadingCategories && (
                  <p className="text-xs font-medium text-red-500">
                    3차 카테고리까지 모두 선택해 주세요.
                  </p>
                )}
              </div>
            </div>
          </div>

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
                onChange={(event) => onDescriptionChange(event.target.value)}
                maxLength={2500}
              />
              <span className="absolute bottom-4 right-4 text-[10px] text-gray-300 font-bold">
                {description.length}/2500
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-base">판매 유형</h3>
            <div className="flex bg-gray-50 p-1 rounded-2xl">
              <button
                onClick={() => onSaleTypeChange("regular")}
                disabled={isEditMode}
                className={`flex-1 py-1.5 text-sm font-bold rounded-xl transition-all ${saleType === "regular" ? "bg-white shadow-md text-gray-900" : "text-gray-300"} ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                일반 판매
              </button>
              <button
                onClick={() => onSaleTypeChange("auction")}
                disabled={isEditMode}
                className={`flex-1 py-1.5 text-sm font-bold rounded-xl transition-all ${saleType === "auction" ? "bg-white shadow-md text-gray-900" : "text-gray-300"} ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Dealit
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base">
                    {auctionFieldContent.sectionTitle}
                  </h3>
                  <span className="text-xs text-gray-600 block pb-1">
                    {auctionFieldContent.priceLabel}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 text-right">
                  {auctionFieldContent.helperText}
                </span>
              </div>
              <div className="relative border-b border-gray-200">
                <input
                  type="text"
                  placeholder="₩ 가격"
                  value={formatDisplayPrice(price)}
                  onChange={(event) => onPriceChange(event.target.value)}
                  className="w-full py-2 text-base font-medium outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={onRecommendPrice}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] flex items-center"
                  style={{ color: themeColor }}
                >
                  <Sparkles size={10} className="mr-1" fill="currentColor" /> AI
                  추천
                </button>
              </div>
            </div>

            {saleType === "auction" && (
              <div className="space-y-4 rounded-3xl bg-rose-50/60 p-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-500">
                    경매 기간 설정
                  </span>
                  <p className="text-sm text-gray-600">
                    {formatAuctionSchedule({
                      ...auction,
                      startPrice: price,
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <label className="space-y-2">
                    <span className="text-xs text-gray-500 font-medium">
                      경매 기간
                    </span>
                    <select
                      value={auction.durationDays}
                      onChange={(event) => onAuctionDurationChange(event.target.value)}
                      className="w-full h-12 rounded-2xl border border-rose-100 bg-white px-4 text-sm outline-none"
                    >
                      {[1, 3, 5, 7].map((day) => (
                        <option key={day} value={day}>
                          {day}일
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-gray-500 font-medium">
                    입찰 단위
                  </span>
                  <div className="flex gap-2">
                    <div className="flex-1 h-11 rounded-2xl border border-rose-500 bg-white text-rose-500 text-sm font-semibold flex items-center justify-center">
                      {formatDisplayPrice(auction.bidUnit)}원
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 p-4 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-100/80">
        <button
          onClick={onRegister}
          disabled={isRegisterDisabled}
          className="w-full h-12 text-white font-bold rounded-2xl text-base shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none disabled:active:scale-100"
          style={isRegisterDisabled ? undefined : { backgroundColor: themeColor }}
        >
          {isSubmitting ? "등록 중..." : isEditMode ? "수정 완료" : "등록 완료"}
        </button>
      </div>

      <AnimatePresence>
        {showDraftModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={onCloseDraftModal}
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
                  onClick={onBack}
                  className="flex-1 h-12 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={onSaveDraft}
                  disabled={isSavingDraft}
                  className="flex-1 h-12 text-white font-bold rounded-xl transition-colors"
                  style={{ backgroundColor: themeColor }}
                >
                  {isSavingDraft ? "저장 중..." : "예"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoadDraftModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={onCloseLoadDraftModal}
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
                  onClick={onDiscardDraft}
                  className="flex-1 h-12 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={onLoadDraft}
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
