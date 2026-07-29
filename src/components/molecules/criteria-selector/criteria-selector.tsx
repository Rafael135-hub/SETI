"use client";

interface CriteriaSelectorProps {
  onPrevious: () => void;
  onNext: () => void;
  isDisabled?: boolean;
  className?: string;
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[clamp(2rem,7vw,2.25rem)] w-[clamp(2rem,7vw,2.25rem)] stroke-current"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {direction === "left" ? (
        <path d="M15 4L7 12L15 20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 4L17 12L9 20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function CriteriaSelector({
  onPrevious,
  onNext,
  isDisabled = false,
  className = "",
}: CriteriaSelectorProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between ${className}`}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isDisabled}
        aria-label="Criterio anterior"
        className="pointer-events-auto flex h-[clamp(2.55rem,9vw,3rem)] w-[clamp(2.55rem,9vw,3rem)] items-center justify-center bg-transparent text-white/78 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowIcon direction="left" />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isDisabled}
        aria-label="Proximo criterio"
        className="pointer-events-auto flex h-[clamp(2.55rem,9vw,3rem)] w-[clamp(2.55rem,9vw,3rem)] items-center justify-center bg-transparent text-white/78 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
