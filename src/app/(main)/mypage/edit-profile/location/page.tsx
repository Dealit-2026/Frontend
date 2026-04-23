"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getErrorMessage } from "@/services/apiError";
import RegionSetupScreen from "@/app/(auth)/region-setup";
import { fetchMyProfileForm, saveMyLocation } from "@/services/mypage/service";
import { getMyProfileDraft, updateMyProfileDraft } from "@/services/mypage/profileDraft";

export default function ProfileLocationEditPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  useEffect(() => {
    const draft = getMyProfileDraft();

    if (draft?.location) {
      setLocation(draft.location);
      return;
    }

    let ignore = false;

    fetchMyProfileForm().then((form) => {
      if (!ignore && form.location) {
        setLocation(form.location);
      }
    }).catch((error) => {
      if (!ignore) {
        window.alert(getErrorMessage(error, "프로필 정보를 불러오지 못했습니다."));
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleComplete = async () => {
    try {
      updateMyProfileDraft({ location });
      await saveMyLocation(location);
      router.push("/mypage/edit-profile");
    } catch (error) {
      window.alert(getErrorMessage(error, "지역 저장에 실패했습니다."));
    }
  };

  return (
    <RegionSetupScreen
      onBack={() => router.back()}
      onNext={handleComplete}
      onFindLocation={() => router.push("/mypage/edit-profile/location/find")}
      currentLocation={location}
      onLocationChange={setLocation}
    />
  );
}
