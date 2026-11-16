import Link from "next/link";
import { ContactStage } from "./ContactStage";
import type { PublicHome } from "@/lib/content/public-types";
import { HeroScrollLab } from "./HeroScrollLab";
import { Reveal, ServiceRail } from "./motion";
import { CaseStage } from "./CaseStage";
import { ProductShowcase } from "./ProductShowcase";
import { PrimaryChannels } from "./PrimaryChannels";
import { WhatsAppStage } from "./WhatsAppStage";
import { LogoWall } from "./walls";

const serviceOrder = ["ad-asset-operations", "media-operations", "global-brand-marketing", "strategic-studio"];
const productOrder = ["pandarocket", "joinspark", "joincompass", "joinmc"];

export function HomeView({ content }: { content: PublicHome }) {
  const services = serviceOrder
    .map((id) => content.serviceDirectory.find((service) => service.id === id))
    .filter((service): service is PublicHome["serviceDirectory"][number] => Boolean(service));
  const products = productOrder
    .map((id) => content.products.find((product) => product.id === id))
    .filter((product): product is PublicHome["products"][number] => Boolean(product));
  return (
    <main id="main">
      <HeroScrollLab
        banners={content.banners}
        metrics={content.about.metrics}
      />

      <section className="section logo-section screen" id="media">
        <div className="wrap">
          <Reveal>
            <h2 className="section-title">{content.media.title}</h2>
            <p className="lede section-lede">{content.media.text}</p>
          </Reveal>
          <PrimaryChannels channels={content.media.primary} />
        </div>
        <LogoWall names={content.media.secondary} />
        <p className="disclaimer section-disclaimer">{content.media.caveat}</p>
      </section>

      <section className="section screen" id="services">
        <div className="wrap">
          <Reveal>
            <h2 className="section-title">{content.servicesTitle}</h2>
          </Reveal>
          <ServiceRail services={services} />
        </div>
      </section>

      <section className="section screen wa-screen" id="whatsapp">
        <div className="wrap">
          <WhatsAppStage content={content.whatsapp} />
        </div>
      </section>

      <section className="section screen" id="products">
        <div className="wrap">
          <Reveal>
            <h2 className="section-title">{content.techTitle}</h2>
          </Reveal>
          <p className="ps-section-note">技术连接创意、运营与增长</p>
          <ProductShowcase products={products} />
        </div>
      </section>

      <section className="section screen" id="cases">
        <div className="wrap">
          <div className="case-stage-head">
            <h2 className="section-title">{content.casesTitle}</h2>
            <Link href="/cases">全部案例</Link>
          </div>
          <CaseStage
            cases={[
              ...content.cases,
              ...content.allCases.filter((item) => !content.cases.some((featured) => featured.slug === item.slug)),
            ]}
          />
          <p className="disclaimer section-disclaimer">{content.clients.caption}</p>
        </div>
      </section>

      <ContactStage contact={content.contact} />
    </main>
  );
}
