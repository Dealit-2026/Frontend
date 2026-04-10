"use client";

import { useRouter } from "next/navigation";

import MyBidsScreen from "./index";

export default function MyBidsPage() {
  const router = useRouter();

  return (
    <MyBidsScreen
      onBack={() => router.back()}
      onProductClick={(id) => router.push(`/products/${id}`)}
      themeColor="#98E446"
    />
  );
}
