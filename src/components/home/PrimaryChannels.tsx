"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { channelMarks } from "./channel-marks";
import { mountPandaMediaBackgrounds } from "./media-backgrounds";

const brandKey: Record<string, string> = {
  Meta: "meta",
  Google: "google",
  TikTok: "tiktok",
  Taboola: "taboola",
};

const officialLogos: Record<
  string,
  { src: string; alt: string; width: number; height: number; className: string }
> = {
  Meta: {
    src: "/brand/channels/meta-lockup-white.svg",
    alt: "Meta",
    width: 140,
    height: 60,
    className: "is-meta",
  },
  Google: {
    src: "/brand/channels/google-wordmark.png",
    alt: "Google",
    width: 120,
    height: 66,
    className: "is-google",
  },
  TikTok: {
    src: "/brand/channels/tiktok-horizontal-white.png",
    alt: "TikTok",
    width: 160,
    height: 67,
    className: "is-tiktok",
  },
  Taboola: {
    src: "/brand/channels/taboola-white.png",
    alt: "Taboola",
    width: 140,
    height: 79,
    className: "is-taboola",
  },
};

export function PrimaryChannels({ channels }: { channels: Array<{ name: string; role: string }> }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return mountPandaMediaBackgrounds(root);
  }, [channels]);

  return (
    <div className="channel-primary" ref={rootRef} aria-label="主要合作平台资质">
      {channels.map((channel, index) => {
        const tint = channelMarks[channel.name]?.color ?? "#0559ff";
        const brand = brandKey[channel.name] ?? channel.name.toLowerCase();
        const logo = officialLogos[channel.name];
        return (
          <button
            key={channel.name}
            className="pm-item channel-cred"
            type="button"
            data-brand={brand}
            aria-label={`${channel.name}：${channel.role}`}
            aria-pressed="false"
            style={{ ["--channel" as string]: tint }}
          >
            <canvas aria-hidden="true" />
            <span className="channel-cred-top">
              {logo ? (
                <span className={`channel-cred-logo ${logo.className}`}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="channel-cred-logo-img"
                    unoptimized
                  />
                </span>
              ) : (
                <span className="channel-cred-pill">{channel.name.toUpperCase()}</span>
              )}
              <span className="channel-cred-index">0{index + 1}</span>
            </span>
            <span className="channel-cred-body">
              <strong>{channel.name}</strong>
              <span className="channel-cred-role">{channel.role}</span>
              <span className="channel-cred-foot">
                核心资质
                <span aria-hidden="true">↗</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
