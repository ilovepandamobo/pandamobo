"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { productArtFor } from "@/content/product-art";

let loadPromise: Promise<void> | null = null;

function loadProductArtScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("panda-product-art")) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-product-art="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Product art failed to load")), { once: true });
      if (customElements.get("panda-product-art")) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "/assets/product-art.js?v=2";
    script.async = true;
    script.dataset.productArt = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Product art failed to load"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

function softenProductArt(host: HTMLElement) {
  const visual = host.querySelector("panda-product-art");
  const root = visual?.shadowRoot;
  if (!root || root.querySelector("[data-pm-art-blend]")) return;
  const style = document.createElement("style");
  style.dataset.pmArtBlend = "true";
  style.textContent = `
    :host { height: 100%; aspect-ratio: auto; }
    .frame {
      background: transparent !important;
      border-radius: 0 0 20px 20px;
    }
    img {
      object-position: center 62%;
      -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.35) 10%, #000 22%, #000 100%);
      mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.35) 10%, #000 22%, #000 100%);
    }
  `;
  root.appendChild(style);
}

export function ProductArt({ productId }: { productId: string }) {
  const art = productArtFor(productId);
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!art) return;
    let cancelled = false;
    loadProductArtScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [art]);

  useEffect(() => {
    if (!ready || !hostRef.current) return;
    softenProductArt(hostRef.current);
    const frame = window.requestAnimationFrame(() => {
      if (hostRef.current) softenProductArt(hostRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready, productId]);

  if (!art) return null;

  if (!ready) {
    return (
      <div className="product-art product-art-fallback" aria-hidden="true">
        <img src={art.src} alt="" width={800} height={920} loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className="product-art" ref={hostRef}>
      {createElement("panda-product-art", {
        variant: art.variant,
        src: art.src,
        alt: art.alt,
      })}
    </div>
  );
}
