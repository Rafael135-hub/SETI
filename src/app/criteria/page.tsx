import CriteriaBanner from "../../components/organisms/criteria-banner/criteria-banner";
import Footer from "../../components/organisms/footer/footer";
import Header from "../../components/organisms/header/header";
import {
  defaultFooterSocials,
  defaultHeaderLinks,
  getCriteriaPageData,
} from "../../server/seti/public-page-data";

export const dynamic = "force-dynamic";

export default async function CriteriaPage() {
  const criteriaPageData = await getCriteriaPageData();

  return (
    <main className="seti-page-background relative min-h-screen overflow-x-clip text-white">
      <div className="relative z-10">
        <Header links={defaultHeaderLinks} />
        <CriteriaBanner criteria={criteriaPageData.criteria} />
        <Footer
          socials={defaultFooterSocials}
          signature="MIAU TECH"
        />
      </div>
    </main>
  );
}
