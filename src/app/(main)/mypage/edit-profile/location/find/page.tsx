"use client";

import { useRouter } from "next/navigation";

import { getErrorMessage } from "@/services/apiError";
import FindLocationScreen from "@/app/(auth)/find-location";
import { saveMyLocation } from "@/services/mypage/service";
import { updateMyProfileDraft } from "@/services/mypage/profileDraft";

export default function ProfileLocationFindPage() {
  const router = useRouter();

  const handleComplete = async (location: string) => {
    try {
      updateMyProfileDraft({ location });
      await saveMyLocation(location);
      router.push("/mypage/edit-profile/location");
    } catch (error) {
      window.alert(getErrorMessage(error, "지역 저장에 실패했습니다."));
    }
  };

  return (
    <FindLocationScreen
      onBack={() => router.push("/mypage/edit-profile/location")}
      onComplete={handleComplete}
    />
  );
}
