import type { Metadata } from "next";
import { HeroScrollLab } from "@/components/home/HeroScrollLab";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = {
  title: "首页滚动测试 | PandaMobo",
  robots: { index: false, follow: false },
};

export default function HeroLabPage() {
  const content = getPublicHome();
  return (
    <HeroScrollLab
      banners={content.banners}
      metrics={content.about.metrics}
      showNote
    />
  );
}
