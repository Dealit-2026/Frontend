"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import BiddingStatusScreen from "./index";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";

export default function BiddingStatusPage() {
  const router = useRouter();
  const params = useParams<{ auctionId: string }>();
  const auctionId = Number(params.auctionId);

  return (
    <EventStreamProvider enabled>
      <BiddingStatusScreen
        auctionId={Number.isFinite(auctionId) ? auctionId : null}
        onBack={() => router.back()}
        themeColor="#F64257"
      />
    </EventStreamProvider>
  );
}
