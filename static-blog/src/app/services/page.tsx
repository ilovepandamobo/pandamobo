import type { Metadata } from "next";
import { Action, Art, ConsultStrip, InteriorHero, Ribbon, SectionHead } from "@/components/site/Interior";
import { getPublicHome } from "@/lib/content/get-public-home";
import { serviceVisuals } from "@/content/interior";

export const metadata: Metadata = { title: "优质媒介服务 | PandaMobo 熊猫新媒", description: "从广告资产管理、全渠道代投到品牌出海和策略研究，按业务阶段选择 PandaMobo 的出海服务。" };

export default function ServicesPage() {
  const directory = getPublicHome().serviceDirectory;
  const services = Object.keys(serviceVisuals).flatMap(id => directory.filter(service => service.id === id));
  return <main id="main" className="ip-page ip-services">
    <InteriorHero label="优质媒介服务" title="把出海计划变成可执行的方案" lead="管理广告资产、做好投放与本地传播，再把市场反馈带回下一轮决策。按你的业务阶段，从四项服务里找到合适的切入点。"
      visual={<div className="ip-service-hero-art ip-service-loop"><Art src="/assets/hero-materials/loop.png" priority /><ol aria-label="按服务探索">{services.map(service => <li key={service.id}><a href={`#${service.id}`}>{service.shortName}<span aria-hidden="true">↘</span></a></li>)}</ol></div>}>
      <Action href="#service-directory">探索四项服务</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="service-directory">
      <SectionHead title="找到适合你当前阶段的服务" />
      <nav className="ip-jump" aria-label="服务导航">{services.map(service => <a key={service.id} href={`#${service.id}`}>{service.name}<span aria-hidden="true">↓</span></a>)}</nav>
      <div className="ip-service-list">{services.map(service => {
        const visual = serviceVisuals[service.id];
        return <article key={service.id} id={service.id} className="ip-service-row" data-theme={visual.theme}>
          <div className="ip-service-copy"><p className="ip-label">{service.name}</p><h3>{visual.title}</h3><p>{visual.output}</p><Action href={`/services/${service.id}`} secondary>查看服务详情</Action></div>
          <div className="ip-service-art"><Art src={`/assets/service-materials/${visual.art}.png`} /><Ribbon steps={visual.steps} /></div>
        </article>;
      })}</div>
    </section>
    <ConsultStrip>告诉我们目标市场和你目前卡在哪一步，一起确定优先做什么。</ConsultStrip>
  </main>;
}
