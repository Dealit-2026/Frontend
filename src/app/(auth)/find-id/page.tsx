"use client";

import { useRouter } from "next/navigation";

import FindIdScreen from "./index";

export default function FindIdPage() {
  const router = useRouter();

  return <FindIdScreen showToast={() => {}} onBack={() => router.back()} />;
}
