"use client";

import { useRouter } from "next/navigation";

import TermsAgreementScreen from "./index";

export default function TermsPage() {
  const router = useRouter();

  return (
    <TermsAgreementScreen
      onBack={() => router.push("/email-auth")}
      onNext={() => router.push("/region-setup")}
    />
  );
}
