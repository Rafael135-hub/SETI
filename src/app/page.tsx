import Image from "next/image";

import BentoGrid from "../components/organisms/bento-grid/bento-grid";
import CronogramCarousel from "../components/organisms/cronogram-carousel/cronogram-carousel";
import Footer from "../components/organisms/footer/footer";
import Header from "../components/organisms/header/header";
import HomeBanner from "../components/organisms/home-banner/home-banner";
import {
  defaultFooterSocials,
  defaultHeaderLinks,
  getHomePageData,
} from "../server/seti/public-page-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const homePageData = await getHomePageData();

  return (
    <main className="seti-page-background relative min-h-screen overflow-x-clip text-white">
      <Image
        src="/home-planets.svg"
        alt=""
        aria-hidden="true"
        width={1912}
        height={1651}
        priority
        className="pointer-events-none absolute left-1/2 top-0 h-auto max-w-none -translate-x-1/2 select-none"
        style={{ zIndex: 0, width: "max(100vw, 193svh)" }}
      />

      <div className="relative z-10">
        <Header links={defaultHeaderLinks} />

        <HomeBanner
          title="A jornada irá começar!"
          description={homePageData.bannerDescription}
          actions={[
            { label: "Explorar Criterios", href: "/criteria", variant: "stroked" },
            { label: "Explorar Hall da SETI", href: "/hall", variant: "filled" },
          ]}
          scrollLabel={`Ver cronograma ${homePageData.eventYear}`}
        />

        <CronogramCarousel
          title={homePageData.scheduleTitle}
          items={homePageData.scheduleItems}
        />

        <BentoGrid
          title="Quais os objetivos da SETI?"
          description="Transformar de maneira ludica e interativa"
        />

        <Footer
          socials={defaultFooterSocials}
          signature="MIAU TECH"
        />
      </div>
    </main>
  );
}
