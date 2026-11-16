"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { PublicCase } from "@/lib/content/public-types";
import { channelMarks } from "./channel-marks";
import { CaseCover } from "./Visuals";

export function ChannelGlyph({ name }: { name: string }) {
  const mark = channelMarks[name];
  if (!mark) {
    return <span className="channel-mono">{name.slice(0, 1)}</span>;
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill={mark.color} d={mark.path} />
    </svg>
  );
}

function LogoRow({ names, pace = "mid" }: { names: string[]; pace?: "slow" | "mid" | "fast" }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(4);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || names.length === 0) return;
    const fit = () => {
      const track = row.querySelector(".logo-track");
      const card = track?.querySelector(".logo-card");
      if (!(track instanceof HTMLElement) || !(card instanceof HTMLElement)) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 14;
      const unit = card.offsetWidth + gap;
      if (unit <= gap || row.clientWidth === 0) return;
      const perHalf = Math.max(1, Math.ceil((row.clientWidth + unit) / (unit * names.length)));
      const next = perHalf * 2;
      setRepeat((current) => (current === next ? current : next));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => observer.disconnect();
  }, [names]);

  const loop = Array.from({ length: repeat }, () => names).flat();
  return (
    <div className={`logo-row pace-${pace}`} ref={rowRef}>
      <div className="logo-track">
        {loop.map((name, index) => (
          <div className="logo-card" key={`${name}-${index}`} aria-hidden={index >= names.length}>
            <ChannelGlyph name={name} />
            <span className={channelMarks[name] ? undefined : "logo-word"}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const globeSpots = ["chip-a", "chip-b", "chip-c", "chip-d", "chip-e", "chip-f", "chip-g", "chip-h"];

export function MediaGlobe({ names }: { names: string[] }) {
  const featured = names.filter((name) => channelMarks[name]).slice(0, globeSpots.length);
  return (
    <div className="globe" aria-hidden="true">
      <div className="globe-sphere" />
      {featured.map((name, index) => (
        <span className={`globe-chip ${globeSpots[index]}`} key={name} style={{ animationDelay: `${index * -0.7}s` }}>
          <ChannelGlyph name={name} />
          {name}
        </span>
      ))}
    </div>
  );
}

export function LogoWall({ names }: { names: string[] }) {
  const [playing, setPlaying] = useState(true);
  const third = Math.ceil(names.length / 3);
  return (
    <div className={playing ? "logo-wall is-playing" : "logo-wall"} aria-label="通案列示的媒介渠道">
      <LogoRow names={names.slice(0, third)} pace="slow" />
      <LogoRow names={names.slice(third, third * 2)} pace="fast" />
      <LogoRow names={names.slice(third * 2)} pace="mid" />
      <div className="rail-controls">
        <button type="button" className="hero-pause" aria-pressed={!playing} onClick={() => setPlaying((value) => !value)}>
          {playing ? "暂停渠道滚动" : "播放渠道滚动"}
        </button>
      </div>
    </div>
  );
}

export function NameWall({ names }: { names: string[] }) {
  const loop = [...names, ...names];
  return (
    <div className="name-row">
      <div className="name-track">
        {loop.map((name, index) => (
          <div className="name-card" key={`${name}-${index}`} aria-hidden={index >= names.length}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseRail({ cases }: { cases: PublicCase[] }) {
  const [playing, setPlaying] = useState(true);
  const copies = [0, 1];
  return (
    <div className={playing ? "case-rail is-playing" : "case-rail"}>
      <div className="case-rail-window">
      <div className="case-rail-track">
        {copies.map((copy) =>
          cases.map((item) => (
            <article key={`${item.slug}-${copy}`} className="case-card" aria-hidden={copy === 1}>
              <CaseCover tone={item.tone} name={item.shortName} label={item.coverLabel} src={item.coverImage} />
              <div className="case-body">
                <p className="kicker">{item.industry}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link className="btn btn-ghost" href={`/cases/${item.slug}`} tabIndex={copy === 1 ? -1 : 0}>
                  查看案例
                </Link>
              </div>
            </article>
          )),
        )}
      </div>
      </div>
      <div className="rail-controls">
        <button type="button" className="hero-pause" aria-pressed={!playing} onClick={() => setPlaying((value) => !value)}>
          {playing ? "暂停案例滚动" : "播放案例滚动"}
        </button>
      </div>
    </div>
  );
}
