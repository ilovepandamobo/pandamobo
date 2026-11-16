import type { Metadata } from "next";
import { Action, Art, ConsultStrip, InteriorHero, SectionHead } from "@/components/site/Interior";

export const metadata: Metadata = { title: "出海资源中心 | PandaMobo 熊猫新媒", description: "查看出海市场评估、广告账户交接、创意测试和多渠道沟通的实用清单。" };

const guides = [
  { id: "market", category: "市场策略", title: "进入一个新市场前，先核对这三件事", items: ["选定一个优先市场，写清目标用户、主要竞品和当地购买渠道。","核对定价、语言、履约和售后能否兑现对当地用户的承诺。","确定试点范围、预算和需要观察的信号，再决定是否扩大。"], href: "/solutions", link: "查看行业解决方案" },
  { id: "account", category: "账户运维", title: "广告账户交接清单", items: ["列出广告账户、主页、素材及转化数据资产，确认归属与负责人。","记录当前权限、结算方式、关键设置和在投活动。","约定交接后的异常处理联系人，以及如何判断交接完成。"], href: "/services/ad-asset-operations", link: "了解广告资产管理" },
  { id: "creative", category: "创意测试", title: "怎样安排第一轮素材测试？", items: ["给每条创意写一个明确假设，例如不同人群对哪种卖点更敏感。","先围绕一个主要变量安排素材版本，保留其他对比条件。","记录观察结果与下一步动作，留下可复用的素材和制作经验。"], href: "/products/joinspark", link: "查看 JoinSpark" },
  { id: "conversation", category: "客户沟通", title: "从广告点击到第一条有效对话", items: ["把客户看到的广告承诺、点击入口和首条回复写在一起核对。","梳理高频问题、目标语言和什么情况需要人工接手。","按团队实际可跟进的节奏安排分工，并检查对话是否得到后续处理。"], href: "/whatsapp", link: "查看 WhatsApp 方案" },
];

export default function InsightsPage() {
  return <main id="main" className="ip-page ip-insights" data-theme="violet">
    <InteriorHero label="资源中心" title="带着问题来，带着清单走" lead="准备进入新市场、交接账户或启动第一轮测试时，可以直接用这些清单做一次团队核对。" theme="violet"
      visual={<div className="ip-library-art"><Art src="/assets/service-materials/insight-reports.png" priority /><div className="ip-library-topics">{guides.map(guide => <a key={guide.id} href={`#${guide.id}`}>{guide.category}<span aria-hidden="true">↓</span></a>)}</div></div>}>
      <Action href="#all">查看实用清单</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="all">
      <SectionHead title="出海实用清单" text="点击展开，按你正在做的事逐项核对。" />
      <div className="ip-guide-list">{guides.map(guide => <details key={guide.id} id={guide.id} className="ip-guide" name="resource-guides">
        <summary><span><small>{guide.category}</small><strong>{guide.title}</strong></span></summary>
        <div><ol>{guide.items.map(item => <li key={item}>{item}</li>)}</ol><Action href={guide.href} secondary>{guide.link}</Action></div>
      </details>)}</div>
    </section>
    <ConsultStrip>带着你正在解决的问题来聊，我们一起确定下一步。</ConsultStrip>
  </main>;
}
