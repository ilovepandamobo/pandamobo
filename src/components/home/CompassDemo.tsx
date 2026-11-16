"use client";
import { useEffect, useId, useRef, useState } from "react";
import "./compass-demo.css";
const DURATION = 6200;
const STEPS = [
 {name:"全域发布",title:"一份内容，多平台协同发布",note:"从公域内容，开启客户互动"},
 {name:"消息汇聚",title:"不同渠道的消息，进入同一工作台",note:"评论与私信集中查看"},
 {name:"AI 与团队",title:"AI 先接待，团队继续跟进",note:"回复、打标签、分配负责人"},
 {name:"客户与数据",title:"沟通沉淀为客户，数据支持复盘",note:"客户档案与团队数据，一处管理"},
];
const CHANNELS=[{name:"Facebook",src:"/brand/social-official/facebook.png"},{name:"Instagram",src:"/brand/social-official/instagram.svg"},{name:"WhatsApp",src:"/brand/social-official/whatsapp.svg"}];
function Channel({index}:{index:number}){return <img className="cd-channel" src={CHANNELS[index].src} alt=""/>;}
function CampaignArt(){return <div className="cd-campaign-art"><svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="180" fill="#e6d9fa"/><circle cx="236" cy="35" r="24" fill="#fff4d3"/><path d="M0 150 90 30 190 150Z" fill="#a5a3ce"/><path d="m90 30-34 44 32-10 26 11Z" fill="#faf8ff"/><path d="m110 160 105-106 85 106Z" fill="#7e8fb1"/><path d="m215 54-29 29 29-7 24 9Z" fill="#f4f2ff"/><path d="M0 131q65-30 131 3t169-4v50H0Z" fill="#c3d9e3"/><path d="M0 157q70-20 140 2t160-3" fill="none" stroke="#f5f2ff" strokeWidth="4"/></svg><span>YOUR NEXT<br/><b>ADVENTURE.</b><small>探索属于你的下一程</small></span></div>;}
export function CompassDemo(){
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
  const complete=beat===2;
  return <div ref={root} className="compass-demo" data-step={step} data-beat={beat} data-playing={running} data-reduced={reduced}>
    <div className="cd-demo-head"><span><i/>JoinCompass · 运营流程演示</span><b>示例数据</b></div>
    <div className="cd-app" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${step}`}>
      <div className="cd-interface" aria-hidden="true">
        <div className="cd-topbar"><img src="/brand/joincompass-logo.png" alt=""/><span>全域运营工作台</span><div><i/>演示空间 <b>J</b></div></div>
        <aside className="cd-nav">{["内容发布","消息中心","AI 与团队","客户数据"].map((item,i)=><div key={item} className={step===i?"is-active":""}><b>{["↗","▣","✦","▤"][i]}</b>{item}{i===1?<i/>:null}</div>)}<span>WORKSPACE</span><small>⚙ 团队设置</small></aside>
        <div className="cd-workspace" key={step}>
          <div className="cd-page-title"><strong>{["内容发布","统一消息中心","AI 接待与团队协作","客户与运营数据"][step]}</strong><span>{step<3?"公域运营 → 私域承接":"近 7 天 · 示例数据"}</span></div>
          {step===0?<div className="cd-publish"><div className="cd-compose"><div className="cd-label">选择发布账号</div><div className="cd-channel-picks">{CHANNELS.slice(0,2).map((item,i)=><div key={item.name}><Channel index={i}/><span>{item.name}</span><b>✓</b></div>)}</div><div className="cd-label">贴文内容</div><div className="cd-compose-text">下一程，向世界出发。<br/>探索山海与城市，开启你的夏日旅程。<span>#SummerJourney #ExploreMore</span></div><div className="cd-asset"><CampaignArt/><span>summer_campaign.png <b>✓ 素材已添加</b></span></div><div className={`cd-primary${beat===1?" is-pressing":""}`}>{complete?"✓ 已发布至 2 个平台":"↗ 一键发布"}<span>→</span></div></div><div className="cd-post-preview"><div className="cd-label">贴文预览</div><div className="cd-post"><div className="cd-post-brand"><i>A</i><b>Adventure Studio<small>品牌官方账号 · 示例</small></b><Channel index={0}/></div><p>下一程，向世界出发。<br/>Start your next adventure.</p><CampaignArt/><div className="cd-post-footer">♡ 喜欢　 ◇ 评论　 ↗ 分享</div></div>{complete?<div className="cd-publish-success"><b>✓</b><span>发布完成<small>Facebook · Instagram</small></span></div>:<span className="cd-preview-note">内容与账号，统一管理</span>}</div></div>:null}
          {step===1||step===2?<div className="cd-inbox"><div className="cd-conversations"><div className="cd-inbox-filter">全部消息 <b>{step===1&&beat===0?"2":"3"}</b><span>⌕</span></div>{["Emma Wilson","David Kim","Sofia Lee"].map((name,i)=><div key={name} className={`cd-person${i===0?" is-selected":""}${i===0&&step===1&&beat>0?" is-new":""}`}><div className={`cd-avatar cd-avatar-${i}`}>{["EW","DK","SL"][i]}<Channel index={[2,0,1][i]}/></div><span><b>{name}</b><small>{["Is this trip still available?","Can you share more details?","Thank you for your reply!"][i]}</small></span><i>{i===0?"刚刚":"09:30"}</i></div>)}<div className="cd-channel-summary">统一接入<Channel index={0}/><Channel index={1}/><Channel index={2}/></div></div><div className="cd-chat"><div className="cd-chat-head"><span className="cd-avatar cd-avatar-0">EW</span><b>Emma Wilson<small><Channel index={2}/>WhatsApp · 英语</small></b><i>● 在线</i></div><div className="cd-chat-body"><span className="cd-chat-time">今天 09:41 · 示例对话</span>{(step===2||beat>0)?<div className="cd-message is-incoming">Hi, is the summer trip still available?<small>你好，夏日旅行还有名额吗？</small></div>:<div className="cd-wait-message"><i/><span>新消息接入中…</span></div>}{step===1&&complete?<div className="cd-source-hint"><Channel index={2}/>已关联渠道与客户，等待接待</div>:null}{step===2&&beat===0?<div className="cd-ai-thinking"><i/><i/><i/><span>AI 正在准备回复</span></div>:null}{step===2&&beat>0?<><div className="cd-message is-outgoing">Hi Emma! Yes, places are available.<br/>Which dates work best for you?<small>AI 自动回复 · 已发送 ✓✓</small></div><div className="cd-tags"><span>✦ AI 标签</span><b>旅行咨询</b><b>英语客户</b></div></>:null}{step===2&&complete?<div className="cd-handoff"><i>JL</i><span>已分配给顾问 Jenny<small>完整对话与客户标签同步交接</small></span><b>✓</b></div>:null}</div><div className="cd-chat-input"><span>输入消息，或使用 AI 建议…</span><b>➤</b></div></div></div>:null}
          {step===3?<div className="cd-insights"><div className="cd-metrics"><div><span>客户咨询</span><b>{beat===0?"0":"128"}</b><small>统一接入的咨询数</small></div><div><span>AI 已回复</span><b>{beat===0?"0":"96"}</b><small>自动接待记录</small></div><div><span>团队跟进</span><b>{complete?"32":"—"}</b><small>分配至团队的咨询</small></div></div><div className="cd-data-grid"><div className="cd-client-card"><div className="cd-label">客户档案</div><div className="cd-client-heading"><i className="cd-avatar cd-avatar-0">EW</i><span>Emma Wilson<small><Channel index={2}/>WhatsApp 客户</small></span><b>已沉淀</b></div><div className="cd-client-fields"><span>客户标签<b>旅行咨询 · 英语客户</b></span><span>跟进顾问<b>Jenny</b></span><span>当前状态<b>待确认出行日期</b></span></div><div className="cd-client-timeline"><span>✓ 消息接入</span><span>✓ AI 接待</span><span>✓ 团队跟进</span></div></div><div className="cd-report"><div className="cd-label">咨询来源分布</div><div className="cd-donut"><span>128<small>咨询总数</small></span></div><div className="cd-legend"><span><i/>WhatsApp <b>64</b></span><span><i/>Facebook <b>40</b></span><span><i/>Instagram <b>24</b></span></div></div></div><div className="cd-report-footer"><span>客户、对话与团队记录，可追踪</span><b>{complete?"✓ 示例报表已就绪":"↗ 查看运营报表"}</b></div></div>:null}
        </div>
        <div className="cd-cursor" data-done={complete}><svg viewBox="0 0 24 29"><path d="M3 2v21l5-5 4 8 4-2-4-8h8L3 2Z" fill="white" stroke="#6c5b91" strokeWidth="1.4" strokeLinejoin="round"/></svg><i/></div>
      </div>
    </div>
    <div className="cd-story"><strong>{STEPS[step].title}</strong><span>{STEPS[step].note}</span></div>
    <div className="cd-controls"><div role="tablist" aria-label="JoinCompass 运营流程" onKeyDown={event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?3:(step+(event.key==="ArrowRight"?1:3))%4;select(next);root.current?.querySelector<HTMLButtonElement>(`[data-cd-tab="${next}"]`)?.focus();}}>{STEPS.map((item,i)=><button type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={step===i} aria-controls={`${id}-panel`} tabIndex={step===i?0:-1} data-cd-tab={i} className={step===i?"is-active":""} onClick={()=>select(i)} key={item.name}><b>0{i+1}</b>{item.name}{step===i?<i className="cd-progress" key={revision}/>:null}</button>)}</div><button type="button" className="cd-play" aria-pressed={!playing} aria-label={playing?"暂停运营演示":"播放运营演示"} onClick={()=>setPlaying(value=>!value)}>{playing?"Ⅱ":"▷"}</button></div>
  </div>;
}
