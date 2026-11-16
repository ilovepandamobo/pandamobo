import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBody } from "@/components/site/DetailBlocks";
import { getPublicHome } from "@/lib/content/get-public-home";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: "pandarocket" }, { slug: "joinmc" }, { slug: "joinspark" }, { slug: "joincompass" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicHome().products.find((item) => item.id === slug && item.kind === "product");
  return { title: product ? `${product.name} | PandaMobo 熊猫新媒` : "技术产品 | PandaMobo 熊猫新媒" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublicHome().products.find((item) => item.id === slug && item.kind === "product");
  if (!product) notFound();
  return (
    <main id="main">
      <ProductBody product={product} />
    </main>
  );
}
