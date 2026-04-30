"use client";

import { useRouter } from "next/navigation";

import ProfileEditScreen from "./index";

interface ProfileEditPageClientProps {
  refreshToken: string;
}

export default function ProfileEditPageClient({
  refreshToken,
}: ProfileEditPageClientProps) {
  const router = useRouter();

  return (
    <ProfileEditScreen
      refreshToken={refreshToken}
      onBack={() => router.back()}
      onComplete={() => router.push("/mypage")}
      onLocationEdit={() => router.push("/mypage/edit-profile/location")}
      onEmailVerify={() =>
        router.push("/email-auth?mode=profile&returnTo=/mypage/edit-profile")
      }
    />
  );
}
