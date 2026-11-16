import type { Metadata } from "next";
import { Suspense } from "react";
import { Action, CaseArtwork, ConsultStrip, InteriorHero, SectionHead } from "@/components/site/Interior";
import { CaseBrowser } from "@/components/site/CaseBrowser";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "成功案例 | PandaMobo 熊猫新媒", description: "按行业查看 PandaMobo 的出海项目，了解客户面对的问题、执行策略和项目成果。" };

export default function CasesPage() {
  const cases = getPublicHome().allCases;
  const featured = cases.find(item => item.slug === "mixue") ?? cases[0];
  return <main id="main" className="ip-page ip-cases" data-theme="warm">
    {featured && <InteriorHero label="客户案例" title="出海策略，落到真实项目里" lead="从区域品牌传播到应用和游戏发行，看看不同团队面对了什么问题，又是如何把方案落到执行的。" theme="warm" visual={<CaseArtwork item={featured} cover />}>
      <Action href="#stories">按行业浏览案例</Action><Action href={`/cases/${featured.slug}`} secondary>查看{featured.shortName}案例</Action>
    </InteriorHero>}
    <section className="ip-wrap ip-section" id="stories">
      <SectionHead title="出海案例" text={`按行业查找 ${cases.length} 个项目。`} />
      <Suspense fallback={<p>正在读取案例。</p>}><CaseBrowser cases={cases} /></Suspense>
    </section>
    <ConsultStrip title="有类似的业务挑战？">告诉我们你想进入的市场和目前的进度，一起讨论适合你的做法。</ConsultStrip>
  </main>;
}
