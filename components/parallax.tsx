"use client";

import { useEffect, useRef, useState } from "react";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Max vertical travel as a fraction of the element height (e.g. 0.1 = 10%). */
  intensity?: number;
};

export function Parallax({ children, className, intensity = 0.1 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      if (total <= 0) return;
      const progress = (vh - rect.top) / total;
      const travel = intensity * rect.height;
      setOffset((progress - 0.5) * 2 * travel);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={className}>
      <div
        className="h-full w-full will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        {children}
      </div>
    </div>
  );
}
