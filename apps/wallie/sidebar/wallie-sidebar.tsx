"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical, PanelRight, Check } from "lucide-react";
import Image from "next/image";
import { useDeepQuerySidebar } from "../walliSidebarContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "./ui/sidebar-sheet";

interface Thread {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  is_pinned?: boolean;
}

interface DeepQuerySidebarProps {
  threads?: Thread[];
  currentThreadId?: string | null;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
  onRenameThread?: (threadId: string, newTitle: string) => void;
  onPinThread?: (threadId: string) => void;
  onArchiveThread?: (threadId: string) => void;
  onDeleteThread?: (threadId: string) => void;
}

type TimeCategory = "Pinned" | "Today" | "This Week" | "Last Week" | "This Month" | "Last Month" | "This Year" | "Older";

function getTimeCategory(dateString: string): TimeCategory {
  const date = new Date(dateString);
  const now = new Date();

  // Reset times to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const threadDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today.getTime() - threadDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Get start of this week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Get start of last week
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  if (diffDays === 0) {
    return "Today";
  } else if (threadDate >= startOfWeek) {
    return "This Week";
  } else if (threadDate >= startOfLastWeek) {
    return "Last Week";
  } else if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return "This Month";
  } else if (
    (date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()) ||
    (now.getMonth() === 0 && date.getMonth() === 11 && date.getFullYear() === now.getFullYear() - 1)
  ) {
    return "Last Month";
  } else if (date.getFullYear() === now.getFullYear()) {
    return "This Year";
  } else {
    return "Older";
  }
}

