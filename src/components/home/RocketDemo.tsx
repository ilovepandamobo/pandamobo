"use client";

import { useEffect, useId, useRef, useState } from "react";

const STEPS = [
  { name: "开户接入", title: "选择平台，完成账户接入", note: "平台、账户与资产，在一个工作台管理" },
  { name: "账户充值", title: "选择账户，充值后查看余额变化", note: "资金与广告账户关联，管理更直观" },
  { name: "消耗监测", title: "消耗趋势与账户明细，同屏掌握", note: "从整体趋势，看到每一个账户的状态" },
  { name: "异常预警", title: "重要变化主动提醒，快速定位账户", note: "预警信息与相关账户关联展示" },
];
const DURATION = 6200;
const PLATFORMS = [
  { name: "Meta", src: "/brand/channels/meta.svg" },
  { name: "Google", src: "/brand/social-official/google.png" },
  { name: "TikTok", src: "/brand/social-official/tiktok.png" },
];
function Check() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export function RocketDemo() {
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
  const accountCount = step === 0 && !complete ? "3" : "4";
  const balance = (step >= 2 || (step === 1 && complete)) ? "$4,200.00" : "$3,200.00";
  return <div ref={root} className="rocket-demo" data-step={step} data-beat={beat} data-playing={running} data-reduced={reduced}>
    <div className="rd-demo-head"><span><i />Panda Rocket · 功能演示</span><b>示例数据</b></div>
    <div className="rd-app" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${step}`}>
      <div className="rd-interface" aria-hidden="true">
        <header className="rd-topbar"><img src="/brand/pandarocket-logo.png?v=3" alt="" /><span>品牌出海工作台</span><div><i />演示空间<b>P</b></div></header>
        <aside className="rd-sidebar">{["账户总览","资金管理","消耗监测","预警中心","海量知识"].map((name,i)=><div key={name} className={step===i?"is-active":""}><span>{["▣","↗","⌁","♧","▤"][i]}</span>{name}{i===3?<i />:null}</div>)}<small>WORKSPACE</small><div className="rd-sidebar-bottom">✦ 帮助与知识</div></aside>
        <div className={`rd-dashboard${step === 2 ? " is-monitoring" : ""}`}>
          <div className="rd-page-heading"><strong>{["账户总览","资金管理","消耗监测","预警中心"][step]}</strong><span>近 7 天⌄</span></div>
          <div className="rd-stats"><div><span>广告账户</span><strong key={accountCount}>{accountCount}<small>个</small></strong><i>多平台集中管理</i></div><div><span>可用余额</span><strong key={balance}>{balance}</strong><i>账户资金概览</i></div><div><span>累计消耗</span><strong>$13,280<small>.46</small></strong><i>示例消耗数据</i></div></div>
          <div className="rd-chart"><div><span>消耗趋势</span><i>● 消耗金额</i></div><svg viewBox="0 0 400 86" preserveAspectRatio="none" fill="none"><path d="M0 16H400M0 43H400M0 70H400" stroke="#edf1f8" strokeDasharray="3 4" /><path d="M0 70C20 70 21 53 48 58S85 75 110 48S148 64 172 37S220 53 245 29S291 46 318 20S361 37 400 8V86H0Z" fill="#edf3ff" /><path className="rd-chart-line" key={step===2?revision:"base"} d="M0 70C20 70 21 53 48 58S85 75 110 48S148 64 172 37S220 53 245 29S291 46 318 20S361 37 400 8" stroke="#4e83ed" strokeWidth="2.1" pathLength="1" /></svg><div className="rd-chart-dates"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div>{step===2&&beat>0?<div className="rd-chart-tooltip"><span>示例消耗</span><b>$2,160.00</b><i /></div>:null}</div>
          <div className="rd-account-table"><div className="rd-table-heading"><strong>账户明细</strong><span>＋ 新建账户</span></div><div className="rd-table-row is-label"><span>平台 / 账户</span><span>账户状态</span><span>今日消耗</span></div>{PLATFORMS.map((p,i)=><div className="rd-table-row" key={p.name}><span><img src={p.src} alt="" /><b>{p.name}_Brand_0{i+1}</b></span><span><i />正常</span><span>${["842.50","628.00","416.80"][i]}</span></div>)}</div>
        </div>
        {step === 0 ? <div className="rd-overlay" key={`account-${revision}`}><div className={`rd-dialog${complete?" is-complete":""}`}>
          {!complete ? <><div className="rd-dialog-title"><strong>接入广告账户</strong><span>×</span></div><p>选择平台，建立账户与资产连接</p><div className="rd-platform-options">{PLATFORMS.map((p,i)=><div key={p.name} className={i===0?"is-selected":""}><img src={p.src} alt="" /><span>{p.name}</span>{i===0?<i>✓</i>:null}</div>)}</div><div className="rd-mock-label">账户名称<span>Brand_US_04</span></div><div className="rd-dialog-footer"><span>查看开户指南 ↗</span><b className={beat===1?"is-pressing":""}>接入账户 <i>→</i></b></div></>
            : <div className="rd-success"><i><Check /></i><strong>账户已接入</strong><span>Meta · Brand_US_04</span><div><b>✓</b> 已加入账户总览</div></div>}
        </div></div> : null}
        {step === 1 ? <div className="rd-overlay" key={`funds-${revision}`}><div className={`rd-drawer rd-funds${complete?" is-complete":""}`}><div className="rd-dialog-title"><strong>账户充值</strong><span>×</span></div>{!complete?<><div className="rd-selected-account"><img src={PLATFORMS[0].src} alt="" /><span>Meta · Brand_US_04<i>当前余额 $3,200.00</i></span></div><span className="rd-small-label">选择充值金额 · USD</span><div className="rd-amounts"><span>$100</span><span>$500</span><span className={beat>0?"is-selected":""}>$1,000</span></div><div className="rd-fund-summary"><span>充值账户<b>Brand_US_04</b></span><span>充值金额<strong>{beat>0?"$1,000.00":"请选择金额"}</strong></span></div><div className={`rd-mock-primary${beat===1?" is-pressing":""}`}>确认充值<span>→</span></div><small>资金操作为功能流程示意</small></>:<div className="rd-success"><i><Check /></i><strong>充值完成</strong><span>示例金额 $1,000.00</span><div className="rd-balance-result"><span>更新后可用余额</span><b>$4,200.00</b></div></div>}</div></div> : null}
        {step === 2 && complete ? <div className="rd-toast"><Check /><span>消耗数据已刷新</span></div> : null}
        {step === 3 ? <div className="rd-overlay" key={`alert-${revision}`}><div className="rd-drawer rd-alert"><div className="rd-dialog-title"><strong>预警中心</strong><span>×</span></div><div className="rd-alert-banner"><i>!</i><span>账户余额提醒<b>Brand_US_04</b></span><small>{complete?"已查看":"待查看"}</small></div><div className="rd-alert-details"><span>触发条件<b>余额低于设定阈值</b></span><span>关联平台<b>Meta</b></span><span>提醒方式<b>站内消息</b></span></div><div className="rd-alert-card"><b>资金与账户状态，及时掌握</b><span>重要变化与关联账户集中展示</span></div><div className={`rd-mock-primary${beat===1?" is-pressing":""}`}>{complete?"✓ 已查看此条提醒":"查看关联账户"}<span>→</span></div><div className="rd-knowledge">▤ 操作知识与常见问题 <span>↗</span></div></div></div> : null}
        <div className="rd-cursor" data-done={complete&&step!==2}><svg viewBox="0 0 24 29"><path d="M3 2v21l5-5 4 8 4-2-4-8h8L3 2Z" fill="#fff" stroke="#2c4f8f" strokeWidth="1.4" strokeLinejoin="round" /></svg><i /></div>
      </div>
    </div>
    <div className="rd-story"><strong>{STEPS[step].title}</strong><span>{STEPS[step].note}</span></div>
    <div className="rd-controls"><div role="tablist" aria-label="Panda Rocket功能演示" onKeyDown={event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?3:(step+(event.key==="ArrowRight"?1:3))%4;select(next);root.current?.querySelector<HTMLButtonElement>(`[data-rd-tab="${next}"]`)?.focus();}}>{STEPS.map((item,i)=><button type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={step===i} aria-controls={`${id}-panel`} tabIndex={step===i?0:-1} data-rd-tab={i} className={step===i?"is-active":""} onClick={()=>select(i)} key={item.name}><b>0{i+1}</b>{item.name}{step===i?<i className="rd-progress" key={revision} />:null}</button>)}</div><button type="button" className="rd-play" aria-pressed={!playing} aria-label={playing?"暂停产品演示":"播放产品演示"} onClick={()=>setPlaying(value=>!value)}>{playing?"Ⅱ":"▷"}</button></div>
  </div>;
}
