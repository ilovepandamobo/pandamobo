import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "加入我们 | PandaMobo 熊猫新媒", robots: { index: false, follow: false } };

export default function CareersPage() {
  return (
    <main id="main">
      <header className="page-hero">
        <div className="wrap">
          <h1>加入我们</h1>
          <p className="lede">目前没有可发布的岗位。招聘入口不会出现在主导航里。</p>
          <Link href="/">返回首页</Link>
        </div>
      </header>
    </main>
  );
}
