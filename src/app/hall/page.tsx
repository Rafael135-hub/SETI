import Footer from "../../components/organisms/footer/footer";
import Header from "../../components/organisms/header/header";
import RankingTable from "../../components/organisms/ranking-table/ranking-table";
import TopThreeShowcase from "../../components/organisms/top-three-showcase/top-three-showcase";
import {
  defaultFooterSocials,
  defaultHeaderLinks,
  getHallPageData,
} from "../../server/seti/public-page-data";

export const dynamic = "force-dynamic";

export default async function HallPage() {
  const hallPageData = await getHallPageData();

  return (
    <main className="seti-page-background relative isolate min-h-screen overflow-visible text-white">
      {hallPageData.isClosed ? <div className="hall-podium-background pointer-events-none absolute left-1/2 top-0 z-0 hidden h-[100svh] w-[110vw] -translate-x-1/2 md:block" aria-hidden="true" /> : null}
      <div className="relative z-10">
        {hallPageData.isClosed ? (
          <div className="flex min-h-svh flex-col">
            <Header links={defaultHeaderLinks} />
            <TopThreeShowcase
              eventYear={hallPageData.eventYear}
              items={hallPageData.items}
            />
          </div>
        ) : (
          <Header links={defaultHeaderLinks} />
        )}

        <RankingTable
          items={hallPageData.ranking}
          title={hallPageData.isClosed ? undefined : hallPageData.title}
          isPreview={!hallPageData.isClosed}
        />

        <Footer
          socials={defaultFooterSocials}
          signature="MIAU TECH"
        />
      </div>
    </main>
  );
}
