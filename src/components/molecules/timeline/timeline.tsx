"use client";

interface TimelineItem {
  id: string;
  dayLabel: string;
}

interface TimelineProps {
  items: TimelineItem[];
  activeId: string;
  activeIndex: number;
  autoplayDurationMs: number;
  onSelect: (id: string) => void;
  isPaused?: boolean;
}

export default function Timeline({
  items,
  activeId,
  activeIndex,
  autoplayDurationMs,
  onSelect,
  isPaused = false,
}: TimelineProps) {
  const stepCount = Math.max(items.length - 1, 1);
  const activePosition = items.length > 1 ? (activeIndex / stepCount) * 100 : 0;
  const nextPosition =
    items.length > 1 && activeIndex < items.length - 1
      ? ((activeIndex + 1) / stepCount) * 100
      : activePosition;
  const animatedWidth = Math.max(nextPosition - activePosition, 0);

  return (
    <div className="w-full">
      <div className="relative h-[clamp(4.25rem,15vw,5.25rem)]">
        <div className="absolute left-0 right-0 top-[clamp(2.15rem,7.5vw,2.8125rem)] h-[2px] bg-white/85" />
        <div
          className="absolute left-0 top-[clamp(2.15rem,7.5vw,2.8125rem)] h-[2px] bg-linear-to-r from-white via-white to-seti-purple-85"
          style={{ width: `${activePosition}%` }}
        />

        {animatedWidth > 0 ? (
          <div
            key={activeId}
            className="absolute top-[clamp(2.15rem,7.5vw,2.8125rem)] h-[2px] overflow-hidden"
            style={{ left: `${activePosition}%`, width: `${animatedWidth}%` }}
          >
            <span
              className="block h-full origin-left bg-linear-to-r from-white via-seti-purple-85 to-seti-purple-75"
              style={{
                animation: `seti-timeline-fill ${autoplayDurationMs}ms linear forwards`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
            <span
              className="pointer-events-none absolute inset-y-[-8px] left-[-18%] w-16 bg-linear-to-r from-transparent via-white to-transparent opacity-80 blur-[8px]"
              style={{
                animation: "seti-timeline-glow 1800ms linear infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        ) : null}

        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const position = items.length > 1 ? (index / stepCount) * 100 : 0;
          const alignmentClass =
            index === 0
              ? "translate-x-0"
              : index === items.length - 1
                ? "-translate-x-full"
                : "-translate-x-1/2";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group absolute top-0 cursor-pointer text-center ${alignmentClass}`}
              style={{ left: `${position}%` }}
              aria-current={isActive ? "date" : undefined}
            >
              <span
                className={`block text-[clamp(0.75rem,2.8vw,1rem)] leading-none font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/86 group-hover:text-white"
                }`}
              >
                {item.dayLabel}
              </span>

              {!isActive ? (
                <span className="absolute left-1/2 top-[clamp(1.1rem,4.2vw,1.1875rem)] h-[clamp(1.25rem,5vw,1.6875rem)] w-[2px] -translate-x-1/2 bg-white/85" />
              ) : null}

              {isActive ? (
                <span className="absolute left-1/2 top-[clamp(2.15rem,7.5vw,2.875rem)] h-[clamp(1.5rem,6vw,1.875rem)] w-[clamp(1.5rem,6vw,1.875rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-seti-purple-75">
                  <span className="absolute left-1/2 top-1/2 h-[clamp(1rem,4vw,1.25rem)] w-[clamp(1rem,4vw,1.25rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seti-purple-00" />
                  <span className="absolute left-1/2 top-1/2 h-[clamp(0.58rem,2.6vw,0.75rem)] w-[clamp(0.58rem,2.6vw,0.75rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seti-purple-75" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
