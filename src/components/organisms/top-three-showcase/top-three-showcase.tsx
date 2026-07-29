"use client";

import { useEffect, useMemo, useState } from "react";
import LeaderboardCard from "../../molecules/leaderboard-card/leaderboard-card";

interface TopThreeItem {
  rank: 1 | 2 | 3;
  name: string;
  score: string;
  image: string;
}

interface TopThreeShowcaseProps {
  eventYear: number;
  items: TopThreeItem[];
  emptyMessage?: string;
}

function TypedAnnouncement({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let characterIndex = 0;
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setVisibleText(text.slice(0, characterIndex));

      if (characterIndex >= text.length) {
        window.clearInterval(typingTimer);
      }
    }, 42);

    return () => window.clearInterval(typingTimer);
  }, [text]);

  return (
    <span className="hall-announcement-text">
      {visibleText}
      {visibleText.length < text.length ? <span className="hall-announcement-caret" aria-hidden="true" /> : null}
    </span>
  );
}

export default function TopThreeShowcase({
  eventYear,
  items,
  emptyMessage = "O placar ainda nao possui turmas pontuadas.",
}: TopThreeShowcaseProps) {
  const [revealStage, setRevealStage] = useState(0);
  const sortedItems = [...items].sort((a, b) => a.rank - b.rank);
  const first = sortedItems.find((item) => item.rank === 1);
  const second = sortedItems.find((item) => item.rank === 2);
  const third = sortedItems.find((item) => item.rank === 3);
  const hasItems = Boolean(first || second || third);
  const winnerName = first?.name ?? "a sala vencedora";

  useEffect(() => {
    if (!hasItems) return;

    const revealTimers = [
      window.setTimeout(() => setRevealStage(1), 2_200),
      window.setTimeout(() => setRevealStage(2), 6_500),
      window.setTimeout(() => setRevealStage(3), 10_500),
      window.setTimeout(() => setRevealStage(4), 15_000),
    ];

    return () => revealTimers.forEach((timer) => window.clearTimeout(timer));
  }, [hasItems]);

  const revealTitle = useMemo(() => {
    switch (revealStage) {
      case 1:
        return "Vamos ao 3º lugar!";
      case 2:
        return "Agora vamos aos vice-campeões!";
      case 3:
        return `E agora? Qual sala será a campeã da SETI ${eventYear}?`;
      case 4:
        return `Parabéns ${winnerName}!! Vencedores da SETI ${eventYear}!!!`;
      default:
        return `Vamos descobrir os vencedores da SETI ${eventYear}?`;
    }
  }, [eventYear, revealStage, winnerName]);

  return (
    <section className="relative flex min-h-0 flex-1 overflow-visible px-[5vw] pb-[clamp(2rem,7vw,2.5rem)] pt-[clamp(1.5rem,5vw,2rem)] md:pb-0">
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1120px] flex-1 flex-col">
        <div className="shrink-0 text-center md:min-h-0 md:basis-0 md:grow-[0.32] md:shrink">
          <h1 className="hall-announcement relative left-1/2 w-[90vw] max-w-none -translate-x-1/2 font-outfit-sans text-[clamp(1.7rem,5vw,2.65rem)] font-light leading-[1.04] text-white">
            <span className="invisible" aria-hidden="true">{revealTitle}</span>
            <span className="absolute inset-0">
              <TypedAnnouncement key={revealStage} text={revealTitle} />
            </span>
          </h1>
        </div>

        {hasItems ? (
          <>
            <div className="hidden md:block md:min-h-0 md:flex-[0.2]" aria-hidden="true" />
            <div className="relative z-10 mt-auto flex min-h-0 flex-1 items-end justify-center gap-[clamp(0.45rem,2.2vw,3.875rem)] pt-[clamp(3.75rem,14vw,5rem)] md:mt-0 md:pt-0">
              {second ? (
                <div className="hall-podium-reveal hall-podium-rank-2 flex h-[88%] max-h-[28rem] items-end md:max-h-none">
                  <LeaderboardCard
                    rank={second.rank}
                    name={second.name}
                    score={second.score}
                    image={second.image}
                    variant="side"
                  />
                </div>
              ) : null}

              {first ? (
                <div className="hall-podium-reveal hall-podium-rank-1 flex h-full max-h-[32rem] items-end md:max-h-none">
                  <LeaderboardCard
                    rank={first.rank}
                    name={first.name}
                    score={first.score}
                    image={first.image}
                    variant="center"
                  />
                </div>
              ) : null}

              {third ? (
                <div className="hall-podium-reveal hall-podium-rank-3 flex h-[80%] max-h-[25.5rem] items-end md:max-h-none">
                  <LeaderboardCard
                    rank={third.rank}
                    name={third.name}
                    score={third.score}
                    image={third.image}
                    variant="side"
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="my-auto pt-[clamp(3rem,12vw,4.5rem)] text-center">
            <p className="font-outfit-sans text-[clamp(1rem,3.8vw,1.35rem)] text-white/78">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
