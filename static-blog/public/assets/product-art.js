/* Image + pointer interaction. No dependencies. */
(() => {
  'use strict';
  if (customElements.get('panda-product-art')) return;
  const defs = {
    rocket:{color:'69,132,255',paths:[[[.3,.48],[.47,.48],[.25,.66],[.51,.7]],[[.56,.63],[.65,.6],[.62,.48],[.75,.34]]]},
    spark:{color:'153,102,255',paths:[[[.28,.7],[.35,.57],[.46,.51],[.59,.4]],[[.28,.7],[.38,.68],[.54,.58],[.68,.54]],[[.28,.7],[.44,.73],[.63,.7],[.77,.65]]]},
    compass:{color:'100,95,255',paths:[[[.22,.4],[.24,.6],[.56,.6],[.79,.62]],[[.79,.62],[.6,.77],[.28,.6],[.22,.4]]]},
    mc:{color:'30,171,255',paths:[[[.39,.6],[.51,.55],[.47,.37],[.7,.37]],[[.39,.6],[.56,.57],[.63,.56],[.77,.56]],[[.39,.6],[.47,.8],[.61,.79],[.71,.79]]]}
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const bezier=(p,t)=>{const s=1-t;return [s*s*s*p[0][0]+3*s*s*t*p[1][0]+3*s*t*t*p[2][0]+t*t*t*p[3][0],s*s*s*p[0][1]+3*s*s*t*p[1][1]+3*s*t*t*p[2][1]+t*t*t*p[3][1]];};
  class ProductArt extends HTMLElement {
    static get observedAttributes(){return ['src','alt','variant'];}
    constructor(){
      super();this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML=`<style>
        :host{display:block;width:100%;height:100%;aspect-ratio:auto;position:relative;--art-rgb:69,132,255}
        *{box-sizing:border-box}.frame{position:absolute;inset:0;overflow:hidden;background:transparent;border-radius:0 0 20px 20px;isolation:isolate;perspective:700px}
        img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 62%;transform:translate3d(var(--x,0px),var(--lift,0px),0) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--scale,1));transform-origin:50% 62%;will-change:transform;mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 100%);-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 100%)}
        .light,.shine,canvas{position:absolute;inset:0;pointer-events:none;mask-image:linear-gradient(transparent 0 18%,#000 27%);-webkit-mask-image:linear-gradient(transparent 0 18%,#000 27%)}
        .light{background:radial-gradient(ellipse at var(--mx,50%) var(--my,60%),rgba(var(--art-rgb),.13),transparent 48%);mix-blend-mode:screen;opacity:var(--energy,0)}
        .shine{inset:0 -65%;background:linear-gradient(112deg,transparent 43%,#ffffff00 46%,#ffffffa0 49.5%,#ffffff10 53%,transparent 57%);transform:translateX(calc(var(--sweep,-48)*1%));opacity:calc(var(--energy,0)*.6);mix-blend-mode:screen}
        canvas{width:100%;height:100%}:host([data-static]) img{will-change:auto}
        @media(prefers-reduced-motion:reduce){img{transform:none!important;will-change:auto}.light,.shine,canvas{display:none}}
      </style><div class="frame"><img width="800" height="920" loading="lazy" decoding="async"><span class="light"></span><span class="shine"></span><canvas aria-hidden="true"></canvas></div>`;
      this._image=this.shadowRoot.querySelector('img');this._canvas=this.shadowRoot.querySelector('canvas');this._ctx=this._canvas.getContext('2d');
      this._w=this._h=this._t=this._energy=0;this._target={x:0,y:0};this._point={x:0,y:0};this._active=false;this._raf=null;this._last=0;this._enter=0;
      this._loop=this._loop.bind(this);
    }
    connectedCallback(){
      if(this._abort)return;this._abort=new AbortController();const signal=this._abort.signal;
      this._root=this.closest('[data-ai-product-card]')||this;
      this._mq=matchMedia('(prefers-reduced-motion:reduce)');this._reduced=this._mq.matches;
      this._root.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')this._activate(true);},{signal});
      this._root.addEventListener('pointerleave',()=>this._activate(false),{signal});
      this._root.addEventListener('pointermove',e=>{
        if(this._reduced||e.pointerType==='touch')return;const r=this._root.getBoundingClientRect();
        this._target={x:clamp((e.clientX-r.left)/r.width*2-1,-1,1),y:clamp((e.clientY-r.top)/r.height*2-1,-1,1)};
      },{signal});
      this._root.addEventListener('focusin',()=>this._activate(true),{signal});
      this._root.addEventListener('focusout',e=>{if(!this._root.contains(e.relatedTarget))this._activate(false);},{signal});
      document.addEventListener('visibilitychange',()=>{if(document.hidden)this._stop();else if(this._active)this._start();},{signal});
      this._mq.addEventListener('change',e=>{this._reduced=e.matches;this._reset();if(this._active)this._start();},{signal});
      this._resize=new ResizeObserver(()=>{
        const r=this.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this._w=r.width;this._h=r.height;
        this._canvas.width=Math.round(r.width*d);this._canvas.height=Math.round(r.height*d);this._ctx?.setTransform(d,0,0,d,0,0);
      });this._resize.observe(this);
      this._intersection=new IntersectionObserver(entries=>{this._visible=entries[0].isIntersecting;if(this._visible&&this._active)this._start();else if(!this._visible)this._reset();});this._intersection.observe(this);
      this._update();
    }
    disconnectedCallback(){this._reset();this._abort?.abort();this._abort=null;this._resize?.disconnect();this._intersection?.disconnect();this._active=false;}
    attributeChangedCallback(){if(this.isConnected)this._update();}
    _update(){
      this._image.src=this.getAttribute('src')||'';this._image.alt=this.getAttribute('alt')||'AI 产品配图';
      this._def=defs[this.getAttribute('variant')]||defs.rocket;this.style.setProperty('--art-rgb',this._def.color);
    }
    _activate(active){this._active=active;if(active)this._enter=this._t;else this._target={x:0,y:0};this._start();}
    _start(){if(this._raf!==null||this._reduced||document.hidden||this._visible===false)return;this.removeAttribute('data-static');this._last=performance.now();this._raf=requestAnimationFrame(this._loop);}
    _stop(){if(this._raf!==null)cancelAnimationFrame(this._raf);this._raf=null;}
    _reset(){this._stop();this._energy=0;this._point={x:0,y:0};for(const [k,v]of Object.entries({'--x':'0px','--lift':'0px','--rx':'0deg','--ry':'0deg','--scale':'1','--energy':'0'}))this.style.setProperty(k,v);this._ctx?.clearRect(0,0,this._w,this._h);this.setAttribute('data-static','');}
    _loop(now){
      this._raf=null;if(!this.isConnected||this._reduced||document.hidden)return;
      const dt=Math.min((now-this._last)/1000,.05);this._last=now;this._t+=dt;const smoothing=1-Math.exp(-dt*8);
      this._energy+=((this._active?1:0)-this._energy)*smoothing;
      this._point.x+=(this._target.x-this._point.x)*smoothing;this._point.y+=(this._target.y-this._point.y)*smoothing;
      const e=this._energy,x=this._point.x*e,y=this._point.y*e;
      const vars={'--x':x*3+'px','--lift':(-e*3+y*1.2)+'px','--rx':-y*5+'deg','--ry':x*6+'deg','--scale':1+e*.027,'--energy':e,'--mx':50+x*30+'%','--my':63+y*17+'%','--sweep':-48+Math.min(1,(this._t-this._enter)/1.1)*96};
      for(const [key,value]of Object.entries(vars))this.style.setProperty(key,String(value));
      this._draw();
      if(!this._active&&e<.008){this._reset();return;}this._raf=requestAnimationFrame(this._loop);
    }
    _draw(){
      const c=this._ctx,w=this._w,h=this._h,e=this._energy;if(!c||!this._def)return;c.clearRect(0,0,w,h);if(e<.01)return;
      const color=this._def.color;c.save();c.globalCompositeOperation='lighter';
      this._def.paths.forEach((p,index)=>{
        const scaled=p.map(([x,y])=>[x*w,y*h]);
        c.beginPath();c.moveTo(...scaled[0]);c.bezierCurveTo(...scaled[1],...scaled[2],...scaled[3]);c.lineWidth=.7;c.strokeStyle=`rgba(${color},${e*.16})`;c.stroke();
        for(let j=0;j<18;j++){
          const phase=((this._t*.45+index*.23-j*.009)%1+1)%1,pos=bezier(scaled,phase),alpha=e*(1-j/18)*.7;
          c.fillStyle=`rgba(207,231,255,${alpha})`;c.shadowColor=`rgb(${color})`;c.shadowBlur=j<3?6:2;
          c.beginPath();c.arc(pos[0],pos[1],j<3?1.2:.7,0,Math.PI*2);c.fill();
        }
      });
      for(let i=0;i<6;i++){
        const x=w*(.18+(i*.137)% .68),y=h*(.37+(i*.121)% .46),a=e*(.25+Math.max(0,Math.sin(this._t*2.8+i))* .5);
        c.strokeStyle=`rgba(255,255,255,${a})`;c.lineWidth=.7;c.shadowColor=`rgb(${color})`;c.shadowBlur=5;c.beginPath();c.moveTo(x-2,y);c.lineTo(x+2,y);c.moveTo(x,y-2);c.lineTo(x,y+2);c.stroke();
      }c.restore();
    }
  }
  customElements.define('panda-product-art',ProductArt);
})();
