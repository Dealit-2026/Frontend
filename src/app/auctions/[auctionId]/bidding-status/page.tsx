"use client";

import { useRouter } from "next/navigation";

import BiddingStatusScreen from "./index";

export default function BiddingStatusPage() {
  const router = useRouter();

  return <BiddingStatusScreen onBack={() => router.back()} themeColor="#F64257" />;
}
