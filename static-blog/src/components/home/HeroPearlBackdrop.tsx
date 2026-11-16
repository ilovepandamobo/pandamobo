/** Static architectural layers keep the hero light without adding a render loop. */
export function HeroPearlBackdrop() {
  return <div className="hero-pearl-backdrop" aria-hidden="true">
    <span className="hero-pearl-word">GO GLOBAL</span>
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id="hp-glass" x1="650" y1="70" x2="1410" y2="650" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" stopOpacity=".15"/><stop offset=".3" stopColor="#e1eaf7" stopOpacity=".7"/><stop offset=".52" stopColor="#fff" stopOpacity=".9"/><stop offset=".75" stopColor="#dbe5f2" stopOpacity=".45"/><stop offset="1" stopColor="#fff" stopOpacity=".1"/></linearGradient>
        <linearGradient id="hp-edge" x1="500" y1="600" x2="1280" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#edf2f9" stopOpacity="0"/><stop offset=".3" stopColor="#fff"/><stop offset=".52" stopColor="#bdcfe7" stopOpacity=".7"/><stop offset=".63" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity=".3"/></linearGradient>
        <linearGradient id="hp-ribbon" x1="100" y1="640" x2="1200" y2="690" gradientUnits="userSpaceOnUse"><stop stopColor="#e3e9f3"/><stop offset=".25" stopColor="#fff"/><stop offset=".5" stopColor="#dce5f1"/><stop offset=".67" stopColor="#fff"/><stop offset="1" stopColor="#e6edf7"/></linearGradient>
        <radialGradient id="hp-pool"><stop stopColor="#85bdff" stopOpacity=".2"/><stop offset=".45" stopColor="#d9e7f8" stopOpacity=".45"/><stop offset="1" stopColor="#ecf2fb" stopOpacity="0"/></radialGradient>
        <linearGradient id="hp-wire" x1="1190" y1="200" x2="1510" y2="650" gradientUnits="userSpaceOnUse"><stop stopColor="#c5d0e0" stopOpacity=".55"/><stop offset=".5" stopColor="#fff"/><stop offset="1" stopColor="#d6e0ed" stopOpacity=".3"/></linearGradient>
      </defs>
      <ellipse cx="1040" cy="668" rx="370" ry="65" fill="url(#hp-pool)"/>
      <g transform="rotate(-27 1090 310)">
        <ellipse cx="1090" cy="310" rx="510" ry="345" stroke="url(#hp-glass)" strokeWidth="59"/>
        <ellipse cx="1090" cy="310" rx="540" ry="374" stroke="url(#hp-edge)" strokeWidth="2"/>
        <ellipse cx="1090" cy="310" rx="480" ry="315" stroke="#fff" strokeOpacity=".9" strokeWidth="1.5"/>
      </g>
      <g stroke="url(#hp-wire)" strokeWidth="1.3" opacity=".65" transform="rotate(-16 1435 375)">
        <circle cx="1435" cy="375" r="232"/><ellipse cx="1435" cy="375" rx="154" ry="232"/><ellipse cx="1435" cy="375" rx="74" ry="232"/><ellipse cx="1435" cy="375" rx="232" ry="153"/><ellipse cx="1435" cy="375" rx="232" ry="73"/><path d="M1203 375H1667M1435 143V607"/>
      </g>
      <path d="M-140 647C260 751 594 666 834 610S1231 559 1580 602" stroke="#b8c7dd" strokeOpacity=".11" strokeWidth="72"/>
      <path d="M-140 639C260 743 594 658 834 602S1231 551 1580 594" stroke="url(#hp-ribbon)" strokeWidth="58"/>
      <path d="M-140 611C260 715 594 630 834 574S1231 523 1580 566" stroke="#fff" strokeOpacity=".9" strokeWidth="2"/>
      <path d="M-100 714C430 788 814 716 1510 664" stroke="#fff" strokeOpacity=".8" strokeWidth="2"/>
    </svg>

  </div>;
}
