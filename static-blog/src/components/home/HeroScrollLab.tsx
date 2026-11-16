"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { PublicBanner, PublicMetric } from "@/lib/content/public-types";
import { HeroSlider } from "./motion";
import {
  BEIJING,
  departAt,
  hubs,
  igniteAt,
  LOOP,
  rayLift,
  spokes,
  travelFor,
  worldLand,
} from "./WorldMap";

const GW = 180;
const GH = 90;
const LINES = [
  { text: "PandaMobo", kind: "brand" as const },
  { text: "服务覆盖全世界", kind: "zh" as const },
];
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

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smootherstep(value: number) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function parseMetric(text: string) {
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const raw = match[1] ?? "0";
  return {
    target: Number(raw),
    suffix: match[2] ?? "",
    decimals: raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0,
  };
}

export function HeroScrollLab({
  banners,
  metrics,
  showNote = false,
}: {
  banners: PublicBanner[];
  metrics: PublicMetric[];
  showNote?: boolean;
}) {
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const valueRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const opening = openingRef.current;
    const finalLayer = finalRef.current;
    const bar = barRef.current;
    if (!pin || !canvas || !opening || !finalLayer || !bar) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parsed = metrics.map((metric) => parseMetric(metric.text));
    let revealed = -1;
    const showLetters = (progress: number) => {
      const lineStage = progress * LINES.length;
      let count = 0;
      LINES.forEach((line, lineIndex) => {
        const local = clamp01(lineStage - lineIndex);
        const lineCount = Array.from(line.text).length;
        count += local >= 0.995 ? lineCount : Math.floor(local * lineCount);
      });
      if (count === revealed) return;
      const previous = revealed;
      revealed = count;
      for (let index = Math.max(0, Math.min(previous, count)); index < Math.max(previous, count); index += 1) {
        const node = letterRefs.current[index];
        if (!node) continue;
        const on = index < count;
        node.style.opacity = on ? "1" : "0";
        node.style.transform = on ? "translateY(0)" : "translateY(0.22em)";
      }
    };
    const shownValues: string[] = [];
    const showValues = (elapsed: number) => {
      parsed.forEach((item, index) => {
        const node = valueRefs.current[index];
        if (!node || !item) return;
        const start = index * 280;
        const progress = clamp01((elapsed - start) / 1100);
        const eased = 1 - (1 - progress) ** 3;
        const value = progress >= 0.992 ? item.target : item.target * eased;
        const digits = item.decimals ? value.toFixed(item.decimals) : String(Math.round(value));
        const text = `${digits}${item.suffix}`;
        if (shownValues[index] === text) return;
        shownValues[index] = text;
        node.textContent = text;
      });
    };

    if (reduced) {
      pin.classList.add("is-reduced");
      showLetters(1);
      showValues(4000);
      finalLayer.style.setProperty("--lab-copy", "1");
      finalLayer.style.setProperty("--lab-figures", "1");
      finalLayer.style.setProperty("--lab-shift", "1");
      return;
    }

    const landLookup = new Uint8Array(GW * GH);
    for (const [x, y] of worldLand) landLookup[y * GW + x] = 1;
    const isLand = (x: number, y: number) => x >= 0 && y >= 0 && x < GW && y < GH && landLookup[y * GW + x] === 1;
    const landPath = new Path2D();
    const edgeKey = (x: number, y: number) => `${x},${y}`;
    const links = new Map<string, Array<[number, number]>>();
    const addEdge = (x1: number, y1: number, x2: number, y2: number) => {
      const key = edgeKey(x1, y1);
      const list = links.get(key);
      if (list) list.push([x2, y2]);
      else links.set(key, [[x2, y2]]);
    };
    for (let y = 0; y < GH; y += 1) {
      for (let x = 0; x < GW; x += 1) {
        if (!isLand(x, y)) continue;
        if (!isLand(x, y - 1)) addEdge(x, y, x + 1, y);
        if (!isLand(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1);
        if (!isLand(x, y + 1)) addEdge(x + 1, y + 1, x, y + 1);
        if (!isLand(x - 1, y)) addEdge(x, y + 1, x, y);
      }
    }
    const seen = new Set<string>();
    links.forEach((list, startKey) => {
      list.forEach((first) => {
        const mark = `${startKey}>${first[0]},${first[1]}`;
        if (seen.has(mark)) return;
        const points: Array<[number, number]> = [startKey.split(",").map(Number) as [number, number]];
        let current = first;
        let guard = 0;
        while (guard < 20000) {
          guard += 1;
          const from = points[points.length - 1];
          seen.add(`${from[0]},${from[1]}>${current[0]},${current[1]}`);
          points.push(current);
          if (current[0] === points[0][0] && current[1] === points[0][1]) break;
          const options = links.get(edgeKey(current[0], current[1])) ?? [];
          const inAngle = Math.atan2(current[1] - from[1], current[0] - from[0]);
          let next: [number, number] | undefined;
          let bestTurn = Infinity;
          options.forEach((point) => {
            const edge = `${current[0]},${current[1]}>${point[0]},${point[1]}`;
            if (seen.has(edge)) return;
            const turn = (Math.atan2(point[1] - current[1], point[0] - current[0]) - inAngle + Math.PI * 2) % (Math.PI * 2);
            if (turn < bestTurn) {
              bestTurn = turn;
              next = point;
            }
          });
          if (!next) break;
          current = next;
        }
        const closed = points.length > 8 && points[0][0] === points[points.length - 1][0] && points[0][1] === points[points.length - 1][1];
        if (!closed) return;
        let smooth = points.slice(0, -1);
        for (let pass = 0; pass < 3; pass += 1) {
          const next: Array<[number, number]> = [];
          for (let index = 0; index < smooth.length; index += 1) {
            const a = smooth[index];
            const b = smooth[(index + 1) % smooth.length];
            next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
            next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
          }
          smooth = next;
        }
        landPath.moveTo(smooth[0][0], smooth[0][1]);
        for (let index = 1; index < smooth.length; index += 1) landPath.lineTo(smooth[index][0], smooth[index][1]);
        landPath.closePath();
      });
    });
    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d");
    if (!maskContext) return;
    const maskUnit = 14;
    mask.width = GW * maskUnit;
    mask.height = GH * maskUnit;
    maskContext.scale(maskUnit, maskUnit);
    maskContext.fillStyle = "#fff";
    maskContext.fill(landPath);
    let width = 0;
    let height = 0;
    let frame = 0;
    let pinTop = 0;
    let pinRange = 1;
    const dotMap = document.createElement("canvas");
    let dotKey = "";
    let countStart = -1;
    let shiftStart = -1;
    let chainStart = -1;
    let completionStart = -1;

    const project = (lon: number, lat: number, ox: number, oy: number, cell: number): [number, number] => {
      const x = ((lon + 180) / 360) * GW;
      const y = ((90 - lat) / 180) * GH;
      return [ox + x * cell + cell / 2, oy + y * cell + cell / 2];
    };

    const trace = (curve: Curve, t0: number, t1: number) => {
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
    };

    const beamHead = (curve: Curve, t: number): [number, number] => {
      const u = 1 - t;
      return [
        u * u * curve.ax + 2 * u * t * curve.mx + t * t * curve.bx,
        u * u * curve.ay + 2 * u * t * curve.my + t * t * curve.by,
      ];
    };

    const paintBeam = (from: [number, number], to: [number, number], head: number, lift: number) => {
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
    };

    const paintResidual = (from: [number, number], to: [number, number], lift: number) => {
      trace(bow(from, to, lift), 0, 1);
      context.strokeStyle = "rgba(148, 214, 255, 0.5)";
      context.lineWidth = 1.35;
      context.stroke();
    };

    const paintBloom = (x: number, y: number, age: number) => {
      if (age < 0 || age > 0.48) return;
      const boost = Math.sin(Math.min(1, age / 0.48) * Math.PI);
      const radius = 28 + boost * 26;
      const halo = context.createRadialGradient(x, y, 0, x, y, radius);
      halo.addColorStop(0, `rgba(255,255,255,${(0.92 * boost).toFixed(3)})`);
      halo.addColorStop(0.28, `rgba(186,236,255,${(0.55 * boost).toFixed(3)})`);
      halo.addColorStop(1, "rgba(80,190,255,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const paintCity = (x: number, y: number, age: number, kick: number, label: string | undefined, withLabel: boolean) => {
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
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(canvas.clientWidth));
      height = Math.max(1, Math.round(canvas.clientHeight));
      // Read layout only on resize; scrolling uses cached document coordinates.
      pinTop = pin.getBoundingClientRect().top + window.scrollY;
      pinRange = Math.max(1, pin.offsetHeight - window.innerHeight);
      dotKey = "";
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const progress = clamp01((window.scrollY - pinTop) / pinRange);
      if (progress < 0.55 && !settleFrame) completionStart = -1;
      const zoom = smootherstep(clamp01((progress - 0.04) / 0.52));
      const reveal = smootherstep(clamp01((progress - 0.58) / 0.14));
      const letterProgress = clamp01((progress - 0.58) / 0.26);
      const lettersDone = letterProgress >= 0.995;
      const padTop = 72;
      const padBottom = 48;
      const availH = Math.max(160, height - padTop - padBottom);
      const fitCell = Math.min((width * 0.92) / GW, availH / GH);
      const fitX = (width - fitCell * GW) / 2;
      const fitY = padTop + Math.max(0, availH - fitCell * GH) / 2;
      const corner = Math.hypot(width / 2, height / 2);
      const startCell = corner / 6.2;
      const ratio = Math.max(1.01, startCell / fitCell);
      const locked = zoom >= 0.999;
      const cell = locked ? fitCell : fitCell * ratio ** (1 - zoom);
      const fitFocusY = (height / 2 - fitY) / fitCell;
      const focusX = 90.5 + (GW / 2 - 90.5) * zoom;
      const focusY = 35.5 + (fitFocusY - 35.5) * zoom;
      const originX = locked ? fitX : width / 2 - focusX * cell;
      const originY = locked ? fitY : height / 2 - focusY * cell;
      const now = performance.now();

      if (!lettersDone) {
        shiftStart = -1;
        countStart = -1;
      } else {
        if (shiftStart < 0) shiftStart = now;
        if (countStart < 0) countStart = now;
      }
      if (reveal < 0.08) chainStart = -1;
      else if (chainStart < 0) chainStart = now;
      const finishing = completionStart >= 0;
      const shiftT = shiftStart < 0 ? 0 : clamp01((now - shiftStart) / (finishing ? 320 : 680));
      const elapsed = countStart < 0 ? 0 : (now - countStart) * (finishing ? 2.8 : 1);
      const shift = shiftT === 0 ? 0 : 1 - (1 - shiftT) ** 3;
      const finishAge = finishing ? Math.max(0, (now - completionStart) / 1000) : 0;
      // Complete the first route sequence in one second, then loop at normal speed.
      const rayElapsed = finishing
        ? (finishAge < 1 ? finishAge * LOOP : LOOP + finishAge - 1)
        : chainStart < 0 ? 0 : (now - chainStart) / 1000;

      if (stage instanceof HTMLElement) stage.style.opacity = "1";
      if (controls instanceof HTMLElement) controls.style.opacity = "1";
      opening.style.pointerEvents = reveal > 0.35 || zoom > 0.2 ? "none" : "auto";
      opening.toggleAttribute("data-hero-covered", reveal > 0.02);
      finalLayer.style.setProperty("--lab-copy", clamp01((letterProgress - 0.02) / 0.2).toFixed(3));
      finalLayer.style.setProperty("--lab-shift", shift.toFixed(3));
      finalLayer.style.setProperty("--lab-figures", shiftT.toFixed(3));
      bar.style.transform = `scaleX(${progress})`;
      showLetters(letterProgress);
      showValues(elapsed);

      canvas.style.opacity = "1";
      context.clearRect(0, 0, width, height);
      const ghost = smootherstep(clamp01((progress - 0.03) / 0.08)) * (1 - reveal);
      if (ghost > 0.02) {
        context.save();
        context.globalAlpha = 0.42 * ghost;
        context.drawImage(mask, originX, originY, GW * cell, GH * cell);
        context.globalCompositeOperation = "source-in";
        context.fillStyle = "#12386f";
        context.fillRect(0, 0, width, height);
        context.restore();
      }
      if (reveal > 0.02) {
        context.save();
        context.globalAlpha = reveal;
        context.fillStyle = "#071428";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "#8fbdff";
        const radius = Math.max(1.05, cell * 0.34);
        if (locked) {
          // Once the map stops zooming, its thousands of land dots are static.
          const key = `${width}:${height}:${cell}`;
          if (dotKey !== key) {
            dotMap.width = canvas.width;
            dotMap.height = canvas.height;
            const dots = dotMap.getContext("2d");
            if (dots) {
              dots.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
              dots.fillStyle = "#8fbdff";
              dots.beginPath();
              for (const [x, y] of worldLand) {
                const px = originX + x * cell + cell / 2;
                const py = originY + y * cell + cell / 2;
                dots.moveTo(px + radius, py);
                dots.arc(px, py, radius, 0, Math.PI * 2);
              }
              dots.fill();
              dotKey = key;
            }
          }
          context.drawImage(dotMap, 0, 0, width, height);
        } else {
          for (const [x, y] of worldLand) {
            const px = originX + x * cell + cell / 2;
            const py = originY + y * cell + cell / 2;
            if (px < -radius || py < -radius || px > width + radius || py > height + radius) continue;
            context.beginPath();
            context.arc(px, py, radius, 0, Math.PI * 2);
            context.fill();
          }
        }
        if (rayElapsed > 0) {
          context.lineCap = "round";
          context.lineJoin = "round";
          const origin = project(BEIJING.lon, BEIJING.lat, originX, originY, cell);
          const points = spokes.map((node) => project(node.lon, node.lat, originX, originY, cell));
          const cycle = rayElapsed % LOOP;
          for (let index = 0; index < points.length; index += 1) {
            const lift = rayLift(index);
            const flight = (rayElapsed - departAt(index)) / travelFor(index);
            if (flight >= 1) paintResidual(origin, points[index], lift);
            if (flight > 0 && flight < 1) paintBeam(origin, points[index], flight, lift);
          }
          if (rayElapsed > LOOP) {
            for (let index = 0; index < points.length; index += 1) {
              const flight = (cycle - departAt(index)) / travelFor(index);
              if (flight > 0 && flight < 1) paintBeam(origin, points[index], flight, rayLift(index));
            }
          }
          for (let index = 0; index < points.length; index += 1) paintBloom(points[index][0], points[index][1], cycle - igniteAt(index));
          const originKick = cycle >= 0 && cycle < 0.34 ? 1 - cycle / 0.34 : 0;
          paintCity(origin[0], origin[1], rayElapsed, originKick, "北京", false);
          points.forEach((point, index) => {
            const hub = spokes[index].hub;
            const since = cycle - igniteAt(index);
            const kick = since >= 0 && since < 0.34 ? 1 - since / 0.34 : 0;
            paintCity(point[0], point[1], rayElapsed - igniteAt(index), kick, hub === undefined ? undefined : hubs[hub][2], false);
          });
          if (cycle < 0.42) {
            const flash = 1 - cycle / 0.42;
            const burst = context.createRadialGradient(origin[0], origin[1], 0, origin[0], origin[1], 86);
            burst.addColorStop(0, `rgba(255,255,255,${(0.7 * flash).toFixed(3)})`);
            burst.addColorStop(1, "rgba(80,180,255,0)");
            context.fillStyle = burst;
            context.beginPath();
            context.arc(origin[0], origin[1], 86, 0, Math.PI * 2);
            context.fill();
          }
          paintCity(origin[0], origin[1], rayElapsed, 0, "北京", true);
          points.forEach((point, index) => {
            const hub = spokes[index].hub;
            if (hub === undefined) return;
            paintCity(point[0], point[1], rayElapsed - igniteAt(index), 0, hubs[hub][2], true);
          });
        }
        context.restore();
      }
    };

    // Native wheel/touch scrolling remains interruptible in both directions.
    // Only schedule work while this section is visible and needs animation.
    const stage = opening.querySelector(".hero-stage");
    const controls = opening.querySelector(".hero-controls");
    let running = true;
    let visible = true;
    const loop = () => {
      frame = 0;
      if (!running || !visible || document.hidden) return;
      draw();
      const progress = clamp01((window.scrollY - pinTop) / pinRange);
      if (progress > 0.58) frame = window.requestAnimationFrame(loop);
    };
    const requestDraw = () => {
      if (!running || !visible || document.hidden || frame) return;
      frame = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    let settleFrame = 0;
    let settleTimer = 0;
    let pendingFastDown = false;
    let gestureDistance = 0;
    let lastWheelAt = 0;
    let suppressUntil = 0;
    let lastScrollY = window.scrollY;
    let touching = false;
    const cancelSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      pendingFastDown = false;
      if (settleFrame) {
        cancelAnimationFrame(settleFrame);
        settleFrame = 0;
        // The new gesture owns scrolling; do not catch its trailing momentum.
        suppressUntil = performance.now() + 700;
      }
    };
    const settle = () => {
      settleTimer = 0;
      if (!pendingFastDown || touching || !visible || document.hidden || document.querySelector('[aria-modal="true"]')) return;
      pendingFastDown = false;
      const progress = (window.scrollY - pinTop) / pinRange;
      // Never pull someone back after they have already passed this scene.
      if (progress < 0.06 || progress > 0.94) return;
      completionStart = performance.now();
      const from = window.scrollY;
      const target = pinTop + pinRange * 0.9;
      const distance = target - from;
      if (Math.abs(distance) < 3) { requestDraw(); return; }
      const started = performance.now();
      const duration = Math.min(450, Math.max(300, Math.abs(distance) * 0.28));
      const step = (now: number) => {
        settleFrame = 0;
        if (!running || document.hidden) return;
        const t = clamp01((now - started) / duration);
        window.scrollTo({ top: from + distance * smootherstep(t), behavior: "instant" });
        requestDraw();
        if (t < 1) settleFrame = window.requestAnimationFrame(step);
      };
      settleFrame = window.requestAnimationFrame(step);
      requestDraw();
    };
    const queueSettle = () => {
      window.clearTimeout(settleTimer);
      if (pendingFastDown && !touching) settleTimer = window.setTimeout(settle, 180);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (!settleFrame && y < lastScrollY - 1) pendingFastDown = false;
      lastScrollY = y;
      requestDraw();
      if (!settleFrame) queueSettle();
    };
    const onWheel = (event: WheelEvent) => {
      const interrupted = settleFrame !== 0;
      if (interrupted) cancelSettle();
      const now = performance.now();
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || dy <= 0) {
        cancelSettle(); gestureDistance = 0; return;
      }
      if (!visible || interrupted || now < suppressUntil) return;
      if (now - lastWheelAt > 180) gestureDistance = 0;
      lastWheelAt = now;
      gestureDistance += dy;
      if (dy >= 64 || gestureDistance >= 170) pendingFastDown = true;
      queueSettle();
    };
    let touchY = 0;
    let touchAt = 0;
    let singleTouch = false;
    const onTouchStart = (event: TouchEvent) => {
      cancelSettle(); touching = true;
      singleTouch = event.touches.length === 1;
      touchY = event.touches[0]?.clientY ?? 0;
      touchAt = performance.now();
    };
    const onTouchEnd = (event: TouchEvent) => {
      touching = false;
      if (!singleTouch || event.touches.length > 0) return;
      const now = performance.now();
      const distance = touchY - (event.changedTouches[0]?.clientY ?? touchY);
      if (visible && now >= suppressUntil && distance > 60 && distance / Math.max(1, now - touchAt) > 0.65) {
        pendingFastDown = true; queueSettle();
      }
    };
    const onTouchCancel = () => { touching = false; cancelSettle(); };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) cancelSettle();
    };
    const onResize = () => {
      cancelSettle();
      resize();
      requestDraw();
    };
    const onVisibility = () => {
      if (document.hidden) { cancelSettle(); stop(); }
      else requestDraw();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) requestDraw();
      else { cancelSettle(); stop(); }
    }, { rootMargin: "40px" });
    const resizeObserver = new ResizeObserver(onResize);
    resize();
    observer.observe(pin);
    resizeObserver.observe(pin);
    requestDraw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });
    window.addEventListener("pointerdown", cancelSettle, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelSettle();
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
      window.removeEventListener("pointerdown", cancelSettle);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [metrics]);

  return (
    <>
      <section className="hero-lab" id="map" ref={pinRef} aria-label="PandaMobo 服务覆盖全世界">
        <div className="hero-lab-sticky">
          <div className="hero-lab-opening" ref={openingRef}>
            <HeroSlider banners={banners} />
          </div>
          <canvas className="hero-lab-canvas" ref={canvasRef} aria-hidden="true" />
          <div className="hero-lab-final" ref={finalRef}>
            <p className="kicker">从数据到全球</p>
            <h2>
              {LINES.map((line, lineIndex) => (
                <span className={`hero-lab-line is-${line.kind}`} key={line.text}>
                  {Array.from(line.text).map((char, charIndex) => {
                    const flat = LINES.slice(0, lineIndex).reduce((sum, item) => sum + Array.from(item.text).length, 0) + charIndex;
                    return (
                      <span
                        key={`${line.text}-${charIndex}`}
                        className="hero-lab-letter"
                        ref={(node) => {
                          letterRefs.current[flat] = node;
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h2>
            {metrics.length > 0 ? (
              <ul className="hero-lab-figures">
                {metrics.map((metric, index) => (
                  <li key={metric.id}>
                    <strong ref={(node) => { valueRefs.current[index] = node; }}>{parseMetric(metric.text) ? `0${parseMetric(metric.text)?.suffix ?? ""}` : metric.text}</strong>
                    <span>{metric.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hero-lab-progress" aria-hidden="true">
            <i ref={barRef} />
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
      {showNote ? (
        <section className="hero-lab-note">
          <div className="wrap">
            <p>这是测试页。首页的轮播和数据板块没有改。</p>
            <Link href="/">返回首页</Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
