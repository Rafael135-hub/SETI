"use client";

import Lenis from "lenis";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface ScrollToIdOptions {
  center?: boolean;
  duration?: number;
}

interface SmoothScrollContextValue {
  scrollToId: (id: string, options?: ScrollToIdOptions) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollToId: () => {},
});

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
    });

    lenisRef.current = lenis;

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToId = useCallback((id: string, options?: ScrollToIdOptions) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    const { center = false, duration = 1.25 } = options ?? {};
    const rect = target.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const centeredTop = absoluteTop + rect.height / 2 - window.innerHeight / 2;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const nextTop = Math.max(0, Math.min(center ? centeredTop : absoluteTop, maxScroll));

    if (lenisRef.current) {
      lenisRef.current.scrollTo(nextTop, {
        duration,
        easing: (value: number) => 1 - Math.pow(1 - value, 4),
      });

      return;
    }

    window.scrollTo({
      top: nextTop,
      behavior: "smooth",
    });
  }, []);

  const value = useMemo(
    () => ({
      scrollToId,
    }),
    [scrollToId],
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
