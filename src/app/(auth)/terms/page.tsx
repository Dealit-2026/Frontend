"use client";

import { useRouter } from "next/navigation";

import TermsAgreementScreen from "./index";

export default function TermsPage() {
  const router = useRouter();

  return (
    <TermsAgreementScreen
      onBack={() => router.back()}
      onNext={() => router.push("/phone-auth")}
    />
  );
}
