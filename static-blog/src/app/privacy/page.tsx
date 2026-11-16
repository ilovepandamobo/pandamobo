import type { Metadata } from "next";
import { Action, SectionHead } from "@/components/site/Interior";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "隐私说明 | PandaMobo 熊猫新媒", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  const { contact, preview } = getPublicHome();
  return <main id="main" className="ip-page ip-privacy">
    <div className="ip-wrap ip-section">
      <p className="ip-label">联系我们</p>
      <h1>咨询表单隐私说明</h1>
      <section className="ip-section">
        <SectionHead title="您提交的信息" text="请填写邮箱或电话中的一项。姓名、公司、职位、咨询方向和需求描述为选填。" />
        <SectionHead title={preview ? "开发预览" : "信息用途"} text={contact.privacyText} />
        <Action href="/contact" secondary>返回联系页</Action>
      </section>
    </div>
  </main>;
}
