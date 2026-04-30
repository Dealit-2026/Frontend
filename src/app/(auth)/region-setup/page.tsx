"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import RegionSetupScreen from "./index";
import { getErrorMessage } from "@/services/apiError";
import {
  applyLocationDetailAddress,
  createDefaultLocationForm,
  openDaumPostcodeSearch,
  resolveCurrentLocation,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";
import { saveMyLocation } from "@/services/mypage/service";
import { clearSignUpDraft, getSignUpDraft } from "@/services/auth/signUpDraft";
import { getAuthToken, signUp } from "@/services/auth/service";

export default function RegionSetupPage() {
  const router = useRouter();
  const [locationForm, setLocationForm] = useState<LocationFormValues>(
    createDefaultLocationForm(),
  );
  const [isResolvingCurrentLocation, setIsResolvingCurrentLocation] =
    useState(false);

  const handleOpenPostcode = async () => {
    try {
      const nextLocationForm = await openDaumPostcodeSearch(
        locationForm.detailAddress,
      );
      setLocationForm(nextLocationForm);
    } catch (error) {
      const message = getErrorMessage(error, "주소 검색을 불러오지 못했습니다.");

      if (message !== "주소 검색이 취소되었습니다.") {
        window.alert(message);
      }
    }
  };

  const handleCurrentLocation = async () => {
    setIsResolvingCurrentLocation(true);

    try {
      const nextLocationForm = await resolveCurrentLocation();
      setLocationForm(
        applyLocationDetailAddress(nextLocationForm, locationForm.detailAddress),
      );
    } catch (error) {
      window.alert(getErrorMessage(error, "현재 위치를 불러오지 못했습니다."));
    } finally {
      setIsResolvingCurrentLocation(false);
    }
  };

  const handleNext = async () => {
    try {
      if (!getAuthToken()) {
        await signUp(getSignUpDraft());
        clearSignUpDraft();
      }

      await saveMyLocation(locationForm);
      router.push("/profile-setup");
    } catch (error) {
      window.alert(getErrorMessage(error, "지역 저장에 실패했습니다."));
    }
  };

  return (
    <RegionSetupScreen
      onBack={() => router.push("/terms")}
      onNext={handleNext}
      onOpenPostcode={handleOpenPostcode}
      onUseCurrentLocation={handleCurrentLocation}
      locationForm={locationForm}
      onLocationChange={setLocationForm}
      isResolvingCurrentLocation={isResolvingCurrentLocation}
      confirmLabel="다음"
    />
  );
}
