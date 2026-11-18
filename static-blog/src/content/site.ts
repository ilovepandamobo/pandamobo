import { SOURCE_DOCUMENT, pendingMetric, type ChannelRecord, type Fact, type Metric } from "./types";

export const brand = {
  nameEn: "PandaMobo",
  nameZh: "熊猫新媒",
  slogan: "PandaMobo, Together Go Global",
};

export const heroBanners = [
  {
    id: "global",
    kicker: "PANDAMOBO · TOGETHER GO GLOBAL",
    title: "让中国品牌\n走向全球",
    text: "全球媒介 × 品牌策略 × 自研技术\n连接品牌与用户，驱动出海业务增长。",
    primaryLabel: "咨询出海方案",
    primaryAction: "consult" as const,
    secondaryLabel: "查看四大服务",
    secondaryHref: "#services",
    visual: "orbit" as const,
  },
  {
    id: "services",
    kicker: "PANDAMOBO · CONNECTED SERVICES",
    title: "从投放到品牌\n构建出海营销闭环",
    text: "媒介服务、智能代投、品牌全案与全球智库，\n以专业执行与策略支持，协同品牌出海增长。",
    primaryLabel: "查看优质媒介服务",
    primaryAction: "link" as const,
    primaryHref: "/services",
    secondaryLabel: "咨询出海方案",
    secondaryHref: "#contact",
    visual: "paths" as const,
  },
  {
    id: "technology",
    kicker: "PANDAMOBO · INTELLIGENT PRODUCTS",
    title: "让技术与洞察\n支撑全球化决策",
    text: "Panda Rocket · JoinSpark · JoinCompass · JoinMC\n贯通广告资产、创意生成、交互运营与智能营销。",
    primaryLabel: "了解技术产品",
    primaryAction: "link" as const,
    primaryHref: "/products",
    secondaryLabel: "了解全球商业智库",
    secondaryHref: "/services/strategic-studio",
    visual: "studio" as const,
  },
];

export const homeCopy = {
  heroTitle: "数据与传播双基因\n帮助中国品牌走向全球",
  heroText:
    "融合全渠道广告、品牌策略、广告资产运维与自研技术，为中国品牌提供专业、高效的出海营销解决方案。",
  aboutTitle: "依托数据与传播，连接全球增长机遇。",
  aboutText:
    "PandaMobo（熊猫新媒）是久其数字传播核心成员，聚合媒介、创意、技术与策略资源，服务中国品牌的全球化发展。",
  affiliation:
    "PandaMobo（熊猫新媒）隶属于上市公司久其软件（002279），是久其数字传播核心成员。",
  servicesTitle: "四大服务",
  mediaTitle: "媒体矩阵",
  mediaText: "主要合作平台单独列出授权关系，其余渠道作为矩阵补充。",
  mediaCaveat: "次要渠道按名称展示，不逐一改写成同一等级的官方代理。",
  techTitle: "AI 产品",
  casesTitle: "案例展示",
  clientsCaption: "以下名称来自通案中的具名案例，不代表客户对官网背书，也不表示当前仍在合作。",
  contactTitle: "联系我们",
  contactText: "留下基本信息，并告诉我们你希望在出海过程中获得哪些帮助。",
  footerBlurb:
    "依托数据与传播双基因，PandaMobo 融合全渠道广告、品牌策略、广告资产运维与自研技术，帮助中国品牌连接全球市场。",
  privacyText:
    "您同意提交后，表单中的联系方式和其他填写内容会发送给咨询接收团队，用于回复和跟进本次咨询。您可以只填写一种联系方式。",
};

export const homeMetrics: Metric[] = [
  pendingMetric({
    id: "scale",
    value: "30",
    unit: "亿",
    label: "年业务规模",
    sourcePage: "p2",
    sourceText: "年业务规模30亿",
    internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 未注明币种、年度与统计口径。",
  }),
  pendingMetric({
    id: "reach",
    value: "4",
    unit: "亿",
    label: "日触达海外用户",
    sourcePage: "p2",
    sourceText: "日触达海外用户4亿",
    internalNote: "未注明去重口径，不补写独立用户。",
  }),
  pendingMetric({
    id: "brands",
    value: "5000",
    qualifier: "+",
    label: "携手品牌",
    sourcePage: "p5",
    sourceText: "携手5000+品牌赢得国际竞争",
    internalNote: "5000+ 为通案统计，范围与时间待核实。不与 600+ 代投客户混为同一口径。",
  }),
];

export const metricDisclaimer = "据2025商务通案，统计口径待确认";

export const caseResultsDisclaimer = "据2025商务通案记载的历史案例数据，不是当前实时数据或效果承诺。";

export const homeChannels = ["Meta", "Google", "TikTok", "Taboola", "X", "Kwai", "Quora", "Yandex"];

export const channelDirectory: ChannelRecord[] = [
  "Meta",
  "Google",
  "TikTok",
  "Taboola",
  "X",
  "Kwai",
  "Quora",
  "Yandex",
  "Snapchat",
  "Pinterest",
  "Bing",
  "Criteo",
  "VK",
  "Outbrain",
  "NewsBreak",
  "LINE",
  "Apple Search Ads",
  "BIGO Ads",
  "MiQ",
].map((name) => ({
  name,
  listedInProposal: true,
  confirmedQualification: null,
  sourcePage: "p4",
}));

