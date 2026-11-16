/* PandaMobo · spatial choreography v2. GPU pearl + compositor transforms. */
(() => {
  'use strict';
  if (customElements.get('panda-service-scene')) return;
  const MATERIAL_BASE = new URL('./service-materials/', document.currentScript?.src || document.baseURI);
  const TAU = Math.PI * 2;
  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const smooth = t => {t=clamp(t);return t*t*(3-2*t);};
  const mix = (a,b,t) => a+(b-a)*t;
  const services = {
    'ad-asset-operations': {type:'media',name:'优质媒介服务',labels:['开户接入','AM 诊断','账户梳理'],accent:[82,122,241]},
    'media-operations': {type:'ads',name:'智能代投管家',labels:['策略定制','原生素材','多渠道投放'],accent:[144,110,230]},
    'global-brand-marketing': {type:'brand',name:'品牌出海全案',labels:['把脉定位','创意表达','策略推导'],accent:[213,147,132]},
    'strategic-studio': {type:'insight',name:'全球商业智库',labels:['细分数据','专业诊断','行业解析'],accent:[93,155,176]}
  };
  let sequence=0;
  const frame = (body,id,view='0 0 200 180') => `<svg viewBox="${view}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="${id}-paper" x1="20" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset=".5" stop-color="#fcfdff"/><stop offset="1" stop-color="#eaf0fa"/></linearGradient>
    <linearGradient id="${id}-foil" x1="20" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse"><stop stop-color="#fafcff"/><stop offset=".2" stop-color="#d7e2f5"/><stop offset=".4" stop-color="#faf9ff"/><stop offset=".53" stop-color="#dfd0f4"/><stop offset=".67" stop-color="#fae1d8"/><stop offset=".82" stop-color="#c8f0f3"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="${id}-ink" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse"><stop stop-color="#8b96ab"/><stop offset=".4" stop-color="#4d5a73"/><stop offset="1" stop-color="#202f4b"/></linearGradient>
    <linearGradient id="${id}-tint"><stop stop-color="#e7e4fb"/><stop offset=".5" stop-color="#c8dcff"/><stop offset="1" stop-color="#e4e3f6"/></linearGradient>
    <filter id="${id}-shadow" x="-50%" y="-50%" width="200%" height="230%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#415a92" flood-opacity=".16"/></filter>
  </defs>${body}</svg>`;
  const paper = id => `url(#${id}-paper)`;
  const shadow = id => `url(#${id}-shadow)`;
  const card = (id,x,y,w,h,content,angle=0) => `<g transform="translate(${x} ${y}) rotate(${angle} ${w/2} ${h/2})" filter="${shadow(id)}"><rect x="0" y="3" width="${w}" height="${h}" rx="7" fill="#dce5f4"/><rect width="${w}" height="${h}" rx="7" fill="${paper(id)}" stroke="#fff" stroke-width="1.6"/>${content}</g>`;
  const avatar = (x,y,r=7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9aa7bd"/><path d="M${x-r} ${y+r+8}q${r} -9 ${r*2} 0" stroke="#a6b3c7" stroke-width="4" stroke-linecap="round"/>`;
  const bars = (x,y,w=40) => `<path d="M${x} ${y}h${w}M${x} ${y+9}h${w*.7}" stroke="#cbd4e3" stroke-width="4" stroke-linecap="round"/>`;
  function mediaParts(id){
    const left=card(id,22,63,138,62,avatar(20,21,5)+bars(39,18,75),-11)+card(id,33,116,137,56,avatar(20,19,5)+bars(39,16,70),8);
    const core=`<canvas class="surface" aria-hidden="true"></canvas><div class="credential">${frame(card(id,26,80,148,58,`<circle cx="25" cy="29" r="13" fill="#9ca9bf"/><text x="25" y="33" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#fff">AM</text>${bars(51,23,72)}<path d="M14 49h119" stroke="#f1f4fa"/>`,-7),id)}</div><div class="scan"></div>`;
    const right=`<path d="M18 95h21m0 0v-48h25m-25 48h25m-25 0v48h25" stroke="#cad3e3" stroke-width="1.5"/>`+[44,94,144].map((y,i)=>card(id,62,y-20,116,38,`<circle cx="16" cy="17" r="5" fill="${i===0?'#9daef1':'#aab6c9'}"/>${bars(31,13,57)}`,-4)).join('');
    return [frame(left,id+'l'),core,frame(right,id+'r')];
  }
  function adParts(id){
    const left=card(id,35,50,128,105,`<path d="M20 25h57M20 36h85" stroke="#a8b6cf" stroke-width="4" stroke-linecap="round"/><circle cx="39" cy="73" r="17" fill="#dbe4fc"/><circle cx="39" cy="73" r="7" fill="#8398d0"/><path d="M69 64h35M69 76h22M69 88h41" stroke="#b8c5db" stroke-width="4" stroke-linecap="round"/>`,-9);
    const creative=(cls,x,y,angle,body)=>`<g class="${cls}" transform="translate(${x} ${y}) rotate(${angle} 47 67)">${card(id,0,0,94,133,body)}</g>`;
    const core=frame(`<g class="fan fan-a">${creative('',44,39,-16,`<path d="M10 105Q24 37 48 75T84 38V121H10Z" fill="#dce4f7"/><path d="M10 111Q48 62 84 95v26H10Z" fill="#9daee6"/>`)}</g><g class="fan fan-c">${creative('',62,32,16,`<rect x="10" y="12" width="74" height="105" rx="4" fill="#e8e5f7"/><path d="M39 46l28 19-28 19Z" fill="#a898d2"/>`)}</g><g class="fan fan-b">${creative('',50,28,0,`<rect x="10" y="12" width="74" height="108" rx="4" fill="url(#${id}-foil)"/><path d="M23 100Q14 65 42 49T71 25M31 105Q78 81 69 49" stroke="#fbfdff" stroke-width="16" stroke-linecap="round"/><path d="M23 100Q14 65 42 49T71 25" stroke="#7f8fb7" stroke-opacity=".45" stroke-width="1"/>`)}</g>`,id);
    const right=`<path d="M17 91h24V45h22M41 91h22M41 91v46h22" stroke="#c6cfe1" stroke-width="1.5"/>`+[45,91,137].map((y,i)=>card(id,61,y-17,115,34,`<${i===0?'circle cx="16" cy="16" r="5"':i===1?'rect x="11" y="11" width="10" height="10" rx="2"':'path d="M12 12l10 5-10 5Z"'} fill="${['#b8a5dc','#9daee1','#afc7d4'][i]}"/><path d="M33 13h59M33 21h40" stroke="#c2cddd" stroke-width="3" stroke-linecap="round"/>`,-3)).join('');
    return [frame(left,id),core,frame(right,id)];
  }
  function brandParts(id){
    const left=card(id,38,36,120,117,`<path d="M16 24h56M16 34h81" stroke="#aab4c5" stroke-width="4" stroke-linecap="round"/><circle cx="61" cy="79" r="29" stroke="#d4dce9"/><circle cx="61" cy="79" r="16" stroke="#b9c6dd"/><circle cx="61" cy="79" r="5" fill="#d4a9a9"/><path d="M61 42v9m37 28h-9M61 116v-9M24 79h9" stroke="#a4b3ca" stroke-width="1.4"/>`,-9);
    const core=`<canvas class="surface" aria-hidden="true"></canvas><div class="ribbon-marks"><span></span><span></span><span></span></div>`;
    const right=[0,1,2].map((i)=>card(id,14+i*51,62-i*11,47,88,`<text x="12" y="23" font-family="Arial,sans-serif" font-size="12" fill="#7e8ca5">0${i+1}</text><path d="M12 44h22M12 53h16M12 62h20" stroke="#c9d3e3" stroke-width="3" stroke-linecap="round"/>`,3-i*4)).join('')+`<path d="M45 160h106m0 0-5-4m5 4-5 4" stroke="#b5c2d8" stroke-width="1.3"/>`;
    return [frame(left,id),core,frame(right,id)];
  }
  function insightParts(id){
    const left=[0,1,2].map(i=>card(id,31+i*6,35+i*34,133,31,`<circle cx="15" cy="14" r="4" fill="${['#c1a9d7','#a4c1d2','#b9c0db'][i]}"/><path d="M29 11h79M29 19h55" stroke="#bdc9db" stroke-width="3" stroke-linecap="round"/>`,-9+i*4)).join('');
    const core=frame(`<g class="data-strips">${[0,1,2,3,4].map(i=>`<path d="M${29+i*3} ${31+i*9}h${105-i*8}" stroke="#b9c5d9" stroke-opacity="${.22+i*.06}" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`+card(id,30,56,138,114,`<path d="M17 21h51" stroke="#a6b2c8" stroke-width="4" stroke-linecap="round"/><path d="M16 84L39 66l18 6 22-35 18 14 24-20" stroke="#a8b6d3" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 84L39 66l18 6 22-35 18 14 24-20v68H16Z" fill="url(#${id}-foil)" fill-opacity=".34"/><circle class="insight-dot" cx="79" cy="37" r="4" fill="#b099d3"/><path d="M17 100h65" stroke="#d4dce8" stroke-width="3" stroke-linecap="round"/>`,-6)+`<circle class="insight-halo" cx="108" cy="91" r="27" stroke="#d5dff1" stroke-width=".8"/>`,id);
    const right=card(id,34,35,137,120,`<path d="M17 23h78M17 33h56" stroke="#bac6d8" stroke-width="3.5" stroke-linecap="round"/><path d="M25 77h29l13-19h39M54 77l13 19h39" stroke="#a6b8cc" stroke-width="1.5"/><circle cx="25" cy="77" r="5" fill="#c4d8dc"/><circle cx="106" cy="58" r="5" fill="#b9c1d7"/><circle cx="106" cy="96" r="5" fill="#bfafd1"/>`,6);
    return [frame(left,id),core,frame(right,id)];
  }
  // Static vertex buffer; material shading and deformation run on the GPU.
  class PearlSurface {
    constructor(canvas, type) {
      this.canvas=canvas;this.type=type==='media'?0:1;
      const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});
      this.gl=gl;if(!gl)throw new Error('WebGL unavailable');
      const vertex=`precision highp float;
        attribute vec2 aUV;uniform float uTime;uniform float uKind;uniform vec2 uPointer;
        varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUV;
        vec3 shape(vec2 uv){float u=uv.x*6.2831853,v=uv.y;
          if(uKind<.5){float twist=u*.5+.28;float r=.53+v*.115*cos(twist);return vec3(r*cos(u),r*sin(u)*1.46,v*.20*sin(twist)+.045*sin(u));}
          float turn=u*1.25+uTime*.055;return vec3(sin(turn)*.24+v*cos(turn)*.29,(uv.x-.5)*1.68,cos(turn)*.19+v*sin(turn)*.29);
        }
        mat3 rotation(){float a=-.42+uPointer.x*.10,b=-.10-uPointer.y*.035;float ca=cos(a),sa=sin(a),cb=cos(b),sb=sin(b);return mat3(ca,0.,-sa,0.,1.,0.,sa,0.,ca)*mat3(1.,0.,0.,0.,cb,sb,0.,-sb,cb);}
        void main(){vec3 p=shape(aUV);vec3 du=shape(aUV+vec2(.0005,0.))-p,dv=shape(aUV+vec2(0.,.0005))-p;mat3 r=rotation();p=r*p;vNormal=normalize(r*cross(du,dv));vPosition=p;vUV=aUV;
          float persp=3.8/(3.8-p.z);gl_Position=vec4(p.x*1.30*persp,p.y*.94*persp,-p.z*.35,1.);
        }`;
      const fragment=`precision highp float;
        uniform float uTime;varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUV;
        void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 view=normalize(vec3(0.,0.,3.)-vPosition);vec3 light=normalize(vec3(-.7,1.,1.8));
          float ndv=abs(dot(n,view)),fresnel=pow(1.-ndv,2.);float diffuse=.94+.06*max(0.,dot(n,light));
          float film=vUV.x*8.5+dot(n,view)*4.4+vUV.y*1.15+uTime*.025;
          vec3 spectral=.86+.13*cos(film+vec3(.2,2.2,4.3));
          vec3 base=mix(vec3(.972,.978,.994),spectral,.10+fresnel*.12)*diffuse;
          vec3 halfVector=normalize(light+view);float spec=pow(max(0.,dot(n,halfVector)),38.);
          base+=vec3(.27,.28,.30)*spec;
          float edge=smoothstep(.92,1.,abs(vUV.y));base=mix(base,vec3(.99,1.,1.),edge*.72);
          gl_FragColor=vec4(base,1.);
        }`;
      const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
      const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      this.program=program;this.buffer=gl.createBuffer();const vertices=[];
      for(let i=0;i<96;i++)for(let j=0;j<10;j++){const a=i/96,b=(i+1)/96,c=j/10*2-1,d=(j+1)/10*2-1;vertices.push(a,c,b,c,b,d,a,c,b,d,a,d);}
      this.count=vertices.length/2;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
      this.position=gl.getAttribLocation(program,'aUV');this.time=gl.getUniformLocation(program,'uTime');this.kind=gl.getUniformLocation(program,'uKind');this.pointer=gl.getUniformLocation(program,'uPointer');
      const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(200*d);canvas.height=Math.round(260*d);
      gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
    }
    draw(time,pointer){const gl=this.gl;if(!gl||gl.isContextLost())return;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,2,gl.FLOAT,false,0,0);gl.uniform1f(this.time,time);gl.uniform1f(this.kind,this.type);gl.uniform2f(this.pointer,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLES,0,this.count);}
    dispose(){if(this.gl){this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);this.gl=null;}}
  }

  class ServiceScene extends HTMLElement {
    static get observedAttributes(){return ['kind','expanded','paused'];}
    constructor(){
      super();this.attachShadow({mode:'open'});this._id='pmss'+(++sequence);this._p=0;this._velocity=0;this._target=0;this._time=0;this._raf=null;this._last=0;this._drawLast=0;this._w=0;this._h=0;this._visible=false;this._pointer={x:0,y:0};this._aim={x:0,y:0};this._hover=false;this._phase=0;this._frame=this._frame.bind(this);
    }
    connectedCallback(){
      if(this._abort)return;
      this._abort=new AbortController();const signal=this._abort.signal;
      this._mq=matchMedia('(prefers-reduced-motion:reduce)');this._reduced=this._mq.matches;
      this._coarse=matchMedia('(pointer:coarse)').matches;
      this._build();this._p=this._target;
      this._resize=new ResizeObserver(()=>this._measure());this._resize.observe(this);
      this._intersection=new IntersectionObserver(entries=>{this._visible=entries[0].isIntersecting;if(this._visible)this._start();else {this._stop();this._p=this._target;this._velocity=0;this._render();}},{rootMargin:'40px'});this._intersection.observe(this);
      this._card=this.closest('[data-service-card],.svc-panel')||this;
      this._card.addEventListener('pointermove',e=>{if(this._reduced||e.pointerType==='touch')return;const r=this._card.getBoundingClientRect();this._aim={x:clamp((e.clientX-r.left)/r.width*2-1,-1,1),y:clamp((e.clientY-r.top)/r.height*2-1,-1,1)};this._hover=true;this._start();},{signal});
      this._card.addEventListener('pointerleave',()=>{this._aim={x:0,y:0};this._hover=false;},{signal});
      this._card.addEventListener('focusin',()=>{this._hover=true;this._start();},{signal});
      this._card.addEventListener('focusout',e=>{if(!this._card.contains(e.relatedTarget)){this._hover=false;this._aim={x:0,y:0};}},{signal});
      this._mq.addEventListener('change',e=>{this._reduced=e.matches;this._p=this._target;this._velocity=0;this._aim={x:0,y:0};this._pointer={x:0,y:0};this._stop();this._render();this._start();},{signal});
      document.addEventListener('visibilitychange',()=>document.hidden?this._stop():this._start(),{signal});
      this._measure();
    }
    disconnectedCallback(){this._stop();this._material?.dispose();this._material=null;this._abort?.abort();this._abort=null;this._resize?.disconnect();this._intersection?.disconnect();this._visible=false;}
    attributeChangedCallback(name,oldValue,newValue){
      if(oldValue===newValue||!this._abort)return;
      if(name==='kind')this._build();
      if(name==='expanded'){this._target=this.getAttribute('expanded')==='true'?1:0;if(this._target)this._phase=this._time;if(this._reduced||!this._visible){this._p=this._target;this._velocity=0;this._render();}}
      if(name==='paused'&&this.hasAttribute('paused')){this._stop();this._render();}else this._start();
    }
    _build(){
      this._def=services[this.getAttribute('kind')]||services['ad-asset-operations'];
      this._target=this.getAttribute('expanded')==='true'?1:0;
      const id=this._id,type=this._def.type;
      let [left,core,right]=type==='media'?mediaParts(id):type==='ads'?adParts(id):type==='brand'?brandParts(id):insightParts(id);
      // Add each module's own scoped gradient definitions.
      if(type==='media'){
        left=left.replaceAll(id+'-paper',id+'l-paper').replaceAll(id+'-shadow',id+'l-shadow');
        right=right.replaceAll(id+'-paper',id+'r-paper').replaceAll(id+'-shadow',id+'r-shadow');
      }
      this.shadowRoot.innerHTML=`<style>
        :host{display:block;position:relative;width:100%;height:100%;min-width:0;contain:layout style;font-family:Inter,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;pointer-events:none}
        *{box-sizing:border-box}.stage{position:absolute;inset:0;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 50% 73%,#fdfdff65,transparent 68%)}
        .ground{position:absolute;left:12%;right:12%;height:17%;bottom:7%;border-radius:50%;background:radial-gradient(ellipse,#576f9e22,transparent 65%);filter:blur(8px);transform:scaleX(var(--ground,1))}
        .module{position:absolute;width:200px;height:180px;left:0;top:0;transform-origin:50% 50%;will-change:transform;backface-visibility:hidden}
        .module svg{width:100%;height:100%;overflow:visible;display:block}.core{z-index:3;height:260px}.left,.right{z-index:2}.wires{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
        .material-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;opacity:0;transition:opacity .25s}.surface-fallback{position:absolute;left:24%;top:6%;width:52%;height:81%;border:17px solid #e4e6f0;border-radius:50%;box-shadow:inset 3px 0 9px #eadbfa,3px 4px 12px #c9d5ee66}.surface-fallback.brand{width:42%;left:32%;border-radius:20%;transform:rotate(-14deg)}.surface{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.credential{position:absolute;inset:0;filter:drop-shadow(1px 3px 5px #718abf12)}
        .scan{position:absolute;left:23%;right:12%;height:1px;top:var(--scan-y,52%);background:linear-gradient(90deg,transparent,#cbb9f5,#94dafa,#fff,transparent);box-shadow:0 0 7px #92cffc99;opacity:var(--scan-a,0)}
        .ribbon-marks{position:absolute;left:39%;top:42%;width:33%;transform:rotate(-15deg);opacity:.6}.ribbon-marks span{display:block;height:2px;background:#aab2c6;margin:4px 0;width:78%;border-radius:2px}.ribbon-marks span:nth-child(2){width:55%}.ribbon-marks span:nth-child(3){width:66%;margin-top:23px;background:#c0c3cd}
        .fan-a{transform-origin:95px 160px;transform:rotate(calc(var(--fan,0)*-11deg))}.fan-c{transform-origin:95px 160px;transform:rotate(calc(var(--fan,0)*11deg))}.fan-b{transform:translateY(calc(var(--fan,0)*-5px))}
        .insight-halo{transform-origin:108px 91px;transform:translate(var(--halo-x,0px),var(--halo-y,0px));opacity:var(--halo-a,.5)}
        .label{position:absolute;top:0;left:0;white-space:nowrap;font-size:11.5px;line-height:1.4;font-weight:500;letter-spacing:.45px;color:#4e5b73;z-index:4;text-align:center;pointer-events:none;will-change:transform,opacity}
        .label.core-label{color:#4a5d7e}.label.core-label:before{content:'';display:inline-block;width:4px;height:4px;background:#9fafff;border-radius:50%;margin-right:6px;vertical-align:middle}
        .serial{display:none;position:absolute;left:50%;bottom:6%;transform:translateX(-50%);font-size:9px;letter-spacing:2.4px;color:#a1adc0;opacity:var(--serial-a,.55);white-space:nowrap}
        @media(prefers-reduced-motion:reduce){.module,.label{will-change:auto}.scan{display:none}}
      </style><div class="stage" aria-hidden="true"><span class="ground"></span><canvas class="wires"></canvas><div class="module left">${left}</div><div class="module core">${core}</div><div class="module right">${right}</div><span class="label left-label">${this._def.labels[0]}</span><span class="label core-label">${this._def.labels[1]}</span><span class="label right-label">${this._def.labels[2]}</span><span class="serial">${['CONNECT / ORGANIZE','CREATE / DISTRIBUTE','DEFINE / EXPRESS','RESEARCH / ADVISE'][Object.values(services).indexOf(this._def)]}</span></div>`;
      this._stage=this.shadowRoot.querySelector('.stage');this._nodes=['left','core','right'].map(s=>this.shadowRoot.querySelector('.'+s));this._labels=['left-label','core-label','right-label'].map(s=>this.shadowRoot.querySelector('.'+s));
      this._canvas=this.shadowRoot.querySelector('.wires');this._ctx=this._canvas.getContext('2d');this._surface=this.shadowRoot.querySelector('.surface');this._material?.dispose();this._material=null;
      if(this._surface){try{this._material=new PearlSurface(this._surface,type);}catch(error){this._surface.style.display='none';const fallback=document.createElement('div');fallback.className='surface-fallback '+type;this._nodes[1].prepend(fallback);}}
      this._artImageLoaded=false;
      {
        const photo=document.createElement('img');photo.className='material-photo';photo.alt='';photo.decoding='async';
        photo.addEventListener('load',()=>{this._artImageLoaded=true;photo.style.opacity='1';if(this._surface)this._surface.style.visibility='hidden';else this._nodes[1].querySelector('svg').style.visibility='hidden';this.shadowRoot.querySelector('.surface-fallback')?.remove();this._material?.dispose();this._material=null;},{once:true,signal:this._abort.signal});
        this._nodes[1].append(photo);
        if(type==='media')this._nodes[1].querySelector('.credential').before(photo);
        const files={media:'diagnostic-gate.png',brand:'brand-ribbon.png',ads:'creative-rack.png',insight:'insight-reports.png'};
        photo.src=new URL(files[type],MATERIAL_BASE).href;
      }
      const glow=document.createElement('canvas');glow.width=glow.height=32;const gc=glow.getContext('2d');if(gc){const gradient=gc.createRadialGradient(16,16,0,16,16,16);gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.16,'rgba('+this._def.accent.join(',')+',.8)');gradient.addColorStop(.5,'rgba('+this._def.accent.join(',')+',.16)');gradient.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gradient;gc.fillRect(0,0,32,32);}this._glow=glow;
      this._canvas.width=1024;this._canvas.height=768;
      if(this._w)this._measure();
    }
    _measure(){
      const r=this.getBoundingClientRect();this._w=r.width;this._h=r.height;
      // The backing stores stay fixed while CSS width is animated.
      if(!this._visible){this._p=this._target;this._velocity=0;this._render();}else if(this._reduced||this.hasAttribute('paused'))this._render();else this._start();
    }
    _start(){if(!this._abort||!this._visible||document.hidden||this._reduced||this.hasAttribute('paused')||this._raf!==null)return;this._last=performance.now();this._drawLast=0;this._raf=requestAnimationFrame(this._frame);}
    _stop(){if(this._raf!==null)cancelAnimationFrame(this._raf);this._raf=null;}
    _frame(now){
      this._raf=null;if(!this._abort||!this._visible||document.hidden||this._reduced||this.hasAttribute('paused'))return;
      const fps=this._coarse?30:120;
      if(!this._coarse || now-this._drawLast>=1000/fps){
        const dt=Math.min((now-this._last)/1000,.045);this._last=now;this._drawLast=now;this._time+=dt;
        // Critically damped spring remains continuous when reversed halfway.
        this._velocity+=(this._target-this._p)*108*dt-this._velocity*19*dt;this._p=clamp(this._p+this._velocity*dt,-.01,1.01);
        if(Math.abs(this._p-this._target)<.0008&&Math.abs(this._velocity)<.008){this._p=this._target;this._velocity=0;}
        const s=1-Math.exp(-dt*5);this._pointer.x+=(this._aim.x-this._pointer.x)*s;this._pointer.y+=(this._aim.y-this._pointer.y)*s;
        this._render();
      }
      // Closed cards settle into a static sculpture; only active scenes loop.
      if(this._target===0&&this._p===0&&!this._hover&&Math.abs(this._pointer.x)+Math.abs(this._pointer.y)<.003)return;
      this._raf=requestAnimationFrame(this._frame);
    }
    _render(){
      if(!this._w||!this._h||!this._nodes)return;
      const w=this._w,h=this._h,p=clamp(this._p),spread=smooth((p-.08)/.86),safe=Math.min(50,h*.215),available=h-safe-22;
      const u=Math.max(28,Math.min(140,w/(1.42+2.64*p),available/1.65));
      const mx=this._reduced?0:this._pointer.x,my=this._reduced?0:this._pointer.y;
      const breathe=this._reduced||this.hasAttribute('paused')?0:Math.sin(this._time*.8)*1.2*p;
      const cy=safe+available*mix(.47,.40,p)+breathe,cx=w*.5+mx*3*p;
      const lp=smooth((p-.12)/.75),rp=smooth((p-.3)/.67);
      const lx=mix(cx-8,w*.175,lp),rx=mix(cx+8,w*.825,rp);
      const ly=cy+mix(-10,3,lp),ry=cy+mix(6,0,rp);
      const layouts=[{x:lx,y:ly,w:u*1.36,h:u*1.24,s:mix(.65,1,lp),r:mix(-8,-5,lp),a:mix(.1,1,lp)},{x:cx,y:cy,w:u*1.28,h:u*1.66,s:1,r:mx*2,a:1},{x:rx,y:ry,w:u*1.43,h:u*1.28,s:mix(.6,1,rp),r:mix(9,3,rp),a:mix(.12,1,rp)}];
      layouts.forEach((n,i)=>{const node=this._nodes[i],bw=200,bh=i===1?260:180;node.style.transform=`translate3d(${n.x-bw/2}px,${n.y-bh/2}px,0) perspective(900px) rotateX(${-my*3*p}deg) rotateY(${mx*(i===1?5:8)*p}deg) rotateZ(${n.r}deg) scale(${n.w/bw*n.s},${n.h/bh*n.s})`;node.style.opacity=String(n.a);});
      const labelY=mix(Math.min(h-28,cy+u*.72+14),h-37,p),labelOpacity=smooth((p-.57)/.3);
      [lx,cx,rx].forEach((x,i)=>{const label=this._labels[i];label.style.transform=`translate(${x}px,${labelY}px) translateX(-50%)`;label.style.opacity=String(i===1?labelOpacity:labelOpacity);});
      const phase=this._time-this._phase;
      this._stage.style.setProperty('--serial-a',String(1-smooth(p*2)));
      this._stage.style.setProperty('--fan',String(spread+(this._hover?mx*.1:0)));
      this._stage.style.setProperty('--scan-y',(45+(this._reduced?0:Math.sin(phase*1.4)*10))*1+'%');
      this._stage.style.setProperty('--scan-a',String(p*.8));
      this._stage.style.setProperty('--ground',String(.8+spread*.3));
      this._stage.style.setProperty('--halo-x',mx*6+'px');this._stage.style.setProperty('--halo-y',my*5+'px');this._stage.style.setProperty('--halo-a',String(.25+p*.5));
      this._wireGeometry={w,h,p,spread,lx,rx,cx,cy,u,safe};this._drawWires();
      if(this._surface&&!this._artImageLoaded)this._material?.draw(this._reduced||this.hasAttribute('paused')?0:this._time,this._pointer);
    }
    _drawWires(){
      const c=this._ctx;if(!c)return;const {w,h,p,spread,lx,rx,cx,cy,u,safe}=this._wireGeometry;c.setTransform(1024/w,0,0,768/h,0,0);c.clearRect(0,0,w,h);if(p<.04)return;
      c.save();c.beginPath();c.rect(0,safe,w,h-safe);c.clip();
      const rgb=this._def.accent,colors=['#b8b4e4','#b1d9e9','#dec3c4'];
      const paths=[];
      for(let i=0;i<3;i++){
        const offset=(i-1)*u*.2;
        paths.push([[lx+u*.25,cy+offset],[cx-u*.58,cy+offset],[cx-u*.45,cy+offset*.35],[cx,cy]]);
        paths.push([[cx,cy],[cx+u*.55,cy],[rx-u*.55,cy+offset],[rx-u*.2,cy+offset]]);
      }
      const ease=smooth((p-.28)/.6);
      for(let i=0;i<paths.length;i++){
        const points=paths[i];c.beginPath();c.moveTo(...points[0]);c.bezierCurveTo(...points[1],...points[2],...points[3]);c.strokeStyle=colors[i%3];c.globalAlpha=.70*ease;c.lineWidth=.75;c.stroke();
        if(this._reduced||this.hasAttribute('paused'))continue;
        for(let j=0;j<12;j++){
          const phase=((this._time*.23+i*.143-j*.007)%1+1)%1,s=1-phase;
          const x=s*s*s*points[0][0]+3*s*s*phase*points[1][0]+3*s*phase*phase*points[2][0]+phase**3*points[3][0];
          const y=s*s*s*points[0][1]+3*s*s*phase*points[1][1]+3*s*phase*phase*points[2][1]+phase**3*points[3][1];
          c.globalAlpha=(1-j/12)*ease*.85;c.shadowBlur=0;if(j===0)c.drawImage(this._glow,x-8,y-8,16,16);else{c.fillStyle=j<3?'#fff':`rgb(${rgb.join(',')})`;c.beginPath();c.arc(x,y,j<3?1:.5,0,TAU);c.fill();}
        }
      }
      // A quiet stage line echoes the approved editorial layout.
      c.shadowBlur=0;c.globalAlpha=ease*.5;c.strokeStyle='#a6b2c9';c.lineWidth=.65;
      const baseline=h-51;c.beginPath();c.moveTo(lx,baseline);c.lineTo(rx,baseline);c.stroke();
      const activeStage=Math.floor(((this._time-this._phase)%7.2)/2.4);
      [lx,cx,rx].forEach((x,i)=>{c.globalAlpha=ease;c.fillStyle=i===activeStage?'#8ea5ee':'#b6bfce';c.beginPath();c.arc(x,baseline,i===activeStage?2.2:1.8,0,TAU);c.fill();});
      // A return strand describes the iteration loop in media buying.
      if(this._def.type==='ads'){
        c.globalAlpha=.24*ease;c.shadowBlur=0;c.strokeStyle='#baa9d8';c.lineWidth=.7;c.beginPath();c.moveTo(rx,cy+u*.3);c.bezierCurveTo(rx,cy+u*.9,lx,cy+u*.9,lx,cy+u*.3);c.stroke();
      }
      c.restore();
    }
  }
  customElements.define('panda-service-scene',ServiceScene);
})();
