"use client";
import { useEffect, useId, useRef, useState } from "react";
import "./mc-demo.css";
const DURATION=6200;
const STEPS=[
 {name:"矩阵监控",title:"多个社媒账号，统一监测表现",note:"粉丝、贴文与互动，同屏查看"},
 {name:"内容排期",title:"AI 辅助创作，多语言定时发布",note:"从创意文案，到账号与发布时间"},
 {name:"舆情聆听",title:"设置品牌关键词，发现待处理提及",note:"识别讨论，创建跟进任务"},
 {name:"消息接待",title:"AI 辅助回复，团队接续处理",note:"关联提及与对话，持续跟进"},
];
const CHANNELS=[{name:"Facebook",src:"/brand/social-official/facebook.png"},{name:"Instagram",src:"/brand/social-official/instagram.svg"},{name:"TikTok",src:"/brand/social-official/tiktok.png"},{name:"WhatsApp",src:"/brand/social-official/whatsapp.svg"}];
function Channel({index}:{index:number}){return <img className="md-channel" src={CHANNELS[index].src} alt=""/>;}
function ProductArt(){return <div className="md-product-art"><svg viewBox="0 0 260 170" aria-hidden="true"><circle cx="170" cy="64" r="68" fill="#d7f1fa"/><path d="M81 100V79a49 49 0 0 1 98 0v21" fill="none" stroke="#506a86" strokeWidth="16"/><path d="M84 82v-7a46 46 0 0 1 92 0v7" fill="none" stroke="#c2d5e2" strokeWidth="5"/><g transform="rotate(-9 84 112)"><rect x="66" y="91" width="34" height="54" rx="13" fill="#647e96"/><rect x="72" y="96" width="20" height="44" rx="8" fill="#d9e7ef"/></g><g transform="rotate(9 176 112)"><rect x="160" y="91" width="34" height="54" rx="13" fill="#647e96"/><rect x="168" y="96" width="20" height="44" rx="8" fill="#d9e7ef"/></g></svg><span>LUMA A10<small>FIND YOUR SOUND.</small></span></div>;}
export function McDemo(){
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
  return <div ref={root} className="mc-demo" data-step={step} data-beat={beat} data-playing={running} data-reduced={reduced}>
    <div className="md-demo-head"><span><i/>JoinMC · 社媒运营演示</span><b>模拟界面 · 示例数据</b></div>
    <div className="md-app" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${step}`}>
      <div className="md-interface" aria-hidden="true">
        <div className="md-topbar"><img src="/brand/joinmc-logo.png" alt=""/><span>智能社媒运营工作台</span><div><i/>LUMA 演示团队 <b>L</b></div></div>
        <aside className="md-nav">{["社媒监控","内容发布","社交聆听","消息中心"].map((item,i)=><div key={item} className={step===i?"is-active":""}><b>{["⌁","↗","◎","▣"][i]}</b>{item}{i===2?<i/>:null}</div>)}<span>WORKSPACE</span><small>⚙ 团队管理</small></aside>
        <div className="md-workspace" key={step}>
          <div className="md-page-title"><strong>{["社媒矩阵监控","内容创作与排期","品牌聆听任务","消息与任务中心"][step]}</strong><span>{step===0?"近 7 天 · 示例数据":"LUMA A10 · 新品传播示例"}</span></div>
          {step===0?<div className="md-monitor"><div className="md-metrics"><div><span>矩阵粉丝</span><b>{beat>0?"24,860":"24,000"}</b><small>账号表现概览</small></div><div><span>贴文互动</span><b>{beat>0?"1,280":"1,024"}</b><small>评论、喜欢与分享</small></div><div><span>已发布内容</span><b>18</b><small>多平台内容记录</small></div></div><div className="md-trend"><span>互动趋势 <i>● 互动次数</i></span><svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 15H400M0 35H400M0 55H400" fill="none" stroke="#eef3f7" strokeDasharray="3 4"/><path d="M0 49C25 46 24 35 50 39S95 55 120 29S170 47 200 25S245 33 280 17S345 25 400 6" fill="none" stroke="#54a4e5" strokeWidth="2" className="md-chart-line" pathLength="1"/></svg><div><span>周一</span><span>周三</span><span>周五</span><span>周日</span></div></div><div className="md-account-table"><div className="md-table-row is-label"><span>社媒账号</span><span>粉丝数</span><span>贴文互动</span><span>授权状态</span></div>{CHANNELS.slice(0,3).map((p,i)=><div className={`md-table-row${i===1&&beat>0?" is-highlight":""}`} key={p.name}><span><Channel index={i}/><b>LUMA · {p.name}</b></span><span>{["12,480","8,260","4,120"][i]}</span><span>{["624","416","240"][i]}</span><span className="md-good">已授权</span></div>)}</div>{complete?<div className="md-inline-feedback">✓ 账号表现已汇总，继续规划新品内容 <span>→</span></div>:null}</div>:null}
          {step===1?<div className="md-publishing"><div className="md-editor"><div className="md-label">选择发布账号</div><div className="md-platform-picks">{CHANNELS.slice(0,3).map((c,i)=><span key={c.name}><Channel index={i}/><b>✓</b></span>)}<small>已选 3 个账号</small></div><div className="md-label">贴文文案 <b>✦ AI 辅助生成</b></div><div className="md-copybox">{beat>0?<span>Find your sound. Meet LUMA A10 —<br/>your everyday listening companion.<small>#LUMA #FindYourSound</small></span>:<i>为新品耳机撰写一条英文社媒贴文…</i>}</div><div className="md-languages"><span className="is-active">English ✓</span><span>Español</span><small>多语言版本</small></div><div className="md-editor-asset"><ProductArt/><span>新品参考素材<b>luma_a10.png</b></span></div><div className={`md-primary${beat===1?" is-pressing":""}`}>{complete?"✓ 已加入发布队列":"◷ 确认定时发布"}<span>→</span></div></div><div className="md-calendar"><div className="md-label">内容日历 <span>本周</span></div><div className="md-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span></div><div className="md-calendar-grid">{Array.from({length:10},(_,i)=><div key={i}><small>{i+11}</small>{i===2?<b>09:00<br/>品牌日常</b>:null}{i===6?<b className={complete?"is-scheduled":"is-ghost"}>{complete?"15:30 新品发布":"15:30 待排期"}</b>:null}</div>)}</div><div className="md-post-thumb"><ProductArt/><span>LUMA A10 · 新品内容<small>Facebook / Instagram / TikTok</small></span></div><div className="md-schedule-note">{complete?"✓ 排期已确认，等待计划时间发布":"统一排期，保持多账号内容节奏"}</div></div></div>:null}
          {step===2?<div className="md-listening"><div className="md-topic"><div className="md-label">品牌聆听设置</div><strong>LUMA 新品讨论</strong><div className="md-label">包含关键词</div><div className="md-keywords"><span>LUMA A10</span><span>LUMA headphones</span></div><div className="md-topic-channels"><Channel index={0}/><Channel index={1}/><span>2 个平台</span></div><div className="md-topic-options"><span>目标市场<b>美国</b></span><span>目标语言<b>英语</b></span></div><div className="md-listening-status"><i/>正在聆听品牌提及</div></div><div className="md-mentions"><div className="md-mentions-head"><strong>品牌提及</strong><span>示例内容</span></div><div className="md-mention"><div><Channel index={1}/><b>Mia · Instagram</b><i>正向讨论</i></div><p>Love the new color of LUMA A10!</p></div><div className={`md-mention${beat>0?" is-attention":""}`}><div><Channel index={0}/><b>Alex · Facebook</b><i className="is-warning">待关注</i></div><p>Any update on my LUMA A10 delivery?</p><small>新品订单配送咨询，建议进一步跟进</small></div><div className="md-task-created">{complete?<><b>✓ 跟进任务已创建</b><span>Alex · 配送咨询 → 消息中心</span></>:<><b>发现值得跟进的客户提及</b><span>将讨论转为可执行的运营任务</span></>}</div></div></div>:null}
          {step===3?<div className="md-service"><div className="md-task-list"><div className="md-label">待办任务 <b>1</b></div><div className="md-task-item"><i>A</i><span>Alex<small>新品配送咨询</small></span><Channel index={0}/></div><div className="md-task-meta"><span>来源<b>社交聆听</b></span><span>关联产品<b>LUMA A10</b></span><span>处理状态<b>{complete?"已分配":"待跟进"}</b></span></div><div className="md-bot-status">✦ AI 助手已开启</div></div><div className="md-chat"><div className="md-chat-header"><span>Alex<small><Channel index={0}/>Facebook · 英语</small></span><b>配送咨询</b></div><div className="md-chat-body"><div className="md-bubble is-incoming">Any update on my LUMA A10 delivery?<small>我的 LUMA A10 配送有更新吗？</small></div>{beat===0?<div className="md-thinking"><i/><i/><i/><span>AI 根据知识库准备回复建议</span></div>:<><div className="md-reply-suggestion"><span>✦ AI 回复建议</span><p>Hi Alex! Please send your order number privately so our team can check delivery.</p><small>可编辑确认后发送</small></div>{complete?<div className="md-assigned"><i>J</i><span>已交给客服 Jamie<small>提及、回复建议与任务一起交接</small></span><b>✓</b></div>:null}</>}</div><div className="md-chat-footer"><span>AI 辅助准备，团队确认处理</span><b>{complete?"✓ 已分配跟进":"分配客服 →"}</b></div></div></div>:null}
        </div>
        <div className="md-cursor" data-done={complete}><svg viewBox="0 0 24 29"><path d="M3 2v21l5-5 4 8 4-2-4-8h8L3 2Z" fill="white" stroke="#54749b" strokeWidth="1.4" strokeLinejoin="round"/></svg><i/></div>
      </div>
    </div>
    <div className="md-story"><strong>{STEPS[step].title}</strong><span>{STEPS[step].note}</span></div>
    <div className="md-controls"><div role="tablist" aria-label="JoinMC 社媒运营流程" onKeyDown={event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?3:(step+(event.key==="ArrowRight"?1:3))%4;select(next);root.current?.querySelector<HTMLButtonElement>(`[data-md-tab="${next}"]`)?.focus();}}>{STEPS.map((item,i)=><button type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={step===i} aria-controls={`${id}-panel`} tabIndex={step===i?0:-1} data-md-tab={i} className={step===i?"is-active":""} onClick={()=>select(i)} key={item.name}><b>0{i+1}</b>{item.name}{step===i?<i className="md-progress" key={revision}/>:null}</button>)}</div><button type="button" className="md-play" aria-pressed={!playing} aria-label={playing?"暂停社媒运营演示":"播放社媒运营演示"} onClick={()=>setPlaying(value=>!value)}>{playing?"Ⅱ":"▷"}</button></div>
  </div>;
}
