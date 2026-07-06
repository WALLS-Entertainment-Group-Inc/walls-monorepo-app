"use client";

import { useInView } from "react-intersection-observer";

export function usePublicPageHeader() {
  return useInView({
    threshold: 0,
    initialInView: true,
  });
}
