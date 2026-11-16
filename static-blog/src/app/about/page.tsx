import type { Metadata } from "next";
import { Action, ConsultStrip, InteriorHero, Metrics, OrbitArt, SectionHead } from "@/components/site/Interior";
import { serviceVisuals } from "@/content/interior";
import { homeCopy } from "@/content/site";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "关于我们 | PandaMobo 熊猫新媒", description: "了解 PandaMobo 熊猫新媒的定位、服务团队和全球媒介渠道。" };

export default function AboutPage() {
  const { about, media, serviceDirectory } = getPublicHome();
  const services = serviceDirectory.filter(service => serviceVisuals[service.id]);
  return <main id="main" className="ip-page ip-about" data-theme="slate">
    <InteriorHero label="关于熊猫新媒" title="陪中国品牌走进全球市场" lead={homeCopy.aboutText} theme="slate"
      visual={<OrbitArt src="/assets/hero-materials/globe.png" label="PandaMobo · Together Go Global" />}>
      <Action href="#advantages">了解我们的服务</Action><Action href="/contact" secondary>联系熊猫新媒</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="position">
      <SectionHead title="把数据与传播放在一起" text={homeCopy.affiliation} />
      <div className="ip-about-position"><p>{homeCopy.heroText}</p><Metrics metrics={about.metrics} note={about.metricsDisclaimer} /></div>
    </section>
    <section className="ip-wrap ip-section" id="advantages">
      <SectionHead title="从策略到执行，一起推进" />
      <div className="ip-option-grid">{services.map(service => <article key={service.id} data-theme={serviceVisuals[service.id].theme}>
        <h3>{service.name}</h3><p>{serviceVisuals[service.id].output}</p><Action href={`/services/${service.id}`} secondary>了解服务</Action>
      </article>)}</div>
    </section>
    <section className="ip-wrap ip-section" id="channels">
      <SectionHead title="媒介与渠道" text="根据目标市场、受众和传播任务选择媒体组合。" />
      <div className="ip-option-grid">{media.primary.map(channel => <article key={channel.name}><h3>{channel.name}</h3><p>{channel.role}</p></article>)}</div>
      <ul className="ip-tags">{media.secondary.map(name => <li key={name}>{name}</li>)}</ul>
    </section>
    <div id="contact"><ConsultStrip>告诉我们目标市场和业务需求，一起讨论接下来可以怎么做。</ConsultStrip></div>
  </main>;
}
