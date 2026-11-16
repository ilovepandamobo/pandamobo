"use client";

import { useEffect, useRef } from "react";
import type { PublicMetric } from "@/lib/content/public-types";

const B64 =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf4AP/AAAAAAAAAAAAAAAAAAAAAAAAX/z///+AAAAAAAABAAAAAAAAAAAAAYd8P///wAA+AAAAAA8AAAAAAAAAAAwAnw////4AAIAAAAAAGAAAAAAAAAAADivwAf//wAAAAADAAf/wAHYAAAAAADoi3sAP//gAAAAAMAD///sAAAAgBgACfwz/AD/+gAAAwAEHf///+/8gBAP/7/nJdjwD/+AAAH/AA7f///////f4P//////h8H/gAAAf/6//f////////Mf/////9H4D8AeAA+ev///////////AP/////4A0B4AAAD5/////////////Af3////gHgA4AAAH5///////////LwAHgH///gHkAAAAAH4/////////+CIAABAB///4D+AAAAGCx/////////4A8AAIAAf///n/gAAAOCD/////////wA4AAAAAf///n/wAAAbP///////////AgAAAAAP/////wAAADf//////////9AAAAAAAF////0YAAAB///////////9AAAAAAAD////8EAAAB///////////5AAAAAAAD////2AAAAB/f5fP//////wAAAAAAAD////gAAAAfxnwPP//////jAAAAAAAD////AAAAAPCb3/n/////+CAAAAAAAD///8AAAAAfALf/n////+ECAAAAAAAB///8AAAAAGHQP/n/////mMAAAAAAAA///8AAAAAH+Ai///////E8AAAAAAAAf//wAAAAAP/AA///////BgAAAAAAAAP//gAAAAAf/73///////gAAAAAAAAAD/AQAAAAAf////f/////gAAAAAAAAAF+AQAAAAB///+/n/////AAAAAAAAAAC+AAAAAAB///+f0H////AAAAAAAAAAAeAwAAAAD////f/B///8gAAAAAAAAAAeGEAAAAH////v+B/z/AAAAAAAAAAAAPMAgAAAD////n+A/B+gAAAAAAAAAAAD8AAAAAD////n4AeB/AgAAAAAAAAAAAPAAAAAH////3gAcAfAgAAAAAAAAAAADAAAAAD////6AAcAfggAAAAAAAAAAABDwAAAD////8wAMATAIAAAAAAAAAAAAr/AAAB/////gAKASAAAAAAAAAAAAAAH/gAAA/////gACAAAIAAAAAAAAAAAAH/8AAAaH///AAAAsGAAAAAAAAAAAAAH/+AAAAB//+AAAAUOAAAAAAAAAAAAAP/+AAAAB//8AAAAYegAAAAAAAAAAAAP//gAAAD//4AAAAMeBgAAAAAAAAAAAP//8AAAB//wAAAAGdiuAAAAAAAAAAAf///AAAA//wAAAACAQHgAAAAAAAAAAP///gAAA//wAAAABwAHwgAAAAAAAAAH///AAAA//wAAAAACIDQIAAAAAAAAAH//+AAAAf/wAAAAAAAAAAAAAAAAAAAD//+AAAA//wgAAAAABxAAAAAAAAAAAD//+AAAA//wgAAAAAPxgBAAAAAAAAAA//8AAAA//jgAAAAAf5gAAAAAAAAAAAf/8AAAA//DgAAAAAf/gAAAAAAAAAAAf/8AAAAf/DAAAAAD//4CAAAAAAAAAAf/wAAAAf/DAAAAAH//4AAAAAAAAAAAf/AAAAAf+CAAAAAH//8AAAAAAAAAAAf/AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAH4AAAAAAD//+AAAAAAAAAAA/8AAAAAHwAAAAAADwf8AAAAAAAAAAA/gAAAAAAAAAAAAACAH4AIAAAAAAAAB/wAAAAAAAAAAAAAAAD4AEAAAAAAAAB+AAAAAAAAAAAAAAAAAAAGAAAAAAAAB6AAAAAAAAAAAAAAAAAwAMAAAAAAAAA8AAAAAAAAAAAAAAAAAQAYAAAAAAAAB4AAAAAAAAAAAAAAAAAAAwAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAACAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAeAAIP+f/gAAAAAAAAAAAMAAAAAAABP/+H//////AAAAAAAAAAA+AAAAAf////8////////AAAAAAAOEAPAAAB///////////////gAAAP//T//8AAAH//////////////+AAAH/////4AAAH///////////////8AAE//////4ABw////////////////8AAAD//////gCA////////////////wAAAf/////////////////////////+A/4A///////////////////////////////////////////////////////////////////////////////////////";

