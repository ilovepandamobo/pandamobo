export const SOURCE_DOCUMENT = "PandaMobo 熊猫新媒营销通案【2025 商务版 2.0 】";

export type FactCheckStatus = "verified" | "pending" | "editorial";

export type Fact<T> = {
  value: T;
  sourceDocument: string;
  sourcePage?: string;
  sourceText?: string;
  factCheckStatus: FactCheckStatus;
  approvedForPublic: boolean;
  internalNote?: string;
};

export type Metric = {
  id: string;
  value: string;
  unit?: string;
  qualifier?: string;
  label: string;
  period?: string;
  definition?: string;
  sourceDocument: string;
  sourcePage?: string;
  sourceText?: string;
  factCheckStatus: FactCheckStatus;
  approvedForPublic: boolean;
  internalNote?: string;
};

export type ServicePoint = {
  title: string;
  text: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  group: "core" | "support";
  summary: string;
  layout: "steps" | "pipeline" | "path" | "dimensions";
  points: ServicePoint[];
  publicNote?: string;
  sourcePage: string;
  relatedCaseSlugs: string[];
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  kind: "product" | "strategy";
  kicker: string;
  summary: string;
  capabilities: string[];
  schematic: "account" | "social" | "strategy";
  sourcePage: string;
  logo?: string;
};

export type CaseRecord = {
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
  metrics: Metric[];
  relatedServiceIds: string[];
  tone: "coral" | "teal" | "ink" | "violet" | "gold" | "green" | "blue" | "amber";
  sourcePage: string;
  featured: boolean;
  featuredOrder?: number;
};

export type HonorRecord = {
  id: string;
  group: "enterprise" | "casework" | "partner";
  name: string;
  year: string;
  category: string;
  sourceText: string;
  sourcePage: string;
  awardedTo: string;
  factCheckStatus: FactCheckStatus;
  approvedForPublic: boolean;
  internalNote?: string;
};

export type ChannelRecord = {
  name: string;
  listedInProposal: boolean;
  confirmedQualification: string | null;
  sourcePage: string;
};

export type TimelineRecord = {
  period: string;
  events: string[];
  sourcePage: string;
  approvedForPublic: boolean;
  internalNote?: string;
};

export function pendingMetric(
  partial: Omit<
    Metric,
    "sourceDocument" | "factCheckStatus" | "approvedForPublic"
  > & { approvedForPublic?: boolean; internalNote?: string },
): Metric {
  return {
    sourceDocument: SOURCE_DOCUMENT,
    factCheckStatus: "pending",
    approvedForPublic: false,
    ...partial,
  };
}
