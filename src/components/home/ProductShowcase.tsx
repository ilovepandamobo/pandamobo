"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { PublicProduct } from "@/lib/content/public-types";
import { productArtFor } from "@/content/product-art";
import { productExperienceDesign } from "@/content/product-experience";
import { ProductExperience } from "./ProductExperience";

type Box = { left: number; top: number; width: number; height: number };
const boxStyle = (box: Box): CSSProperties => ({ left: box.left, top: box.top, width: box.width, height: box.height });

export function ProductShowcase({ products }: { products: PublicProduct[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [active, setActive] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const activeRef = useRef<string | null>(null);
  const snapshots = useRef(new Map<string, DOMRect>());
  const animations = useRef<Animation[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreFocus = useRef<string | null>(null);
  const hoverSuppressed = useRef(false);
  const selected = products.find(product => product.id === active);
  const small = width < 720;
  const stageHeight = small ? 758 : 614;
  const panelHeight = small ? 674 : 510;
  const gap = small ? 14 : 16;
  const columns = small ? 2 : products.length;
  const tileWidth = (width - gap * (columns - 1)) / columns;
  const tileHeight = small ? 372 : stageHeight;
  const dockStart = small ? 0 : 132;
  const dockGap = small ? 8 : 12;
  const dockWidth = (width - dockStart - dockGap * (products.length - 1)) / Math.max(1, products.length);
  const collapsedBox = (index: number): Box => ({ left: index % columns * (tileWidth + gap), top: Math.floor(index / columns) * (tileHeight + gap), width: tileWidth, height: tileHeight });
  const dockBox = (id: string): Box => ({ left: dockStart + products.findIndex(product => product.id === id) * (dockWidth + dockGap), top: panelHeight + (small ? 14 : 18), width: dockWidth, height: small ? 70 : 86 });
  const expandedBox = (id: string): Box => id === active ? { left: 0, top: 0, width, height: panelHeight } : dockBox(id);
  const logoBox = (id: string, index: number): Box => {
    if (!active) { const box = collapsedBox(index); return { left: box.left + (small ? 14 : 26), top: box.top + (small ? 23 : 30), width: box.width - (small ? 28 : 52), height: small ? 34 : 48 }; }
    if (active === id) return { left: small ? 22 : 38, top: small ? 25 : 30, width: small ? Math.min(205, width - 130) : 230, height: small ? 35 : 48 };
    const box = expandedBox(id); return { left: box.left + (small ? 11 : 24), top: box.top + (small ? 14 : 16), width: box.width - (small ? 22 : 48), height: small ? 24 : 34 };
  };
  const cancelHover = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  const change = (id: string | null, restoreFocus = false) => {
    cancelHover();
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (activeRef.current === id || !root.current) return;
    const old = activeRef.current;
    if (!id && restoreFocus) hoverSuppressed.current = true;
    snapshots.current = new Map(Array.from(root.current.querySelectorAll<HTMLElement>("[data-product-flip]")).map(el => [el.dataset.productFlip!, el.getBoundingClientRect()]));
    for (const animation of animations.current) animation.cancel();
    animations.current = [];
    activeRef.current = id; setActive(id);
    if (restoreFocus && old) requestAnimationFrame(() => { const button = root.current?.querySelector<HTMLButtonElement>(`[data-product-trigger="${old}"]`); if (button && document.activeElement !== button) { ignoreFocus.current = old; button.focus({ preventScroll: true }); } });
  };
  useLayoutEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    setWidth(root.current.getBoundingClientRect().width); observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!root.current || !snapshots.current.size) return;
    const before = snapshots.current; snapshots.current = new Map();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(root.current.querySelectorAll<HTMLElement>("[data-product-flip]"));
    const after = elements.map(element => ({ element, box: element.getBoundingClientRect() }));
    for (const { element, box } of after) {
      const old = before.get(element.dataset.productFlip!);
      if (!old || !box.width || !box.height) continue;
      const animation = element.animate([
        { transform: `translate(${old.left - box.left}px, ${old.top - box.top}px) scale(${old.width / box.width}, ${old.height / box.height})` },
        { transform: "translate(0,0) scale(1,1)" },
      ], { duration: 620, easing: "cubic-bezier(.22,.78,.16,1)", fill: "both" });
      animations.current.push(animation);
      void animation.finished.then(() => animation.cancel()).catch(() => undefined);
    }
  }, [active]);
  useEffect(() => {
    if (!root.current) return;
    let visible = false;
    const update = () => setAnimate(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { rootMargin: "80px" });
    observer.observe(root.current); document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); cancelHover(); if (closeTimer.current) clearTimeout(closeTimer.current); animations.current.forEach(animation => animation.cancel()); };
  }, []);

  return <div ref={root} className="ps-stage" data-expanded={Boolean(active)} data-small={small} data-animate={animate} style={{ height: stageHeight }}
    onPointerEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
    onPointerMove={event => {
      if (!hoverSuppressed.current || event.pointerType !== "mouse" || Math.abs(event.movementX) + Math.abs(event.movementY) < 3) return;
      hoverSuppressed.current = false;
      const button = (event.target as Element).closest<HTMLElement>("[data-product-trigger]");
      if (button?.dataset.productTrigger) { const id = button.dataset.productTrigger; cancelHover(); hoverTimer.current = setTimeout(() => change(id), 140); }
    }}
    onPointerLeave={() => {
      cancelHover();
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) closeTimer.current = setTimeout(() => { if (!root.current?.querySelector(":focus-visible")) change(null); }, 650);
    }}
    onKeyDown={event => { if (event.key === "Escape" && activeRef.current) { event.preventDefault(); event.stopPropagation(); change(null, true); } }}>
    {products.map((product, index) => {
      const design = productExperienceDesign[product.id];
      const art = productArtFor(product.id);
      const box = active ? expandedBox(product.id) : collapsedBox(index);
      const overview = collapsedBox(index);
      const brand = logoBox(product.id, index);
      const triggerBox = active ? dockBox(product.id) : box;
      return <div className="ps-product" key={product.id} style={{ "--ps-accent": design?.accent, "--ps-tint": design?.tint } as CSSProperties}>
        <div className="ps-surface" data-current={active === product.id} data-product-flip={`surface-${product.id}`} style={boxStyle(box)} aria-hidden="true" />
        <div className="ps-overview" style={boxStyle(overview)} aria-hidden={Boolean(active)}>
          <div className="ps-overview-copy"><span className="ps-overview-kicker">{product.kicker}</span><h3>{design?.headline ?? product.name}</h3><p>{product.summary}</p><ul>{product.capabilities.slice(0, 2).map(item => <li key={item}>{item}</li>)}</ul><span className="ps-explore">探索产品 <b>↗</b></span></div>
          {art ? <img className="ps-overview-art" src={art.src} alt="" width={800} height={920} loading="lazy" decoding="async" /> : null}
        </div>
        <div className="ps-brand" data-product-flip={`brand-${product.id}`} style={boxStyle(brand)} aria-hidden="true">{product.logo ? <img src={product.logo} alt="" /> : <strong>{product.name}</strong>}</div>
        {active && active !== product.id ? <span className="ps-dock-kicker" style={{ left: box.left + 24, top: box.top + 55, width: box.width - 48 }} aria-hidden="true">{product.kicker}<b>↗</b></span> : null}
        {active === product.id ? <div className="ps-active-chip" style={boxStyle(dockBox(product.id))} aria-hidden="true">{product.logo ? <img src={product.logo} alt="" /> : <b>{product.name}</b>}<span>正在浏览<i /></span></div> : null}
        <button className="ps-trigger" data-product-trigger={product.id} type="button" style={boxStyle(triggerBox)} aria-label={`${product.name} ${active === product.id ? "收起" : "展开"}产品介绍`} aria-expanded={active === product.id} aria-controls="product-stage-detail"
          onPointerEnter={event => {
            if (hoverSuppressed.current || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover)").matches) return;
            cancelHover(); hoverTimer.current = setTimeout(() => change(product.id), activeRef.current ? 90 : 140);
          }}
          onPointerLeave={cancelHover}
          onFocus={event => { if (ignoreFocus.current === product.id) { ignoreFocus.current = null; return; } if (event.currentTarget.matches(":focus-visible")) change(product.id); }}
          onClick={() => { const closing = activeRef.current === product.id; change(closing ? null : product.id, closing); }} />
      </div>;
    })}
    {selected ? <>
      <div className="ps-detail" id="product-stage-detail" role="region" aria-label={`${selected.name}产品介绍`} key={selected.id}>
        <div className="ps-detail-copy"><span className="ps-detail-kicker">{selected.kicker}</span><h3>{productExperienceDesign[selected.id]?.headline ?? selected.name}</h3><p className="ps-detail-summary">{selected.summary}</p><ul className="ps-capabilities">{selected.capabilities.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><Link className="ps-detail-link" href={`/products/${selected.id}`}>了解产品 <span aria-hidden="true">↗</span></Link></div>
        <div className="ps-experience"><ProductExperience productId={selected.id} /></div>
      </div>
      <button type="button" className="ps-close" onClick={() => change(null, true)}>收起视图 <span aria-hidden="true">↙</span></button>
      <div className="ps-dock-label" aria-hidden="true"><span>继续探索</span><b>更多 AI 产品</b><i>→</i></div>
    </> : null}
  </div>;
}
