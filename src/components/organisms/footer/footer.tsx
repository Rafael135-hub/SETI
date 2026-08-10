import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  iconSrc: string;
}

interface FooterProps {
  socials: FooterLink[];
  signature: string;
}

export default function Footer({ socials, signature }: FooterProps) {
  return (
    <footer className="relative aspect-[1920/850] min-h-[clamp(15rem,42vw,26rem)] w-full overflow-hidden">
      <Image
        src="/footer-planet.svg?v=20260503-2251"
        alt=""
        aria-hidden="true"
        width={1920}
        height={850}
        className="pointer-events-none absolute inset-y-0 left-1/2 right-auto z-0 h-full w-[max(100%,120rem)] max-w-none -translate-x-1/2 object-cover"
        style={{ 
          objectPosition: "center 60%",
          display: "none"
        }}
      />
      <style>{`
        @media (min-width: 1350px) {
          img[src*="footer-planet"] {
            display: block !important;
          }
        }
      `}</style>

      <div className="relative z-10 flex h-full w-full flex-col justify-end pb-[clamp(1.25rem,4vw,1.75rem)]">
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#9864FF] to-transparent" />

        <div className="mt-[clamp(1.5rem,6vw,4.125rem)] flex w-full flex-col px-[5vw]">
          <div className="flex items-end justify-between gap-[clamp(1rem,4vw,1.5rem)]">
            <div className="flex items-center gap-[clamp(0.75rem,3vw,1.5rem)]">
              {socials.map((social) => (
                <Link
                  key={social.href + social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="block w-[clamp(2.1rem,7vw,2.5rem)] transition-transform hover:scale-105"
                >
                  <Image
                    src={social.iconSrc}
                    alt=""
                    width={150}
                    height={150}
                    className="h-auto w-full"
                  />
                </Link>
              ))}
            </div>

            <p className="font-aquire font-light text-[clamp(1.2rem,5vw,1.875rem)] tracking-[0.05em] text-white/80">
              {signature}
            </p>
          </div>

          <p className="mt-[clamp(1.25rem,4vw,1.875rem)] text-center text-[clamp(0.62rem,1.8vw,0.8rem)] font-light leading-snug text-white/72">
            Music: “Electric Dreams” by Scott Buckley — released under CC BY 4.0. {" "}
            <a
              href="https://www.scottbuckley.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/50 underline-offset-2 transition-colors hover:text-white"
            >
              www.scottbuckley.com.au
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
