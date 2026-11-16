import { cases } from "@/content/cases";
import { products, services, studioSupport } from "@/content/services";
import {
  brand,
  caseResultsDisclaimer,
  channelDirectory,
  heroBanners,
  homeCopy,
  homeMetrics,
  metricDisclaimer,
  navItems,
  homeWhatsapp,
  primaryChannels,
  secondaryChannels,
  serviceInterestOptions,
} from "@/content/site";
import type { Metric } from "@/content/types";
import type { PublicCase, PublicHome, PublicMetric, PublicProduct, PublicService } from "./public-types";

function metricText(metric: Metric) {
  return `${metric.value}${metric.unit ?? ""}${metric.qualifier ?? ""}`;
}

function exposeMetrics(items: Metric[], preview: boolean): PublicMetric[] {
  return items
    .filter((item) => item.approvedForPublic || preview)
    .map((item) => ({
      id: item.id,
      text: metricText(item),
      label: item.label,
      sourceBadge: preview && item.sourcePage ? `通案 ${item.sourcePage}` : undefined,
    }));
}

function serviceName(id: string) {
  return services.find((service) => service.id === id)?.name ?? id;
}

function toPublicCase(item: (typeof cases)[number], preview: boolean): PublicCase {
  const metrics = exposeMetrics(item.metrics, preview);
  return {
    slug: item.slug,
    brand: item.brand,
    shortName: item.shortName,
    industry: item.industry,
    title: item.title,
    summary: item.summary,
    challenge: item.challenge,
    strategy: item.strategy,
    execution: item.execution,
    resultsStatement: item.resultsStatement,
    metrics,
    resultsDisclaimer: metrics.length > 0 ? caseResultsDisclaimer : undefined,
    relatedServices: item.relatedServiceIds.map((id) => ({ id, name: serviceName(id) })),
    tone: item.tone,
    sourceBadge: preview ? `通案 ${item.sourcePage}` : undefined,
    coverLabel: `${item.shortName}案例，2025 营销通案完整页面`,
    coverImage: `/assets/case-pages/${item.slug}.webp`,
  };
}

export function toPublicHome(preview: boolean): PublicHome {
  const serviceDirectory: PublicService[] = services.map((service) => ({
    id: service.id,
    name: service.name,
    shortName: service.shortName,
    group: service.group,
    summary: service.summary,
    layout: service.layout,
    points: service.points,
    publicNote: service.publicNote,
    sourceBadge: preview ? `通案 ${service.sourcePage}` : undefined,
  }));
  const publicServices = serviceDirectory.filter((service) => service.group === "core");

  const publicProducts: PublicProduct[] = [
    ...products.map((product) => ({
      id: product.id,
      name: product.name,
      kind: product.kind,
      kicker: product.kicker,
      summary: product.summary,
      capabilities: product.capabilities,
      points: product.capabilities.map((title) => ({ title, text: "" })),
      schematic: product.schematic,
      logo: product.logo,
      kindLabel: "技术产品",
      sourceBadge: preview && /^p\d/.test(product.sourcePage) ? `通案 ${product.sourcePage}` : undefined,
    })),
    {
      id: "strategic-studio",
      name: studioSupport.name,
      kind: "strategy" as const,
      kicker: studioSupport.kicker,
      summary: services.find((service) => service.id === "strategic-studio")?.summary ?? studioSupport.summary,
      capabilities: services.find((service) => service.id === "strategic-studio")?.points.map((point) => point.title) ?? [],
      points: services.find((service) => service.id === "strategic-studio")?.points ?? [],
      schematic: "strategy" as const,
      kindLabel: "策略支持",
      sourceBadge: preview ? "通案 p8、p13" : undefined,
    },
  ];

  const allCases = cases.map((item) => toPublicCase(item, preview));
  const featured = [...cases]
    .filter((item) => item.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((item) => allCases.find((candidate) => candidate.slug === item.slug))
    .filter((item): item is PublicCase => Boolean(item));

  const metrics = exposeMetrics(homeMetrics, preview);
  const whatsappEffects = homeWhatsapp.effects.map((effect) => {
    const [metric] = exposeMetrics([effect.metric], preview);
    return {
      id: effect.id,
      title: effect.title,
      metric: metric
        ? {
            ...metric,
            text:
              effect.id === "acquire"
                ? `+${effect.metric.value}${effect.metric.unit ?? ""}`
                : metric.text,
          }
        : undefined,
      text: effect.text,
      points: effect.points,
      href: effect.href,
    };
  });

  return {
    preview,
    brand,
    nav: navItems,
    banners: heroBanners,
    hero: { title: homeCopy.heroTitle, text: homeCopy.heroText },
    about: {
      title: homeCopy.aboutTitle,
      text: homeCopy.aboutText,
      metrics,
      metricsDisclaimer: metrics.length > 0 ? metricDisclaimer : undefined,
    },
    servicesTitle: homeCopy.servicesTitle,
    services: publicServices,
    serviceDirectory,
    media: {
      title: homeCopy.mediaTitle,
      text: homeCopy.mediaText,
      caveat: homeCopy.mediaCaveat,
      channels: channelDirectory.map((channel) => channel.name),
      primary: primaryChannels,
      secondary: secondaryChannels,
    },
    whatsapp: {
      kicker: homeWhatsapp.kicker,
      title: homeWhatsapp.title,
      text: homeWhatsapp.text,
      productsTitle: homeWhatsapp.productsTitle,
      products: homeWhatsapp.products,
      effectsTitle: homeWhatsapp.effectsTitle,
      effectsHint: homeWhatsapp.effectsHint,
      effects: whatsappEffects,
      effectsDisclaimer:
        whatsappEffects.some((effect) => effect.metric) ? homeWhatsapp.effectsDisclaimer : undefined,
    },
    techTitle: homeCopy.techTitle,
    products: publicProducts,
    casesTitle: homeCopy.casesTitle,
    cases: featured,
    allCases,
    clients: {
      caption: homeCopy.clientsCaption,
      names: cases.map((item) => item.shortName),
    },
    honorsNote: preview ? "荣誉资料尚未确认获奖主体，正式页面不展示奖项名称。" : undefined,
    contact: {
      title: homeCopy.contactTitle,
      text: homeCopy.contactText,
      privacyText: preview ? "当前为开发预览。咨询信息不会转交给接收团队。" : homeCopy.privacyText,
      serviceOptions: serviceInterestOptions,
    },
    footer: { blurb: homeCopy.footerBlurb },
  };
}
