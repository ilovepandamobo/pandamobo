"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { parseContact, type ContactErrors as FormErrors } from "@/lib/consult";

type ConsultFormProps = {
  idPrefix: string;
  serviceOptions: string[];
  privacyText: string;
  initialService?: string;
  variant?: "standard" | "invitation";
};
export function ConsultForm({ idPrefix, serviceOptions, privacyText, initialService, variant = "standard" }: ConsultFormProps) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [interest, setInterest] = useState(initialService || "");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const options = initialService && !serviceOptions.includes(initialService) ? [initialService, ...serviceOptions] : serviceOptions;
  const invitation = variant === "invitation";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const input = new FormData(form);
    const submission = parseContact({ ...Object.fromEntries(input), privacy: input.get("privacy") === "yes" });
    if (!submission) return;
    const next = submission.errors;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setNotice("");
      const focusName = next.contact ? (invitation ? contactMethod : "email") : Object.keys(next)[0];
      const target = event.currentTarget.querySelector<HTMLElement>(`[name="${focusName}"]`);
      const details = target?.closest("details"); if (details) details.open = true;
      target?.focus();
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setNotice("正在发送咨询…");
    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission.data),
      });
      const result = await response.json();
      setNotice(result.message ?? "暂时无法发送，请稍后重试。");
      if (response.ok) {
        form.reset();
        setInterest(initialService || "");
        setPrivacyOpen(false);
      }
    } catch {
      setNotice("暂时无法发送，请稍后重试。");
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  const messageField = <label className="field" htmlFor={`${idPrefix}-message`}><span>{invitation ? "想重点聊聊什么" : "更多内容"}<span className="optional">选填</span></span><textarea id={`${idPrefix}-message`} name="message" rows={invitation ? 3 : 4} placeholder={invitation ? "例如：想进入的市场、产品方向，或正在遇到的问题" : undefined} maxLength={1000} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined} />{errors.message ? <small id={`${idPrefix}-message-error`} className="field-error">{errors.message}</small> : null}</label>;
  return <form className={invitation ? "form form-invitation" : "form"} onSubmit={onSubmit} noValidate>
    {invitation ? <>
      <fieldset className="cf-interests"><legend>你希望获得哪些帮助<span className="optional">选填</span></legend><div className="cf-interest-options">{options.map(option => <button type="button" key={option} aria-pressed={interest === option} onClick={() => setInterest(value => value === option ? "" : option)}><i aria-hidden="true" />{option}</button>)}</div><input type="hidden" name="service" value={interest} /></fieldset>
      <div className="form-grid"><Field id={`${idPrefix}-name`} name="name" label="怎么称呼你" optional placeholder="你的姓名" error={errors.name} autoComplete="name" maxLength={40} /><Field id={`${idPrefix}-company`} name="company" label="公司 / 品牌" optional placeholder="你的公司或品牌" error={errors.company} autoComplete="organization" maxLength={80} /></div>
      <div className="cf-contact"><div className="cf-contact-heading"><span>留下一个联系方式</span><div role="group" aria-label="选择联系方式"><button type="button" aria-pressed={contactMethod === "email"} onClick={() => setContactMethod("email")}>邮箱</button><button type="button" aria-pressed={contactMethod === "phone"} onClick={() => setContactMethod("phone")}>电话</button></div></div>
        <div hidden={contactMethod !== "email"}><Field id={`${idPrefix}-email`} name="email" label="邮箱" hideLabel type="email" placeholder="you@company.com" disabled={contactMethod !== "email"} error={contactMethod === "email" ? errors.email || errors.contact : undefined} autoComplete="email" maxLength={80} /></div>
        <div hidden={contactMethod !== "phone"}><Field id={`${idPrefix}-phone`} name="phone" label="电话" hideLabel type="tel" placeholder="方便联系你的号码" disabled={contactMethod !== "phone"} error={contactMethod === "phone" ? errors.phone || errors.contact : undefined} autoComplete="tel" maxLength={30} /></div>
        <p className="cf-contact-note">邮箱或电话，选择一种填写即可</p>
      </div>
      <details className="cf-extra"><summary>再补充一点信息<span>选填</span><i aria-hidden="true">＋</i></summary><Field id={`${idPrefix}-role`} name="role" label="职位" optional error={errors.role} autoComplete="organization-title" maxLength={40} placeholder="你的职位" />{messageField}</details>
    </> : <>
      <div className="form-grid"><Field id={`${idPrefix}-name`} name="name" label="姓名" optional error={errors.name} autoComplete="name" maxLength={40} /><Field id={`${idPrefix}-company`} name="company" label="公司名称" optional error={errors.company} autoComplete="organization" maxLength={80} /><Field id={`${idPrefix}-role`} name="role" label="职位" optional error={errors.role} autoComplete="organization-title" maxLength={40} /><Field id={`${idPrefix}-email`} name="email" label="邮箱" type="email" error={errors.email || errors.contact} autoComplete="email" maxLength={80} /><Field id={`${idPrefix}-phone`} name="phone" label="电话" type="tel" error={errors.phone} autoComplete="tel" maxLength={30} /></div>
      <p className="field-hint">邮箱和电话至少填写一种。</p>
      <label className="field" htmlFor={`${idPrefix}-service`}><span>您希望在出海过程中获得哪些帮助?<span className="optional">选填</span></span><select id={`${idPrefix}-service`} name="service" defaultValue={initialService || ""}><option value="">请选择</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
      {messageField}
    </>}
    <div className="privacy-row"><label className="check" htmlFor={`${idPrefix}-privacy`}><input id={`${idPrefix}-privacy`} name="privacy" type="checkbox" value="yes" aria-invalid={errors.privacy ? true : undefined} aria-describedby={errors.privacy ? `${idPrefix}-privacy-error` : undefined} /><span>我已阅读隐私说明，并同意仅为本次咨询提供以上信息。</span></label><button type="button" className="text-button" aria-expanded={privacyOpen} aria-controls={`${formId}-privacy`} onClick={() => setPrivacyOpen(open => !open)}>查看隐私说明<span aria-hidden="true">{invitation ? " ↗" : ""}</span></button>{privacyOpen ? <p id={`${formId}-privacy`} className="privacy-copy">{privacyText}</p> : null}{errors.privacy ? <small id={`${idPrefix}-privacy-error`} className="field-error">{errors.privacy}</small> : null}</div>
    <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "正在发送…" : invitation ? <>聊聊我的出海计划<span aria-hidden="true">↗</span></> : "咨询出海方案"}</button>
    <p className="form-notice" role="status" aria-live="polite">{notice}</p>
  </form>;
}

function Field({ id, name, label, error, optional, type = "text", autoComplete, maxLength, placeholder, disabled, hideLabel }: {
  id: string; name: string; label: string; error?: string; optional?: boolean; type?: string; autoComplete?: string; maxLength?: number; placeholder?: string; disabled?: boolean; hideLabel?: boolean;
}) {
  return <label className="field" htmlFor={id}><span className={hideLabel ? "sr-only" : undefined}>{label}{optional ? <span className="optional">选填</span> : null}</span><input id={id} name={name} type={type} autoComplete={autoComplete} maxLength={maxLength} placeholder={placeholder} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />{error ? <small id={`${id}-error`} className="field-error">{error}</small> : null}</label>;
}
