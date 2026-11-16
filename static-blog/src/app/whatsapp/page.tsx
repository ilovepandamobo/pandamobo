import type { Metadata } from "next";
import { Action, ConsultStrip, InteriorHero, SectionHead, Steps, consultHref } from "@/components/site/Interior";
import { InteriorJourney } from "@/components/site/InteriorJourney";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "WhatsApp | PandaMobo 熊猫新媒", description: "了解 WhatsApp Business API、WhatsApp 与 JoinCompass 的账户连接，以及团队如何承接客户对话。" };

const conversation = [
  { label: "客户发来消息", name: "客户", text: "Hi! Do you ship to Singapore?", note: "客户从广告或网站进入 WhatsApp，发来配送问题。" },
  { label: "AI 协助回复", name: "AI 助手", text: "Hi! Which product are you interested in?", note: "根据团队设置的回复规则，先确认客户感兴趣的商品。" },
  { label: "团队接手", name: "客服团队", text: "I can help check delivery options for your item.", note: "需要人工确认时，团队接过上下文并继续跟进。" },
];

export default function WhatsappPage() {
  const { whatsapp } = getPublicHome();
  return <main id="main" className="ip-page ip-whatsapp" data-theme="mint">
    <InteriorHero label="WhatsApp 商业沟通" title="从第一条消息开始，把客户接住" lead={whatsapp.text} theme="mint" visual={
      <div className="ip-chat-stage">
        <div className="ip-chat-phone">
          <div className="ip-chat-top"><span aria-hidden="true">✦</span><div><strong>客户咨询</strong><small>WhatsApp · 对话演示</small></div></div>
          <div className="ip-chat-body">{conversation.map(item => <p key={item.label}><small>{item.name}</small>{item.text}</p>)}</div>
        </div>
      </div>
    }>
      <Action href={consultHref("WhatsApp")}>咨询沟通方案</Action><Action href="#product" secondary>查看接入方式</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="product">
      <SectionHead title="按现有账户选择接入方式" />
      <div className="ip-option-grid">
        <article><p className="ip-label">企业消息接入</p><h3>WhatsApp Business API</h3><p>评估账户开通、消息场景和团队分工，规划企业客户沟通流程。</p><Action href={consultHref("WhatsApp Business API")} secondary>咨询 API 接入</Action></article>
        <article><p className="ip-label">账户与团队协作</p><h3>WhatsApp X JoinCompass</h3><p>将 WhatsApp WABA 账户直连绑定 JoinCompass，方便团队协作和 AI 自动化。</p><Action href="/products/joincompass#demo" secondary>看 JoinCompass 演示</Action></article>
      </div>
    </section>
    <section className="ip-wrap ip-section" id="solutions">
      <SectionHead title="看一条客户消息怎么被接住" text="以跨境电商的配送咨询为例，点击步骤查看客户、AI 和团队分别做什么。" />
      <InteriorJourney title="会话流程" panels={conversation.map((item, index) => ({ label: item.label, content:
        <article className="ip-message-board"><div className="ip-message-log">{conversation.slice(0, index + 1).map(message => <div key={message.label}><small>{message.name}</small><p>{message.text}</p></div>)}</div><div><p className="ip-label">对话演示</p><h3>{item.label}</h3><p>{item.note}</p></div></article>
      }))} />
    </section>
    <section className="ip-wrap ip-section" id="resources">
      <SectionHead title="咨询前可以准备这三项" />
      <Steps ordered items={[{title:"现有账户",text:"说明是否已有 WhatsApp Business 账户，以及现在由谁运营。"}, {title:"常见沟通场景",text:"列出售前咨询、订单通知、售后服务等最常发生的需求。"}, {title:"团队与语言",text:"说明客服分工、目标市场和常用回复语言。"}]} />
    </section>
    <section className="ip-wrap ip-section" id="why">
      <SectionHead title="把广告入口和后续对话连起来" text="一起评估用户从哪里来、第一条消息怎么回，以及何时需要交给团队继续跟进。" />
      <div id="pricing"><details className="ip-guide"><summary>如何了解费用？</summary><div><p>提供账户情况、目标市场及预计消息规模，便于进一步沟通适用的接入方案与费用。</p></div></details></div>
    </section>
    <ConsultStrip service="WhatsApp">告诉我们你的账户情况和消息场景，一起梳理接入路径。</ConsultStrip>
  </main>;
}
