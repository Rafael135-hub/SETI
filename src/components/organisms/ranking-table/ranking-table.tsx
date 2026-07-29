import type { RankingItemData } from "../../../server/seti/public-page-data";

interface RankingTableProps {
  items: RankingItemData[];
  title?: string;
  isPreview?: boolean;
}

const columns = [
  { key: "name", label: "Sala" },
  { key: "initialPoints", label: "Pontuacao inicial" },
  { key: "additionalPoints", label: "Pontos adicionais" },
  { key: "deductedPoints", label: "Pontos descontados" },
  { key: "finalPoints", label: "Pontuacao final" },
] as const;

function points(value: number) {
  return `${value} pts`;
}

export default function RankingTable({ items, title = "Ranking geral", isPreview = false }: RankingTableProps) {
  return (
    <section aria-labelledby="ranking-title" className={`${isPreview ? "mt-[clamp(3rem,7vw,5rem)]" : "mt-[clamp(4rem,10vw,7rem)]"} mb-[clamp(4rem,10vw,7rem)] w-full px-[5vw]`}>
      <h2 id="ranking-title" className={`${isPreview ? "mb-[clamp(2rem,5vw,3rem)]" : "mb-6"} text-[clamp(1.7rem,5vw,2.65rem)] font-light leading-[1.04] text-center font-outfit-sans text-white`}>
        {title}
      </h2>

      <div className="ranking-table-shell overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left font-outfit-sans text-[clamp(0.68rem,1.3vw,0.9rem)] text-white">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="ranking-table-head px-4 py-3 font-normal whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="ranking-table-row">
                <th scope="row" className="px-4 py-3 font-light whitespace-nowrap">{item.name}</th>
                <td className="px-4 py-3 font-light whitespace-nowrap">{points(item.initialPoints)}</td>
                <td className="px-4 py-3 font-light whitespace-nowrap">{points(item.additionalPoints)}</td>
                <td className="px-4 py-3 font-light whitespace-nowrap">{points(item.deductedPoints)}</td>
                <td className="px-4 py-3 font-normal whitespace-nowrap">{points(item.finalPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