const categoryOrder: TimeCategory[] = ["Pinned", "Today", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Older"];

export function DeepQuerySidebar({
  threads = [],
  currentThreadId,
  onNewChat,
  onSelectThread,
  onRenameThread,
  onPinThread,
  onArchiveThread,
  onDeleteThread,
}: DeepQuerySidebarProps) {
  const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useDeepQuerySidebar();
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [renameState, setRenameState] = useState<{ threadId: string; value: string } | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const hasFocusedRef = useRef(false);

  // Only focus when rename *starts* (threadId changes), not on every value change — otherwise
  // each keystroke would re-run this, select() would highlight the value, and the next key would replace it.
  useEffect(() => {
    if (renameState && !hasFocusedRef.current) {
      renameInputRef.current?.focus();
      hasFocusedRef.current = true;
    }
    if (!renameState) {
      hasFocusedRef.current = false;
    }
  }, [renameState?.threadId]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Group threads: pinned at top, then by time category
  const categorizedThreads = useMemo(() => {
    const groups: Record<TimeCategory, Thread[]> = {
      "Pinned": [],
      "Today": [],
      "This Week": [],
      "Last Week": [],
      "This Month": [],
      "Last Month": [],
      "This Year": [],
      "Older": [],
    };

    threads.forEach(thread => {
      if (thread.is_pinned) {
        groups["Pinned"].push(thread);
      } else {
        const category = getTimeCategory(thread.updated_at || thread.created_at);
        groups[category].push(thread);
      }
    });

    // Pinned: sort by updated_at descending; other categories keep insertion order
    if (groups["Pinned"].length > 0) {
      groups["Pinned"].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }

    return categoryOrder
      .filter(category => groups[category].length > 0)
      .map(category => ({
        category,
        threads: groups[category],
      }));
  }, [threads]);

  const sidebarBody = (logoClickHandler: () => void, expanded: boolean, isMobileDrawer = false) => (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header - Logo & New Chat */}
      <div className="py-3 px-2.5">
        <div className="space-y-2">
          {/* Special Logo Item with Hover Animations (desktop only; on mobile drawer, static logo, close via X only) */}
          <button
            onMouseEnter={() => !isMobileDrawer && setIsHoveringLogo(true)}
            onMouseLeave={() => !isMobileDrawer && setIsHoveringLogo(false)}
            onClick={isMobileDrawer ? undefined : logoClickHandler}
            type="button"
            className={cn(
              "group relative w-full h-10 rounded-xl border border-transparent transition-all duration-300 flex items-center gap-3 px-3",
              !isMobileDrawer && "cursor-pointer hover:bg-gray-50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:border-neutral-200/50",
              isMobileDrawer && "cursor-default"
            )}
          >
            <div className="relative w-4 h-4 flex-shrink-0 overflow-visible flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {!isMobileDrawer && isHoveringLogo ? (
                  <motion.div
                    key="panel-right"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="pointer-events-none"
                  >
                    <PanelRight className="h-4 w-4 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute -inset-2 flex items-center justify-center pointer-events-none"
                  >
                    <Image src="https://assets.wallsentertainment.com/walls-app-icons/wallie.svg" alt="Wallie" width={24} height={24} className="flex-shrink-0 pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {expanded && !isMobileDrawer && isHoveringLogo && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-gray-700 whitespace-nowrap flex-1 text-left"
                  style={{
                    maskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
                  }}
                >
                  Collapse sidebar
                </motion.span>
              )}
            </AnimatePresence>
          </button>

              {/* New Chat Button */}
              <button
                onClick={onNewChat}
                className="w-full h-10 flex items-center gap-3 px-3 rounded-xl text-sm font-medium text-gray-500 border border-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:border-neutral-200/50"
              >
                <div className="relative w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </div>
                <AnimatePresence mode="wait">
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: 0.1 }}
                      className="whitespace-nowrap"
                    >
                      New chat
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Thread History - Categorized */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="py-2">
              <AnimatePresence>
                {expanded && categorizedThreads.length > 0 && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {categorizedThreads.map(({ category, threads: categoryThreads }) => (
                      <div key={category}>
                        {/* Category Header */}
                        <div className="px-4 py-1.5">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            {category}
                          </span>
                        </div>

                        {/* Category Threads */}
                        <div className="space-y-0.5 px-2">
                          {categoryThreads.map((thread) => {
                            const isActive = thread.id === currentThreadId;
                            const isRenaming = renameState?.threadId === thread.id;
                            return (
                              <div
                                key={thread.id}
                                onClick={() => !isRenaming && onSelectThread(thread.id)}
                                className={cn(
                                  "group relative rounded-xl py-2 pl-3 pr-3 cursor-pointer border border-transparent transition-all duration-300",
                                  isActive
                                    ? "bg-gray-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-neutral-200/50"
                                    : "hover:bg-gray-50 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:border-neutral-200/50"
                                )}
                              >
                                <div className="flex items-center min-w-0 gap-1 h-5">
                                  {isRenaming && renameState ? (
                                    <>
                                      <Input
                                        ref={renameInputRef}
                                        value={renameState.value}
                                        onChange={(e) =>
                                          setRenameState((s) => (s ? { ...s, value: e.target.value } : null))
                                        }
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          if (e.key === "Enter") {
                                            setRenameState((current) => {
                                              if (current?.value.trim() && onRenameThread) {
                                                onRenameThread(current.threadId, current.value.trim());
                                              }
                                              return null;
                                            });
                                          }
                                          if (e.key === "Escape") {
                                            setRenameState(null);
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Chat name"
                                        className="flex-1 min-w-0 h-5 min-h-0 rounded-none border-0 bg-transparent py-0 px-0 text-sm leading-none text-gray-700 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setRenameState((current) => {
                                            if (current?.value.trim() && onRenameThread) {
                                              onRenameThread(current.threadId, current.value.trim());
                                            }
                                            return null;
                                          });
                                        }}
                                        className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                                        aria-label="Save name"
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <span
                                      className="block flex-1 min-w-0 truncate text-sm leading-5 text-gray-700 transition-all duration-200 group-hover:mr-7"
                                      style={{
                                        maskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
                                      }}
                                    >
                                      {thread.title || "New Chat"}
                                    </span>
                                  )}
                                </div>
                                {!isRenaming && (onRenameThread || onPinThread || onArchiveThread || onDeleteThread) && (
                                  <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          onClick={(e) => e.stopPropagation()}
                                          className="p-1.5 rounded-lg transition-colors"
                                        >
                                          <MoreVertical className="h-4 w-4 text-gray-400" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="rounded-xl min-w-[120px] bg-gray-50 border-neutral-200/50"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {onPinThread && (
                                          <DropdownMenuItem
                                            onClick={() => onPinThread(thread.id)}
                                            className="rounded-lg cursor-pointer"
                                          >
                                            {thread.is_pinned ? "Unpin" : "Pin"}
                                          </DropdownMenuItem>
                                        )}
                                        {onRenameThread && (
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setRenameState({ threadId: thread.id, value: thread.title || "New Chat" });
                                            }}
                                            className="rounded-lg cursor-pointer"
                                          >
                                            Rename
                                          </DropdownMenuItem>
                                        )}
                                        {onArchiveThread && (
                                          <DropdownMenuItem
                                            onClick={() => onArchiveThread(thread.id)}
                                            className="rounded-lg cursor-pointer"
                                          >
                                            Archive
                                          </DropdownMenuItem>
                                        )}
                                        {onDeleteThread && (
                                          <DropdownMenuItem
                                            onClick={() => onDeleteThread(thread.id)}
                                            className="rounded-lg cursor-pointer text-red-600 focus:text-red-600"
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
  );

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out z-40 max-md:hidden",
          isCollapsed ? "w-16" : "w-[260px]"
        )}
      >
        <div
          className={cn(
            "h-full bg-gray-50 backdrop-blur-md border-r border-neutral-200/50 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-[260px]"
          )}
        >
          {sidebarBody(handleCollapse, !isCollapsed)}
        </div>
      </div>
      {/* Mobile drawer - hamburger opens this */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[260px] max-w-[85vw] p-0 gap-0 border-r border-neutral-200/50 bg-gray-50 shadow-[8px_0_30px_rgba(0,0,0,0.14)] rounded-none [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button]:text-black [&>button]:opacity-100 [&>button]:right-3 [&>button]:top-3 [&>button_svg]:h-5 [&>button_svg]:w-5"
        >
          {sidebarBody(() => {}, true, true)}
        </SheetContent>
      </Sheet>
    </>
  );
}