const GW = 180;
const GH = 90;
export const hubs: [number, number, string, string][] = [
  [103.8, 8, "东南亚", "案例中出现过的区域市场"],
  [139.7, 35.7, "日本", "案例中出现过的市场"],
  [8, 50, "欧洲", "案例中出现过的市场"],
  [-98, 40, "北美", "案例中出现过的市场"],
];
export const BEIJING = { lon: 116.4, lat: 39.9 };

function spreadDistance(lon: number, lat: number) {
  let dLon = Math.abs(lon - BEIJING.lon);
  if (dLon > 180) dLon = 360 - dLon;
  const dLat = lat - BEIJING.lat;
  return Math.hypot(dLon * Math.cos((BEIJING.lat * Math.PI) / 180), dLat);
}

export const spokes = [
  { lon: 127, lat: 37.6 },
  { lon: 139.7, lat: 35.7, hub: 1 },
  { lon: 121, lat: 14.6 },
  { lon: 103.8, lat: 8, hub: 0 },
  { lon: 151.2, lat: -27.5 },
  { lon: 8, lat: 50, hub: 2 },
  { lon: 25.5, lat: -29 },
  { lon: -98, lat: 40, hub: 3 },
  { lon: -70.6, lat: -33.4 },
]
  .map((node) => ({ ...node, dist: spreadDistance(node.lon, node.lat) }))
  .sort((a, b) => a.dist - b.dist);

const LAUNCH = 0.18;
const STAGGER = 0.06;

export function departAt(index: number) {
  return LAUNCH + index * STAGGER;
}

export function travelFor(index: number) {
  const farthest = spokes[spokes.length - 1]?.dist || 1;
  return 0.2 + (spokes[index].dist / farthest) * 0.42;
}

export function igniteAt(index: number) {
  return departAt(index) + travelFor(index);
}

export function rayLift(index: number) {
  const farthest = spokes[spokes.length - 1]?.dist || 1;
  return 0.08 + (spokes[index].dist / farthest) * 0.2;
}

export const LOOP = igniteAt(spokes.length - 1) + 0.85;

