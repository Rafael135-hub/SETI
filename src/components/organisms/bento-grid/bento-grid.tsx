"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BentoCard from "../../molecules/bento-card/bento-card";

gsap.registerPlugin(ScrollTrigger);

interface BentoGridProps {
  title: string;
  description: string;
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-[clamp(4.1rem,16vw,5.375rem)] w-[clamp(4.1rem,16vw,5.375rem)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44 28L19 54L44 80"
        stroke="url(#code-left)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M76 28L101 54L76 80"
        stroke="url(#code-right)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="code-left" x1="19" y1="28" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3ECFF" />
          <stop offset="1" stopColor="#9864FF" />
        </linearGradient>
        <linearGradient id="code-right" x1="60" y1="28" x2="101" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3ECFF" />
          <stop offset="1" stopColor="#9864FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-[clamp(5.25rem,21vw,7.5rem)] w-[clamp(5.25rem,21vw,7.5rem)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.842 14C76.5253 28.5368 84.9332 44.2716 86 61.2044L96.4026 73.5389L91.3017 101L68.4335 88.9966C63.0788 94.3345 54.9212 94.3345 49.5665 88.9966L26.6983 101L21.5974 73.5389L32 61.2044C33.0668 44.2716 41.4747 28.5368 56.158 14H61.842Z"
        fill="url(#rocket-gradient)"
      />
      <path d="M27 99.5L34.5 82L46 88L27 99.5Z" fill="#9864FF" />
      <path d="M91 99.5L83.5 82L72 88L91 99.5Z" fill="#9864FF" />
      <circle cx="59" cy="54" r="9.5" fill="#120037" />
      <defs>
        <linearGradient id="rocket-gradient" x1="14" y1="9" x2="98" y2="109" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3ECFF" />
          <stop offset="1" stopColor="#9864FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg
      viewBox="0 0 108 170"
      className="h-[clamp(6.25rem,25vw,9.25rem)] w-[clamp(4rem,16vw,5.875rem)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="18" y="12" width="72" height="146" rx="10" stroke="url(#device-stroke)" strokeWidth="18" />
      <defs>
        <linearGradient id="device-stroke" x1="18" y1="12" x2="90" y2="158" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9864FF" />
          <stop offset="1" stopColor="#F3ECFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function BentoGrid({ title, description }: BentoGridProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const currentSection = sectionRef.current;

    if (!currentSection) {
      return;
    }

    const context = gsap.context(() => {
      const revealTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: currentSection,
          start: "top 78%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });

      revealTimeline
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 36, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.78 },
        )
        .fromTo(
          cardRefs.current,
          { autoAlpha: 0, y: 42, scale: 0.965, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.08,
          },
          "-=0.36",
        );
    }, currentSection);

    return () => {
      context.revert();
    };
  }, []);

  const setCardRef = (index: number) => (element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }

    cardRefs.current[index] = element;
  };

  return (
    <section ref={sectionRef} className="relative isolate bg-transparent px-[5vw] pb-[clamp(2.5rem,7vw,4rem)] pt-[clamp(3.5rem,10vw,6.5rem)]">
      <div className="mx-auto max-w-[1110px]">
        <h2
          ref={titleRef}
          className="text-center font-outfit-sans text-[clamp(1.8rem,5.7vw,3.1rem)] font-normal leading-[1] text-white"
        >
          {title}
        </h2>

        <div className="mt-[clamp(2rem,6vw,3.5rem)] grid grid-cols-1 gap-[clamp(0.75rem,3vw,1rem)] md:grid-cols-5 md:auto-rows-[92px]">
          <div ref={setCardRef(0)} className="md:row-span-4">
            <BentoCard className="flex min-h-[clamp(12.5rem,55vw,23rem)] flex-col items-center justify-center gap-[clamp(1.5rem,7vw,3rem)] px-[clamp(1rem,4vw,1.5rem)] py-[clamp(1.5rem,7vw,2.5rem)] text-center transition-transform duration-500 hover:-translate-y-1 md:min-h-full md:px-5">
              <div>
                <CodeIcon />
              </div>

              <p className="max-w-[170px] text-[clamp(1.05rem,4.4vw,1.4375rem)] font-light leading-[1.42] text-white">
                Aprender
                <br />
                de forma
                <br />
                <span className="text-seti-purple-80">interativa</span>
                <br />e <span className="text-seti-purple-80">{"pr\u00E1tica"}</span>
              </p>
            </BentoCard>
          </div>

          <div ref={setCardRef(1)} className="md:col-span-3">
            <BentoCard className="flex min-h-[clamp(5.25rem,22vw,6rem)] items-center justify-center px-[clamp(1rem,5vw,3rem)] py-[clamp(1rem,4vw,1.25rem)] transition-transform duration-500 hover:-translate-y-1 md:min-h-full">
              <p className="text-center text-[clamp(0.98rem,3.7vw,1.4rem)] font-light leading-[1.18] tracking-normal text-white/88">
                {description}
              </p>
            </BentoCard>
          </div>

          <div ref={setCardRef(2)} className="md:row-span-3">
            <BentoCard className="flex min-h-[clamp(11rem,48vw,19rem)] items-center justify-center py-[clamp(1.5rem,7vw,2rem)] transition-transform duration-500 hover:-translate-y-1 md:min-h-full">
              <div className="drop-shadow-[0_0_24px_rgba(152,100,255,0.12)]">
                <DeviceIcon />
              </div>
            </BentoCard>
          </div>

          <div ref={setCardRef(3)} className="md:row-span-3">
            <BentoCard className="flex min-h-[clamp(11rem,48vw,19rem)] items-center justify-center py-[clamp(1.5rem,7vw,2rem)] transition-transform duration-500 hover:-translate-y-1 md:min-h-full">
              <div className="drop-shadow-[0_8px_30px_rgba(152,100,255,0.16)]">
                <RocketIcon />
              </div>
            </BentoCard>
          </div>

          <div ref={setCardRef(4)} className="md:col-span-2 md:row-span-2">
            <BentoCard className="flex min-h-[clamp(9.5rem,42vw,11.25rem)] items-center justify-center py-[clamp(1.5rem,6vw,2rem)] transition-transform duration-500 hover:-translate-y-1 md:min-h-full">
              <div>
                <Image
                  src="/images/logo-seti.png"
                  alt="Logo SETI"
                  width={496}
                  height={147}
                  className="w-[clamp(8.75rem,40vw,15.5rem)]"
                />
              </div>
            </BentoCard>
          </div>

          <div ref={setCardRef(5)} className="md:col-span-3">
            <BentoCard className="flex min-h-[clamp(5.25rem,22vw,6rem)] items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,1.25rem)] transition-transform duration-500 hover:-translate-y-1 md:min-h-full">
              <p className="text-center font-light leading-[1.1] text-white/84">
                <span className="text-[clamp(1rem,3.7vw,1.375rem)]">Cultura de </span>
                <span className="text-[clamp(1.65rem,7vw,2.9rem)] text-seti-purple-80">{"Inova\u00E7\u00E3o Aplicada"}</span>
              </p>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
