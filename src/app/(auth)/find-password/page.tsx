"use client";

import { useRouter } from "next/navigation";

import FindPasswordScreen from "./index";

export default function FindPasswordPage() {
  const router = useRouter();

  return <FindPasswordScreen showToast={() => {}} onBack={() => router.back()} />;
}
