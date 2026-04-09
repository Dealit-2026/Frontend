"use client";

import { useRouter } from "next/navigation";

import FindLocationScreen from "./index";

export default function FindLocationPage() {
  const router = useRouter();

  return (
    <FindLocationScreen
      onBack={() => router.back()}
      onComplete={() => router.back()}
    />
  );
}
