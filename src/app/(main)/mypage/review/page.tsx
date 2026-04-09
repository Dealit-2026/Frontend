"use client";

import { useRouter } from "next/navigation";

import ReviewScreen from "./index";

export default function ReviewPage() {
  const router = useRouter();

  return <ReviewScreen onBack={() => router.back()} themeColor="#98E446" />;
}
