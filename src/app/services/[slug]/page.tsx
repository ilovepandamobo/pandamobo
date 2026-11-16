import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceBody } from "@/components/site/DetailBlocks";
import { getPublicHome } from "@/lib/content/get-public-home";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ["media-operations", "ad-asset-operations", "global-brand-marketing", "strategic-studio"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getPublicHome().serviceDirectory.find((item) => item.id === slug);
  return { title: service ? `${service.name} | PandaMobo 熊猫新媒` : "服务 | PandaMobo 熊猫新媒" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = getPublicHome();
  const service = content.serviceDirectory.find((item) => item.id === slug);
  if (!service) notFound();
  return (
    <main id="main">
      <ServiceBody service={service} cases={content.allCases} />
    </main>
  );
}
