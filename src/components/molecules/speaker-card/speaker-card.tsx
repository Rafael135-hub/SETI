import Image from "next/image";
import Link from "next/link";

export interface SpeakerLink {
  url: string;
  image: string;
  label?: string;
}

export interface SpeakerCardProps {
  picture: string;
  name: string;
  title: string;
  description: string;
  position: string;
  classroom: string;
  links?: SpeakerLink[];
  link?: SpeakerLink;
}

export default function SpeakerCard({
  picture,
  name,
  title,
  description,
  position,
  classroom,
  links,
  link,
}: SpeakerCardProps) {
  const speakerLinks = links?.length ? links : link ? [link] : [];

  return (
    <article className="seti-glass-frame mx-auto w-full rounded-[clamp(0.9rem,2.5vw,1.25rem)] p-[clamp(0.5rem,1.5vw,0.875rem)]">
      <div className="seti-glass-inner rounded-[clamp(0.75rem,2vw,0.875rem)] px-[clamp(1rem,5vw,3rem)] py-[clamp(1.1rem,4.5vw,2.75rem)]">
        <div className="flex w-full flex-col items-start justify-center gap-[clamp(1rem,4vw,2.75rem)] md:flex-row md:items-center md:justify-center">
          <Image
            src={picture}
            alt={`Foto de ${name}`}
            width={205}
            height={205}
            unoptimized
            className="mx-auto h-[clamp(7.25rem,34vw,12.8125rem)] w-[clamp(7.25rem,34vw,12.8125rem)] rounded-full border border-white/22 object-cover md:mx-0"
          />

          <div className="flex-1">
            <h3 className="font-outfit-sans text-[clamp(1.55rem,6.5vw,2.6875rem)] leading-[1.05] tracking-[0.05em] font-normal text-white sm:tracking-[0.08em]">
              {name}
            </h3>
            <p className="mt-[clamp(0.85rem,2.5vw,1rem)] text-[clamp(0.86rem,2.8vw,1.3125rem)] font-normal leading-snug text-white/95">
              {title}
              <span className="text-white/70"> | </span>
              {position} {classroom}
            </p>
            <p className="mt-[clamp(0.65rem,2.4vw,0.75rem)] text-[clamp(0.8rem,2.3vw,1.125rem)] leading-[1.4] font-normal text-white/72">
              {description}
            </p>

            {speakerLinks.length > 0 ? (
              <div className="mt-[clamp(0.9rem,3vw,1rem)] flex items-center gap-[clamp(0.5rem,2vw,0.625rem)]">
                {speakerLinks.map((speakerLink, index) => (
                  <Link
                    key={`${speakerLink.url}-${index}`}
                    href={speakerLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform duration-300 hover:scale-[1.04]"
                  >
                    <Image
                      src={speakerLink.image}
                      alt={speakerLink.label ?? `Contato de ${name}`}
                      width={50}
                      height={50}
                      unoptimized
                      className="h-[clamp(2.25rem,8vw,3.125rem)] w-[clamp(2.25rem,8vw,3.125rem)]"
                    />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