export const navItems = [
  { label: "首页", href: "/" },
  { label: "优质媒介服务", href: "/services" },
  { label: "行业解决方案", href: "/solutions" },
  { label: "WhatsApp", href: "/whatsapp" },
  { label: "技术产品", href: "/products" },
  { label: "成功案例", href: "/cases" },
  { label: "出海资讯", href: "/insights" },
  { label: "关于我们", href: "/about" },
];

export const withheldContact: Fact<string> = {
  value: "",
  sourceDocument: SOURCE_DOCUMENT,
  sourcePage: "p27",
  factCheckStatus: "pending",
  approvedForPublic: false,
  internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 通案未提供可确认的商务电话、邮箱、地址。不得编造，也不得把二维码当成商务人员微信。",
};

export const primaryChannels = [
  { name: "Meta", role: "大中华区官方授权代理商" },
  { name: "Google", role: "官方授权代理商" },
  { name: "TikTok", role: "核心合作伙伴" },
  { name: "Taboola", role: "大中华区核心合作伙伴、官方代理商" },
];

export const secondaryChannels = ["Quora", "Yandex", "X", "VK", "Snapchat", "NewsBreak", "MiQ", "Bing", "Pinterest", "Criteo"];

export const serviceInterestOptions = [
  "海外广告开户",
  "海外广告代投",
  "创意素材生成",
  "WhatsApp私域营销转化",
  "品牌出海整合营销",
  "其他海外营销服务",
];

export const homeWhatsapp = {
  kicker: "WhatsApp",
  title: "用 WhatsApp 把沟通放进增长链路。",
  text: "PandaMobo 是 WhatsApp 官方顶级合作伙伴（BSP），专注帮助企业用 WhatsApp 实现业务增长。",
  productsTitle: "服务",
  products: [
    {
      id: "api",
      title: "WhatsApp Business API",
      text: "以品牌形象开通 API 账户，大规模与客户互动。",
      href: "/whatsapp#product",
    },
    {
      id: "app",
      title: "WhatsApp X JoinCompass",
      text: "将Whatsapp WABA账户直连绑定JoinCompass，方便团队协作和AI自动化。",
      href: "/whatsapp#product",
    },
  ],
  effectsTitle: "效果",
  effectsHint: "悬停查看能力细节",
  effects: [
    {
      id: "acquire",
      title: "获客",
      metric: pendingMetric({
        id: "wa-acquire",
        value: "185",
        unit: "%",
        qualifier: "+",
        label: "用户增长",
        sourcePage: "xmind",
        sourceText: "获客用户 +185%",
        approvedForPublic: true,
        internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 首页已按用户确认上线预览；正式口径仍需业务复核。",
      }),
      text: "广告与网站线索导入 WhatsApp，AI 对话全天承接询盘。",
      points: ["广告与网站流量导入 WhatsApp", "AI 对话筛选潜在客户", "激活沉默线索"],
      href: "/whatsapp#why",
    },
    {
      id: "convert",
      title: "营销转化",
      metric: pendingMetric({
        id: "wa-convert",
        value: "80",
        unit: "%",
        label: "转化率提升",
        sourcePage: "xmind",
        sourceText: "转化率提升 80%",
        approvedForPublic: true,
        internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 首页已按用户确认上线预览；正式口径仍需业务复核。",
      }),
      text: "群发、自动标签与 CRM 协同，把沟通放进转化链路。",
      points: ["联系人列表群发", "自动化营销旅程", "内置 CRM 标签与分组", "实时追踪打开与点击"],
      href: "/whatsapp#why",
    },
    {
      id: "support",
      title: "客户服务",
      metric: pendingMetric({
        id: "wa-support",
        value: "85",
        unit: "%",
        label: "客户满意度提升",
        sourcePage: "xmind",
        sourceText: "客户满意度提升 85%",
        approvedForPublic: true,
        internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 首页已按用户确认上线预览；正式口径仍需业务复核。JoinCompass 解决 70% 常见咨询写入正文，不另作独立承诺数字。",
      }),
      text: "JoinCompass 可承接约 70% 常见咨询，并支持团队协作与实时翻译。",
      points: ["AI 承接约 70% 常见咨询", "团队共享收件箱", "AI 摘要与实时翻译", "支持语音沟通"],
      href: "/whatsapp#why",
    },
    {
      id: "integrate",
      title: "开发集成",
      metric: pendingMetric({
        id: "wa-integrate",
        value: "50",
        unit: "%",
        label: "成本降低",
        sourcePage: "xmind",
        sourceText: "成本降低 50%",
        approvedForPublic: true,
        internalNote: "INTERNAL_NOTE_DO_NOT_LEAK 首页已按用户确认上线预览；正式口径仍需业务复核。不写到达率或套餐价。",
      }),
      text: "专用 API / SDK 对接 CRM，提升送达与阅读效率。",
      points: ["专用 API / SDK 对接验证码与通知", "送达与已读状态追踪", "对接现有 CRM / Call Center / 营销自动化"],
      href: "/whatsapp#why",
    },
  ],
  effectsDisclaimer: "据业务通案效果表述，统计口径待确认。价格与到达率确认前不在此承诺。",
};
