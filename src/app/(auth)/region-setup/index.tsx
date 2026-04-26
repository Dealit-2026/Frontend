"use client";

import { ChevronLeft, Home, MapPinned, Navigation, Search } from "lucide-react";
import { motion } from "motion/react";

import {
  applyLocationDetailAddress,
  getLocationDisplayName,
  isLocationFormReady,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";

interface RegionSetupScreenProps {
  onBack: () => void;
  onNext: () => void;
  onOpenPostcode: () => void;
  onUseCurrentLocation: () => void;
  locationForm: LocationFormValues;
  onLocationChange: (locationForm: LocationFormValues) => void;
  isResolvingCurrentLocation?: boolean;
  confirmLabel?: string;
}

export default function RegionSetupScreen({
  onBack,
  onNext,
  onOpenPostcode,
  onUseCurrentLocation,
  locationForm,
  onLocationChange,
  isResolvingCurrentLocation = false,
  confirmLabel = "확인",
}: RegionSetupScreenProps) {
  const displayLocation = getLocationDisplayName(locationForm);
  const canSubmit = isLocationFormReady(locationForm);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">지역 설정</h1>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
        <div className="space-y-2 text-center">
          <div className="w-20 h-20 mx-auto bg-[#98E446]/10 rounded-full flex items-center justify-center">
            <MapPinned size={36} className="text-[#98E446]" />
          </div>
          <h2 className="text-xl font-bold">거래 지역을 설정해 주세요</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            주소 검색이나 현재 위치를 이용해서
            <br />
            내 거래 지역을 정확하게 저장할 수 있어요.
          </p>
        </div>

        {displayLocation && (
          <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-8 h-8 bg-[#98E446]/20 rounded-full flex items-center justify-center shrink-0">
                <Home size={16} className="text-[#98E446]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm break-words">{displayLocation}</p>
                {locationForm.locationSource && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {locationForm.locationSource === "GPS"
                      ? "현재 위치 기준"
                      : locationForm.locationSource === "POSTCODE"
                        ? "주소 검색 기준"
                        : "직접 입력 기준"}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold shrink-0">
              현재 설정됨
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isResolvingCurrentLocation}
            className={`h-12 rounded-lg border font-bold transition-colors flex items-center justify-center gap-2 ${
              isResolvingCurrentLocation
                ? "border-[#98E446] bg-[#98E446]/40 text-black/50 cursor-wait"
                : "border-[#98E446] bg-[#98E446] hover:bg-[#87d335] text-black"
            }`}
          >
            <Navigation size={18} />
            {isResolvingCurrentLocation ? "위치 확인 중" : "현재 위치로 찾기"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">주소</label>
            <button
              type="button"
              onClick={onOpenPostcode}
              className="w-full min-h-12 bg-gray-100 rounded-lg px-4 py-3 text-left hover:bg-gray-200 transition-colors flex items-start justify-between gap-3"
            >
              <span className={`flex-1 min-w-0 break-words ${displayLocation ? "text-black" : "text-gray-400"}`}>
                {displayLocation || "주소 검색으로 지역을 선택해 주세요."}
              </span>
              <span className="shrink-0 self-center">
                <Search size={16} className="text-gray-400" />
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="detailAddress">
              상세 주소
            </label>
            <input
              id="detailAddress"
              type="text"
              value={locationForm.detailAddress}
              onChange={(event) =>
                onLocationChange(
                  applyLocationDetailAddress(locationForm, event.target.value),
                )
              }
              placeholder="동/호수 등 상세 주소를 입력해 주세요. (선택)"
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={onNext}
          disabled={!canSubmit}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            canSubmit
              ? "bg-[#98E446] hover:bg-[#87d335] text-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </motion.div>
  );
}
