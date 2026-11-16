"use client";

import Link from "next/link";
import { createElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Script from "next/script";
import { ServiceContext, ServiceExpandedContext } from "./ServiceContext";
import { ConsultButton } from "@/components/site/SiteFrame";
import type { PublicBanner, PublicService } from "@/lib/content/public-types";
import { HeroScene } from "./HeroScene";
import { HeroPearlBackdrop } from "./HeroPearlBackdrop";

export function MotionRoot() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);
  return null;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reducedMotion()) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${shown ? "is-in" : ""} ${className}`.trim()} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export function MetricFigure({ text }: { text: string }) {
  const match = text.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(match ? "0" : text);

  useEffect(() => {
    const parsed = text.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!parsed) return;
    const target = Number(parsed[2]);
    const decimals = parsed[2].includes(".") ? parsed[2].split(".")[1]?.length ?? 0 : 0;
    if (reducedMotion()) {
      setCurrent(parsed[2]);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const started = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / 980);
          const eased = 1 - (1 - progress) ** 3;
          const value = target * eased;
          setCurrent(decimals ? value.toFixed(decimals) : String(Math.round(value)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  if (!match) return <>{text}</>;
  return (
    <span ref={ref}>
      {match[1]}
      {current}
      {match[3]}
    </span>
  );
}

export function HeroSlider({ banners }: { banners: PublicBanner[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pausedByPointer, setPausedByPointer] = useState(false);
  const [controlsHovered, setControlsHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(true);
  const [covered, setCovered] = useState(false);
  const sliderRef = useRef<HTMLElement>(null);
  const count = banners.length;
  const active = banners[index] ?? banners[0];
  const slideDuration = active?.visual === "orbit" ? 20000 : 6800;

  useEffect(() => {
    const node = sliderRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false));
    observer.observe(node);
    const opening = node.closest(".hero-lab-opening");
    const update = () => setCovered(opening?.hasAttribute("data-hero-covered") ?? false);
    const mutation = new MutationObserver(update);
    if (opening) mutation.observe(opening, { attributes: true, attributeFilter: ["data-hero-covered"] });
    update();
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduction = () => setReduced(query.matches);
    onVisibility(); onReduction();
    document.addEventListener("visibilitychange", onVisibility);
    query.addEventListener("change", onReduction);
    return () => { document.removeEventListener("visibilitychange", onVisibility); query.removeEventListener("change", onReduction); };
  }, []);

  useEffect(() => {
    if (!playing || pausedByPointer || controlsHovered || hidden || !inView || covered || count < 2 || reduced) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), slideDuration);
    return () => window.clearTimeout(timer);
  }, [playing, pausedByPointer, controlsHovered, hidden, inView, covered, count, reduced, index, slideDuration]);

  if (!active) return null;

  function go(next: number) {
    setIndex((next + count) % count);
  }

  const moving = playing && !pausedByPointer && !controlsHovered && !hidden && inView && !covered && !reduced;

  return (
    <section
      ref={sliderRef}
      className="hero"
      id="hero"
      aria-roledescription="carousel"
      aria-label="首页主视觉"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(index - 1);
        }
      }}
    >
      <HeroPearlBackdrop />
      <div
        className="hero-stage"
        onMouseEnter={() => setPausedByPointer(true)}
        onMouseLeave={() => setPausedByPointer(false)}
        onFocusCapture={() => setPausedByPointer(true)}
        onBlurCapture={(event) => {
          const next = event.relatedTarget;
          if (!(next instanceof Node) || !event.currentTarget.contains(next)) setPausedByPointer(false);
        }}
      >
        {banners.map((banner, bannerIndex) => {
          const [lead, rest] = banner.title.split("\n");
          const selected = bannerIndex === index;
          const Title = selected ? "h1" : "p";
          return (
            <article key={banner.id} id={`hero-slide-${banner.id}`} role="tabpanel" aria-labelledby={`hero-tab-${banner.id}`} className={selected ? "hero-slide is-active" : "hero-slide"} aria-hidden={!selected} inert={!selected}>
              <div className="wrap hero-grid">
                <div className={`${selected ? "slide-copy is-playing" : "slide-copy"}${banner.visual === "orbit" ? " hero-copy-global" : ""}`}>
                  <p className="eyebrow">{banner.kicker}</p>
                  <p className="hero-category">{banner.visual === "orbit" ? "数据与传播双基因" : banner.visual === "paths" ? "四大服务协同增长" : "AI 产品与业务洞察"}</p>
                  <Title className="slide-title">
                    {lead}
                    {rest ? (
                      <>
                        <br />
                        <span className="title-accent">{rest}</span>
                      </>
                    ) : null}
                  </Title>
                  <p className="lede">{banner.text}</p>
                  <div className="hero-actions">
                    {banner.primaryAction === "consult" ? (
                      <ConsultButton className="btn btn-primary">{banner.primaryLabel}</ConsultButton>
                    ) : (
                      <Link className="btn btn-primary" href={banner.primaryHref || "/"} tabIndex={selected ? 0 : -1}>
                        {banner.primaryLabel}
                      </Link>
                    )}
                    <a className="btn btn-ghost" href={banner.secondaryHref} tabIndex={selected ? 0 : -1}>
                      {banner.secondaryLabel}
                    </a>
                  </div>
                  <div className="hero-support" aria-hidden="true">{(banner.visual === "orbit" ? ["数据洞察", "整合传播", "全球增长"] : banner.visual === "paths" ? ["专业服务", "协同执行", "持续复盘"] : ["自研产品", "AI 协同", "业务增长"]).map(label => <span key={label}>{label}</span>)}</div>
                </div>
                <HeroScene kind={banner.visual} active={selected && playing && inView && !covered && !hidden && !reduced} />
              </div>
            </article>
          );
        })}
      </div>
      <div
        className={moving ? "wrap hero-controls is-playing" : "wrap hero-controls"}
        style={{ "--hero-slide-duration": `${slideDuration}ms` } as CSSProperties}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setControlsHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setControlsHovered(false);
        }}
      >
        <button type="button" className="hero-arrow" aria-label="上一张" onClick={() => go(index - 1)}>
          ‹
        </button>
        <div className="hero-dots" role="tablist" aria-label="主视觉切换">
          {banners.map((banner, bannerIndex) => (
            <button
              key={banner.id}
              type="button"
              role="tab"
              id={`hero-tab-${banner.id}`}
              aria-controls={`hero-slide-${banner.id}`}
              aria-selected={bannerIndex === index}
              className={bannerIndex === index ? "is-active" : ""}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setIndex(bannerIndex);
              }}
              onClick={() => setIndex(bannerIndex)}
            ><b aria-hidden="true">0{bannerIndex + 1}</b><span>{["全球增长", "四大服务", "AI 产品"][bannerIndex] ?? banner.kicker}</span></button>
          ))}
        </div>
        <button type="button" className="hero-arrow" aria-label="下一张" onClick={() => go(index + 1)}>
          ›
        </button>
        <button type="button" className="hero-pause" aria-pressed={!playing} onClick={() => setPlaying((value) => !value)}>
          {playing ? "暂停" : "播放"}
        </button>
      </div>
    </section>
  );
}

function ServiceScene({ serviceId, open }: { serviceId: string; open: boolean }) {
  return createElement("panda-service-scene", {
    kind: serviceId,
    expanded: open ? "true" : "false",
    className: "svc-kinetic-scene",
  });
}

export function ServiceRail({ services }: { services: PublicService[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(true);
  const [size, setSize] = useState({ collapsed: 0, expanded: 0 });
  const hoverIntent = useRef({ index: -1, timer: 0 });
  const activate = (index: number) => {
    window.clearTimeout(hoverIntent.current.timer);
    hoverIntent.current.index = -1;
    setActive(index);
  };
  const requestHover = (index: number) => {
    if (index === active || hoverIntent.current.index === index) return;
    window.clearTimeout(hoverIntent.current.timer);
    hoverIntent.current.index = index;
    hoverIntent.current.timer = window.setTimeout(() => {
      hoverIntent.current.index = -1;
      setActive(index);
    }, 75);
  };
  useEffect(() => () => window.clearTimeout(hoverIntent.current.timer), []);


  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const apply = () => setWide(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    const node = railRef.current;
    if (!node) return;
    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(node).columnGap || "14") || 14;
      const count = services.length;
      const total = node.clientWidth;
      const collapsed = Math.round(Math.min(240, Math.max(156, total * 0.175)));
      const expanded = total - collapsed * (count - 1) - gap * (count - 1);
      setSize({ collapsed, expanded: Math.max(expanded, 280) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [services.length]);

  const collapsedText = size.collapsed > 0 ? size.collapsed - 78 : undefined;
  const expandedText = size.expanded > 0 ? size.expanded - 78 : undefined;

  return (
    <>
    <Script src="/assets/service-scenes.js?v=20261109-3" strategy="afterInteractive" />
    <div className="svc-rail" ref={railRef}>
      {services.map((service, index) => {
        const open = index === active;
        return (
          <article
            key={service.id}
            className={open ? `svc-panel layout-${service.layout} is-open` : `svc-panel layout-${service.layout}`}
            style={wide && size.collapsed ? { width: open ? size.expanded : size.collapsed } : undefined}
            onPointerMove={(event) => {
              if (event.pointerType === "mouse" && (event.movementX !== 0 || event.movementY !== 0)) requestHover(index);
            }}
            onPointerLeave={() => {
              if (hoverIntent.current.index === index) {
                window.clearTimeout(hoverIntent.current.timer);
                hoverIntent.current.index = -1;
              }
            }}
            onFocus={() => activate(index)}
            onClick={() => activate(index)}
          >
            <button
              type="button"
              className="svc-arrow"
              aria-expanded={open || !wide}
              aria-label={`${open ? "收起" : "展开"}${service.name}`}
              onClick={() => activate(index)}
            >
              →
            </button>
            <div className="svc-face svc-face-collapsed" style={collapsedText ? { width: collapsedText } : undefined} aria-hidden={open}>
              <h3>{service.shortName}</h3>
              <p className="svc-collapsed-summary">{service.summary}</p>
            </div>
            <div className="svc-face svc-face-expanded" style={expandedText ? { width: expandedText } : undefined} aria-hidden={wide && !open}>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.points.slice(0, 3).map((point) => (
                  <li key={point.title}>
                    <strong>{point.title}</strong>
                    {point.text ? <span>{point.text}</span> : null}
                  </li>
                ))}
              </ul>
              <Link className="btn btn-ghost svc-cta" href={`/services/${service.id}`} tabIndex={open || !wide ? 0 : -1} onClick={(event) => event.stopPropagation()}>
                了解此项服务
              </Link>
            </div>
            <div className="svc-scene has-kinetic" aria-hidden="true">
              <ServiceScene serviceId={service.id} open={open || !wide} />
              <ServiceContext serviceId={service.id} />
              <ServiceExpandedContext serviceId={service.id} />
            </div>
          </article>
        );
      })}
    </div>
    </>
  );
}

export function ChannelMarquee({ channels, className = "" }: { channels: string[]; className?: string }) {
  const loop = [...channels, ...channels];
  return (
    <>
      <ul className="sr-only">
        {channels.map((channel) => (
          <li key={channel}>{channel}</li>
        ))}
      </ul>
      <div className={`marquee ${className}`.trim()} aria-hidden="true">
        <div className="marquee-track">
          {loop.map((channel, index) => (
            <span key={`${channel}-${index}`}>{channel}</span>
          ))}
        </div>
      </div>
    </>
  );
}
