import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseBody } from "@/components/site/DetailBlocks";
import { cases } from "@/content/cases";
import { getPublicHome } from "@/lib/content/get-public-home";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPublicHome().allCases.find((entry) => entry.slug === slug);
  return { title: item ? `${item.brand} | PandaMobo 熊猫新媒` : "案例 | PandaMobo 熊猫新媒" };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getPublicHome().allCases.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return (
    <main id="main">
      <CaseBody item={item} />
    </main>
  );
}
