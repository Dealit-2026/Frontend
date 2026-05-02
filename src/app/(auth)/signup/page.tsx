"use client";

import { useRouter } from "next/navigation";

import SignupScreen from "./index";

export default function SignupPage() {
  const router = useRouter();

  return (
    <SignupScreen
      showToast={() => {}}
      onBack={() => router.back()}
      onNext={() => router.push("/email-auth")}
    />
  );
}
