import type { Metadata } from "next";
import { MotionRoot } from "@/components/home/motion";
import { SiteFrame } from "@/components/site/SiteFrame";
import { getPublicHome } from "@/lib/content/get-public-home";
import "./globals.css";
import "./interior.css";


const description =
  "依托数据与传播双基因，PandaMobo 融合全渠道广告、品牌策略、广告资产运维与自研技术，帮助中国品牌连接全球市场。";

const indexable = process.env.NODE_ENV === "production" && process.env.CONTENT_MODE !== "preview";

export const metadata: Metadata = {
  title: "PandaMobo 熊猫新媒 | 帮助中国品牌走向全球",
  description,
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = getPublicHome();
  return (
    <html lang="zh-CN">
      <body>
        <MotionRoot />
        <SiteFrame
          chrome={{
            preview: content.preview,
            brand: content.brand,
            nav: content.nav,
            contact: content.contact,
            footerBlurb: content.footer.blurb,
          }}
        >
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
