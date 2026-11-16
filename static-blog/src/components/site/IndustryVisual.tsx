import { CaseArtwork, EditorialImage, Ribbon } from "./Interior";
import type { PublicCase } from "@/lib/content/public-types";

export function IndustryVisual({ item, travel }: { item?: PublicCase; travel: boolean }) {
  if (item) return <CaseArtwork item={item} cover />;
  if (!travel) return null;
  return <figure className="ip-travel-map">
    <EditorialImage src="/assets/interior/jiangnan-travel.webp" alt="江南水乡的石桥、临水民居和木船" />
    <figcaption>入境游场景示意</figcaption>
    <Ribbon steps={["目的地发现", "行程了解", "咨询承接"]} />
  </figure>;
}
