export type PublicMetric = {
  id: string;
  text: string;
  label: string;
  sourceBadge?: string;
};

export type PublicService = {
  id: string;
  name: string;
  shortName: string;
  group: "core" | "support";
  summary: string;
  layout: "steps" | "pipeline" | "path" | "dimensions";
  points: { title: string; text: string }[];
  publicNote?: string;
  sourceBadge?: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  kind: "product" | "strategy";
  kicker: string;
  summary: string;
  capabilities: string[];
  points: { title: string; text: string }[];
  schematic: "account" | "social" | "strategy";
  logo?: string;
  sourceBadge?: string;
  kindLabel: string;
};

export type PublicCase = {
  slug: string;
  brand: string;
  shortName: string;
  industry: string;
  title: string;
  summary: string;
  challenge: string;
  strategy: string;
  execution: string[];
  resultsStatement?: string;
  metrics: PublicMetric[];
  resultsDisclaimer?: string;
  relatedServices: { id: string; name: string }[];
  tone: "coral" | "teal" | "ink" | "violet" | "gold" | "green" | "blue" | "amber";
  sourceBadge?: string;
  coverLabel: string;
  coverImage: string;
};

export type PublicBanner = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  primaryLabel: string;
  primaryAction: "consult" | "link";
  primaryHref?: string;
  secondaryLabel: string;
  secondaryHref: string;
  visual: "orbit" | "paths" | "studio";
};

export type PublicHome = {
  preview: boolean;
  brand: { nameEn: string; nameZh: string; slogan: string };
  nav: { label: string; href: string }[];
  banners: PublicBanner[];
  hero: { title: string; text: string };
  about: {
    title: string;
    text: string;
    metrics: PublicMetric[];
    metricsDisclaimer?: string;
  };
  servicesTitle: string;
  services: PublicService[];
  serviceDirectory: PublicService[];
  media: {
    title: string;
    text: string;
    caveat: string;
    channels: string[];
    primary: { name: string; role: string }[];
    secondary: string[];
  };
  whatsapp: {
    kicker: string;
    title: string;
    text: string;
    productsTitle: string;
    products: { id: string; title: string; text: string; href: string }[];
    effectsTitle: string;
    effectsHint: string;
    effects: {
      id: string;
      title: string;
      metric?: PublicMetric;
      text: string;
      points: string[];
      href: string;
    }[];
    effectsDisclaimer?: string;
  };
  techTitle: string;
  products: PublicProduct[];
  casesTitle: string;
  cases: PublicCase[];
  allCases: PublicCase[];
  clients: { caption: string; names: string[] };
  honorsNote?: string;
  contact: { title: string; text: string; privacyText: string; serviceOptions: string[] };
  footer: { blurb: string };
};
