"use client";

import { useParams, useRouter } from "next/navigation";

import RegularPaymentScreen from "./index";

export default function RegularPaymentPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;

  return (
    <RegularPaymentScreen
      key={`regular-payment-${productId}`}
      showToast={() => {}}
      onBack={() => router.back()}
      onComplete={() => router.push(`/products/${productId}/receipt`)}
      themeColor="#98E446"
    />
  );
}
