"use client";

import { useEffect, useRef } from "react";

type Action = "phone" | "map" | "stretch" | "coffee" | "explore" | "dance" | "wave" | "sleep";
const ACTIONS: Action[] = ["phone", "map", "stretch", "coffee", "explore", "dance", "wave", "sleep"];
const ACTION_POSES: Record<Action, [number, number, string]> = {
  phone: [0, 1, "正在联系海外小伙伴"], map: [2, 3, "下一站，去哪里呢"],
  stretch: [4, 5, "伸个懒腰，继续出发"], coffee: [6, 7, "喝口咖啡，补充灵感"],
  explore: [8, 9, "发现新的出海机会"], dance: [10, 11, "好消息，庆祝一下"],
  wave: [12, 13, "你好呀，一起去全球"], sleep: [14, 15, "休息一下，马上回来"],
};
const SIZE = 88;

/** Interactive 3D-rendered mascot. Movement stays outside React's render cycle. */
export function NavMascot({ disabled }: { disabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const entrancePlayed = useRef(false);
  useEffect(() => {
    const mascot = ref.current;
    const nav = mascot?.closest<HTMLElement>(".nav-inner");
    const header = nav?.closest("header");
    const brand = nav?.querySelector<HTMLElement>(".brand");
    const button = mascot?.querySelector("button");
    const caption = mascot?.querySelector<HTMLElement>(".nav-mascot-caption");
    if (!mascot || !nav || !header || !brand || !button || !caption) return;
    const media = window.matchMedia("(min-width: 980px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let enabled = false;
    let disposed = false;
    let flying = false;
    let flightStart = 0;
    let flightFromX = 0;
    let raf = 0;
    let previous = 0;
    let returnTimer = 0;
    let idleTimer = 0;
    let restTimer = 0;
    let captionTimer = 0;
    let x = 0, y = 6, targetX = 0, targetY = 6, velocity = 0;
    let homeX = 0, dockX = 0;
    let bounds = { left: 0, width: 0 };
    let location: "home" | "dock" | "nav" | "patrol" = "home";
    let target: HTMLElement | null = null;
    let menuPull: { button: HTMLElement; label: string } | null = null;
    let nextAction: Action = "phone";
    let idleIndex = 0, clickIndex = 0, effort = 0;
    let lastRest = performance.now();
    let mascotHovered = false;
    let keyboardInside = false;
    const clearTimers = () => { window.clearTimeout(returnTimer); window.clearTimeout(idleTimer); window.clearTimeout(restTimer); window.clearTimeout(captionTimer); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; previous = 0; velocity = 0; };
    const paint = () => { mascot.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`; };
    const state = (value: string) => { mascot.dataset.state = value; };
    const say = (text: string) => {
      window.clearTimeout(captionTimer);
      caption.textContent = text;
      mascot.dataset.caption = "true";
      captionTimer = window.setTimeout(() => { mascot.dataset.caption = "false"; }, 2600);
    };
    const action = (value: Action, speak = false) => {
      window.clearTimeout(idleTimer); window.clearTimeout(restTimer);
      const [a, b, text] = ACTION_POSES[value];
      const pos = (index: number) => `${(index % 4) * 100 / 3}% ${Math.floor(index / 4) * 100 / 3}%`;
      mascot.style.setProperty("--panda-pose-a", pos(a));
      mascot.style.setProperty("--panda-pose-b", pos(b));
      mascot.dataset.action = value;
      mascot.dataset.direction = "right";
      state("activity");
      lastRest = performance.now();
      if (speak) say(text);
    };
    const scheduleIdle = (delay = 1200) => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (!enabled || location === "nav" || mascotHovered || keyboardInside) return;
        nextAction = ACTIONS[idleIndex % ACTIONS.length];
        idleIndex++;
        target = null;
        location = "dock";
        targetX = dockX + (idleIndex % 2 ? 0 : 22);
        targetY = 6;
        // Occasionally take a short sightseeing stroll along the empty logo-side lane.
        if (idleIndex % 5 === 0) { location = "patrol"; targetX = Math.min(dockX + 120, bounds.width - SIZE); targetY = nav.clientHeight - 42; }
        travel();
      }, delay);
    };
    const finishActivity = () => {
      if (!enabled) return;
      if (location === "patrol" || idleIndex % 3 === 0) goHome();
      else scheduleIdle();
    };
    const arrive = () => {
      stop(); mascot.dataset.direction = "right";
      if (location === "home") { state("ready"); scheduleIdle(1600); }
      else if (location === "dock" || location === "patrol") {
        action(nextAction);
        restTimer = window.setTimeout(finishActivity, nextAction === "sleep" ? 6800 : 4800);
      } else if (menuPull && menuPull.button === target) {
        state("pulling");
        restTimer = window.setTimeout(() => { if (enabled && location === "nav") state("ready"); }, 600);
      } else {
        state(effort > 1 ? "tired" : "ready");
        restTimer = window.setTimeout(() => { if (enabled && location === "nav") state("ready"); }, 1900);
      }
    };
    const tick = (time: number) => {
      if (!enabled) { stop(); return; }
      if (flying) {
        entrancePlayed.current = true;
        if (!flightStart) flightStart = time;
        const progress = Math.min(1, (time - flightStart) / 1250);
        const eased = 1 - Math.pow(1 - progress, 3);
        x = flightFromX + (homeX - flightFromX) * eased;
        y = 6 + 20 * (1 - eased) - 12 * Math.sin(Math.PI * progress);
        paint();
        if (progress < 1) { raf = requestAnimationFrame(tick); return; }
        flying = false; x = targetX = homeX; y = targetY = 6; paint(); stop();
        state("landing");
        restTimer = window.setTimeout(() => { if (enabled) { state("ready"); scheduleIdle(900); } }, 600);
        return;
      }
      const dt = Math.min((time - (previous || time - 16)) / 1000, .032);
      previous = time;
      const distance = targetX - x;
      if (Math.abs(distance) < .8 && Math.abs(targetY - y) < .8 && Math.abs(velocity) < 35) {
        x = targetX; y = targetY; paint(); arrive(); return;
      }
      const desired = Math.sign(distance) * Math.min(820, Math.sqrt(2 * 3000 * Math.abs(distance)));
      velocity += Math.max(-3200 * dt, Math.min(3200 * dt, desired - velocity));
      let step = velocity * dt;
      if (Math.sign(step) === Math.sign(distance) && Math.abs(step) > Math.abs(distance)) { step = distance; velocity *= .4; }
      x = Math.max(0, Math.min(bounds.width - SIZE, x + step));
      effort += Math.abs(step) / 900;
      y += (targetY - y) * (1 - Math.exp(-12 * dt));
      if (Math.abs(velocity) > 20) mascot.dataset.direction = velocity < 0 ? "left" : "right";
      mascot.style.setProperty("--panda-lean", `${Math.min(5, Math.abs(velocity) / 170)}deg`);
      mascot.style.setProperty("--panda-run-rate", `${(.49 - .22 * Math.min(1, Math.abs(velocity) / 820)).toFixed(2)}s`);
      paint(); raf = requestAnimationFrame(tick);
    };
    const travel = () => {
      window.clearTimeout(restTimer); window.clearTimeout(idleTimer);
      mascot.dataset.caption = "false";
      state("running");
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const goHome = () => {
      if (!enabled || mascotHovered || keyboardInside) return;
      clearTimers(); menuPull = null; target = null; location = "home"; targetX = homeX; targetY = 6; travel();
    };
    const chase = (element: HTMLElement) => {
      if (!enabled || flying || mascot.dataset.state === "landing") return;
      window.clearTimeout(returnTimer);
      if (target === element && location === "nav") return;
      clearTimers();
      if (menuPull?.button !== element) menuPull = null;
      effort = Math.max(0, effort - (performance.now() - lastRest) / 12000);
      lastRest = performance.now();
      target = element; location = "nav";
      const box = element.getBoundingClientRect();
      targetX = Math.max(0, Math.min(bounds.width - SIZE, box.left + box.width / 2 - bounds.left - SIZE / 2));
      targetY = nav.clientHeight - 42;
      if (menuPull?.button === element) {
        targetX = Math.max(homeX, Math.min(bounds.width - SIZE, box.left - bounds.left - 22 - 72));
        targetY = nav.clientHeight - 34;
      }
      travel();
    };
    const measure = () => {
      const box = nav.getBoundingClientRect();
      bounds = { left: box.left, width: box.width };
      const right = brand.getBoundingClientRect().right - box.left;
      homeX = right + 12; dockX = homeX;
      if (location === "home") { targetX = homeX; if (!raf) { x = homeX; paint(); } }
      else if (location === "nav" && target) { const item = target; target = null; chase(item); }
    };
    const sync = () => {
      enabled = media.matches && !disabled && !document.hidden;
      mascot.hidden = !enabled;
      stop(); clearTimers(); flying = false; menuPull = null; target = null; location = "home"; mascotHovered = false; keyboardInside = false;
      mascot.dataset.caption = "false";
      if (enabled) {
        measure(); targetX = homeX; targetY = 6;
        if (!entrancePlayed.current) {
          flying = true; flightStart = 0;
          flightFromX = -bounds.left - SIZE - 64;
          x = flightFromX; y = 26; paint(); state("flying");
          const image = new Image(); image.src = "/brand/mascot/pandamobo-sailor-atlas.png";
          void image.decode().catch(() => undefined).then(() => {
            if (!disposed && enabled && flying && !raf) raf = requestAnimationFrame(tick);
          });
        } else { x = homeX; y = 6; paint(); state("ready"); scheduleIdle(1400); }
      }
    };
    const findTarget = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const item = event.target.closest<HTMLElement>(".nav-refined-links > a, .nav-group > button, .nav-cta, .nav-dropdown");
      if (item?.classList.contains("nav-dropdown")) { const parent = item.parentElement?.querySelector<HTMLElement>(":scope > button"); if (parent) chase(parent); }
      else if (item) chase(item);
    };
    const leave = () => { window.clearTimeout(returnTimer); if (location === "nav") returnTimer = window.setTimeout(goHome, 650); };
    const out = (event: PointerEvent) => {
      if (!(event.relatedTarget instanceof Element) || !event.relatedTarget.closest(".nav-refined-links,.nav-cta,.nav-mascot")) leave();
    };
    const focus = (event: FocusEvent) => { keyboardInside = button.matches(":focus-visible"); findTarget(event); };
    const blur = (event: FocusEvent) => { keyboardInside = button.contains(event.relatedTarget as Node); if (!keyboardInside) { if (location === "nav") leave(); else scheduleIdle(2600); } };
    const hoverMascot = () => { mascotHovered = true; window.clearTimeout(returnTimer); if (mascot.dataset.state !== "running") say("点点我，换个小动作"); };
    const leaveMascot = () => { mascotHovered = false; if (location === "nav") leave(); else scheduleIdle(3600); };
    const interact = () => {
      if (!enabled) return;
      clearTimers(); stop(); target = null;
      location = "dock";
      const choices: Action[] = ["wave", "dance", "phone", "explore", "stretch", "map", "coffee", "sleep"];
      action(choices[clickIndex++ % choices.length], true);
      restTimer = window.setTimeout(() => scheduleIdle(), 5200);
    };
    const pullMenu = (event: Event) => {
      const detail = (event as CustomEvent<{ button: HTMLElement; label: string; handled: boolean; estimatedMs: number }>).detail;
      if (!enabled || flying || mascot.dataset.state === "landing" || !nav.contains(detail.button)) return;
      menuPull = { button: detail.button, label: detail.label };
      target = null; chase(detail.button);
      detail.handled = true;
      detail.estimatedMs = Math.round((Math.abs(targetX - x) / 820 + .26) * 1000);
    };
    const closeMenu = (event: Event) => {
      const label = (event as CustomEvent<{ label: string }>).detail.label;
      if (menuPull?.label !== label) return;
      menuPull = null;
      if (mascot.dataset.state === "pulling") { window.clearTimeout(restTimer); state("ready"); }
    };
    window.addEventListener("pandamobo:menu-pull", pullMenu);
    window.addEventListener("pandamobo:menu-close", closeMenu);
    const observer = new ResizeObserver(measure); observer.observe(nav);
    header.addEventListener("pointerover", findTarget);
    header.addEventListener("pointerout", out);
    header.addEventListener("pointerleave", leave);
    header.addEventListener("focusin", focus);
    header.addEventListener("focusout", blur);
    button.addEventListener("pointerenter", hoverMascot);
    button.addEventListener("pointerleave", leaveMascot);
    button.addEventListener("click", interact);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      disposed = true; enabled = false; stop(); clearTimers(); observer.disconnect();
      header.removeEventListener("pointerover", findTarget); header.removeEventListener("pointerout", out); header.removeEventListener("pointerleave", leave);
      header.removeEventListener("focusin", focus); header.removeEventListener("focusout", blur);
      button.removeEventListener("pointerenter", hoverMascot); button.removeEventListener("pointerleave", leaveMascot); button.removeEventListener("click", interact);
      window.removeEventListener("pandamobo:menu-pull", pullMenu); window.removeEventListener("pandamobo:menu-close", closeMenu);
      media.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
    };
  }, [disabled]);

  return <div className="nav-mascot" ref={ref} data-state="ready" data-direction="right" hidden>
    <div className="nav-mascot-facing" aria-hidden="true">
      <svg className="nav-mascot-cape" viewBox="0 0 100 80" fill="none" focusable="false">
        <defs><linearGradient id="panda-cape-red" x1="85" y1="22" x2="14" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor="#ff6860" /><stop offset=".5" stopColor="#e6283e" /><stop offset="1" stopColor="#a90f2c" /></linearGradient></defs>
        <path d="M92 27C68 30 51 7 23 15C12 18 5 17 1 12L11 40L1 65C32 75 58 42 91 43Z" fill="url(#panda-cape-red)" />
        <path d="M90 31C63 38 41 22 16 22M89 38C57 34 39 60 12 58" stroke="#ff9b91" strokeWidth="1.4" opacity=".6" />
      </svg>
      <div className="nav-mascot-pose" /><div className="nav-mascot-action" />
      <span className="nav-mascot-sweat" /><span className="nav-mascot-sweat second" />
      <span className="nav-mascot-speed" />
    </div>
    <span className="nav-mascot-shadow" aria-hidden="true" />
    <button type="button" className="nav-mascot-play" aria-label="和熊猫领航员互动，点击切换小动作" />
    <span className="nav-mascot-caption" role="status" aria-live="polite" />
  </div>;
}
