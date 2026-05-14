import type { ReactNode } from "react";
import { EventStreamProvider } from "@/services/events/EventStreamProvider";

export default function MainRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <EventStreamProvider enabled>{children}</EventStreamProvider>;
}
