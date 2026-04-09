"use client";

import { useRouter } from "next/navigation";

import ReceiptScreen from "./index";

export default function ReceiptPage() {
  const router = useRouter();

  return (
    <ReceiptScreen
      onBack={() => router.back()}
      onWriteReview={() => router.push("/mypage/review/write")}
      themeColor="#98E446"
    />
  );
}
