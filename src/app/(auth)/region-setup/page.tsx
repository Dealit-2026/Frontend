"use client";

import { useRouter } from "next/navigation";

import RegionSetupScreen from "./index";

export default function RegionSetupPage() {
  const router = useRouter();

  return (
    <RegionSetupScreen
      onBack={() => router.back()}
      onNext={() => router.push("/category-selection")}
      onFindLocation={() => router.push("/find-location")}
      currentLocation="서울특별시 강남구 역삼동"
    />
  );
}
