"use client";

import Link from "next/link";
import { HeroEarthPanda } from "./HeroEarthPanda";
import { useEffect, useRef, type CSSProperties } from "react";
import type { PublicBanner } from "@/lib/content/public-types";

const scenes = {
  orbit: { asset: "globe", serial: "01 / GLOBAL GROWTH", caption: "数据与传播，连接全球增长", tags: ["全渠道广告", "品牌策略", "自研技术"] },
  paths: { asset: "loop", serial: "02 / CONNECTED SERVICES", caption: "从策略到执行，让增长形成闭环", tags: ["策略支持", "协同执行", "持续复盘"] },
  studio: { asset: "core", serial: "03 / INTELLIGENT ECOSYSTEM", caption: "四款产品，协同每一个增长环节", tags: ["资产管理", "创意生成", "交互运营"] },
};
const services = [
  { id: "ad-asset-operations", name: "优质媒介服务", detail: "账户与资产运维" },
  { id: "media-operations", name: "智能代投管家", detail: "策略 · 素材 · 投放" },
  { id: "global-brand-marketing", name: "品牌出海全案", detail: "定位与品牌表达" },
  { id: "strategic-studio", name: "全球商业智库", detail: "洞察与策略支持" },
];
const products = [
  { id: "pandarocket", name: "Panda Rocket", logo: "/brand/pandarocket-logo.png?v=3", detail: "广告资产管理" },
  { id: "joinspark", name: "JoinSpark", logo: "/brand/joinspark-logo.png?v=2", detail: "AI 创意生成" },
  { id: "joincompass", name: "JoinCompass", logo: "/brand/joincompass-logo.png", detail: "跨境交互运营" },
  { id: "joinmc", name: "JoinMC", logo: "/brand/joinmc-logo.png", detail: "智能营销协同" },
];

const socialPlatforms = [
  { name: "Facebook", asset: "facebook.png", href: "https://www.facebook.com/", x: 23, y: 10, delay: "-.8s" },
  { name: "Instagram", asset: "instagram.svg", href: "https://www.instagram.com/", x: 63, y: 9, delay: "-2.1s" },
  { name: "TikTok", asset: "tiktok.png", href: "https://www.tiktok.com/", x: 96, y: 30, delay: "-3.4s" },
  { name: "Taboola", asset: "taboola-official-symbol.svg", href: "https://www.taboola.com/", x: 94, y: 57, delay: "-1.5s" },
  { name: "LinkedIn", asset: "linkedin.png", href: "https://www.linkedin.com/", x: 88, y: 74, delay: "-4.2s" },
  { name: "Google", asset: "google.png", href: "https://www.google.com/", x: 64, y: 94, delay: "-1.1s" },
  { name: "Pinterest", asset: "pinterest.png", href: "https://www.pinterest.com/", x: 38, y: 94, delay: "-2.8s" },
  { name: "WhatsApp", asset: "whatsapp.svg", href: "https://www.whatsapp.com/", x: 0, y: 58, delay: "-5.1s" },
  { name: "X", asset: "x.png", href: "https://x.com/", x: 2, y: 43, delay: "-3.7s" },
];

