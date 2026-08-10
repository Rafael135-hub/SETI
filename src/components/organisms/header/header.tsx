"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "../../molecules/logo/logo";
import { useMusic } from "../../providers/music-provider";

interface HeaderLink {
  label: string;
  href: string;
}

interface HeaderProps {
  links: HeaderLink[];
}

export default function Header({ links }: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSoundPanelOpen, setIsSoundPanelOpen] = useState<boolean>(false);
  const soundPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isSoundEnabled, volume, setVolume, toggleSound: toggleMusicSound } = useMusic();
  const currentPageLabel = links.find((link) => link.href === pathname)?.label;

  useLayoutEffect(() => {
    const handleScroll = () => {
      const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const visibleContentBottom = window.scrollY + window.innerHeight;
      setScrollProgress(Math.max(0, Math.min((visibleContentBottom / scrollHeight) * 100, 100)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const toggleSound = () => {
    toggleMusicSound();
    setIsSoundPanelOpen(true);
  };

  useEffect(() => {
    if (!isSoundPanelOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (soundPanelRef.current && !soundPanelRef.current.contains(event.target as Node)) {
        setIsSoundPanelOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isSoundPanelOpen]);

  return (
    <>
      {/* Progress indicator — fixed at the very top */}
      <div className="fixed inset-x-0 top-0 z-50 h-[6px] w-full bg-white/30">
        <div className="h-full bg-linear-to-r from-seti-purple-70 via-seti-purple-80 to-white" style={{ width: `${scrollProgress}%` }} />
      </div>

      <header className="relative inset-x-0 top-0 z-40">
        <div className="flex w-full items-center justify-between px-[5vw] pt-[clamp(1.1rem,3vw,1.75rem)]">
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>

          <div className="flex items-center gap-[clamp(0.5rem,2vw,1.5rem)]">
            {currentPageLabel ? (
              <span className="relative hidden pb-[0.35rem] font-outfit-sans text-[clamp(0.85rem,1.5vw,0.9375rem)] leading-none text-seti-purple-85 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-[115%] after:bg-linear-to-r after:from-seti-purple-85 after:to-transparent sm:inline-block">
                {currentPageLabel}
              </span>
            ) : null}

            <div ref={soundPanelRef} className="relative">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={isSoundEnabled ? "Silenciar música" : "Ativar música"}
                aria-expanded={isSoundPanelOpen}
                aria-controls="sound-controls"
                className="flex h-[clamp(2rem,6vw,2.25rem)] w-[clamp(2rem,6vw,2.25rem)] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white/80 outline-none transition-colors hover:text-seti-purple-80"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none">
                  {isSoundEnabled ? (
                    <path d="M4 10v4h4l5 4V6l-5 4H4Zm12 0a3 3 0 0 1 0 4m2-6a6 6 0 0 1 0 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  ) : (
                    <path d="M4 10v4h4l5 4V6l-5 4H4Zm1-6 14 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  )}
                </svg>
              </button>

              {isSoundPanelOpen ? (
                <div id="sound-controls" role="dialog" aria-label="Controles de música" className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(75vw,15rem)] rounded-sm border border-white/15 bg-[#070011]/90 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-orbitron text-[0.68rem] tracking-[0.12em] text-white/90">MÚSICA</span>
                    <button type="button" onClick={() => setIsSoundPanelOpen(false)} className="text-xs text-white/55 hover:text-white" aria-label="Fechar controles de música">✕</button>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-white/65">
                    {isSoundEnabled ? "Som ambiente ativado." : "Ative o som para ouvir a experiência SETI."}
                  </p>
                  <label className="seti-volume-controls flex items-center text-xs text-white/75" style={{ "--volume": `${volume * 100}%` } as React.CSSProperties}>
                    <span aria-hidden="true">🔈</span>
                    <input aria-label="Volume da música" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-full accent-seti-purple-80" />
                    <span aria-hidden="true">🔊</span>
                  </label>
                </div>
              ) : null}
            </div>

            <button
              className="flex h-[clamp(2rem,6vw,2.25rem)] w-[clamp(2rem,6vw,2.25rem)] cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-white outline-none transition-colors hover:text-seti-purple-80"
              aria-label="Abrir menu de navegacao"
              aria-expanded={isMenuOpen}
              aria-controls="menu-sidebar"
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <svg viewBox="0 0 24 24" className="h-[clamp(1.35rem,4vw,1.55rem)] w-[clamp(1.35rem,4vw,1.55rem)]" aria-hidden="true" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[999] transition-opacity duration-300 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={closeMenu}
          className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
        />

        <aside
          id="menu-sidebar"
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-[84vw] max-w-[360px] bg-[#070011]/84 px-6 py-8 shadow-[-18px_0_60px_rgba(0,0,0,0.58),inset_1px_0_0_rgba(255,255,255,0.06),inset_0_0_52px_rgba(127,63,255,0.16)] backdrop-blur-[22px] backdrop-saturate-150 transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-5">
            <p className="font-orbitron text-[clamp(0.9rem,2.8vw,0.9375rem)] tracking-[0.16em] text-white/90">MENU</p>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-[clamp(1.9rem,6vw,2rem)] w-[clamp(1.9rem,6vw,2rem)] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white/75 outline-none transition-colors hover:text-white"
              aria-label="Fechar sidebar"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
                fill="none"
              >
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col gap-3">
              {links.map((link) => {
                const isCurrent = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                    className={`relative block px-0 py-[clamp(0.45rem,1.5vw,0.5rem)] font-outfit-sans text-[clamp(0.95rem,3.2vw,1.0625rem)] transition-colors ${
                        isCurrent
                          ? "text-white drop-shadow-[0_0_16px_rgba(167,122,255,0.48)] before:absolute before:bottom-1 before:left-0 before:h-[1px] before:w-full before:bg-linear-to-r before:from-seti-purple-80 before:via-white/80 before:to-transparent before:shadow-[0_0_12px_rgba(167,122,255,0.7)]"
                          : "text-white/64 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
