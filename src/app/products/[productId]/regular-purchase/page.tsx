"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RegularPurchasePage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const productId = Number(params.productId) || 1;

  useEffect(() => {
    router.replace(`/products/${productId}/regular-payment`);
  }, [productId, router]);

  return null;
}
