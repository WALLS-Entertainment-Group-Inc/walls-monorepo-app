"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_SCROLL_CONTAINER_SELECTOR = "[data-app-scroll-container]";

function useAutoHideOnScroll(enabled: boolean, selector: string): boolean {
  const [scrollHidden, setScrollHidden] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setScrollHidden(false);
      return;
    }

    let scrollContainer: HTMLElement | null = null;
    let lastScrollTop = 0;
    let rafId = 0;

    const onScroll = () => {
      if (!scrollContainer) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = scrollContainer!.scrollTop;
        const delta = scrollTop - lastScrollTop;

        if (scrollTop <= 8) {
          setScrollHidden(false);
        } else if (delta > 4) {
          setScrollHidden(true);
        } else if (delta < -4) {
          setScrollHidden(false);
        }

        lastScrollTop = scrollTop;
      });
    };

    const attach = () => {
      scrollContainer = document.querySelector(selector);
      if (!scrollContainer) return false;

      lastScrollTop = scrollContainer.scrollTop;
      scrollContainer.addEventListener("scroll", onScroll, { passive: true });
      return true;
    };

    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    if (!attach()) {
      retryTimer = setTimeout(() => {
        attach();
      }, 0);
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      cancelAnimationFrame(rafId);
      scrollContainer?.removeEventListener("scroll", onScroll);
    };
  }, [enabled, selector]);

  return scrollHidden;
}

type AppHeaderVisibilityContextValue = {
  visible: boolean;
};

const AppHeaderVisibilityContext =
  createContext<AppHeaderVisibilityContextValue | null>(null);

export type AppHeaderVisibilityProviderProps = {
  children: ReactNode;
  autoHideOnScroll?: boolean;
  scrollContainerSelector?: string;
};

export function AppHeaderVisibilityProvider({
  children,
  autoHideOnScroll = false,
  scrollContainerSelector = DEFAULT_SCROLL_CONTAINER_SELECTOR,
}: AppHeaderVisibilityProviderProps) {
  const scrollHidden = useAutoHideOnScroll(
    autoHideOnScroll,
    scrollContainerSelector,
  );

  return (
    <AppHeaderVisibilityContext.Provider value={{ visible: !scrollHidden }}>
      {children}
    </AppHeaderVisibilityContext.Provider>
  );
}

export function useAppHeaderVisible(): boolean {
  const context = useContext(AppHeaderVisibilityContext);
  return context?.visible ?? true;
}
