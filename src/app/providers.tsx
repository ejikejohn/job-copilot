"use client";

import { SessionProvider } from "next-auth/react";

// SessionProvider makes login state available to any client component
// in the app via the useSession() hook, without prop-drilling.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
