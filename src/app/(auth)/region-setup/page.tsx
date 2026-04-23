"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import RegionSetupScreen from "./index";

export default function RegionSetupPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  return (
    <RegionSetupScreen
      onBack={() => router.back()}
      onNext={() => router.push("/category-selection")}
      onFindLocation={() => router.push("/find-location")}
      currentLocation={location}
      onLocationChange={setLocation}
    />
  );
}
