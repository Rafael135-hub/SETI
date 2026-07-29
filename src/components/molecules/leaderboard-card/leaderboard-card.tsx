import Image from "next/image";
import { motion } from "motion/react";

interface LeaderboardCardProps {
  rank: 1 | 2 | 3;
  name: string;
  score: string;
  image: string;
  variant?: "center" | "side";
  className?: string;
}

export default function LeaderboardCard({
  rank,
  name,
  score,
  image,
  variant = "side",
  className = "",
}: LeaderboardCardProps) {
  const isCenter = variant === "center";
  const sizeClasses = isCenter
    ? "h-full w-[clamp(6.75rem,31vw,18.125rem)]"
    : "h-full w-[clamp(5.75rem,26vw,18.125rem)]";
  const contentClasses = isCenter
    ? "px-[clamp(0.45rem,2vw,1.25rem)] pb-[clamp(0.85rem,3vw,2rem)] pt-[clamp(3.25rem,14vw,6rem)]"
    : "px-[clamp(0.4rem,1.8vw,1.25rem)] pb-[clamp(0.7rem,2.5vw,2rem)] pt-[clamp(2.875rem,12vw,6rem)]";
  const avatarClasses = isCenter
    ? "h-[clamp(4.625rem,20vw,8.875rem)] w-[clamp(4.625rem,20vw,8.875rem)]"
    : "h-[clamp(4rem,18vw,8.875rem)] w-[clamp(4rem,18vw,8.875rem)]";
  const badgeOffsetClasses = rank === 1
    ? "mb-[clamp(2.5rem,8vw,7rem)]"
    : rank === 2
      ? "mb-[clamp(1.5rem,5vw,4rem)]"
      : "mb-[clamp(0.5rem,2vw,1.5rem)]";

  return (
    <article
      className={`relative shrink-0 overflow-visible border border-white/18 bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[18px] ${sizeClasses} ${className}`}
    >
      <div className={`flex h-full flex-col items-center text-center ${contentClasses}`}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          {isCenter ? (
            <motion.span
              aria-hidden="true"
              className="absolute -right-2 top-2 z-20 h-[clamp(1.75rem,6vw,2.5rem)] w-[clamp(1.75rem,6vw,2.5rem)] md:-right-3 md:top-3"
              initial={{ opacity: 0.5, scale: 0.78 }}
              animate={{
                opacity: [0.5, 1, 0.65, 0.5],
                scaleX: [0.78, 1.08, 0.88, 0.78],
                scaleY: [0.78, 0.94, 1.08, 0.78],
              }}
              transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute left-1/2 top-1/2 h-[clamp(1.35rem,5.2vw,2.15rem)] w-[clamp(1.35rem,5.2vw,2.15rem)] -translate-x-1/2 -translate-y-1/2 overflow-visible drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]"
              >
                <path
                  d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"
                  fill="white"
                />
                <path
                  d="M50 18 C51 45 55 49 82 50 C55 51 51 55 50 82 C49 55 45 51 18 50 C45 49 49 45 50 18Z"
                  fill="white"
                  opacity="0.72"
                />
              </svg>
            </motion.span>
          ) : null}
          <Image
            src={image}
            alt={`Avatar de ${name}`}
            width={142}
            height={142}
            className={`${avatarClasses} aspect-square max-w-none shrink-0 rounded-full border border-white/25 object-cover`}
          />
        </div>

        <h3 className="mt-[clamp(0.25rem,1vw,0.5rem)] max-w-full font-outfit-sans text-[clamp(0.78rem,3.4vw,1.75rem)] font-normal leading-tight text-white">
          <span className="block max-w-full truncate md:inline">{name}</span>
          <span className="block text-[0.82em] text-white/68 md:inline md:text-[1em] md:text-white">
            <span className="hidden md:inline"> - </span>
            {score}
          </span>
        </h3>

        <div className={`mt-auto flex h-[clamp(1.9rem,7vw,3rem)] w-[clamp(1.9rem,7vw,3rem)] items-center justify-center rounded-full border border-white/70 bg-transparent font-outfit-sans text-[clamp(1rem,4vw,1.5rem)] font-light leading-none text-white ${badgeOffsetClasses}`}>
          {rank}
        </div>
      </div>
    </article>
  );
}
