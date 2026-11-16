import type { ReactNode } from "react";

function Icon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    {kind === "target" ? <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 12l8-8m-4 0h4v4" /></>
      : kind === "creative" ? <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 8l7 4-7 4V8Z" /></>
      : kind === "launch" ? <><path d="M3 10l18-7-7 18-3-8-8-3Zm8 3L21 3" /></>
      : kind === "chart" ? <><path d="M4 19V5m0 14h16M8 15l4-5 4 2 4-6" /></>
      : kind === "people" ? <><circle cx="10" cy="8" r="3" /><path d="M4 19v-2a6 6 0 0 1 12 0v2m1-14a3 3 0 0 1 0 6m3 8v-3a4 4 0 0 0-3-4" /></>
      : kind === "search" ? <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6M7 10h6m-3-3v6" /></>
      : <><path d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7m-7 4h5" /></>}
  </svg>;
}
function Connections({ loop = false }: { loop?: boolean }) {
  return <svg className="ssc-connections" viewBox="0 0 210 420" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path d={loop ? "M35 142C14 200 18 284 74 301C135 327 188 266 176 215C165 173 123 129 35 142Z" : "M30 145C68 146 68 211 105 211S150 194 180 198M30 275C64 275 75 211 105 211S146 330 180 330"} />
    {[[34,145],[179,198],[31,275],[179,330]].map(([cx,cy]) => <circle key={cy} cx={cx} cy={cy} r="2" />)}
  </svg>;
}
function Badge({ index, children, className = "" }: { index: number; children: ReactNode; className?: string }) {
  return <div className={`ssc-badge ssc-badge-${index} ${className}`}>{children}</div>;
}

/** Semantic illustration details for the narrow, collapsed service cards. */
export function ServiceContext({ serviceId }: { serviceId: string }) {
  if (serviceId === "ad-asset-operations") return <div className="svc-context ssc-media" aria-hidden="true">
    <span className="ssc-caption"><i />平台 × 账户 × AM</span><Connections />
    {[
      ["Meta", "/brand/channels/meta.svg"],
      ["Google", "/brand/social-official/google.png"],
      ["TikTok", "/brand/social-official/tiktok.png"],
      ["Taboola", "/brand/social-official/taboola-official-symbol.svg"],
    ].map(([name,src], i) => <Badge index={i + 1} key={name} className="ssc-platform"><img src={src} alt="" /><span>{name}</span></Badge>)}
    <div className="ssc-bottom"><span>开户接入</span><i>·</i><span>诊断梳理</span></div>
  </div>;
  if (serviceId === "media-operations") return <div className="svc-context ssc-ads" aria-hidden="true">
    <span className="ssc-caption"><i />从策略到投放的闭环</span><Connections loop />
    {[["target","策略"],["creative","素材"],["launch","投放"],["chart","复盘"]].map(([icon,label],i)=><Badge index={i+1} key={label}><Icon kind={icon} /><span>{label}</span></Badge>)}
    <div className="ssc-bottom"><span>策略</span><i>→</i><span>执行</span><i>→</i><span>优化</span></div>
  </div>;
  if (serviceId === "global-brand-marketing") return <div className="svc-context ssc-brand" aria-hidden="true">
    <img className="ssc-world-map" src="/brand/service-context/world-map.svg" alt="" />
    <span className="ssc-caption"><i />定位 · 本地化 · 全球传播</span><Connections />
    {[["🇺🇸","美国"],["🇬🇧","英国"],["🇯🇵","日本"],["🇸🇬","新加坡"]].map(([flag,name],i)=><Badge index={i+1} key={name} className="ssc-country"><b>{flag}</b><span>{name}</span></Badge>)}
    <div className="ssc-bottom"><span>品牌定位</span><i>→</i><span>全球触达</span></div>
  </div>;
  if (serviceId === "strategic-studio") return <div className="svc-context ssc-insight" aria-hidden="true">
    <svg className="ssc-research-grid" viewBox="0 0 200 300" fill="none"><path d="M25 64H175M25 104H175M25 144H175M25 184H175M25 224H175M45 44V244M85 44V244M125 44V244M165 44V244" /><circle cx="111" cy="148" r="65" /><path d="m155 195 29 29" /></svg>
    <span className="ssc-caption"><i />把研究转化为策略方向</span><Connections loop />
    {[["chart","行业研究"],["people","人群洞察"],["search","竞品分析"],["report","策略建议"]].map(([icon,label],i)=><Badge index={i+1} key={label}><Icon kind={icon} /><span>{label}</span></Badge>)}
    <div className="ssc-bottom"><span>数据研究</span><i>×</i><span>专家判断</span></div>
  </div>;
  return null;
}

function PlatformStrip() {
  return <div className="sse-platforms">{[
    ["Meta", "/brand/channels/meta.svg"], ["Google", "/brand/social-official/google.png"],
    ["TikTok", "/brand/social-official/tiktok.png"], ["Taboola", "/brand/social-official/taboola-official-symbol.svg"],
  ].map(([name,src]) => <span key={name} title={name}><img src={src} alt="" /></span>)}</div>;
}
function HeadingChip({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className="sse-heading"><Icon kind={icon} />{children}</span>;
}

/** Expanded details align with the three existing scene modules: 17.5%, 50%, 82.5%. */
export function ServiceExpandedContext({ serviceId }: { serviceId: string }) {
  if (serviceId === "ad-asset-operations") return <div className="svc-expanded-context" aria-hidden="true">
    <div className="sse-column sse-left"><PlatformStrip /></div>
    <div className="sse-column sse-core"><HeadingChip icon="people">专属 AM</HeadingChip></div>
    <div className="sse-column sse-right"><HeadingChip icon="report">账户资产协作</HeadingChip></div>
  </div>;
  if (serviceId === "media-operations") return <div className="svc-expanded-context" aria-hidden="true">
    <div className="sse-column sse-left"><HeadingChip icon="target">目标 · 人群 · 策略</HeadingChip></div>
    <div className="sse-column sse-core"><div className="sse-tags"><span>图文</span><span>视频</span><span>口播</span></div></div>
    <div className="sse-column sse-right"><PlatformStrip /></div>
    <div className="sse-loop"><span>↺</span>数据复盘，持续优化</div>
  </div>;
  if (serviceId === "global-brand-marketing") return <div className="svc-expanded-context sse-brand" aria-hidden="true">
    <img className="sse-brand-map" src="/brand/service-context/world-map.svg" alt="" />
    <div className="sse-column sse-left"><HeadingChip icon="search">市场洞察与定位</HeadingChip></div>
    <div className="sse-column sse-core"><div className="sse-flags">{[["🇺🇸","美国"],["🇬🇧","英国"],["🇯🇵","日本"],["🇸🇬","新加坡"]].map(([flag,name])=><span key={name} title={name}>{flag}</span>)}</div></div>
    <div className="sse-column sse-right"><HeadingChip icon="launch">本地内容 · 全球传播</HeadingChip></div>
  </div>;
  if (serviceId === "strategic-studio") return <div className="svc-expanded-context" aria-hidden="true">
    <div className="sse-column sse-left"><div className="sse-tags"><span>行业</span><span>人群</span><span>竞品</span></div></div>
    <div className="sse-column sse-core"><HeadingChip icon="search">诊断模型</HeadingChip></div>
    <div className="sse-column sse-right"><HeadingChip icon="report">策略建议</HeadingChip></div>
  </div>;
  return null;
}