function landCells() {
  const bin = atob(B64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  const land: [number, number][] = [];
  for (let y = 0; y < GH; y += 1) {
    for (let x = 0; x < GW; x += 1) {
      const index = y * GW + x;
      const bi = index >> 3;
      const bit = 7 - (index & 7);
      if ((bytes[bi] >> bit) & 1) land.push([x, y]);
    }
  }
  return land;
}

const LAND = landCells();
export { LAND as worldLand };

export function WorldMap({ metrics, disclaimer }: { metrics: PublicMetric[]; disclaimer?: string }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const cv = canvasRef.current;
    const bar = barRef.current;
    const tip = tipRef.current;
    if (!pin || !cv || !bar || !tip) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dotCv = document.createElement("canvas");
    const revCv = document.createElement("canvas");
    const dotCtx = dotCv.getContext("2d");
    const revCtx = revCv.getContext("2d");
    if (!dotCtx || !revCtx) return;
    const canvas: HTMLCanvasElement = cv;
    const context: CanvasRenderingContext2D = ctx;
    const dots: CanvasRenderingContext2D = dotCtx;
    const reveal: CanvasRenderingContext2D = revCtx;
    const pinEl: HTMLDivElement = pin;
    const barEl: HTMLElement = bar;
    const tipEl: HTMLDivElement = tip;
    const stageEl = stageRef.current;

    const sprite = document.createElement("canvas");
    sprite.width = 48;
    sprite.height = 48;
    const spriteCtx = sprite.getContext("2d");
    if (spriteCtx) {
      const glow = spriteCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
      glow.addColorStop(0, "rgba(110,168,255,.8)");
      glow.addColorStop(0.45, "rgba(90,150,255,.32)");
      glow.addColorStop(1, "rgba(90,150,255,0)");
      spriteCtx.fillStyle = glow;
      spriteCtx.fillRect(0, 0, 48, 48);
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cell = 8;
    let ox = 0;
    let oy = 0;
    let mapX = 0;
    let mapY = 0;
    let maxD = 1;
    let lastRp = -1;
    let visible = true;
    let frameId = 0;
    let mouse: [number, number] | null = null;
    let hovered = -1;
    let chainStart = -1;

    function project(lon: number, lat: number) {
      const x = ((lon + 180) / 360) * GW;
      const y = ((90 - lat) / 180) * GH;
      return [ox + x * cell + cell / 2, oy + y * cell + cell / 2];
    }

    function renderDots() {
      dots.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots.clearRect(0, 0, width, height);
      const radius = cell * 0.34;
      const glowSize = cell * 2.7;
      for (const [x, y] of LAND) {
        const px = ox + x * cell + cell / 2;
        const py = oy + y * cell + cell / 2;
        dots.drawImage(sprite, px - glowSize / 2, py - glowSize / 2, glowSize, glowSize);
      }
      dots.fillStyle = "#8fbdff";
      for (const [x, y] of LAND) {
        dots.beginPath();
        dots.arc(ox + x * cell + cell / 2, oy + y * cell + cell / 2, radius, 0, Math.PI * 2);
        dots.fill();
      }
    }

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.round(canvas.clientWidth);
      height = Math.round(canvas.clientHeight);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      dotCv.width = width * dpr;
      dotCv.height = height * dpr;
      revCv.width = width * dpr;
      revCv.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padTop = 64;
      const padBottom = 36;
      const availH = Math.max(160, height - padTop - padBottom);
      cell = Math.min((width * 0.98) / GW, availH / GH);
      ox = (width - cell * GW) / 2;
      oy = padTop + Math.max(0, availH - cell * GH) / 2;
      mapX = ox + (cell * GW) / 2;
      mapY = oy + (cell * GH) / 2;
      maxD = Math.hypot((cell * GW) / 2, (cell * GH) / 2);
      lastRp = -1;
      renderDots();
    }

    function renderReveal(progress: number) {
      reveal.setTransform(dpr, 0, 0, dpr, 0, 0);
      reveal.clearRect(0, 0, width, height);
      const [originX, originY] = project(BEIJING.lon, BEIJING.lat);
      const reach = Math.max(
        Math.hypot(originX - ox, originY - oy),
        Math.hypot(originX - (ox + cell * GW), originY - oy),
        Math.hypot(originX - ox, originY - (oy + cell * GH)),
        Math.hypot(originX - (ox + cell * GW), originY - (oy + cell * GH)),
      );
      const revealR = progress * reach;
      const soft = reach * 0.08;
      reveal.save();
      reveal.beginPath();
      reveal.arc(originX, originY, Math.max(0, revealR - soft / 2), 0, Math.PI * 2);
      reveal.clip();
      reveal.drawImage(dotCv, 0, 0, width, height);
      reveal.restore();
      reveal.save();
      reveal.beginPath();
      reveal.arc(originX, originY, revealR + soft / 2, 0, Math.PI * 2);
      reveal.arc(originX, originY, Math.max(0, revealR - soft / 2), 0, Math.PI * 2, true);
      reveal.clip("evenodd");
      reveal.globalAlpha = 0.45;
      reveal.drawImage(dotCv, 0, 0, width, height);
      reveal.restore();
    }

    function showTip(index: number) {
      const [x, y] = project(hubs[index][0], hubs[index][1]);
      tipEl.innerHTML = `<b>${hubs[index][2]}</b><span>${hubs[index][3]}</span>`;
      tipEl.style.left = `${x}px`;
      tipEl.style.top = `${y - 14}px`;
      tipEl.style.opacity = "1";
    }

    type Curve = { ax: number; ay: number; mx: number; my: number; bx: number; by: number };

    function bow(a: [number, number], b: [number, number], lift: number): Curve {
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const outward = b[1] >= a[1] ? 1 : -1;
      return {
        ax: a[0],
        ay: a[1],
        bx: b[0],
        by: b[1],
        mx: (a[0] + b[0]) / 2,
        my: (a[1] + b[1]) / 2 + outward * dist * lift,
      };
    }

    function trace(curve: Curve, t0: number, t1: number) {
      const steps = 24;
      context.beginPath();
      for (let step = 0; step <= steps; step += 1) {
        const t = t0 + ((t1 - t0) * step) / steps;
        const u = 1 - t;
        const x = u * u * curve.ax + 2 * u * t * curve.mx + t * t * curve.bx;
        const y = u * u * curve.ay + 2 * u * t * curve.my + t * t * curve.by;
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
    }

    function beamHead(curve: Curve, t: number): [number, number] {
      const u = 1 - t;
      return [
        u * u * curve.ax + 2 * u * t * curve.mx + t * t * curve.bx,
        u * u * curve.ay + 2 * u * t * curve.my + t * t * curve.by,
      ];
    }

    function paintBeam(from: [number, number], to: [number, number], head: number, lift: number) {
      const clamped = Math.max(0.04, Math.min(1, head));
      const tail = Math.max(0, clamped - 0.38);
      const curve = bow(from, to, lift);
      trace(curve, tail, clamped);
      context.strokeStyle = "rgba(90, 206, 255, 0.32)";
      context.lineWidth = 8;
      context.stroke();
      trace(curve, tail, clamped);
      context.strokeStyle = "rgba(240, 253, 255, 0.98)";
      context.lineWidth = 1.8;
      context.stroke();
      const [hx, hy] = beamHead(curve, clamped);
      const glow = context.createRadialGradient(hx, hy, 0, hx, hy, 12);
      glow.addColorStop(0, "rgba(255,255,255,0.98)");
      glow.addColorStop(1, "rgba(90,210,255,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(hx, hy, 12, 0, Math.PI * 2);
      context.fill();
    }

    function paintResidual(from: [number, number], to: [number, number], lift: number) {
      trace(bow(from, to, lift), 0, 1);
      context.strokeStyle = "rgba(148, 214, 255, 0.5)";
      context.lineWidth = 1.35;
      context.stroke();
    }

    function paintBloom(index: number, age: number) {
      if (age < 0 || age > 0.48) return;
      const boost = Math.sin(Math.min(1, age / 0.48) * Math.PI);
      const [x, y] = project(spokes[index].lon, spokes[index].lat);
      const radius = 28 + boost * 26;
      const halo = context.createRadialGradient(x, y, 0, x, y, radius);
      halo.addColorStop(0, `rgba(255,255,255,${(0.92 * boost).toFixed(3)})`);
      halo.addColorStop(0.28, `rgba(186,236,255,${(0.55 * boost).toFixed(3)})`);
      halo.addColorStop(1, "rgba(80,190,255,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    function paintCity(x: number, y: number, age: number, kick: number, label: string | undefined, withLabel: boolean) {
      if (age < 0) return;
      const flash = Math.max(kick, age < 0.36 ? 1 - age / 0.36 : 0);
      const ring = kick > 0 ? 1 - kick : 1;
      const settle = Math.min(1, age / 0.12);
      if (!withLabel) {
        context.beginPath();
        context.arc(x, y, 3 + ring * (label ? 34 : 20), 0, Math.PI * 2);
        context.strokeStyle = `rgba(220,252,255,${((1 - ring) * 0.95 * settle).toFixed(3)})`;
        context.lineWidth = label ? 1.8 : 1.25;
        context.stroke();
        if (label) {
          const ring2 = Math.max(0, Math.min(1, (age - 0.05) / 0.5));
          context.beginPath();
          context.arc(x, y, 4 + ring2 * 46, 0, Math.PI * 2);
          context.strokeStyle = `rgba(120,210,255,${((1 - ring2) * 0.6).toFixed(3)})`;
          context.lineWidth = 1.2;
          context.stroke();
        }
        const glowR = (label ? 24 : 16) * (1 + flash);
        const glow = context.createRadialGradient(x, y, 0, x, y, glowR);
        glow.addColorStop(0, `rgba(255,255,255,${(0.98 * settle).toFixed(3)})`);
        glow.addColorStop(0.35, `rgba(170,230,255,${(0.7 * settle).toFixed(3)})`);
        glow.addColorStop(1, "rgba(60,170,255,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, glowR, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#fff";
        context.beginPath();
        context.arc(x, y, (label ? 4.8 : 3.5) * (1 + flash * 0.9), 0, Math.PI * 2);
        context.fill();
        return;
      }
      if (!label || settle < 0.25) return;
      context.font = '12px "PingFang SC", sans-serif';
      context.textAlign = "center";
      context.lineJoin = "round";
      context.lineWidth = 4;
      context.strokeStyle = `rgba(4,12,28,${(0.92 * settle).toFixed(3)})`;
      context.strokeText(label, x, y - 16);
      context.fillStyle = `rgba(255,255,255,${settle.toFixed(3)})`;
      context.fillText(label, x, y - 16);
    }

    function frame(now: number) {
      if (!canvas.clientWidth) {
        frameId = requestAnimationFrame(frame);
        return;
      }
      if (Math.round(canvas.clientWidth) !== width || Math.round(canvas.clientHeight) !== height) size();
      if (!visible && !reduced) {
        frameId = requestAnimationFrame(frame);
        return;
      }
      const rect = pinEl.getBoundingClientRect();
      const progress = reduced ? 1 : Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      barEl.style.width = `${progress * 100}%`;
      const spread = reduced ? 1 : Math.max(0, Math.min(1, (progress - 0.12) / 0.46));
      if (stageEl) {
        stageEl.style.transform = `translateY(${(1 - spread) * 6}vh)`;
        stageEl.style.setProperty("--spread", spread.toFixed(3));
      }
      canvas.style.opacity = String(reduced ? 1 : spread);
      context.clearRect(0, 0, width, height);
      const revealAmt = reduced ? 1 : spread;
      if (revealAmt >= 1) context.drawImage(dotCv, 0, 0, width, height);
      else if (revealAmt > 0) {
        if (Math.abs(revealAmt - lastRp) > 0.002) {
          renderReveal(revealAmt);
          lastRp = revealAmt;
        }
        context.drawImage(revCv, 0, 0, width, height);
      }
      const armed = reduced || progress >= 0.5;
      if (!armed) chainStart = -1;
      else if (!reduced && chainStart < 0) chainStart = now;
      const elapsed = reduced ? 99 : chainStart >= 0 ? (now - chainStart) / 1000 : 0;
      const points = spokes.map((node) => project(node.lon, node.lat) as [number, number]);
      const origin = project(BEIJING.lon, BEIJING.lat) as [number, number];
      hovered = -1;
      const pointer = mouse;
      if (pointer && elapsed > 0.2) {
        const originDistance = Math.hypot(pointer[0] - origin[0], pointer[1] - origin[1]);
        let best = originDistance < 26 ? originDistance : 1e9;
        if (originDistance < 26) {
          tipEl.innerHTML = "<b>北京</b><span>光线从这里散开</span>";
          tipEl.style.left = `${origin[0]}px`;
          tipEl.style.top = `${origin[1] - 14}px`;
          tipEl.style.opacity = "1";
        }
        hubs.forEach((hub, index) => {
          const [x, y] = project(hub[0], hub[1]);
          const distance = Math.hypot(pointer[0] - x, pointer[1] - y);
          if (distance < 26 && distance < best) {
            best = distance;
            hovered = index;
          }
        });
        if (hovered >= 0) showTip(hovered);
        else if (originDistance >= 26) tipEl.style.opacity = "0";
        canvas.style.cursor = hovered >= 0 || originDistance < 26 ? "pointer" : "default";
      } else if (!pointer) {
        tipEl.style.opacity = "0";
      }
      if (elapsed > 0) {
        context.lineCap = "round";
        context.lineJoin = "round";
        const cycle = elapsed % LOOP;
        for (let index = 0; index < points.length; index += 1) {
          const lift = rayLift(index);
          const flight = (elapsed - departAt(index)) / travelFor(index);
          if (flight >= 1) paintResidual(origin, points[index], lift);
          if (!reduced && flight > 0 && flight < 1) paintBeam(origin, points[index], flight, lift);
        }
        if (!reduced && elapsed > LOOP) {
          for (let index = 0; index < points.length; index += 1) {
            const flight = (cycle - departAt(index)) / travelFor(index);
            if (flight > 0 && flight < 1) paintBeam(origin, points[index], flight, rayLift(index));
          }
        }
        if (!reduced) {
          for (let index = 0; index < points.length; index += 1) paintBloom(index, cycle - igniteAt(index));
        }
        const originKick = !reduced && cycle >= 0 && cycle < 0.34 ? 1 - cycle / 0.34 : 0;
        paintCity(origin[0], origin[1], elapsed, originKick, "北京", false);
        points.forEach((point, index) => {
          const hub = spokes[index].hub;
          const since = cycle - igniteAt(index);
          const kick = !reduced && since >= 0 && since < 0.34 ? 1 - since / 0.34 : 0;
          paintCity(point[0], point[1], elapsed - igniteAt(index), kick, hub === undefined ? undefined : hubs[hub][2], false);
        });
        if (!reduced && cycle < 0.42) {
          const flash = 1 - cycle / 0.42;
          const burst = context.createRadialGradient(origin[0], origin[1], 0, origin[0], origin[1], 86);
          burst.addColorStop(0, `rgba(255,255,255,${(0.7 * flash).toFixed(3)})`);
          burst.addColorStop(1, "rgba(80,180,255,0)");
          context.fillStyle = burst;
          context.beginPath();
          context.arc(origin[0], origin[1], 86, 0, Math.PI * 2);
          context.fill();
        }
        paintCity(origin[0], origin[1], elapsed, 0, "北京", true);
        points.forEach((point, index) => {
          const hub = spokes[index].hub;
          if (hub === undefined) return;
          paintCity(point[0], point[1], elapsed - igniteAt(index), 0, hubs[hub][2], true);
        });
      }
      if (!reduced) frameId = requestAnimationFrame(frame);
    }

    const onMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      mouse = [event.clientX - bounds.left, event.clientY - bounds.top];
    };
    const onLeave = () => {
      mouse = null;
      hovered = -1;
      tipEl.style.opacity = "0";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    observer.observe(pinEl);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    const onResize = () => {
      size();
      if (reduced) requestAnimationFrame(frame);
    };
    window.addEventListener("resize", onResize);
    size();
    frameId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="map-sec" id="map" aria-label="案例涉及的市场">
      <div className="map-pin" ref={pinRef}>
        <div className="map-sticky">
          <canvas className="map-canvas" ref={canvasRef} aria-hidden="true" />
          <div className="map-tip" ref={tipRef} />
          <div className="map-veil" />
          <div className="map-copy" ref={stageRef}>
            <p className="kicker">从数据到全球</p>
            <h2>
              一组数据，<span className="title-accent">展开一张网</span>
            </h2>
            <div className="map-lines">
              <p className="map-line map-line-before">先看已经写进通案的规模。继续下滑，数字从画面中心展开。</p>
              <p className="map-line map-line-after">同一组数据连向案例里出现过的市场，不是办公室分布。</p>
            </div>
            {metrics.length > 0 ? (
              <ul className="map-figures">
                {metrics.map((metric) => (
                  <li key={metric.id}>
                    <strong>{metric.text}</strong>
                    <span>{metric.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="map-figures map-steps">
                <li><strong>01</strong><span>先读规模</span></li>
                <li><strong>02</strong><span>再看触达</span></li>
                <li><strong>03</strong><span>最后落到市场</span></li>
              </ol>
            )}
            {disclaimer ? <p className="map-disclaimer">{disclaimer}</p> : null}
          </div>
          <div className="map-progress" aria-hidden="true">
            <i ref={barRef} />
          </div>
        </div>
      </div>
      <ul className="sr-only">
        <li>北京：光线从这里散开，不是办公室分布。</li>
        {hubs.map((hub) => (
          <li key={hub[2]}>
            {hub[2]}：{hub[3]}
          </li>
        ))}
      </ul>
    </section>
  );
}
