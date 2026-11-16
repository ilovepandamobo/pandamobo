"use client";

import { createElement, useEffect, useRef, useState } from "react";

type BspVisualProps = {
  brand?: string;
  label?: string;
  company?: string;
  accent?: string;
  speed?: string;
};

let loadPromise: Promise<void> | null = null;

function loadBspVisualScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("panda-bsp-visual")) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-bsp-visual="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("BSP visual failed to load")), { once: true });
      if (customElements.get("panda-bsp-visual")) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "/assets/bsp-visual.js?v=3";
    script.async = true;
    script.dataset.bspVisual = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("BSP visual failed to load"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

function tightenBspInstance(host: Element) {
  const visual = host.querySelector("panda-bsp-visual");
  const root = visual?.shadowRoot;
  if (!root || root.querySelector("[data-pm-tighten]")) return;
  const style = document.createElement("style");
  style.dataset.pmTighten = "true";
  style.textContent = `
    .company, .hint { display: none !important; }
    .stage { aspect-ratio: 1 / 1; min-height: 240px; max-height: 360px; }
    .credential { top: 78%; font-size: clamp(18px, 5cqi, 28px); }
  `;
  root.appendChild(style);
  visual?.setAttribute("company", "");
}

export function BspVisual({
  brand = "WhatsApp",
  label = "官方顶级合作伙伴",
  company = "",
  accent = "#83ffbf",
  speed = "0.72",
}: BspVisualProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadBspVisualScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !hostRef.current) return;
    tightenBspInstance(hostRef.current);
    const frame = window.requestAnimationFrame(() => {
      if (hostRef.current) tightenBspInstance(hostRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready, brand, label, company, accent, speed]);

  return (
    <div className={ready ? "wa-bsp is-ready" : "wa-bsp"} ref={hostRef}>
      {ready ? (
        createElement("panda-bsp-visual", {
          brand,
          label,
          company,
          accent,
          speed,
          quality: "auto",
        })
      ) : (
        <div className="wa-bsp-fallback" aria-hidden="true">
          <span className="wa-bsp-fallback-ring" />
          <strong>BSP</strong>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
