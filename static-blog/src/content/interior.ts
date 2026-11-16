export const serviceVisuals: Record<string, { art: string; theme: string; title: string; steps: string[]; output: string }> = {
  "ad-asset-operations": {
    art: "diagnostic-gate", theme: "blue", title: "把广告资产管清楚",
    steps: ["账户接入", "专属 AM 诊断", "资产与权限梳理"], output: "厘清账户、资产及协作权限，确定后续管理方式。",
  },
  "media-operations": {
    art: "creative-rack", theme: "plum", title: "把投放做成可优化的流程",
    steps: ["制定策略", "制作素材", "协同投放", "数据复盘"], output: "把投放目标、素材测试和阶段复盘放进同一套执行节奏。",
  },
  "global-brand-marketing": {
    art: "brand-ribbon", theme: "warm", title: "让品牌在当地被理解",
    steps: ["市场与人群洞察", "品牌表达本地化", "跨渠道传播"], output: "明确重点市场、当地受众和内容表达，再安排传播与执行。",
  },
  "strategic-studio": {
    art: "insight-reports", theme: "mint", title: "让研究进入出海决策",
    steps: ["市场研究", "竞争与受众诊断", "出海策略建议"], output: "围绕具体业务问题整理证据，形成可讨论的策略方向。",
  },
};

export const industryVisuals: Record<string, { theme: string; cover: string; title: string; intro: string; steps: { title: string; text: string }[] }> = {
  "cross-border": {
    theme: "warm", cover: "lightinthebox", title: "让商品找到对的人", intro: "从商品卖点、目标市场到购买路径，梳理跨境电商的广告与品牌运营。",
    steps: [
      { title: "明确首发市场", text: "先选要推广的商品，梳理市场、受众、客单价和履约范围。" },
      { title: "测试素材和卖点", text: "围绕真实使用场景，规划不同素材与落地页的测试组合。" },
      { title: "复盘购买路径", text: "检查从点击、到站到成交的关键环节，再决定下一轮投入。" },
    ],
  },
  games: {
    theme: "plum", cover: "dynasty-legends-2", title: "让玩家看见游戏的乐趣", intro: "围绕上线阶段、核心玩法与本地玩家偏好，规划广告创意和媒体组合。",
    steps: [
      { title: "梳理发行阶段", text: "明确预热、上线和持续运营各阶段的目标市场与推广节点。" },
      { title: "拆解玩法素材", text: "把核心玩法、角色和成长体验拆成容易理解的素材主题。" },
      { title: "结合反馈迭代", text: "按地区和创意观察安装、早期留存及玩家反馈，安排后续测试。" },
    ],
  },
  apps: {
    theme: "blue", cover: "bytedance", title: "让用户找到下载的理由", intro: "把应用的使用价值和短剧内容的看点，做成适合目标市场的推广素材。",
    steps: [
      { title: "选定关键体验", text: "应用聚焦用户首次获得的价值，短剧聚焦能讲清人物和冲突的片段。" },
      { title: "测试本地化素材", text: "根据目标市场调整语言、字幕、节奏和内容入口。" },
      { title: "跟进关键行为", text: "结合安装后的激活、观看或订阅行为，找出需要改进的环节。" },
    ],
  },
  travel: {
    theme: "mint", cover: "", title: "从看见中国到规划行程", intro: "以境外游客的决策路径规划入境游推广，覆盖目的地发现、行程理解和咨询承接。",
    steps: [
      { title: "理解出发地需求", text: "梳理游客关注的交通、季节、体验项目和语言需求。" },
      { title: "表达目的地体验", text: "用当地受众容易理解的内容呈现行程、特色体验和实用信息。" },
      { title: "安排咨询承接", text: "明确咨询入口、回复语言及团队跟进方式，方便游客继续了解。" },
    ],
  },
  auto: {
    theme: "slate", cover: "omoda-jaecoo", title: "让车型进入当地消费者的选择", intro: "结合车型卖点、当地用车场景和区域运营目标，规划品牌传播与线索承接。",
    steps: [
      { title: "明确车型和区域", text: "梳理车型定位、目标人群以及实际销售与服务覆盖范围。" },
      { title: "建立本地使用场景", text: "把配置和技术参数转化为当地消费者关心的实际体验。" },
      { title: "连接推广与跟进", text: "按项目目标衔接车型页面、活动或咨询入口，并明确后续分工。" },
    ],
  },
};

export const productVisuals: Record<string, { theme: string; title: string; steps: string[] }> = {
  pandarocket: { theme: "blue", title: "广告账户与资产，一处管理", steps: ["账户接入", "资产管理", "消耗监测"] },
  joinspark: { theme: "plum", title: "从创意想法到广告素材", steps: ["选择创作方式", "生成素材", "预览与迭代"] },
  joincompass: { theme: "violet", title: "把跨境沟通接到同一个工作台", steps: ["公域运营", "私域承接", "企业管理"] },
  joinmc: { theme: "mint", title: "把日常社媒运营串起来", steps: ["多平台发布", "互动承接", "监控与聆听"] },
};
