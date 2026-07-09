"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface DeepQuerySidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

const DeepQuerySidebarContext = createContext<DeepQuerySidebarContextType | undefined>(undefined);

export function DeepQuerySidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <DeepQuerySidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </DeepQuerySidebarContext.Provider>
  );
}

export function useDeepQuerySidebar() {
  const context = useContext(DeepQuerySidebarContext);
  if (context === undefined) {
    throw new Error('useDeepQuerySidebar must be used within a DeepQuerySidebarProvider');
  }
  return context;
}
