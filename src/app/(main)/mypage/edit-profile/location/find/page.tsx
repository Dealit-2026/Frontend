"use client";

import { useRouter } from "next/navigation";

import FindLocationScreen from "@/app/(auth)/find-location";
import { saveMyLocation } from "@/services/mypage/service";

export default function ProfileLocationFindPage() {
  const router = useRouter();

  const handleComplete = async (location: string) => {
    await saveMyLocation(location);
    router.push("/mypage/edit-profile/location");
  };

  return (
    <FindLocationScreen
      onBack={() => router.push("/mypage/edit-profile/location")}
      onComplete={handleComplete}
    />
  );
}
