"use client";

import { useRouter } from "next/navigation";

import ProfileEditScreen from "./index";

export default function ProfileEditPage() {
  const router = useRouter();

  return (
    <ProfileEditScreen
      onBack={() => router.back()}
      onComplete={() => router.push("/mypage")}
      onLocationEdit={() => router.push("/mypage/edit-profile/location")}
    />
  );
}
