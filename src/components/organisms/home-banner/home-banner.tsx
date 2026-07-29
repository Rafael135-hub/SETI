"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Button from "../../atoms/button/button";
import { useSmoothScroll } from "../../providers/smooth-scroll-provider";

interface BannerAction {
  label: string;
  href: string;
  variant: "filled" | "stroked";
}

interface HomeBannerProps {
  title: string;
  description: string;
  actions: BannerAction[];
  scrollLabel?: string;
}

export default function HomeBanner({
  title,
  description,
  actions,
  scrollLabel = "Ver cronograma",
}: HomeBannerProps) {
  const { scrollToId } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    const currentSection = sectionRef.current;

    if (!currentSection) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 24 || wheelLockRef.current) {
        return;
      }

      const bounds = currentSection.getBoundingClientRect();

      if (bounds.top > 24 || bounds.bottom < window.innerHeight * 0.6) {
        return;
      }

      event.preventDefault();
      wheelLockRef.current = true;
      scrollToId("cronograma", { center: true, duration: 1.35 });

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 1100);
    };

    currentSection.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      currentSection.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToId]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden px-[5vw] pb-[clamp(9rem,18vh,14rem)] pt-[clamp(2.25rem,5vh,3.5rem)]"
    >
      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center text-center">
        <h1 className="font-outfit-sans text-[clamp(2.05rem,7.2vw,4.25rem)] font-light leading-[1.05] tracking-normal text-white">
          {title}
        </h1>

        <p className="mt-[clamp(1rem,3.5vw,1.5rem)] max-w-[760px] text-[clamp(0.68rem,1.8vw,0.9rem)] leading-[1.5] tracking-[0.08em] text-white/58 sm:tracking-[0.14em] md:tracking-[0.2em]">
          {description}
        </p>

        <div className="mt-[clamp(1.8rem,5vw,2.75rem)] grid w-full max-w-[560px] grid-cols-2 items-center justify-center gap-[clamp(0.45rem,2vw,0.75rem)] sm:flex sm:flex-row sm:flex-nowrap">
          {actions.map((action) => (
            <Link key={action.href + action.label} href={action.href} className="min-w-0">
              <Button
                label={action.label}
                variant={action.variant}
                className="min-h-[clamp(2rem,7vw,2.5rem)] w-full whitespace-normal px-[clamp(0.4rem,2vw,1.25rem)] py-[clamp(0.35rem,1vw,0.6rem)] text-[clamp(0.64rem,2.65vw,0.8125rem)] min-[390px]:whitespace-nowrap sm:w-[clamp(12.5rem,23vw,14rem)]"
              />
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToId("cronograma", { center: true, duration: 1.35 })}
          className="mt-[clamp(2.5rem,8vw,4.5rem)] flex cursor-pointer flex-col items-center text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-seti-purple-75"
        >
          <span className="text-[clamp(0.7rem,2.2vw,0.8125rem)]">{scrollLabel}</span>
          <span className="mt-0.5 text-[clamp(1.2rem,4vw,1.5rem)]">&#8595;</span>
        </button>
      </div>
    </section>
  );
}
