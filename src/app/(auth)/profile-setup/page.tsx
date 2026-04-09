"use client";

import { useRouter } from "next/navigation";

import ProfileSetupScreen from "./index";

export default function ProfileSetupPage() {
  const router = useRouter();

  return (
    <ProfileSetupScreen
      showToast={() => {}}
      onBack={() => router.back()}
      onComplete={() => router.push("/region-setup")}
    />
  );
}
