"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { PublicHome } from "@/lib/content/public-types";
import { BspVisual } from "./BspVisual";
import { MetricFigure, Reveal } from "./motion";

type WhatsAppContent = PublicHome["whatsapp"];

export function WhatsAppStage({ content }: { content: WhatsAppContent }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(content.effects[0]?.id ?? "");
  const active = content.effects.find((effect) => effect.id === activeId) ?? content.effects[0];

  return (
    <div className="wa-band">
      <div className="wa-hero">
        <Reveal>
          <div className="wa-intro">
            <p className="kicker">{content.kicker}</p>
            <h2>{content.title}</h2>
            <p className="wa-lede">{content.text}</p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="wa-hero-visual" aria-label="WhatsApp BSP 合作资质动效">
            <BspVisual label="官方顶级合作伙伴" company="" />
          </div>
        </Reveal>
      </div>

      <div className="wa-products" aria-label={content.productsTitle}>
        {content.products.map((product, index) => (
          <Reveal key={product.id} delay={index * 70}>
            <Link className="wa-product" href={product.href}>
              <span className="wa-product-index">0{index + 1}</span>
              <span className="wa-product-copy">
                <strong>{product.title}</strong>
                <span>{product.text}</span>
              </span>
              <em>
                了解更多
                <span aria-hidden="true">↗</span>
              </em>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="wa-effects-head">
          <p className="wa-effects-title">{content.effectsTitle}</p>
          <p className="wa-effects-hint">{content.effectsHint}</p>
        </div>
      </Reveal>

      <div className="wa-stage">
        <div
          className="wa-rails"
          role="tablist"
          aria-label={content.effectsTitle}
          onKeyDown={(event) => {
            const ids = content.effects.map((effect) => effect.id);
            const current = Math.max(0, ids.indexOf(activeId));
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              setActiveId(ids[(current + 1) % ids.length] ?? activeId);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              setActiveId(ids[(current - 1 + ids.length) % ids.length] ?? activeId);
            }
          }}
        >
          {content.effects.map((effect, index) => {
            const selected = effect.id === active?.id;
            const tabId = `${baseId}-tab-${effect.id}`;
            const panelId = `${baseId}-panel`;
            return (
              <button
                key={effect.id}
                id={tabId}
                className={selected ? "wa-rail is-active" : "wa-rail"}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onMouseEnter={() => setActiveId(effect.id)}
                onFocus={() => setActiveId(effect.id)}
                onClick={() => setActiveId(effect.id)}
                style={{ ["--wa-delay" as string]: `${index * 40}ms` }}
              >
                <span className="wa-rail-label">{effect.title}</span>
                {effect.metric ? (
                  <strong className="wa-rail-metric">
                    <MetricFigure text={effect.metric.text} />
                  </strong>
                ) : (
                  <strong className="wa-rail-metric">—</strong>
                )}
                {effect.metric ? <span className="wa-rail-caption">{effect.metric.label}</span> : null}
              </button>
            );
          })}
        </div>

        {active ? (
          <div
            className="wa-panel"
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active.id}`}
            key={active.id}
          >
            <div className="wa-panel-glow" aria-hidden="true" />
            <div className="wa-panel-copy">
              <p className="wa-panel-kicker">{active.title}</p>
              <p className="wa-panel-text">{active.text}</p>
              <ul className="wa-panel-points">
                {active.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <Link className="wa-panel-cta" href={active.href}>
              了解更多
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : null}
      </div>

      {content.effectsDisclaimer ? <p className="wa-disclaimer">{content.effectsDisclaimer}</p> : null}
    </div>
  );
}
