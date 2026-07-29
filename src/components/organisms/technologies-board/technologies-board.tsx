interface TechnologyItem {
  id: string;
  name: string;
  icon: "circle" | "bolt";
}

interface TechnologyGroup {
  id: string;
  title: string;
  items: TechnologyItem[];
}

interface TechnologiesBoardProps {
  title: string;
  groups: TechnologyGroup[];
}

function CircleTechIcon() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-linear-to-b from-white to-seti-purple-75 font-orbitron text-[18px] text-seti-purple-10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      N
    </span>
  );
}

function BoltTechIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-11 w-11 fill-white drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]" aria-hidden="true">
      <path d="M14.2 1.8L3 13h6.8l-1.4 9.2L21 9h-7l.2-7.2z" />
    </svg>
  );
}

function TechnologyCard({ group }: { group: TechnologyGroup }) {
  return (
    <article className="seti-glass-frame rounded-[14px] p-2 md:rounded-[16px] md:p-2.5">
      <div className="seti-glass-inner rounded-[10px] px-3 py-4 md:px-5 md:py-5">
        <h3 className="text-center text-[11px] text-seti-purple-85 md:text-[12px]">{group.title}</h3>

        <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4 md:mt-5 md:gap-x-5">
          {group.items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-1.5">
              {item.icon === "circle" ? <CircleTechIcon /> : <BoltTechIcon />}
              <span className="text-[8px] text-white/68 md:text-[9px]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function TechnologiesBoard({ title, groups }: TechnologiesBoardProps) {
  return (
    <section className="px-4 pb-18 pt-8 sm:px-8 md:pb-24 md:pt-10">
      <div className="mx-auto w-full max-w-[980px]">
        <h2 className="text-center font-outfit-sans text-[32px] text-white sm:text-[36px] md:text-[42px]">
          {title}
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2 md:gap-5">
          {groups.map((group) => (
            <TechnologyCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
