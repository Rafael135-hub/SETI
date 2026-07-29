import Link from "next/link";

interface TitlePart {
  text: string;
  highlight?: boolean;
}

interface AboutUsBannerProps {
  titleParts: TitlePart[];
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function AboutUsBanner({
  titleParts,
  subtitle,
  ctaLabel,
  ctaHref,
}: AboutUsBannerProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-22 pt-28 sm:px-8 md:px-12 md:pb-28 md:pt-34">
      <div className="pointer-events-none absolute -top-[24px] left-1/2 h-[228px] w-[1120px] max-w-[165%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(167,122,255,0.34)_0%,_rgba(127,63,255,0.11)_50%,_rgba(127,63,255,0)_78%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[184px] h-[188px] w-[178%] -translate-x-1/2 rounded-[100%] border-b border-seti-purple-70/70 shadow-[0_28px_62px_rgba(127,63,255,0.65)] sm:h-[228px] md:top-[210px] md:h-[258px]" />
      <div className="pointer-events-none absolute left-[6.5%] top-[228px] h-[40px] w-[40px] rounded-full bg-white shadow-[0_0_42px_14px_rgba(167,122,255,0.75)] sm:h-[52px] sm:w-[52px] md:top-[252px] md:h-[58px] md:w-[58px]" />
      <div className="pointer-events-none absolute right-[7.5%] top-[212px] h-[54px] w-[54px] rounded-full bg-white shadow-[0_0_52px_18px_rgba(167,122,255,0.8)] sm:h-[72px] sm:w-[72px] md:top-[244px] md:h-[78px] md:w-[78px]" />

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center text-center">
        <h1 className="max-w-[780px] font-outfit-sans text-[36px] leading-[1.15] tracking-[-0.01em] text-white sm:text-[44px] md:text-[58px]">
          {titleParts.map((part) => (
            <span key={`${part.text}-${part.highlight ? "h" : "n"}`} className={part.highlight ? "text-seti-purple-80" : "text-white"}>
              {part.text}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-[610px] text-[11px] leading-[1.45] tracking-[0.08em] text-white/58 sm:text-[12px] md:text-[14px]">
          {subtitle}
        </p>

        <Link
          href={ctaHref}
          className="mt-7 inline-flex items-center gap-2 text-[11px] text-white/85 transition-colors hover:text-white md:mt-8 md:text-[13px]"
        >
          {ctaLabel}
          <span aria-hidden="true" className="text-[15px] leading-none md:text-[16px]">
            &#8964;
          </span>
        </Link>
      </div>
    </section>
  );
}
