"use client";

import { cn } from "@walls/utils";

import {
  SIDEBAR_OFFSET_COLLAPSED,
  SIDEBAR_OFFSET_EXPANDED,
  SIDEBAR_TRANSITION,
} from "./app-sidebar-constants";
import { useAppSidebar } from "./app-sidebar-context";

type AppSidebarLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Shifts page content when the sidebar rail expands on hover or pin.
 * Collapsed rail = wider content; expanded rail = content narrows in sync.
 */
export function AppSidebarLayout({
  children,
  className,
}: AppSidebarLayoutProps) {
  const { isExpanded } = useAppSidebar();

  return (
    <div
      className={cn(
        "min-h-full w-full bg-walls-white",
        SIDEBAR_TRANSITION,
        SIDEBAR_OFFSET_COLLAPSED,
        isExpanded && SIDEBAR_OFFSET_EXPANDED,
        className,
      )}
    >
      {children}
    </div>
  );
}
