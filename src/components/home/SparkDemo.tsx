"use client";
import { useEffect, useId, useRef, useState } from "react";
import "./spark-demo.css";
const DURATION = 6200;
const STEPS = [
 { name:"上传素材", title:"从一张产品图开始", note:"上传参考图，保留产品主体" },
 { name:"描述创意", title:"说清创意，设定投放场景", note:"描述画面，并选择比例与时长" },
 { name:"AI 生成", title:"把创意转成动态画面", note:"流程演示加速播放，非实际生成速度" },
 { name:"成片预览", title:"预览效果，继续迭代创意", note:"可再次编辑，生成更多素材版本" },
];
function BottleArt({ animated = false }: { animated?: boolean }) {
 const uid=useId().replace(/:/g, "");
 return <div className={`sd-art${animated?" is-ad":""}`}><svg viewBox="0 0 240 280" aria-hidden="true"><defs><linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff5df" stopOpacity=".95"/><stop offset=".4" stopColor="#e2af72" stopOpacity=".8"/><stop offset=".7" stopColor="#936732" stopOpacity=".85"/><stop offset="1" stopColor="#ffdfb1"/></linearGradient><linearGradient id={`${uid}-cap`}><stop stopColor="#34271d"/><stop offset=".5" stopColor="#8b704a"/><stop offset="1" stopColor="#2d211b"/></linearGradient></defs><ellipse cx="120" cy="248" rx="70" ry="10" fill="#513620" opacity=".18"/><g className="sd-bottle"><rect x="88" y="45" width="64" height="44" rx="5" fill={`url(#${uid}-cap)`}/><rect x="102" y="86" width="36" height="18" rx="3" fill="#e9d4b2"/><rect x="57" y="101" width="126" height="140" rx="18" fill={`url(#${uid}-glass)`} stroke="#fff5e3" strokeWidth="2"/><path d="M67 124v92q0 14 14 14" stroke="#fff5de" strokeWidth="3" opacity=".65" fill="none"/><rect x="73" y="137" width="94" height="70" rx="2" fill="#f7f0df"/><text x="120" y="163" textAnchor="middle" fill="#4e3b2c" fontFamily="Georgia,serif" fontSize="20" letterSpacing="5">AURA</text><text x="120" y="179" textAnchor="middle" fill="#9b856d" fontFamily="sans-serif" fontSize="6" letterSpacing="2">EAU DE PARFUM</text><path d="M106 189h28" stroke="#b8a285"/></g></svg><i className="sd-leaf sd-leaf-one"/><i className="sd-leaf sd-leaf-two"/><span className="sd-sunlight"/>{animated?<div className="sd-ad-copy"><small>THE SUMMER EDIT</small><strong>Make summer<br/>yours.</strong><span>发现你的夏日气息</span></div>:null}</div>;
}
export function SparkDemo() {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [beat, setBeat] = useState(0);
  const [revision, setRevision] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const track = useRef({ step: 0, elapsed: 0, epoch: 0 });
  const running = playing && visible && !hidden && !reduced;
  const select = (next: number) => {
    const value = (next + STEPS.length) % STEPS.length;
    track.current = { step: value, elapsed: 0, epoch: track.current.epoch + 1 };
    setBeat(0); setStep(value); setRevision(value => value + 1);
  };
  useEffect(() => {
    if (!root.current) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(media.matches); setHidden(document.hidden); };
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 });
    observer.observe(root.current); update();
    media.addEventListener("change", update); document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);
  useEffect(() => {
    if (!running) return;
    const current = track.current;
    const start = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const [at, value] of [[1300,1],[3000,2]] as const) {
      if (at > current.elapsed) timers.push(setTimeout(() => setBeat(value), at - current.elapsed));
      else setBeat(value);
    }
    timers.push(setTimeout(() => select(step + 1), Math.max(50,DURATION - current.elapsed)));
    return () => { timers.forEach(clearTimeout); if (track.current.epoch === current.epoch) track.current.elapsed = Math.min(DURATION,current.elapsed + performance.now() - start); };
  }, [step, revision, running]);
  const complete = beat === 2;
  const ready = step > 0 || complete;
  return <div ref={root} className="spark-demo" data-step={step} data-beat={beat} data-playing={running} data-reduced={reduced}>
    <div className="sd-demo-head"><span><i/>JoinSpark · 创意生成演示</span><b>模拟界面</b></div>
    <div className="sd-app" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${step}`}>
      <div className="sd-interface" aria-hidden="true">
        <div className="sd-topbar"><img src="/brand/joinspark-mark.png" alt=""/><strong>JoinSpark</strong><span>AI 创意工作台</span><b>创作空间 <i>J</i></b></div>
        <aside className="sd-nav"><span>⌂</span><span>✦</span><span className="is-active">▣</span><span>▤</span><span>▱</span><i>?</i></aside>
        <section className="sd-editor"><div className="sd-editor-title">创意生视频 <span>⌄</span></div><div className="sd-modes"><span>文生视频</span><b>图生视频</b></div><div className="sd-field-title">参考图片 <i>*</i></div><div className={`sd-upload${ready?" is-ready":""}`}>{ready?<><BottleArt/><span>product_reference.png <b>✓</b></span></>:<><b>＋</b><span>点击 / 拖拽上传</span><small>JPG · PNG · WEBP</small></>}</div><div className="sd-field-title">视频描述 <i>*</i><small>AI 优化提示词 ✦</small></div><div className={`sd-prompt${step>0&&beat>0?" is-filled":""}`}>{step>1 || (step===1&&beat>0)?<span className="sd-prompt-text">以参考图中的香水为主体，阳光穿过叶片，镜头缓慢推进，呈现清新的夏日氛围。</span>:<span>描述你想要的画面与镜头…</span>}</div><div className="sd-field-title">广告参数</div><div className="sd-options"><span>欧洲 ⌄</span><span>Facebook ⌄</span></div><div className="sd-settings"><span>10 秒 ⌄</span><span>9:16 ⌄</span><span>高清 ⌄</span></div><div className={`sd-create${step===1&&beat===2?" is-clicked":""}`}>✦ 开始创作 <span>→</span></div></section>
        <section className="sd-canvas"><div className="sd-canvas-heading"><span>{step===3?"成片预览":"创作预览"}</span><b>{step===3?"示例成片":"图生视频"}</b></div>
          {step<2?<div className="sd-preflight" key={ready?"ready":"empty"}>{ready?<><div className="sd-reference"><BottleArt/></div><strong>参考图已就绪</strong><span>添加创意描述，让画面动起来</span></>:<><div className="sd-empty-mark">✦</div><strong>让灵感，成为画面</strong><span>从一张产品参考图开始创作</span><div className="sd-capabilities"><i>图片</i><i>视频</i><i>音频</i><i>数字人</i></div></>}</div>:step===2?<div className="sd-generating"><div className="sd-render-preview"><BottleArt animated/><div className="sd-render-mask"/><i/></div><div className="sd-render-status"><span className="sd-spinner"/><strong>{complete?"画面合成完成":"AI 正在生成视频"}</strong><b>{complete?"100%":beat===1?"68%":"12%"}</b></div><div className="sd-render-track"><i style={{transform:`scaleX(${complete?1:beat===1?.68:.12})`}}/></div><div className="sd-render-stages"><span>✓ 解析参考图</span><span>{beat>0?"✓":"○"} 生成动态画面</span><span>{complete?"✓":"○"} 合成预览</span></div><small>演示已加速 · 实际用时以任务为准</small></div>:<div className="sd-result"><div className="sd-video"><BottleArt animated/><div className="sd-video-controls"><span>Ⅱ</span><i><b/></i><small>00:06 / 00:10</small></div><span className="sd-result-tag">✦ 示例广告</span></div><div className="sd-result-actions"><span>↶ 再次编辑</span><span>⟳ 重新生成</span><b>{complete?"✓ 示例已就绪":"↓ 导出视频"}</b></div></div>}
        </section>
        <aside className="sd-history"><strong>历史创作</strong>{[0,1,2].map((n)=><div className={`sd-history-item sd-history-${n}`} key={n}><BottleArt/><span>▷</span></div>)}<span>我的素材</span></aside>
        <div className="sd-cursor" data-done={complete}><svg viewBox="0 0 24 29"><path d="M3 2v21l5-5 4 8 4-2-4-8h8L3 2Z" fill="white" stroke="#64627e" strokeWidth="1.4" strokeLinejoin="round"/></svg><i/></div>
      </div>
    </div>
    <div className="sd-story"><strong>{STEPS[step].title}</strong><span>{STEPS[step].note}</span></div>
    <div className="sd-controls"><div role="tablist" aria-label="JoinSpark 创作流程" onKeyDown={event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?3:(step+(event.key==="ArrowRight"?1:3))%4;select(next);root.current?.querySelector<HTMLButtonElement>(`[data-sd-tab="${next}"]`)?.focus();}}>{STEPS.map((item,i)=><button type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={step===i} aria-controls={`${id}-panel`} tabIndex={step===i?0:-1} data-sd-tab={i} className={step===i?"is-active":""} onClick={()=>select(i)} key={item.name}><b>0{i+1}</b>{item.name}{step===i?<i className="sd-progress" key={revision}/>:null}</button>)}</div><button type="button" className="sd-play" aria-pressed={!playing} aria-label={playing?"暂停创作演示":"播放创作演示"} onClick={()=>setPlaying(value=>!value)}>{playing?"Ⅱ":"▷"}</button></div>
  </div>;
}
