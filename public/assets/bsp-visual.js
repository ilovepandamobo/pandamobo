/* PandaMobo BSP Visual · dependency-free Web Component */
(() => {
  'use strict';
  if (customElements.get('panda-bsp-visual')) return;
  const TAU = Math.PI * 2;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host{display:block;width:100%;min-width:0;--bsp-accent:#83ffbf;--bsp-rgb:131,255,191;contain:layout style;container-type:inline-size;font-family:Inter,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
      *{box-sizing:border-box}
      .stage{position:relative;isolation:isolate;display:block;width:100%;height:auto;aspect-ratio:1/1;min-height:260px;max-height:520px;margin:0;padding:0;border:0;background:transparent;color:#effff8;font:inherit;overflow:hidden;border-radius:22px;text-align:center;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer}
      .stage:focus-visible{outline:2px solid var(--bsp-accent);outline-offset:-4px}
      canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
      .ambient{position:absolute;inset:5% 0 0;z-index:-1;background:radial-gradient(ellipse at 50% 46%,rgba(var(--bsp-rgb),.11),transparent 63%);pointer-events:none}
      .fallback{position:absolute;left:20%;top:16%;width:60%;aspect-ratio:1;border:1px solid rgba(var(--bsp-rgb),.3);border-radius:50%;box-shadow:0 0 35px rgba(var(--bsp-rgb),.07),inset 0 0 35px rgba(var(--bsp-rgb),.07);transform:rotateX(15deg)}
      :host([data-ready]) .fallback{display:none}
      .inscription{position:absolute;inset:0;pointer-events:none;transform:perspective(900px) rotateX(var(--bsp-rx,0deg)) rotateY(var(--bsp-ry,0deg));will-change:transform}
      .eyebrow{position:absolute;left:0;right:0;top:9%;display:flex;align-items:center;justify-content:center;gap:9px;color:#c5f2da;font-size:13px;font-weight:500;letter-spacing:.5px}
      .eyebrow:before{content:'';width:5px;height:5px;border-radius:50%;background:var(--bsp-accent);box-shadow:0 0 13px rgba(var(--bsp-rgb),.7)}
      .center{position:absolute;left:0;right:0;top:36%;display:flex;align-items:center;justify-content:center;flex-direction:column}
      .letters{display:block;font-size:clamp(58px,14cqi,96px);font-weight:550;line-height:1.05;letter-spacing:3px;background:linear-gradient(165deg,#fff 15%,#eafff3 48%,var(--bsp-accent) 90%);color:#edfff6;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 24px rgba(var(--bsp-rgb),.18))}
      .micro{margin-top:12px;font-size:11px;font-weight:400;letter-spacing:1.6px;color:#91bba8}
      .credential{position:absolute;left:5%;right:5%;top:78%;font-size:clamp(20px,5.2cqi,30px);font-weight:600;line-height:1.4;letter-spacing:2px;color:#eafff4;text-shadow:0 0 30px rgba(var(--bsp-rgb),.18);text-wrap:balance}
      .company,.hint{display:none!important}
      @media(prefers-reduced-motion:reduce){.inscription{transform:none!important;will-change:auto}}
    </style>
    <button type="button" class="stage" aria-label="激活 BSP 光环动效">
      <span class="ambient"></span><span class="fallback" aria-hidden="true"></span>
      <canvas aria-hidden="true"></canvas>
      <span class="inscription">
        <span class="eyebrow"></span>
        <span class="center"><span class="letters">BSP</span><span class="micro">BUSINESS SOLUTION PROVIDER</span></span>
        <span class="credential"></span><span class="company"></span>
      </span>
      <span class="hint">移动探索 · 点击激活光环</span>
    </button>`;

  class PandaBspVisual extends HTMLElement {
    static get observedAttributes() { return ['label', 'brand', 'company', 'accent', 'speed', 'paused', 'quality']; }
    constructor() {
      super();
      this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
      this._button = this.shadowRoot.querySelector('button');
      this._canvas = this.shadowRoot.querySelector('canvas');
      this._ctx = this._canvas.getContext('2d', {alpha:true});
      this._w = this._h = this._time = this._last = this._drawLast = 0;
      this._raf = null; this._visible = false; this._hover = false;
      this._cursor = {x:0,y:0}; this._target = {x:0,y:0}; this._energy = 0;
      this._waves = []; this._rgb = [131,255,191];
      this._frame = this._frame.bind(this);
      this._particles = Array.from({length:100},(_,i)=>({
        x:Math.sin(i*12.9898)*.48,y:Math.cos(i*37.719)*.46,
        z:(Math.sin(i*78.233)+1)*.5,phase:i*2.39996
      }));
    }
    connectedCallback() {
      if(this._abort) return;
      this._abort = new AbortController();
      const signal = this._abort.signal;
      this._media = matchMedia('(prefers-reduced-motion: reduce)');
      this._coarse = matchMedia('(pointer:coarse)').matches;
      this._reduced = this._media.matches;
      this._resizeObserver = new ResizeObserver(()=>this._resize());
      this._resizeObserver.observe(this._button);
      this._intersection = new IntersectionObserver(entries=>{
        this._visible=entries[0].isIntersecting;
        if(this._visible) this._start(); else this._stop();
      },{rootMargin:'60px'});
      this._intersection.observe(this);
      this._button.addEventListener('pointermove',e=>{
        if(e.pointerType==='touch'||this._reduced) return;
        const r=this._button.getBoundingClientRect();
        this._target.x=clamp((e.clientX-r.left)/r.width*2-1,-1,1);
        this._target.y=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
      },{signal});
      this._button.addEventListener('pointerenter',()=>{this._hover=true;this._start();},{signal});
      this._button.addEventListener('pointerleave',()=>{this._hover=false;this._target={x:0,y:0};},{signal});
      this._button.addEventListener('focus',()=>{this._hover=true;this._start();},{signal});
      this._button.addEventListener('blur',()=>{this._hover=false;this._target={x:0,y:0};},{signal});
      this._button.addEventListener('click',()=>{
        if(!this._reduced&&!this.hasAttribute('paused')) {
          this._waves.push({age:0}); this._waves=this._waves.slice(-4); this._energy=1; this._start();
        }
        this.dispatchEvent(new CustomEvent('bsp-activate',{bubbles:true,composed:true}));
      },{signal});
      document.addEventListener('visibilitychange',()=>document.hidden?this._stop():this._start(),{signal});
      this._media.addEventListener('change',e=>{
        this._reduced=e.matches;this._waves=[];this._cursor={x:0,y:0};this._target={x:0,y:0};
        this._setTilt();this._stop();this._draw();this._start();
      },{signal});
      this._update(); this._resize();
    }
    disconnectedCallback() {
      this._stop();this._abort?.abort();this._abort=null;
      this._resizeObserver?.disconnect();this._intersection?.disconnect();
      this._visible=false;this._hover=false;
    }
    attributeChangedCallback(){if(this.isConnected&&this._abort)this._update();}
    _update(){
      const brand=this.getAttribute('brand')||'WhatsApp';
      const label=this.getAttribute('label')||'官方顶级合作伙伴';
      this.shadowRoot.querySelector('.eyebrow').textContent=brand;
      this.shadowRoot.querySelector('.credential').textContent=label;
      this.shadowRoot.querySelector('.company').textContent=this.getAttribute('company')??'';
      this._button.setAttribute('aria-label',`${brand} ${label} BSP，点击激活光环动效`);
      const value=this.getAttribute('accent')||'#83ffbf';
      const color=/^#[0-9a-f]{6}$/i.test(value)?value:'#83ffbf';
      this._rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
      this.style.setProperty('--bsp-accent',color);this.style.setProperty('--bsp-rgb',this._rgb.join(','));
      const speed=Number(this.getAttribute('speed')??1);
      this._speed=Number.isFinite(speed)?clamp(speed,0,2):1;
      if(this.hasAttribute('paused')||this._speed===0){this._stop();this._waves=[];this._draw();}
      else this._start();
    }
    _resize(){
      if(!this._ctx)return;
      const r=this._button.getBoundingClientRect();
      this._w=r.width;this._h=r.height;
      const dpr=Math.min(devicePixelRatio||1,this._coarse||this.getAttribute('quality')==='low'?1.5:2);
      this._canvas.width=Math.max(1,Math.round(r.width*dpr));
      this._canvas.height=Math.max(1,Math.round(r.height*dpr));
      this._ctx.setTransform(dpr,0,0,dpr,0,0);
      this._draw();this._start();
    }
    _start(){
      if(this._raf!==null||!this._abort||!this._ctx||!this._visible||document.hidden||this._reduced||this.hasAttribute('paused')||this._speed===0)return;
      this._last=this._drawLast=performance.now();this._raf=requestAnimationFrame(this._frame);
    }
    _stop(){if(this._raf!==null)cancelAnimationFrame(this._raf);this._raf=null;this._last=0;}
    _frame(now){
      this._raf=null;
      if(!this.isConnected||!this._visible||document.hidden||this._reduced||this.hasAttribute('paused'))return;
      const fps=this._coarse||this.getAttribute('quality')==='low'?30:45;
      if(now-this._drawLast>=1000/fps){
        const dt=Math.min((now-this._last)/1000,.075);this._last=now;this._drawLast=now;
        this._time+=dt*this._speed;
        const lerp=1-Math.exp(-dt*4.5);
        this._cursor.x+=(this._target.x-this._cursor.x)*lerp;
        this._cursor.y+=(this._target.y-this._cursor.y)*lerp;
        this._energy*=Math.exp(-dt*2.7);
        this._waves.forEach(w=>w.age+=dt);this._waves=this._waves.filter(w=>w.age<1.7);
        this._setTilt();this._draw();
      }
      this._raf=requestAnimationFrame(this._frame);
    }
    _setTilt(){
      this.style.setProperty('--bsp-rx',(-this._cursor.y*3)+'deg');
      this.style.setProperty('--bsp-ry',(this._cursor.x*4)+'deg');
    }
    _draw(){
      const c=this._ctx,w=this._w,h=this._h;if(!c||!w||!h)return;
      const t=this._time,move=this._reduced?0:1;
      const rgb=this._rgb,rgba=a=>`rgba(${rgb.join(',')},${a})`;
      c.clearRect(0,0,w,h);c.save();
      const cx=w*.5+this._cursor.x*w*.022,cy=h*.43+this._cursor.y*h*.015;
      const R=Math.min(w*.35,h*.33),energy=this._energy;
      const scale=R/160;
      c.translate(cx,cy);c.scale(scale,scale);
      const halo=c.createRadialGradient(0,0,28,0,0,210);
      halo.addColorStop(0,rgba(.025));halo.addColorStop(.47,rgba(.018));halo.addColorStop(.76,rgba(.08+energy*.035));halo.addColorStop(1,rgba(0));
      c.fillStyle=halo;c.fillRect(-230,-230,460,460);
      // Deterministic dust field: no random flicker between frames.
      for(const p of this._particles){
        const px=p.x*w/scale+Math.sin(t*.18+p.phase)*6*move,py=p.y*h/scale+Math.cos(t*.15+p.phase)*5*move;
        const alpha=.12+p.z*.3;
        c.fillStyle=rgba(alpha);c.beginPath();c.arc(px,py,.35+p.z*.8,0,TAU);c.fill();
        const mx=this._cursor.x*w/scale*.5,my=this._cursor.y*h/scale*.5;
        const distance=Math.hypot(px-mx,py-my);
        if(this._hover&&move&&distance<85){
          c.strokeStyle=rgba((1-distance/85)*.12);c.lineWidth=.6;
          c.beginPath();c.moveTo(px,py);c.lineTo(mx,my);c.stroke();
        }
      }
      // A softly lit glass core keeps the letters legible.
      const core=c.createRadialGradient(-20,-24,2,0,0,105);
      core.addColorStop(0,'rgba(31,69,57,.27)');core.addColorStop(.7,'rgba(6,25,28,.17)');core.addColorStop(1,'rgba(9,26,28,0)');
      c.fillStyle=core;c.beginPath();c.arc(0,0,105,0,TAU);c.fill();
      const rx=.23+Math.sin(t*.23)*.045*move+this._cursor.y*.12;
      const ry=-.38+Math.sin(t*.17)*.07*move+this._cursor.x*.18;
      const rz=-.38+Math.sin(t*.12)*.08*move;
      const project=(x,y,z)=>{
        let yy=y*Math.cos(rx)-z*Math.sin(rx),zz=y*Math.sin(rx)+z*Math.cos(rx);
        let xx=x*Math.cos(ry)+zz*Math.sin(ry);zz=-x*Math.sin(ry)+zz*Math.cos(ry);
        const xxx=xx*Math.cos(rz)-yy*Math.sin(rz),yyy=xx*Math.sin(rz)+yy*Math.cos(rz);
        const p=650/(650-zz);return [xxx*p,yyy*p,zz];
      };
      const low=this._coarse||this.getAttribute('quality')==='low';
      const count=low?18:30,steps=low?120:168;
      const rings=[];
      for(let k=0;k<count;k++){
        const v=k/count*TAU,points=[];
        for(let j=0;j<=steps;j++){
          const u=j/steps*TAU;
          const undulation=(Math.sin(u*3+t*.36)+Math.cos(u*2-t*.24))*3;
          const tube=17+Math.sin(t*.5+u*2)*2;
          const radius=150+Math.cos(v)*tube+undulation+energy*5;
          const z=Math.sin(v)*tube+Math.sin(u*2+t*.27)*9;
          points.push(project(Math.cos(u)*radius,Math.sin(u)*radius,z));
        }
        rings.push({points,k});
      }
      // Broad low-opacity light, then crisp continuous filaments.
      c.globalCompositeOperation='lighter';
      for(const ring of rings){
        const {points,k}=ring;
        c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));
        c.strokeStyle=rgba(.018+energy*.012);c.lineWidth=4;c.stroke();
        c.strokeStyle=k%7===0?'rgba(210,255,234,.32)':rgba(.1+Math.sin(k*1.1)*.035);
        c.lineWidth=k%7===0?1:.55;c.stroke();
      }
      // Offset orbital arcs give a layered, spatial silhouette.
      for(let orbit=0;orbit<3;orbit++){
        const pts=[];
        for(let j=0;j<=150;j++){
          const u=j/150*TAU,rad=185+orbit*11;
          pts.push(project(Math.cos(u)*rad,Math.sin(u)*rad*(.79+orbit*.06),Math.sin(u+.8)*30+orbit*4));
        }
        c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));
        c.strokeStyle=rgba(.07-orbit*.012);c.lineWidth=.65;c.stroke();
        const u=(t*(.28+orbit*.08)+orbit*1.9)%TAU;
        const pos=project(Math.cos(u)*(185+orbit*11),Math.sin(u)*(185+orbit*11)*(.79+orbit*.06),Math.sin(u+.8)*30+orbit*4);
        const flare=c.createRadialGradient(pos[0],pos[1],0,pos[0],pos[1],13);
        flare.addColorStop(0,'rgba(240,255,249,.95)');flare.addColorStop(.1,rgba(.8));flare.addColorStop(.3,rgba(.14));flare.addColorStop(1,rgba(0));
        c.fillStyle=flare;c.fillRect(pos[0]-13,pos[1]-13,26,26);
      }
      // Fast light traces travel along the main halo, never through the copy.
      for(let k=0;k<5;k++){
        const phase=t*(.2+(this._hover ? .16 : 0))+k*TAU/5;
        for(let j=0;j<17;j++){
          const u=phase-j*.009,p=project(Math.cos(u)*151,Math.sin(u)*151,Math.sin(u*2+t*.27)*9);
          c.fillStyle=j<3?'rgba(225,255,239,.85)':rgba((1-j/17)*.4);
          c.beginPath();c.arc(p[0],p[1],j<3?1.15:.65,0,TAU);c.fill();
        }
      }
      for(const wave of this._waves){
        const progress=wave.age/1.7,rad=95+progress*165;
        c.strokeStyle=rgba((1-progress)**2*.5);c.lineWidth=1.5*(1-progress)+.3;
        c.beginPath();c.ellipse(0,0,rad,rad*.9,-.3,0,TAU);c.stroke();
      }
      c.globalCompositeOperation='source-over';c.restore();
      this.setAttribute('data-ready','');
    }
  }
  customElements.define('panda-bsp-visual',PandaBspVisual);
})();
