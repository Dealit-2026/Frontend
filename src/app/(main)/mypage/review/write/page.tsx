"use client";

import { useRouter } from "next/navigation";

import WriteReviewScreen from "./index";

export default function WriteReviewPage() {
  const router = useRouter();

  return (
    <WriteReviewScreen
      onBack={() => router.back()}
      onComplete={() => router.push("/mypage/review")}
      themeColor="#98E446"
    />
  );
}
