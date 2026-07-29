"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpeakerCard, { SpeakerCardProps } from "../../molecules/speaker-card/speaker-card";
import Timeline from "../../molecules/timeline/timeline";

gsap.registerPlugin(ScrollTrigger);

interface CronogramItem {
  id: string;
  dayLabel: string;
  speaker: SpeakerCardProps;
}

interface CronogramCarouselProps {
  title: string;
  items: CronogramItem[];
  emptyMessage?: string;
}

const AUTOPLAY_DURATION_MS = 10000;

export default function CronogramCarousel({
  title,
  items,
  emptyMessage = "O cronograma ainda nao foi publicado.",
}: CronogramCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPointerHovering, setIsPointerHovering] = useState(false);
  const [isPointerPressing, setIsPointerPressing] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wheelCooldownRef = useRef(false);
  const autoplayStartedAtRef = useRef<number | null>(null);
  const autoplayRemainingMsRef = useRef(AUTOPLAY_DURATION_MS);

  const activeId = items[activeIndex]?.id ?? items[0]?.id ?? "";
  const activeItem = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items]);
  const isAutoplayPaused = isPointerHovering || isPointerPressing;

  const selectIndex = (nextIndex: number) => {
    if (!items.length) {
      return;
    }

    const normalizedIndex =
      ((nextIndex % items.length) + items.length) % items.length;

    autoplayStartedAtRef.current = null;
    autoplayRemainingMsRef.current = AUTOPLAY_DURATION_MS;
    setActiveIndex(normalizedIndex);
  };

  const selectId = (id: string) => {
    if (id === activeId) {
      return;
    }

    const nextIndex = items.findIndex((item) => item.id === id);

    if (nextIndex >= 0) {
      selectIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    if (isAutoplayPaused) {
      if (autoplayStartedAtRef.current !== null) {
        const elapsedMs = Date.now() - autoplayStartedAtRef.current;
        autoplayRemainingMsRef.current = Math.max(
          0,
          autoplayRemainingMsRef.current - elapsedMs,
        );
        autoplayStartedAtRef.current = null;
      }

      return;
    }

    const delayMs = autoplayRemainingMsRef.current;
    autoplayStartedAtRef.current = Date.now();
    const timeoutId = window.setTimeout(() => {
      autoplayStartedAtRef.current = null;
      autoplayRemainingMsRef.current = AUTOPLAY_DURATION_MS;
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);

      if (autoplayStartedAtRef.current !== null) {
        const elapsedMs = Date.now() - autoplayStartedAtRef.current;
        autoplayRemainingMsRef.current = Math.max(
          0,
          autoplayRemainingMsRef.current - elapsedMs,
        );
        autoplayStartedAtRef.current = null;
      }
    };
  }, [activeIndex, isAutoplayPaused, items.length]);

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
          start: "top 72%",
          once: true,
        },
      });

      revealTimeline
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 42 },
          { autoAlpha: 1, y: 0, duration: 0.85 },
        )
        .fromTo(
          timelineRef.current,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.45",
        )
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 50, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.95 },
          "-=0.38",
        );
    }, currentSection);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      id="cronograma"
      ref={sectionRef}
      className="relative px-[5vw] pb-[clamp(3rem,8vw,5rem)] pt-[clamp(1rem,3vw,1.5rem)]"
    >
      <div className="mx-auto max-w-[1000px]">
        <h2
          ref={titleRef}
          className="mb-[clamp(4.5rem,16vw,8.5rem)] text-center font-outfit-sans text-[clamp(1.8rem,6.4vw,3.35rem)] leading-none text-white md:mb-20"
        >
          {title}
        </h2>

        {activeItem ? (
          <>
            <div
              ref={timelineRef}
              className="mt-[clamp(1.25rem,4vw,2rem)]"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  setIsPointerHovering(true);
                }
              }}
              onPointerLeave={() => {
                setIsPointerHovering(false);
                setIsPointerPressing(false);
              }}
              onPointerDown={() => setIsPointerPressing(true)}
              onPointerUp={() => setIsPointerPressing(false)}
              onPointerCancel={() => setIsPointerPressing(false)}
              onWheel={(event) => {
                if (Math.abs(event.deltaY) < 22 || wheelCooldownRef.current) {
                  return;
                }

                event.preventDefault();
                wheelCooldownRef.current = true;
                selectIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));

                window.setTimeout(() => {
                  wheelCooldownRef.current = false;
                }, 420);
              }}
            >
              <Timeline
                items={items.map(({ id, dayLabel }) => ({ id, dayLabel }))}
                activeId={activeId}
                activeIndex={activeIndex}
                autoplayDurationMs={AUTOPLAY_DURATION_MS}
                onSelect={selectId}
                isPaused={isAutoplayPaused}
              />
            </div>

            <div
              ref={cardRef}
              className="mt-[clamp(1rem,3vw,1.25rem)]"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  setIsPointerHovering(true);
                }
              }}
              onPointerLeave={() => {
                setIsPointerHovering(false);
                setIsPointerPressing(false);
              }}
              onPointerDown={() => setIsPointerPressing(true)}
              onPointerUp={() => setIsPointerPressing(false)}
              onPointerCancel={() => setIsPointerPressing(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 26, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.985 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <SpeakerCard {...activeItem.speaker} />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="seti-glass-frame mt-[clamp(2rem,5vw,2.5rem)] rounded-[1rem] p-[1px]">
            <div className="seti-glass-inner rounded-[calc(1rem-1px)] px-6 py-10 text-center">
              <p className="font-outfit-sans text-[clamp(1rem,3.5vw,1.25rem)] text-white/82">
                {emptyMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
