"use client";

import { useRouter } from "next/navigation";

import ReviewScreen from "./index";
import RouteTabShell from "@/components/common/bottom-navigation/RouteTabShell";

export default function ReviewPage() {
  const router = useRouter();

  return (
    <RouteTabShell activeTab="mypage" activeColor="#98E446">
      <ReviewScreen onBack={() => router.push("/mypage")} themeColor="#98E446" />
    </RouteTabShell>
  );
}
