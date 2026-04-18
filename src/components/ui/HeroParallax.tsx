"use client";

import {useEffect, useRef} from "react";

interface HeroParallaxProps {
  background: React.ReactNode;
  children: React.ReactNode;
}

export default function HeroParallax({
  background,
  children,
}: HeroParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = section!.getBoundingClientRect();
          const h = section!.offsetHeight;
          const progress = Math.max(0, Math.min(1, -rect.top / h));

          // Background moves at 40% of scroll speed
          bg!.style.transform = `translateY(${progress * h * 0.4}px)`;

          // Content fades out and drifts up
          content!.style.opacity = `${1 - progress * 1.5}`;
          content!.style.transform = `translateY(${-progress * 60}px)`;

          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden hero-grain"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        {background}
      </div>
      <div
        ref={contentRef}
        className="relative z-10 will-change-[transform,opacity]"
      >
        {children}
      </div>
    </section>
  );
}
