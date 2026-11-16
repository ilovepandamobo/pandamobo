import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Action, CaseTiles, ConsultStrip, InteriorHero, SectionHead, Steps } from "@/components/site/Interior";
import { IndustryVisual } from "@/components/site/IndustryVisual";
import { industries } from "@/content/industries";
import { industryVisuals } from "@/content/interior";
import { getPublicHome } from "@/lib/content/get-public-home";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find(item => item.slug === slug);
  return { title: industry ? `${industry.name} | PandaMobo 熊猫新媒` : "行业解决方案 | PandaMobo 熊猫新媒", description: industryVisuals[slug]?.intro };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const industry = industries.find(item => item.slug === slug);
  if (!industry) notFound();
  const visual = industryVisuals[industry.slug];
  const matches = new Set<string>(industry.matches);
  const allCases = getPublicHome().allCases;
  const cases = allCases.filter(item => matches.has(item.industry));
  return <main id="main" className="ip-page ip-solution-detail" data-theme={visual.theme}>
    <InteriorHero label={industry.name} title={visual.title} lead={visual.intro} theme={visual.theme}
      back={{ href: "/solutions#industry-directory", label: `行业解决方案 / ${industry.name}` }}
      visual={<IndustryVisual item={allCases.find(item => item.slug === visual.cover)} travel={industry.slug === "travel"} />}>
      <Action href="#approach">查看执行思路</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="approach"><SectionHead title="从这三步开始" /><Steps items={visual.steps} ordered /></section>
    {cases.length > 0 && <section className="ip-wrap ip-section"><SectionHead title="同行业项目案例" /><CaseTiles cases={cases} /></section>}
    <ConsultStrip service={industry.name}>告诉我们你想进入的地区、当前阶段和希望解决的问题。</ConsultStrip>
  </main>;
}
