"use client";

import { useRouter } from "next/navigation";

import CategorySelectionScreen from "./index";

export default function CategorySelectionPage() {
  const router = useRouter();

  return (
    <CategorySelectionScreen
      onBack={() => router.back()}
      onComplete={() => router.push("/")}
      onNavigateLogin={() => router.push("/login")}
      showSkip
    />
  );
}
