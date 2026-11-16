import type { Metadata } from "next";
import { Action, Art, ConsultStrip, InteriorHero, OrbitArt, ProductLogo, Ribbon, SectionHead } from "@/components/site/Interior";
import { productArtFor } from "@/content/product-art";
import { productVisuals } from "@/content/interior";
import { getPublicHome } from "@/lib/content/get-public-home";

export const metadata: Metadata = { title: "技术产品 | PandaMobo 熊猫新媒", description: "探索 Panda Rocket、JoinSpark、JoinCompass 和 JoinMC 的功能与操作演示。" };

export default function ProductsPage() {
  const products = getPublicHome().products.filter(product => product.kind === "product" && productArtFor(product.id));
  return <main id="main" className="ip-page ip-products">
    <InteriorHero label="技术产品" title="让出海团队少切换，多协作" lead="从管账户、做素材，到接住客户消息和运营社媒，四款产品对应四类日常工作。" theme="violet"
      visual={<OrbitArt src="/assets/hero-materials/core.png" label="广告资产 · 创意 · 客户沟通 · 社媒运营" />}>
      <Action href="#product-directory">探索产品</Action>
    </InteriorHero>
    <section className="ip-wrap ip-section" id="product-directory">
      <SectionHead title="按你的工作场景选产品" />
      <div className="ip-product-grid">{products.map(product => {
        const art = productArtFor(product.id);
        const design = productVisuals[product.id];
        return <article className="ip-product-card" key={product.id} id={product.id === "pandarocket" ? "panda-rocket" : product.id} data-theme={design.theme}>
          <div className="ip-product-copy">{product.logo && <ProductLogo src={product.logo} name={product.name} />}<h3>{design.title}</h3><p>{product.summary}</p><Ribbon steps={design.steps} /><Action href={`/products/${product.id}#demo`} secondary>查看产品演示</Action></div>
          {art && <Art src={art.src} alt={art.alt} />}
        </article>;
      })}</div>
    </section>
    <ConsultStrip title="一起选适合你的工具">说说你的业务流程，我们可以从最耗时的工作开始梳理。</ConsultStrip>
  </main>;
}
