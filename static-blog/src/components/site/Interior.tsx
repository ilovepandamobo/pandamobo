import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicCase } from "@/lib/content/public-types";

export function Art({ src, alt = "", priority = false }: { src: string; alt?: string; priority?: boolean }) {
  return <div className="ip-art"><Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 680px) 88vw, (max-width: 1100px) 48vw, 600px" /></div>;
}

export function ProductLogo({ src, name }: { src: string; name: string }) {
  return <Image className="ip-product-logo" src={src} alt={name} width={180} height={44} />;
}

export function EditorialImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return <div className="ip-editorial-image"><Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 680px) 92vw, (max-width: 1100px) 56vw, 720px" /></div>;
}

export function Action({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={`ip-action${secondary ? " ip-secondary" : ""}`} href={href}>{children}<span aria-hidden="true">{href.startsWith("#") ? "↓" : "↗"}</span></Link>;
}

export function consultHref(service?: string) {
  return service ? `/contact?service=${encodeURIComponent(service)}` : "/contact";
}

export function InteriorHero({ label, title, lead, visual, children, back, logo, theme = "blue" }: {
  label: string; title: string; lead: string; visual: ReactNode; children?: ReactNode;
  back?: { href: string; label: string }; logo?: string; theme?: string;
}) {
  return <header className="ip-hero" data-theme={theme}>
    <div className="ip-wrap ip-hero-grid">
      <div className="ip-hero-copy">
        {back ? <Link className="ip-back" href={back.href}>← {back.label}</Link> : <p className="ip-label">{label}</p>}
        {logo && <ProductLogo src={logo} name={label} />}
        <h1>{title}</h1>
        <p className="ip-lead">{lead}</p>
        {children && <div className="ip-actions">{children}</div>}
      </div>
      <div className="ip-hero-visual">{visual}</div>
    </div>
  </header>;
}

export function SectionHead({ label, title, text }: { label?: string; title: string; text?: string }) {
  return <div className="ip-section-head">{label && <p className="ip-label">{label}</p>}<h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function Steps({ items, ordered = false }: { items: readonly { title: string; text?: string }[]; ordered?: boolean }) {
  return <ol className="ip-steps">{items.map((item, index) => <li key={item.title}>
    {ordered && <span className="ip-step-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
    <div><h3>{item.title}</h3>{item.text && <p>{item.text}</p>}</div>
  </li>)}</ol>;
}

export function Ribbon({ steps }: { steps: readonly string[] }) {
  return <ol className="ip-ribbon">{steps.map((step) => <li key={step}>{step}</li>)}</ol>;
}

export function ConsultStrip({ title = "聊聊你的出海计划", service, children }: { title?: string; service?: string; children: ReactNode }) {
  return <section className="ip-wrap ip-section"><div className="ip-cta"><div><h2>{title}</h2><p>{children}</p></div><Action href={consultHref(service)}>咨询出海方案</Action></div></section>;
}

export function CaseTiles({ cases }: { cases: PublicCase[] }) {
  return <div className="ip-case-tiles">{cases.map((item) => <Link key={item.slug} href={`/cases/${item.slug}`} className="ip-case-tile">
    <EditorialImage src={item.coverImage} alt={`${item.brand}案例海报`} />
    <div><p className="ip-label">{item.industry}</p><h3>{item.shortName}</h3><p>{item.title}</p></div>
    <span className="ip-tile-arrow" aria-hidden="true">↗</span>
  </Link>)}</div>;
}

export function Metrics({ metrics, note }: { metrics: PublicCase["metrics"]; note?: string }) {
  if (!metrics.length) return null;
  return <div><ul className="ip-metrics">{metrics.map((metric) => <li key={metric.id}>
    <strong>{metric.text}</strong><span>{metric.label}</span>
  </li>)}</ul>{note && <p className="ip-fine">{note}</p>}</div>;
}

export function OrbitArt({ src, label }: { src: string; label: string }) {
  return <div className="ip-orbit-art">
    <span className="ip-orbit-track" aria-hidden="true" />
    <Art src={src} priority />
    <span className="ip-art-caption">{label}</span>
  </div>;
}

export function CaseArtwork({ item, cover = false }: { item: PublicCase; cover?: boolean }) {
  return <div className="ip-case-artwork" data-case-tone={item.tone}>
    <EditorialImage src={item.coverImage} alt={`${item.brand}案例海报`} priority />
    {cover && <span className="ip-art-caption">{item.shortName} · {item.industry}</span>}
  </div>;
}

