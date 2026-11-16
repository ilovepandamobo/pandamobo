import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main">
      <header className="page-hero">
        <div className="wrap stack">
          <h1>页面不存在</h1>
          <p className="lede">这个地址没有对应内容。可以回到首页，或先看看优质媒介服务。</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/">
              返回首页
            </Link>
            <Link className="btn btn-ghost" href="/services">
              浏览服务
            </Link>
          </div>
        </div>
      </header>
    </main>
  );
}
