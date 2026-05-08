"use client";

import { useRouter } from "next/navigation";

import WinningBidCompletionScreen from "./index";

export default function WinningCompletePage() {
  const router = useRouter();

  return (
    <WinningBidCompletionScreen
      onBack={() => router.back()}
      onPaymentClick={() => router.push("/products/1/regular-payment")}
      themeColor="#F64257"
    />
  );
}
