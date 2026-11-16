import type { Metadata } from "next";
import { ConsultForm } from "@/components/home/ConsultForm";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "联系我们 | PandaMobo 熊猫新媒", description: "告诉熊猫新媒你想进入的市场和出海需求，咨询适合你的方案。" };

type Props = { searchParams: Promise<{ service?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const { contact } = getPublicHome();
  const { service } = await searchParams;
  const initialService = typeof service === "string" ? service.trim().slice(0, 80) : undefined;
  return <main id="main" className="ip-page ip-contact" data-theme="violet">
    <div className="ip-wrap ip-contact-grid">
      <header className="ip-contact-copy">
        <p className="ip-label">联系我们</p>
        <h1>出海的下一步<br />从一次对话开始</h1>
        <p className="ip-lead">告诉我们你的目标市场和现在最想解决的问题。留一个方便联系你的方式就可以开始。</p>
        <div className="ip-contact-art" aria-hidden="true"><div /><i /><i /><span className="ip-contact-panda" /></div>
      </header>
      <section className="ip-contact-form" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading">聊聊你的需求</h2>
        <ConsultForm idPrefix="contact" variant="invitation" initialService={initialService} serviceOptions={contact.serviceOptions} privacyText={contact.privacyText} />
      </section>
    </div>
  </main>;
}
