"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CaseCover } from "@/components/home/Visuals";
import type { PublicCase } from "@/lib/content/public-types";

const PAGE_SIZE = 6;

export function CaseBrowser({ cases }: { cases: PublicCase[] }) {
  const params = useSearchParams();
  const industry = params.get("industry") ?? "";
  const requested = Number(params.get("page") || "1");
  const page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
  const industries = [...new Set(cases.map((item) => item.industry))];
  const filtered = industry ? cases.filter((item) => item.industry === industry) : cases;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function href(nextIndustry: string, nextPage = 1) {
    const query = new URLSearchParams();
    if (nextIndustry) query.set("industry", nextIndustry);
    if (nextPage > 1) query.set("page", String(nextPage));
    const value = query.toString();
    return value ? `/cases?${value}#stories` : "/cases#stories";
  }

  return (
    <>
      <div className="filter-row">
        <Link href="/cases#stories" aria-current={industry ? undefined : "true"}>
          全部
        </Link>
        {industries.map((item) => (
          <Link key={item} href={href(item)} aria-current={industry === item ? "true" : undefined}>
            {item}
          </Link>
        ))}
      </div>
      {visible.length === 0 ? <p>这个筛选下还没有案例。</p> : null}
      <div className="case-grid">
        {visible.map((item) => (
          <article key={item.slug} className="case-card">
            <CaseCover tone={item.tone} name={item.shortName} label={item.coverLabel} src={item.coverImage} />
            <div className="case-body">
              <p className="kicker">{item.industry}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link className="btn btn-ghost" href={`/cases/${item.slug}`}>
                查看案例
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="pager">
        {safePage > 1 ? <Link href={href(industry, safePage - 1)}>上一页</Link> : <span />}
        <span>
          第 {safePage} / {pages} 页
        </span>
        {safePage < pages ? <Link href={href(industry, safePage + 1)}>下一页</Link> : null}
        {industry ? <Link href="/cases#stories">清空筛选</Link> : null}
      </div>
    </>
  );
}
