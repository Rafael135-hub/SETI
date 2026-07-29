"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface DeveloperSocial {
  label: string;
  href: string;
}

interface DeveloperItem {
  id: string;
  picture: string;
  name: string;
  role: string;
  description?: string;
  socials: DeveloperSocial[];
}

interface ProfileBannerProps {
  title: string;
  developers: DeveloperItem[];
}

const FALLBACK_DEVELOPER: DeveloperItem = {
  id: "default",
  picture: "/images/speaker-grazielly.png",
  name: "Equipe SETI",
  role: "UI UX | Front End Developer",
  description: "Equipe de desenvolvimento da plataforma SETI 2026.",
  socials: [
    { label: "in", href: "https://www.linkedin.com" },
    { label: "gh", href: "https://github.com" },
    { label: "in", href: "https://www.linkedin.com" },
  ],
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`h-3.5 w-3.5 border-b border-r border-white/70 ${
        direction === "left" ? "rotate-[135deg]" : "-rotate-45"
      }`}
    />
  );
}

export default function ProfileBanner({ title, developers }: ProfileBannerProps) {
  const items = useMemo(() => (developers.length > 0 ? developers : [FALLBACK_DEVELOPER]), [developers]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const activeDeveloper = items[currentIndex] ?? items[0];

  const canNavigate = items.length > 1;

  const showPrevious = () => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => (previous - 1 + items.length) % items.length);
  };

  const showNext = () => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => (previous + 1) % items.length);
  };

  return (
    <section className="px-4 py-16 sm:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1020px]">
        <h2 className="text-center font-outfit-sans text-[32px] text-white sm:text-[36px] md:text-[42px]">
          {title}
        </h2>

        <article className="seti-glass-frame relative mt-8 rounded-[18px] p-2.5 md:mt-10 md:rounded-[20px] md:p-3">
          <div className="seti-glass-inner rounded-[14px] px-5 py-6 md:px-9 md:py-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  onClick={showPrevious}
                  disabled={!canNavigate}
                  aria-label="Desenvolvedor anterior"
                  className="absolute -left-9 flex h-7 w-7 items-center justify-center bg-transparent text-white transition-opacity hover:opacity-100 disabled:opacity-45 md:-left-10"
                >
                  <Arrow direction="left" />
                </button>

                <Image
                  src={activeDeveloper.picture}
                  alt={`Foto de ${activeDeveloper.name}`}
                  width={170}
                  height={170}
                  unoptimized
                  className="h-[138px] w-[138px] rounded-full border border-white/22 object-cover md:h-[170px] md:w-[170px]"
                />

                <button
                  type="button"
                  onClick={showNext}
                  disabled={!canNavigate}
                  aria-label="Proximo desenvolvedor"
                  className="absolute -right-9 flex h-7 w-7 items-center justify-center bg-transparent text-white transition-opacity hover:opacity-100 disabled:opacity-45 md:-right-10"
                >
                  <Arrow direction="right" />
                </button>
              </div>

              <div className="w-full max-w-[560px] text-center md:text-left">
                <h3 className="font-outfit-sans text-[22px] tracking-[0.05em] text-white md:text-[30px]">
                  {activeDeveloper.name}
                </h3>
                <p className="mt-2 text-[12px] text-white/76 md:text-[14px]">{activeDeveloper.role}</p>
                {activeDeveloper.description ? (
                  <p className="mt-3 text-[12px] leading-[1.4] text-white/65 md:text-[14px]">
                    {activeDeveloper.description}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                  {activeDeveloper.socials.map((social) => (
                    <Link
                      key={social.href + social.label}
                      href={social.href}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-seti-purple-85/75 bg-linear-to-b from-white to-seti-purple-75 text-[12px] font-semibold text-seti-purple-05 transition-transform hover:scale-105 md:h-8 md:w-8"
                    >
                      {social.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
