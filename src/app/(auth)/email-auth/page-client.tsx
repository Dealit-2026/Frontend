"use client";

import { useRouter } from "next/navigation";

import EmailAuthScreen from "./index";

interface EmailAuthPageClientProps {
  mode: "signup" | "profile";
  returnTo: string;
}

export default function EmailAuthPageClient({
  mode,
  returnTo,
}: EmailAuthPageClientProps) {
  const router = useRouter();

  return (
    <EmailAuthScreen
      showToast={() => {}}
      onBack={() => router.back()}
      onComplete={() => {
        if (mode === "profile") {
          router.push(`${returnTo}?verifiedRefresh=${Date.now()}`);
          return;
        }

        router.push("/terms");
      }}
      onSkip={() => router.push("/terms")}
      mode={mode}
    />
  );
}
