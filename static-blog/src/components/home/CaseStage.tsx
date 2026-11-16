"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PublicCase } from "@/lib/content/public-types";
import { CaseCover } from "./Visuals";

const DWELL = 10000;

// Art-directed colors sampled from the original case pages; no runtime canvas reads.
const CASE_PALETTES: Record<string, [string, string, number]> = {
  "mixue": ["229 70 78", "239 153 112", 1],
  "roborock": ["175 110 57", "204 166 104", 1.65],
  "bytedance": ["169 144 43", "180 117 65", 1.55],
  "dameng-longtu": ["96 154 49", "175 186 64", 1.55],
  "canton-fair": ["92 139 157", "167 149 113", 1.8],
  "omoda-jaecoo": ["117 86 170", "107 144 188", 1.65],
  "viaim": ["163 126 91", "179 163 133", 1.9],
  "dreame": ["173 91 168", "188 137 180", 1.65],
  "lightinthebox": ["147 170 65", "198 169 56", 1.65],
  "faw": ["69 108 181", "114 105 174", 1.65],
  "dynasty-legends-2": ["106 125 146", "167 143 112", 1.9],
  "baidu-gravity": ["113 141 166", "143 159 180", 1.9],
};
const DEFAULT_PALETTE: [string, string, number] = ["134 155 181", "173 181 193", 1.5];

export function CaseStage({ cases }: { cases: PublicCase[] }) {
  const [slug, setSlug] = useState(cases[0]?.slug ?? "");
  const [paused, setPaused] = useState(true);
  const [reading, setReading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const active = cases.find(item => item.slug === slug) ?? cases[0];
  const position = Math.max(0, cases.findIndex(item => item.slug === active?.slug));
  const running = !paused && !reading && visible && !hidden;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { if (media.matches) setPaused(true); };
    change();
    const visibility = () => setHidden(document.hidden);
    visibility();
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    if (rootRef.current) observer.observe(rootRef.current);
    return () => { observer.disconnect(); media.removeEventListener("change", change); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => setCanScroll(list.scrollWidth > list.clientWidth + 4);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [cases.length]);

  useEffect(() => {
    if (!running || cases.length < 2 || !active) return;
    const timer = window.setTimeout(() => {
      const next = cases[(position + 1) % cases.length];
      if (next) setSlug(next.slug);
    }, DWELL);
    return () => window.clearTimeout(timer);
  }, [running, cases, position, active]);

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(".case-pick.is-active");
    if (!list || !row) return;
    const listBox = list.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    list.scrollLeft += rowBox.left + rowBox.width / 2 - (listBox.left + listBox.width / 2);
  }, [active?.slug]);

  if (!active) return null;
  const select = (next: number) => {
    const item = cases[(next + cases.length) % cases.length];
    if (item) setSlug(item.slug);
  };

  return (
    <div ref={rootRef} className={`case-stage case-gallery${running ? "" : " is-paused"}`}
      style={{ "--case-accent": (CASE_PALETTES[active.slug] ?? DEFAULT_PALETTE)[0] } as CSSProperties}>
      <div className="case-ambience" aria-hidden="true">
        {cases.map(item => {
          const [primary, secondary, strength] = CASE_PALETTES[item.slug] ?? DEFAULT_PALETTE;
          return <div key={item.slug} className={`case-ambience-layer${item.slug === active.slug ? " is-active" : ""}`}
            data-case={item.slug}
            style={{ backgroundImage: `radial-gradient(ellipse at 12% 44%, rgb(${primary} / ${.16 * strength}), transparent 57%), radial-gradient(ellipse at 90% 57%, rgb(${secondary} / ${.19 * strength}), transparent 59%), radial-gradient(ellipse at 50% 87%, rgb(${primary} / ${.065 * strength}), transparent 56%)` }} />;
        })}
      </div>
      <figure className="case-stage-frame" id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${active.slug}`}
        onMouseEnter={() => setReading(true)} onMouseLeave={() => setReading(false)}
        onFocusCapture={() => setReading(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setReading(false); }}>
        <a className="case-stage-cover" href={active.coverImage} target="_blank" rel="noopener noreferrer" aria-label={`查看${active.brand}案例完整大图（新窗口）`}>
          <div key={active.slug} className="is-active">
            <CaseCover tone={active.tone} name={active.shortName} label={active.coverLabel} src={active.coverImage} />
          </div>
          <span className="case-image-expand" aria-hidden="true">查看大图 ↗</span>
        </a>
        <figcaption className="case-stage-caption">
          <div>
            <p className="case-caption-meta"><span>{String(position + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</span><strong>{active.shortName}</strong><small>{active.industry}</small></p>
            <p className="case-caption-summary">{active.summary}</p>
          </div>
          <Link className="case-caption-link" href={`/cases/${active.slug}`}>查看案例 <span aria-hidden="true">↗</span></Link>
        </figcaption>
      </figure>
      <div className="case-stage-bar">
        {canScroll ? <button type="button" className="case-nudge" aria-label="上一个案例" onClick={() => select(position - 1)}>‹</button> : null}
        <div className={canScroll ? "case-picks is-overflow" : "case-picks"} ref={listRef} role="tablist" aria-label="案例"
          onKeyDown={event => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            const next = event.key === "ArrowRight" ? position + 1 : position - 1;
            select(next);
            event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[(next + cases.length) % cases.length]?.focus();
          }}>
          {cases.map(item => (
            <button key={item.slug} type="button" role="tab" id={`case-tab-${item.slug}`} className={item.slug === active.slug ? "case-pick is-active" : "case-pick"}
              aria-selected={item.slug === active.slug} aria-controls="case-panel" tabIndex={item.slug === active.slug ? 0 : -1} onClick={() => setSlug(item.slug)}>
              <span className="case-thumb" aria-hidden="true"><CaseCover tone={item.tone} name={item.shortName} label={item.coverLabel} src={item.coverImage} thumbnail /></span>
              <strong>{item.shortName}</strong><i className="meter" />
            </button>
          ))}
        </div>
        {canScroll ? <button type="button" className="case-nudge" aria-label="下一个案例" onClick={() => select(position + 1)}>›</button> : null}
        <button type="button" className="hero-pause" aria-pressed={paused} aria-label={paused ? "自动播放案例" : "暂停案例播放"} onClick={() => setPaused(value => !value)}>{paused ? "播放" : "暂停"}</button>
      </div>
    </div>
  );
}
