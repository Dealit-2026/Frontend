"use client";

import { useParams, useRouter } from "next/navigation";

import RegularPurchaseScreen from "./index";

export default function RegularPurchasePage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;

  return (
    <RegularPurchaseScreen
      productId={productId}
      onBack={() => router.back()}
      onComplete={() => router.push(`/products/${productId}/receipt`)}
      themeColor="#98E446"
      showToast={() => {}}
    />
  );
}
