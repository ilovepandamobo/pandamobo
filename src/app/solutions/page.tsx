import type { Metadata } from "next";
import { Action, ConsultStrip, InteriorHero, OrbitArt, Ribbon, SectionHead } from "@/components/site/Interior";
import { InteriorJourney } from "@/components/site/InteriorJourney";
import { IndustryVisual } from "@/components/site/IndustryVisual";
import { industries } from "@/content/industries";
import { industryVisuals } from "@/content/interior";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "行业解决方案 | PandaMobo 熊猫新媒", description: "探索跨境电商、游戏、应用与短剧、入境游和汽车五类行业的出海思路与项目案例。" };

export default function SolutionsPage() {
  const { allCases } = getPublicHome();
  return <main id="main" className="ip-page ip-solutions">
    <InteriorHero label="行业解决方案" title="进入新市场，先看懂本地用户" lead="从跨境电商到汽车出海，每个行业都有自己的决策路径。按行业查看推广重点、执行顺序与相关项目。" theme="warm"
      visual={<OrbitArt src="/assets/hero-materials/globe.png" label="五类行业 · 按业务场景探索" />}>
      <Action href="#industry-directory">选择我的行业</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="industry-directory">
      <SectionHead title="按行业查看方案" />
      <InteriorJourney title="选择行业" panels={industries.map(industry => {
        const visual = industryVisuals[industry.slug];
        return { label: industry.name, content: <article className="ip-industry-board" data-theme={visual.theme}>
          <div><h3>{visual.title}</h3><p>{visual.intro}</p><Ribbon steps={visual.steps.map(step => step.title)} /><Action href={`/solutions/${industry.slug}`} secondary>查看行业方案</Action></div>
          <IndustryVisual item={allCases.find(item => item.slug === visual.cover)} travel={industry.slug === "travel"} />
        </article> };
      })} />
    </section>
    <ConsultStrip>带上行业、目标地区和业务目标，我们一起梳理下一步。</ConsultStrip>
  </main>;
}
