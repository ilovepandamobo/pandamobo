/** Eight matched 3D-rendered poses share one timeline with the globe. */
export function HeroEarthPanda() {
  return <div className="h-earth-panda" aria-hidden="true">
    <span className="h-earth-panda-shadow" />
    <div className="h-earth-panda-action"><div className="h-earth-panda-breath">
      {Array.from({ length: 8 }, (_, i) => <i className={`h-earth-panda-pose h-earth-panda-pose-${i}`} key={i} />)}
    </div></div>
    <span className="h-earth-panda-effort"><i /><i /><i /></span>
  </div>;
}
