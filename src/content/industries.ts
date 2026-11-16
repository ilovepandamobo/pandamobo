export const industries = [
  {
    slug: "cross-border",
    name: "跨境电商",
    matches: ["跨境电商"],
    text: "这一页只连接通案里已经收录的跨境电商案例，不另写打法、转化或投放承诺。",
  },
  {
    slug: "games",
    name: "游戏出海",
    matches: ["游戏"],
    text: "这一页只连接通案里已经收录的游戏案例，不另写买量模型或回收承诺。",
  },
  {
    slug: "apps",
    name: "APP出海（短剧）",
    matches: ["APP/互联网", "社交APP", "网文/有声/短剧内容平台"],
    text: "短剧、网文、社交和 APP 类案例按通案行业归入此页。页面不补充下载量或付费承诺。",
  },
  {
    slug: "travel",
    name: "文旅出海（入境游）",
    matches: [],
    text: "通案尚未收录文旅或入境游的具名案例。此页不补充行程、渠道或效果。",
  },
  {
    slug: "auto",
    name: "汽车出海",
    matches: ["汽车"],
    text: "这一页只连接通案里已经收录的汽车案例，不另写到店或销量承诺。",
  },
] as const;
