"use client";

import { useState, type ReactNode } from "react";

export function InteriorJourney({ title, panels }: { title: string; panels: { label: string; content: ReactNode }[] }) {
  const [selected, setSelected] = useState(0);
  return <div className="ip-journey">
    <div className="ip-journey-controls" role="group" aria-label={title}>
      {panels.map((panel, index) => <button key={panel.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
        {panel.label}
      </button>)}
    </div>
    <div className="ip-journey-panel" key={selected} aria-live="polite">{panels[selected]?.content}</div>
  </div>;
}
