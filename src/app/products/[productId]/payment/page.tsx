"use client";

import { useRouter } from "next/navigation";

import PaymentScreen from "./index";

export default function PaymentPage() {
  const router = useRouter();

  return (
    <PaymentScreen
      showToast={() => {}}
      onBack={() => router.back()}
      onComplete={() => router.push("/products/1/receipt")}
      themeColor="#98E446"
    />
  );
}
