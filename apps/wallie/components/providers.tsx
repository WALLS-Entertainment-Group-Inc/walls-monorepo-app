"use client";

import { AuthProvider } from "@walls/auth";
import { WallsToaster } from "@walls/ui/walls-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <WallsToaster />
    </AuthProvider>
  );
}
