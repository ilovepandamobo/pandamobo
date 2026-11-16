export type SiteRoute = {
  path: string;
  name: string;
  phase: 1 | 2 | 3 | 4;
  status: "live" | "planned";
  note?: string;
};

export const siteRoutes: SiteRoute[] = [
  { path: "/", name: "首页", phase: 1, status: "live" },
  { path: "/about", name: "关于我们", phase: 2, status: "live" },
  { path: "/services", name: "优质媒介服务", phase: 2, status: "live" },
  { path: "/services/ad-asset-operations", name: "广告资产管理", phase: 2, status: "live" },
  { path: "/services/media-operations", name: "广告代投服务", phase: 2, status: "live" },
  { path: "/services/global-brand-marketing", name: "品牌出海营销", phase: 2, status: "live" },
  { path: "/services/strategic-studio", name: "全球商业智库", phase: 2, status: "live" },
  { path: "/solutions", name: "行业解决方案", phase: 2, status: "live" },
  { path: "/solutions/[slug]", name: "行业子页", phase: 2, status: "live" },
  { path: "/whatsapp", name: "WhatsApp", phase: 2, status: "live" },
  { path: "/products", name: "技术产品", phase: 2, status: "live" },
  { path: "/products/pandarocket", name: "Panda Rocket", phase: 2, status: "live" },
  { path: "/products/joinspark", name: "JoinSpark", phase: 2, status: "live" },
  { path: "/products/joincompass", name: "JoinCompass", phase: 2, status: "live" },
  { path: "/products/joinmc", name: "JoinMC", phase: 2, status: "live" },
  { path: "/cases", name: "成功案例", phase: 2, status: "live" },
  { path: "/cases/[slug]", name: "案例详情", phase: 2, status: "live" },
  { path: "/insights", name: "出海资讯", phase: 2, status: "live", note: "没有真实稿件，页面保留栏目并禁止收录" },
  { path: "/insights/[slug]", name: "文章详情", phase: 3, status: "planned" },
  { path: "/careers", name: "加入我们", phase: 2, status: "live", note: "没有岗位资料，不出现在公开导航" },
  { path: "/contact", name: "联系我们", phase: 2, status: "live" },
  { path: "/privacy", name: "隐私政策", phase: 2, status: "live", note: "法律主体与收集流程确认前不编造正文" },
  { path: "/admin", name: "运营后台", phase: 3, status: "planned" },
];
