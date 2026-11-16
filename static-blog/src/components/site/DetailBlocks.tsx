import Link from "next/link";
import { ProductExperience } from "@/components/home/ProductExperience";
import { productArtFor } from "@/content/product-art";
import { productVisuals, serviceVisuals } from "@/content/interior";
import type { PublicCase, PublicProduct, PublicService } from "@/lib/content/public-types";
import { Action, Art, CaseArtwork, CaseTiles, ConsultStrip, InteriorHero, Metrics, Ribbon, SectionHead, Steps, consultHref } from "./Interior";
import { InteriorJourney } from "./InteriorJourney";

export function CaseBody({ item }: { item: PublicCase }) {
  return <article className="ip-page ip-case-detail" data-case-tone={item.tone}>
    <InteriorHero label={item.industry} title={item.brand} lead={item.title} back={{ href: "/cases#stories", label: `客户案例 / ${item.industry}` }}
      visual={<CaseArtwork item={item} />}><Action href="#project">阅读项目过程</Action></InteriorHero>
    <section className="ip-wrap ip-section" id="project">
      <SectionHead title="项目概览" text={item.summary} />
      <Steps ordered items={[{ title: "业务挑战", text: item.challenge }, { title: "服务策略", text: item.strategy }]} />
    </section>
    {item.execution.length > 0 && <section className="ip-wrap ip-section"><SectionHead title="执行内容" /><Steps ordered items={item.execution.map((text, index) => ({ title: `执行 ${String(index + 1).padStart(2, "0")}`, text }))} /></section>}
    {(item.resultsStatement || item.metrics.length > 0) && <section className="ip-wrap ip-section"><div className="ip-results">
      <SectionHead title="项目成果" text={item.resultsStatement} />
      <Metrics metrics={item.metrics} note={item.resultsDisclaimer} />
    </div></section>}
    {item.relatedServices.length > 0 && <section className="ip-wrap ip-section"><SectionHead title="项目相关服务" /><div className="ip-jump">{item.relatedServices.map(service => <Link key={service.id} href={`/services/${service.id}`}>{service.name}<span aria-hidden="true">↗</span></Link>)}</div></section>}
    <ConsultStrip service={item.relatedServices[0]?.name}>告诉我们你的业务目标和市场计划，聊聊适合你的执行路径。</ConsultStrip>
  </article>;
}

export function ServiceBody({ service, cases }: { service: PublicService; cases: PublicCase[] }) {
  const design = serviceVisuals[service.id];
  const related = cases.filter(item => item.relatedServices.some(entry => entry.id === service.id));
  return <article className={`ip-page ip-service-detail ip-service-${service.layout}`} data-theme={design?.theme}>
    <InteriorHero label={service.name} title={design?.title ?? service.name} lead={design?.output ?? service.summary}
      theme={design?.theme} back={{ href: `/services#${service.id}`, label: `服务与方案 / ${service.name}` }}
      visual={design && <div className="ip-service-hero-art"><Art src={`/assets/service-materials/${design.art}.png`} priority /><Ribbon steps={design.steps} /></div>}>
      <Action href={consultHref(service.name)}>咨询这项服务</Action><Action href="#capabilities" secondary>看具体怎么做</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="capabilities">
      <SectionHead title={service.name} text={service.summary} />
      {service.points.length > 0 && <InteriorJourney title={service.name} panels={service.points.map((point, index) => ({
        label: point.title, content: <article className="ip-service-workflow">
          <div className="ip-workflow-scene" aria-hidden="true">{service.points.map((step, stepIndex) => <span key={step.title} data-current={stepIndex === index} />)}</div>
          <div><p className="ip-label">{service.name}</p><h3>{point.title}</h3><p>{point.text}</p></div>
        </article>,
      }))} />}
    </section>
    {service.id === "ad-asset-operations" && <section className="ip-wrap ip-section"><SectionHead title="也可以了解 Panda Rocket" text="如果你希望让团队自助管理广告账户，可以先看账户接入、余额管理和数据监测演示。" /><Action href="/products/pandarocket#demo" secondary>看产品操作演示</Action></section>}
    {related.length > 0 && <section className="ip-wrap ip-section"><SectionHead title="相关项目案例" /><CaseTiles cases={related.slice(0, 3)} /></section>}
    <ConsultStrip service={service.name}>告诉我们你目前的业务阶段，一起确定需要优先解决的问题。</ConsultStrip>
  </article>;
}

export function ProductBody({ product }: { product: PublicProduct }) {
  const design = productVisuals[product.id];
  const art = productArtFor(product.id);
  const points = product.points.length ? product.points : product.capabilities.map(title => ({ title, text: "" }));
  return <article className="ip-page ip-product-detail" data-theme={design?.theme}>
    <InteriorHero label={product.name} title={design?.title ?? product.name} lead={product.summary} theme={design?.theme} logo={product.logo}
      back={{ href: "/products#product-directory", label: "技术产品" }}
      visual={art && <div className="ip-product-detail-art"><Art src={art.src} alt={art.alt} priority />{design && <Ribbon steps={design.steps} />}</div>}>
      <Action href="#demo">看操作演示</Action><Action href={consultHref(product.name)} secondary>咨询产品方案</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="demo">
      <SectionHead label={product.name} title="看一遍产品怎么用" text="以下为模拟工作台。可播放演示，也可直接选择要查看的步骤。" />
      <div className="ip-demo"><ProductExperience productId={product.id} /></div>
    </section>
    {points.length > 0 && <section className="ip-wrap ip-section"><SectionHead title="能帮团队做什么" /><Steps items={points} /></section>}
    <ConsultStrip service={product.name}>说说你目前的工作流程，一起看看这款产品能从哪里帮上忙。</ConsultStrip>
  </article>;
}
