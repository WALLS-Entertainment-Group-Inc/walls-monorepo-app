"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  UserProfileButton,
  type UserProfileButtonProps,
} from "@walls/ui/private-app-chrome";

/**
 * Viewport-locked profile slot. Portaled to `document.body` so it never rides
 * inside the scrolling main column.
 */
export function AppTopChrome(props: UserProfileButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed top-0 right-0 z-[100] flex items-center p-4 pr-6">
      <div className="pointer-events-auto">
        <UserProfileButton {...props} />
      </div>
    </div>,
    document.body,
  );
}
