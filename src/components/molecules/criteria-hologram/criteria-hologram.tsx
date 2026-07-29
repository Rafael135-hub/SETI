import Image from "next/image";

interface CriteriaHologramProps {
  image?: string;
  imageAlt?: string;
  penalty: string;
  ctaLabel?: string;
  className?: string;
}

const DEFAULT_CRITERIA_IMAGE = "/images/criteria-s23fe-purple-2.png";

function PenaltyLabel({ penalty }: { penalty: string }) {
  const match = penalty.match(/^(.*?)([+-]?\d+)$/);

  if (!match) {
    return <>{penalty}</>;
  }

  return (
    <>
      <span>{match[1]}</span>
      <span className="criteria-points-window" aria-label={match[2]}>
        <span key={match[2]} className="criteria-points-number">
          {match[2]}
        </span>
      </span>
    </>
  );
}

function HologramImage({ image, imageAlt }: Pick<CriteriaHologramProps, "image" | "imageAlt">) {
  return (
    <Image
      src={image ?? DEFAULT_CRITERIA_IMAGE}
      alt={imageAlt ?? "Celular do criterio"}
      width={512}
      height={512}
      priority
      className="criteria-hologram-image h-[clamp(12.5rem,54vw,18.75rem)] w-auto object-contain"
    />
  );
}

export default function CriteriaHologram({
  image,
  imageAlt,
  penalty,
  className = "",
}: CriteriaHologramProps) {
  const isPositive = penalty.includes("+");

  return (
    <article
      className={`criteria-hologram relative mx-auto flex h-[clamp(19.75rem,82vw,27.375rem)] w-full max-w-[600px] items-end justify-center ${className}`}
    >
      <div className="pointer-events-none absolute bottom-[clamp(2.25rem,9vw,3.25rem)] h-[clamp(13rem,54vw,17.875rem)] w-full rounded-full bg-[#9864FF]/28 blur-[60px]" />
      <div className="pointer-events-none absolute bottom-[clamp(7.6rem,31vw,10.375rem)] h-[clamp(8.5rem,35vw,11.5rem)] w-[68%] rounded-full bg-[#9864FF]/20 blur-[38px]" />

      <div className="pointer-events-none absolute bottom-[clamp(2.6rem,10vw,3.625rem)] z-10 h-[clamp(5.3rem,22vw,7.25rem)] w-full overflow-hidden bg-linear-to-b from-[#9864FF]/30 via-[#6C36B8]/20 to-[#2B174E]/42">
        <span className="absolute left-0 top-0 h-full w-px bg-[#B993FF]/22" />
        <span className="absolute right-0 top-0 h-full w-px bg-[#B993FF]/22" />
      </div>

      <div className="pointer-events-none absolute bottom-[clamp(5.9rem,24vw,8.5rem)] z-20 h-[clamp(4rem,15vw,5.125rem)] w-full rounded-[100%] bg-[#9864FF] shadow-[0_0_30px_rgba(152,100,255,0.68)]">
        <span className="absolute inset-0 rounded-[100%] border border-[#D8BDFF]/25" />
      </div>

      <div className="pointer-events-none absolute bottom-[clamp(1rem,4vw,1.5rem)] z-20 h-[clamp(3.25rem,13vw,4.375rem)] w-full rounded-[100%] bg-linear-to-r from-[#6F3AC6]/76 via-[#9864FF]/84 to-[#7844D6]/76 shadow-[0_14px_34px_rgba(152,100,255,0.34)]" />

      <div className="relative z-30 mb-[clamp(6.9rem,28vw,10.125rem)]">
        <HologramImage image={image} imageAlt={imageAlt} />
      </div>

      <p className={`criteria-penalty ${isPositive ? "criteria-penalty-positive" : "criteria-penalty-negative"} absolute bottom-[clamp(3rem,12vw,4.375rem)] z-40 rounded-[8px] border px-[clamp(1rem,4vw,1.5rem)] py-[clamp(0.35rem,1.6vw,0.5rem)] font-outfit-sans text-[clamp(0.7rem,2.5vw,0.875rem)] font-medium shadow-[0_8px_18px_rgba(0,0,0,0.35)]`}>
        <PenaltyLabel penalty={penalty} />
      </p>
    </article>
  );
}
