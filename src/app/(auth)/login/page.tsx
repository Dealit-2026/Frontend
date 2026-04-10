"use client";

import { useRouter } from "next/navigation";

import LoginScreen from "./index";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginScreen
      showToast={() => {}}
      onNavigateSignup={() => router.push("/signup")}
      onNavigateFindId={() => router.push("/find-id")}
      onNavigateFindPassword={() => router.push("/find-password")}
      onLogin={() => router.push("/")}
    />
  );
}
