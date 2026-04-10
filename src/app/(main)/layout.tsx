import type { ReactNode } from "react";

export default function MainRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
