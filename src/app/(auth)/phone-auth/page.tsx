"use client";

import { useRouter } from "next/navigation";

import PhoneAuthScreen from "./index";

export default function PhoneAuthPage() {
  const router = useRouter();

  return (
    <PhoneAuthScreen
      showToast={() => {}}
      onBack={() => router.back()}
      onComplete={() => router.push("/profile-setup")}
    />
  );
}
