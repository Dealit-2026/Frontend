"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RegionSetupScreen from "@/app/(auth)/region-setup";
import { getErrorMessage } from "@/services/apiError";
import {
  applyLocationDetailAddress,
  createDefaultLocationForm,
  getLocationDisplayName,
  openDaumPostcodeSearch,
  resolveCurrentLocation,
} from "@/services/location/service";
import type { LocationFormValues } from "@/services/location/types";
import {
  fetchMyLocationForm,
  saveMyLocation,
} from "@/services/mypage/service";
import {
  getMyProfileDraft,
  updateMyProfileDraft,
} from "@/services/mypage/profileDraft";

export default function ProfileLocationEditPage() {
  const router = useRouter();
  const [locationForm, setLocationForm] = useState<LocationFormValues>(
    createDefaultLocationForm(),
  );
  const [isResolvingCurrentLocation, setIsResolvingCurrentLocation] =
    useState(false);

  useEffect(() => {
    const draft = getMyProfileDraft();

    if (draft?.locationDetails) {
      setLocationForm(draft.locationDetails);
      return;
    }

    let ignore = false;

    fetchMyLocationForm()
      .then((nextLocationForm) => {
        if (!ignore) {
          setLocationForm(nextLocationForm);
        }
      })
      .catch((error) => {
        if (!ignore) {
          window.alert(getErrorMessage(error, "지역 정보를 불러오지 못했습니다."));
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

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

  const handleComplete = async () => {
    try {
      await saveMyLocation(locationForm);
      updateMyProfileDraft({
        location: getLocationDisplayName(locationForm),
        locationDetails: locationForm,
      });
      router.push("/mypage/edit-profile");
    } catch (error) {
      window.alert(getErrorMessage(error, "지역 저장에 실패했습니다."));
    }
  };

  return (
    <RegionSetupScreen
      onBack={() => router.back()}
      onNext={handleComplete}
      onOpenPostcode={handleOpenPostcode}
      onUseCurrentLocation={handleCurrentLocation}
      locationForm={locationForm}
      onLocationChange={setLocationForm}
      isResolvingCurrentLocation={isResolvingCurrentLocation}
      confirmLabel="확인"
    />
  );
}