export function HeroScene({ kind, active }: { kind: PublicBanner["visual"]; active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const scene = scenes[kind];

  useEffect(() => {
    const node = host.current;
    const layer = plane.current;
    if (!node || !layer || !active) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let rect: DOMRect | null = null;
    const aim = { x: 0, y: 0 };
    const point = { x: 0, y: 0 };
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min((now - last) / 1000, .05); last = now;
      const smooth = 1 - Math.exp(-dt * 9);
      point.x += (aim.x - point.x) * smooth;
      point.y += (aim.y - point.y) * smooth;
      layer.style.transform = `perspective(1100px) rotateX(${-point.y * 4}deg) rotateY(${point.x * 6}deg) translate3d(${point.x * 8}px,${point.y * 5}px,0)`;
      if (Math.abs(aim.x - point.x) + Math.abs(aim.y - point.y) > .002) frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame && !media.matches) { last = performance.now(); frame = requestAnimationFrame(tick); } };
    const enter = () => { rect = node.getBoundingClientRect(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || media.matches) return;
      rect ??= node.getBoundingClientRect();
      aim.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      aim.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      start();
    };
    const leave = () => { aim.x = aim.y = 0; rect = null; start(); };
    const reset = () => { if (frame) cancelAnimationFrame(frame); frame = 0; aim.x = aim.y = point.x = point.y = 0; layer.style.transform = ""; rect = null; };
    node.addEventListener("pointerenter", enter);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    window.addEventListener("resize", leave);
    media.addEventListener("change", reset);
    return () => {
      reset();
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", leave);
      media.removeEventListener("change", reset);
    };
  }, [active]);

  return (
    <div ref={host} className={`h-scene h-scene-${kind}`} data-running={active ? "true" : "false"} aria-label={scene.caption}>
      <div className="h-scene-meta"><span>{scene.serial}</span><span className="h-live-dot" aria-hidden="true" /></div>
      <div ref={plane} className="h-scene-plane">
        <svg className="h-connections" viewBox="0 0 600 520" fill="none" aria-hidden="true">
          <path d="M100 150C200 70 410 95 500 190S490 400 330 420S50 365 100 150Z" stroke="#a5b5d5" strokeOpacity=".28" strokeWidth=".8" />
          <path className="h-flight" d="M100 150C200 70 410 95 500 190S490 400 330 420S50 365 100 150Z" stroke="#6d94e7" strokeWidth="2" strokeLinecap="round" />
          {kind === "studio" ? <path d="M110 140Q300 190 470 180M110 140Q270 280 130 365M470 180Q320 270 490 390M130 365Q320 300 490 390" stroke="#c2cbea" strokeWidth=".8" /> : null}
        </svg>
        <div className="h-sculpture">
          {kind === "orbit" ? <div className="h-earth-body"><img src={`/assets/hero-materials/${scene.asset}.png`} alt="" width="1448" height="1086" fetchPriority="high" decoding="async" /></div> : (
            <svg className="h-material-svg" viewBox="0 0 1448 1086" fill="none" aria-hidden="true">
              <image href={`/assets/hero-materials/${scene.asset}.png`} width="1448" height="1086" />
              {kind === "paths" ? <g className="h-loop-mark">
                <rect x="554" y="500" width="340" height="118" rx="24" fill="#fcfdff" fillOpacity=".94" stroke="#d8e1f0" strokeWidth="2" />
                <circle cx="607" cy="559" r="16" stroke="#9cafd1" strokeWidth="2" />
                <path d="M600 551l12 8-12 8" stroke="#6f88af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <text x="747" y="538" textAnchor="middle" className="h-mark-caption">CONNECTED SERVICES</text>
                <text x="748" y="585" textAnchor="middle" className="h-mark-heading">增长闭环</text>
              </g> : <g className="h-ai-mark" transform="translate(690 510)">
                <circle r="101" fill="#ffffff" fillOpacity=".2" stroke="#ffffff" strokeOpacity=".65" strokeWidth="2" />
                <text x="3" y="-1" textAnchor="middle" dominantBaseline="central" className="h-mark-ai">AI</text>
                <path d="M-23 51h46" stroke="#82a7c5" strokeOpacity=".6" strokeWidth="2" />
                <text x="2" y="78" textAnchor="middle" className="h-mark-caption">CORE</text>
              </g>}
            </svg>
          )}
        </div>
        {kind === "orbit" ? <>
          <HeroEarthPanda />
          <svg className="h-global-routes" viewBox="0 0 600 520" fill="none" aria-hidden="true">
            <path d="M224 189Q331 91 402 218M224 189Q367 173 342 326M402 218Q294 210 342 326" stroke="#76abf3" strokeWidth="1" strokeOpacity=".7" />
            <path className="h-flight" d="M224 189Q331 91 402 218Q294 210 342 326" stroke="#458cf3" strokeWidth="1.7" strokeLinecap="round" />
            <g fill="#fafdff" stroke="#75aafa" strokeWidth="1.5"><circle cx="224" cy="189" r="3.4"/><circle cx="402" cy="218" r="3.4"/><circle cx="342" cy="326" r="3.4"/></g>
          </svg>
          <ul className="h-social-orbit" aria-label="海外社媒平台">
            {socialPlatforms.map(platform => <li key={platform.name} className="h-social-slot" data-platform={platform.name} style={{ left: `${platform.x}%`, top: `${platform.y}%`, "--social-delay": platform.delay } as CSSProperties}>
              <a className="h-social-badge" href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={`访问 ${platform.name} 官方网站（新窗口）`}>
                <img src={`/brand/social-official/${platform.asset}`} width="32" height="32" alt={platform.name} loading="lazy" decoding="async" />
                <span aria-hidden="true">{platform.name}</span>
              </a>
            </li>)}
          </ul>
          <div className="h-global-note h-note-a"><i aria-hidden="true">↗</i><div><strong>全渠道触达</strong><span>让品牌与全球用户相遇</span></div></div>
          <div className="h-global-note h-note-b"><div className="h-signal" aria-hidden="true"><i /><i /><i /><i /><i /></div><div><strong>数据驱动增长</strong><span>策略 × 创意 × 技术</span></div></div>
          <span className="h-orbit-label">TOGETHER GO GLOBAL</span>
        </> : null}
        {kind === "paths" ? <>
          {services.map((item, i) => <Link className={`h-node h-node-${i}`} key={item.id} href={`/services/${item.id}`}><span className="h-node-number">0{i + 1}</span><strong>{item.name}</strong><small>{item.detail}</small><span className="h-node-arrow" aria-hidden="true">↗</span></Link>)}
        </> : null}
        {kind === "studio" ? <>
          {products.map((item, i) => <Link className={`h-node h-product h-node-${i}`} key={item.id} href={`/products/${item.id}`}><img src={item.logo} alt={item.name} width="126" height="30" /><small>{item.detail}</small><span className="h-node-arrow" aria-hidden="true">↗</span></Link>)}
        </> : null}
      </div>
      <div className="h-scene-bottom"><p>{scene.caption}</p><div>{scene.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
    </div>
  );
}
