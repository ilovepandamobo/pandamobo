type Brand = "meta" | "google" | "tiktok" | "taboola";

type State = {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  brand: Brand;
  w: number;
  h: number;
  a: number;
  hover: boolean;
  focus: boolean;
  pinned: boolean;
  x: number;
  y: number;
  visible: boolean;
  phase: number;
};

const TAU = Math.PI * 2;

function glow(ctx: CanvasRenderingContext2D, color: string, blur = 15) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function line(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  color: string,
  width = 1,
  blur = 0,
) {
  ctx.beginPath();
  points.forEach((point, index) => (index ? ctx.lineTo(...point) : ctx.moveTo(...point)));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, blur = 0) {
  glow(ctx, color, blur);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function draw(s: State, t: number) {
  const c = s.ctx;
  const w = s.w;
  const h = s.h;
  const a = s.a;
  c.clearRect(0, 0, w, h);
  c.save();
  const cx = w * 0.52 + s.x * 8 * a;
  const cy = 134 + s.y * 7 * a;
  const scale = w / 250;
  c.translate(cx, cy);
  c.scale(scale, scale);
  const ambient = c.createRadialGradient(0, 0, 5, 0, 0, 160);
  ambient.addColorStop(0, s.brand === "taboola" ? "#7034ad45" : s.brand === "tiktok" ? "#1bb9ba24" : "#246ada33");
  ambient.addColorStop(1, "#0b122000");
  c.fillStyle = ambient;
  c.fillRect(-200, -180, 400, 360);
  for (let i = 0; i < 35; i += 1) {
    const x = Math.sin(i * 127.1) * 140;
    const y = Math.cos(i * 19.7) * 115;
    dot(c, x, y, 0.45 + (i % 3) * 0.3, `rgba(173,202,255,${0.13 + (Math.sin(t + i) + 1) * 0.1})`);
  }
  if (s.brand === "meta") {
    const path = (layer: number) => {
      const pts: Array<[number, number]> = [];
      for (let j = 0; j <= 220; j += 1) {
        const u = (j / 220) * TAU;
        const xx = (91 * Math.cos(u)) / (1 + Math.sin(u) ** 2 * 0.38);
        const yy = 56 * Math.sin(u) * Math.cos(u);
        pts.push([xx, yy + layer * 2.2 + Math.sin(u + t * 0.55) * 4]);
      }
      return pts;
    };
    c.rotate(-0.19 + Math.sin(t * 0.3) * 0.05);
    for (let i = 8; i >= 0; i -= 1) line(c, path(i), `rgba(36,105,255,${0.05 + i * 0.014})`, 9 - i * 0.6, 8);
    line(c, path(0), "#2168ff", 9, 24);
    line(c, path(-1), "#52aeff", 3.3, 9);
    line(c, path(-1), "#d0efff", 0.75, 2);
    for (let i = 0; i < 26; i += 1) {
      const u = (t * (0.23 + a * 0.5) + (i / 26) * TAU) % TAU;
      const x = (91 * Math.cos(u)) / (1 + Math.sin(u) ** 2 * 0.38);
      const y = 56 * Math.sin(u) * Math.cos(u);
      dot(c, x, y, i % 4 === 0 ? 2.2 : 1, "#c5ecff", 12);
      if (a > 0.1) dot(c, x + Math.sin(i * 29) * 30 * a, y + Math.cos(i * 13) * 25 * a, 0.7, "#4f9dff", 5);
    }
    c.globalAlpha = 0.2;
    c.scale(1, 0.28);
    c.translate(0, 245);
    line(c, path(0), "#1975ff", 14, 20);
    c.globalAlpha = 1;
  } else if (s.brand === "google") {
    const colors = ["#4285f4", "#ea4335", "#fbbc05", "#34a853"];
    for (let k = 0; k < 4; k += 1) {
      const points: Array<[number, number]> = [];
      const angle = k * 0.7 - 0.75;
      for (let j = 0; j <= 130; j += 1) {
        const u = (j / 130) * TAU;
        const x = Math.cos(u) * 91;
        const y = Math.sin(u) * 37;
        points.push([x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]);
      }
      line(c, points, `${colors[k]}38`, 1);
      const u = t * (0.3 + a * 0.45) + k * 1.58;
      const xx = Math.cos(u) * 91;
      const yy = Math.sin(u) * 37;
      const x = xx * Math.cos(angle) - yy * Math.sin(angle);
      const y = xx * Math.sin(angle) + yy * Math.cos(angle);
      dot(c, x, y, 5, colors[k], 16);
      dot(c, x - 1, y - 1, 1.5, "#ffffff", 3);
    }
    c.rotate(t * 0.1);
    for (let k = 0; k < 4; k += 1) {
      const start = (k * Math.PI) / 2 + 0.1;
      const pts: Array<[number, number]> = [];
      for (let i = 0; i < 46; i += 1) {
        const u = start + (i / 46) * (Math.PI / 2 - 0.2);
        pts.push([Math.cos(u) * 48, Math.sin(u) * 48]);
      }
      line(c, pts, colors[k], 12, 12);
      line(c, pts, "#ffffff55", 1, 0);
    }
    const sphere = c.createRadialGradient(-12, -14, 1, 0, 0, 34);
    sphere.addColorStop(0, "#e7f3ff");
    sphere.addColorStop(0.18, "#91adce");
    sphere.addColorStop(0.48, "#273958");
    sphere.addColorStop(0.8, "#101b32");
    sphere.addColorStop(1, "#5180b7");
    c.fillStyle = sphere;
    c.beginPath();
    c.arc(0, 0, 30, 0, TAU);
    c.fill();
  } else if (s.brand === "tiktok") {
    c.rotate(-0.11);
    for (let i = 0; i < 29; i += 1) {
      const x = (i - 14) * 7.6;
      const length = 7 + Math.pow(Math.max(0, Math.sin(i * 0.46 + t * (1 + a * 3))), 2) * (25 + a * 35);
      const col = i % 2 ? "#ff3567" : "#27eced";
      line(c, [[x, 44 - length * 0.5], [x, 44 + length * 0.5]], `${col}85`, 2.5, 5);
    }
    const note = (ox: number, oy: number, col: string) => {
      c.save();
      c.translate(ox, oy);
      c.shadowColor = col;
      c.shadowBlur = 18;
      c.strokeStyle = col;
      c.lineWidth = 12;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(7, 15);
      c.lineTo(7, -57);
      c.bezierCurveTo(9, -34, 21, -29, 36, -29);
      c.stroke();
      c.fillStyle = col;
      c.beginPath();
      c.ellipse(-7, 17, 19, 14, -0.4, 0, TAU);
      c.fill();
      c.restore();
    };
    note(-7 - a * 3, 2, "#24e7ec");
    note(4 + a * 3, 8, "#fe2c64");
    note(-1, 4, "#f2faff");
    for (let j = 0; j < 3; j += 1) {
      const r = (t * 18 + j * 32) % 110;
      c.globalAlpha = (1 - r / 110) * (0.08 + a * 0.19);
      c.strokeStyle = j % 2 ? "#ff3567" : "#26edee";
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(0, 8, r, r * 0.7, 0, 0, TAU);
      c.stroke();
    }
    c.globalAlpha = 1;
  } else {
    const nodes: Array<[number, number, number]> = [
      [-79, -32, -0.18],
      [0, -48, 0.04],
      [78, -20, 0.2],
      [-52, 43, -0.11],
      [42, 39, 0.12],
    ];
    const spread = 1 + a * 0.16;
    nodes.forEach((n, i) => {
      const x = n[0] * spread;
      const y = n[1] * spread + Math.sin(t * 0.6 + i) * 4;
      line(c, [[0, 0], [x * 0.5, y * 0.3], [x, y]], "#ba94ff66", 1);
      const p = (t * 0.24 + i * 0.21) % 1;
      dot(c, x * p, y * p, 1.7, "#d1b5ff", 8);
    });
    nodes.forEach((n, i) => {
      c.save();
      c.translate(n[0] * spread, n[1] * spread + Math.sin(t * 0.6 + i) * 4);
      c.rotate(n[2] + Math.sin(t * 0.3 + i) * 0.02);
      c.shadowColor = "#9373ff";
      c.shadowBlur = 12;
      c.fillStyle = "#171e39";
      c.strokeStyle = "#a786e180";
      c.lineWidth = 1;
      c.beginPath();
      c.roundRect(-25, -31, 50, 62, 6);
      c.fill();
      c.stroke();
      c.shadowBlur = 0;
      const gr = c.createLinearGradient(-20, -25, 20, 5);
      gr.addColorStop(0, i % 2 ? "#815ef0" : "#4267bd");
      gr.addColorStop(1, i % 2 ? "#de8abd" : "#9ebdff");
      c.fillStyle = gr;
      c.beginPath();
      c.roundRect(-20, -25, 40, 29, 3);
      c.fill();
      c.fillStyle = "#e1d9f0";
      c.fillRect(-18, 12, 29, 2);
      c.fillStyle = "#69758d";
      c.fillRect(-18, 19, 35, 2);
      c.fillRect(-18, 24, 20, 2);
      c.restore();
    });
    dot(c, 0, 0, 15, "#9972fd", 23);
    dot(c, 0, 0, 8, "#e4d4ff", 5);
    dot(c, -2, -2, 3, "#ffffff", 3);
  }
  c.restore();
}

export function mountPandaMediaBackgrounds(root: HTMLElement) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const states: State[] = [];
  const cleanups: Array<() => void> = [];
  let running = false;
  let last = 0;
  let clock = 0;
  let frameId = 0;

  root.querySelectorAll<HTMLElement>(".pm-item").forEach((el) => {
    const canvas = el.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const brand = (el.dataset.brand || "meta") as Brand;
    const s: State = {
      el,
      canvas,
      ctx,
      brand,
      w: 0,
      h: 0,
      a: 0,
      hover: false,
      focus: false,
      pinned: false,
      x: 0,
      y: 0,
      visible: true,
      phase: 0,
    };
    states.push(s);

    const resize = () => {
      const r = el.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      s.w = r.width;
      s.h = r.height;
      canvas.width = Math.round(r.width * d);
      canvas.height = Math.round(r.height * d);
      s.ctx.setTransform(d, 0, 0, d, 0, 0);
      draw(s, clock);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);

    const onEnter = () => {
      s.hover = true;
      start();
    };
    const onLeave = () => {
      s.hover = false;
      s.x = 0;
      s.y = 0;
    };
    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.x = (event.clientX - r.left) / r.width - 0.5;
      s.y = (event.clientY - r.top) / r.height - 0.5;
    };
    const onFocus = () => {
      s.focus = true;
      start();
    };
    const onBlur = () => {
      s.focus = false;
    };
    const onClick = () => {
      s.pinned = !s.pinned;
      el.setAttribute("aria-pressed", String(s.pinned));
      start();
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    el.addEventListener("click", onClick);

    const io = new IntersectionObserver((entries) => {
      s.visible = entries[0]?.isIntersecting ?? true;
      if (s.visible) start();
    });
    io.observe(el);

    cleanups.push(() => {
      observer.disconnect();
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("click", onClick);
    });
    resize();
  });

  const frame = (now: number) => {
    running = false;
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
    last = now;
    if (!motion.matches) clock += dt;
    states.forEach((s) => {
      if (!s.visible) return;
      const target = s.hover || s.pinned || s.focus ? 1 : 0;
      s.a = motion.matches ? target : s.a + (target - s.a) * (1 - Math.exp(-dt * 7));
      if (!motion.matches) s.phase += dt;
      if (s.w) draw(s, s.phase);
    });
    if (!document.hidden && states.some((s) => s.visible) && !motion.matches) {
      running = true;
      frameId = window.requestAnimationFrame(frame);
    }
  };

  const start = () => {
    if (!running) {
      running = true;
      frameId = window.requestAnimationFrame(frame);
    }
  };

  const onMotion = () => start();
  const onVisibility = () => {
    if (!document.hidden) start();
  };
  motion.addEventListener("change", onMotion);
  document.addEventListener("visibilitychange", onVisibility);
  start();

  return () => {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    motion.removeEventListener("change", onMotion);
    document.removeEventListener("visibilitychange", onVisibility);
    cleanups.forEach((fn) => fn());
  };
}
