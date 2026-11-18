type Tone = "coral" | "teal" | "ink" | "violet" | "gold" | "green" | "blue" | "amber";

const tones: Record<Tone, [string, string]> = {
  coral: ["#ff8a7a", "#8d1d3d"],
  teal: ["#7ee0d6", "#0c4f68"],
  ink: ["#9db7ff", "#102044"],
  violet: ["#c4b5fd", "#3b2175"],
  gold: ["#f6d48a", "#6d4b12"],
  green: ["#9ee0b8", "#0e4a34"],
  blue: ["#9ec2ff", "#14357a"],
  amber: ["#ffd39a", "#7a3e0b"],
};

export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 560 460" role="img" aria-label="PandaMobo 品牌图形：以圆环连接广告、内容、技术与策略">
      <defs>
        <radialGradient id="orb" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#eef4ff" />
          <stop offset="70%" stopColor="#d7e6ff" />
          <stop offset="100%" stopColor="#b9d0ff" />
        </radialGradient>
      </defs>
      <circle cx="280" cy="220" r="168" fill="url(#orb)" />
      <circle className="orbit-ring" cx="280" cy="220" r="128" fill="none" stroke="#1557f0" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="10 14" />
      <circle className="orbit-ring orbit-ring-fast" cx="280" cy="220" r="86" fill="none" stroke="#1557f0" strokeOpacity="0.8" strokeWidth="2" strokeDasharray="4 8" />
      <circle cx="280" cy="220" r="18" fill="#1557f0" />
      <circle cx="280" cy="92" r="8" fill="#07111f" />
      <circle cx="408" cy="250" r="8" fill="#1557f0" />
      <circle cx="176" cy="318" r="8" fill="#0d3fbe" />
      <circle cx="168" cy="150" r="8" fill="#3d7bff" />
      <text x="280" y="74" textAnchor="middle" fill="#162033" fontSize="15" fontFamily="PingFang SC, sans-serif">广告</text>
      <text x="446" y="256" fill="#162033" fontSize="15" fontFamily="PingFang SC, sans-serif">内容</text>
      <text x="118" y="348" textAnchor="middle" fill="#162033" fontSize="15" fontFamily="PingFang SC, sans-serif">技术</text>
      <text x="112" y="146" textAnchor="middle" fill="#162033" fontSize="15" fontFamily="PingFang SC, sans-serif">策略</text>
    </svg>
  );
}

export function CaseCover({ tone, name, label, src, thumbnail = false, eager = false }: { tone: Tone; name: string; label: string; src?: string; thumbnail?: boolean; eager?: boolean }) {
  if (src) return <div className="case-cover case-cover-source"><img src={thumbnail ? src.replace(/\.webp$/, "-thumb.webp") : src} alt={label} width={1800} height={1013} loading={eager || !thumbnail ? "eager" : "lazy"} decoding="async" /></div>;
  const [a, b] = tones[tone];
  return (
    <div className="case-cover" style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}>
      <svg viewBox="0 0 640 400" role="img" aria-label={label} width="640" height="400">
        <circle cx="520" cy="70" r="90" fill="white" fillOpacity="0.16" />
        <circle cx="500" cy="70" r="48" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="3" />
        <circle cx="120" cy="300" r="70" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
        <text x="40" y="250" fill="white" fontSize="42" fontFamily="PingFang SC, sans-serif" fontWeight="650">
          {name}
        </text>
      </svg>
    </div>
  );
}

export function Schematic({ kind }: { kind: "account" | "social" | "strategy" }) {
  if (kind === "strategy") {
    return (
      <div className="schematic schematic-strategy" aria-hidden="true">
        <span>能力示意</span>
        <ol>
          <li>数据</li>
          <li>模型</li>
          <li>洞察</li>
          <li>战略</li>
        </ol>
      </div>
    );
  }

  return (
    <div className={`schematic schematic-${kind}`} aria-hidden="true">
      <span>能力示意</span>
      <div className="schematic-bar" />
      <div className="schematic-row">
        <i />
        <i />
        <i />
      </div>
      <div className="schematic-line" />
      <div className="schematic-line short" />
    </div>
  );
}
