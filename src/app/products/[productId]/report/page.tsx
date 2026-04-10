"use client";

import { useParams, useRouter } from "next/navigation";

import ReportScreen from "./index";

export default function ReportPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;

  return (
    <ReportScreen
      productId={productId}
      onBack={() => router.back()}
      themeColor="#98E446"
      showToast={() => {}}
    />
  );
}
