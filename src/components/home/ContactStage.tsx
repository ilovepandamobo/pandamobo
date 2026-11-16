"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicHome } from "@/lib/content/public-types";
import { ConsultForm } from "./ConsultForm";

export function ContactStage({ contact }: { contact: PublicHome["contact"] }) {
  const root = useRef<HTMLElement>(null);
  const [engaged, setEngaged] = useState(false);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    let visible = false;
    const update = () => setAnimate(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(root.current); document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <section ref={root} className="consult screen contact-invitation" id="contact" aria-labelledby="contact-invitation-title" data-engaged={engaged} data-animate={animate}>
    <div className="wrap cs-layout">
      <div className="cs-introduction">
        <p className="cs-eyebrow"><span />LET’S TALK · 联系我们</p>
        <h2 id="contact-invitation-title">让出海的下一步<br /><span>从一次对话开始</span></h2>
        <p className="cs-intro-text">告诉我们你的目标市场与当前需求<br />一起找到更合适的增长方向</p>
        <div className="cs-illustration" aria-hidden="true">
          <svg className="cs-globe" viewBox="0 0 320 320" fill="none"><circle cx="160" cy="160" r="126" /><ellipse cx="160" cy="160" rx="67" ry="126" /><ellipse cx="160" cy="160" rx="126" ry="48" /><path d="M34 160H286M160 34V286" /><ellipse className="cs-globe-orbit" cx="160" cy="160" rx="152" ry="46" transform="rotate(-28 160 160)" /></svg>
          <div className="cs-message-card"><span className="cs-message-icon">↗</span><div><strong>{engaged ? "我在听，慢慢说" : "你好，出海同行者"}</strong><span>{engaged ? "把你的想法告诉我们" : "你的下一站，想去哪里"}</span></div></div>
          <div className="cs-character" />
          <div className="cs-character-shadow" />
          <div className="cs-side-note"><span>TOGETHER</span><strong>GO GLOBAL</strong><i>从一个想法<br />到更多可能</i></div>
          <span className="cs-orbit-dot one" /><span className="cs-orbit-dot two" />
        </div>
        <ol className="cs-conversation-path"><li><span>01</span><strong>了解你的业务</strong></li><li><span>02</span><strong>明确出海目标</strong></li><li><span>03</span><strong>探讨合作方向</strong></li></ol>
      </div>
      <div className="cs-form-card" onFocusCapture={() => setEngaged(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }}>
        <div className="cs-form-heading"><p><span />开启一段合作</p><h3>聊聊你的出海计划</h3><span>选个方向，留个方便联系的方式</span></div>
        <ConsultForm variant="invitation" idPrefix="page" serviceOptions={contact.serviceOptions} privacyText={contact.privacyText} />
      </div>
    </div>
  </section>;
}
