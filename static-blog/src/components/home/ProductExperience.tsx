"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { RocketDemo } from "./RocketDemo";
import { SparkDemo } from "./SparkDemo";
import { CompassDemo } from "./CompassDemo";
import { McDemo } from "./McDemo";
import "./rocket-demo.css";
import { productArtFor } from "@/content/product-art";
import { productExperienceDesign, productExperienceMedia } from "@/content/product-experience";

/** Replace the media mapping in product-experience.ts with the final animation. */
export function ProductExperience({ productId }: { productId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);
  const art = productArtFor(productId);
  const design = productExperienceDesign[productId];
  const media = productExperienceMedia[productId];
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  useEffect(() => {
    if (!video.current || !host.current) return;
    const player = video.current;
    let visible = false;
    const update = () => { if (visible && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void player.play().catch(() => undefined); else player.pause(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(host.current); document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); player.pause(); };
  }, [media]);
  if (!design) return null;
  return <div ref={host} className={`px-stage px-${productId}`} data-product-animation-slot={productId}
    style={{ "--px-accent": design.accent, "--px-tint": design.tint } as CSSProperties}
    onPointerEnter={event => { rect.current = event.currentTarget.getBoundingClientRect(); }}
    onPointerMove={event => {
      if (["pandarocket", "joinspark", "joincompass", "joinmc"].includes(productId) || event.pointerType !== "mouse" || !rect.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const x = (event.clientX - rect.current.left) / rect.current.width - .5;
      const y = (event.clientY - rect.current.top) / rect.current.height - .5;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => { host.current?.style.setProperty("--px-rx", `${-y * 4}deg`); host.current?.style.setProperty("--px-ry", `${x * 5}deg`); });
    }}
    onPointerLeave={() => { cancelAnimationFrame(frame.current); host.current?.style.setProperty("--px-rx", "0deg"); host.current?.style.setProperty("--px-ry", "0deg"); }}>
    {media ? media.type === "video" ? <video ref={video} className="px-final-media" src={media.src} poster={media.poster} muted loop playsInline preload="metadata" aria-label="产品介绍动画" />
      : <img className="px-final-media" src={media.src} alt="产品介绍" />
      : productId === "pandarocket" ? <RocketDemo /> : productId === "joinspark" ? <SparkDemo /> : productId === "joincompass" ? <CompassDemo /> : productId === "joinmc" ? <McDemo /> : <div className="px-scene" aria-hidden="true">
        <div className="px-scene-label"><span /><span>{design.label}</span><i>↗</i></div>
        <div className="px-orbit px-orbit-one" /><div className="px-orbit px-orbit-two" />
        {art ? <img className="px-hero-art" src={art.src} alt="" width={800} height={920} draggable={false} /> : null}
        <div className="px-widget px-widget-a">
          <span className="px-widget-eyebrow">{productId === "joinspark" ? "CREATIVE STUDIO" : productId === "joincompass" ? "LIVE CONVERSATION" : productId === "joinmc" ? "CONTENT CALENDAR" : "CONNECTED ACCOUNTS"}</span>
          {productId === "pandarocket" ? <><div className="px-account"><b>M</b><span>Meta</span><i /></div><div className="px-account"><b>G</b><span>Google</span><i /></div><div className="px-account"><b>♪</b><span>TikTok</span><i /></div></>
            : productId === "joinspark" ? <div className="px-creative-tiles"><span /><span /><span /></div>
            : productId === "joincompass" ? <div className="px-messages"><span>Let&apos;s connect</span><span>每一次沟通，都有回应</span></div>
            : <div className="px-calendar">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>}
        </div>
        <div className="px-widget px-widget-b"><span className="px-widget-symbol">{productId === "joinspark" ? "✦" : productId === "joincompass" ? "↗" : "⌁"}</span><strong>{design.widget}</strong><div className="px-bars"><i /><i /><i /><i /><i /><i /></div></div>
        <div className="px-workflow">{design.stages.map((stage, i) => <span key={stage}><i>{String(i + 1).padStart(2, "0")}</i>{stage}{i < 2 ? <b>→</b> : null}</span>)}</div>
      </div>}
  </div>;
}
