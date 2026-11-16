"use client";

import Link from "next/link";
import { NavMascot } from "./NavMascot";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ConsultForm } from "@/components/home/ConsultForm";
import { useOverlay } from "@/components/home/use-overlay";

type Chrome = {
  preview: boolean;
  brand: { nameEn: string; nameZh: string };
  nav: { label: string; href: string }[];
  contact: {
    title: string;
    text: string;
    privacyText: string;
    serviceOptions: string[];
  };
  footerBlurb: string;
};

type SiteUIValue = {
  openConsult: (service?: string) => void;
};

const SiteUIContext = createContext<SiteUIValue | null>(null);

export function useSiteUI() {
  const value = useContext(SiteUIContext);
  if (!value) throw new Error("咨询按钮需要放在站点框架内");
  return value;
}

export function ConsultButton({
  className,
  children,
  service,
}: {
  className?: string;
  children: React.ReactNode;
  service?: string;
}) {
  const { openConsult } = useSiteUI();
  return (
    <button className={className} type="button" onClick={() => openConsult(service)}>
      {children}
    </button>
  );
}

const primaryNavigation = [
  { label: "服务与方案", items: [{ label: "优质媒介服务", href: "/services" }, { label: "行业解决方案", href: "/solutions" }] },
  { label: "产品与技术", items: [{ label: "技术产品", href: "/products" }, { label: "WhatsApp", href: "/whatsapp" }] },
  { label: "客户案例", href: "/cases" },
  { label: "资源中心", href: "/insights" },
  { label: "关于我们", href: "/about" },
];

function DesktopNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const openRef = useRef<string | null>(null);
  const dismissedHover = useRef<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const close = () => {
    cancel();
    const label = openRef.current;
    openRef.current = null; setOpen(null);
    if (label) window.dispatchEvent(new CustomEvent("pandamobo:menu-close", { detail: { label } }));
  };
  const show = (label: string, button: HTMLButtonElement) => {
    cancel();
    if (openRef.current === label) return;
    openRef.current = label; setOpen(label);
    const detail = { label, button, handled: false, estimatedMs: 0 };
    window.dispatchEvent(new CustomEvent("pandamobo:menu-pull", { detail }));

  };
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !openRef.current) return;
      const button = ref.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]');
      dismissedHover.current = openRef.current;
      close(); button?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { cancel(); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  useEffect(() => { close(); }, [pathname]);
  return <nav ref={ref} className="nav-links nav-refined-links" aria-label="主导航"
    onKeyDown={event => {
      if (event.key === "Escape") {
        const button = ref.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]');
        dismissedHover.current = openRef.current;
        close(); button?.focus();
      }
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    {primaryNavigation.map(item => item.items ? <div className="nav-group" data-open={open === item.label} key={item.label}
      onPointerEnter={event => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        if (dismissedHover.current === item.label) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const button = event.currentTarget.querySelector<HTMLButtonElement>(":scope > button");
        if (!button) return;
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => show(item.label, button), 70);
      }}
      onPointerLeave={() => {
        if (dismissedHover.current === item.label) dismissedHover.current = null;
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(close, 200);
      }}>
      <button type="button" aria-expanded={open === item.label} aria-controls={`nav-${item.items[0].href.slice(1)}`}
        onClick={event => { dismissedHover.current = null; if (openRef.current === item.label) close(); else show(item.label, event.currentTarget); }}
        onKeyDown={event => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault(); dismissedHover.current = null; show(item.label, event.currentTarget);
          const group = event.currentTarget.parentElement;
          requestAnimationFrame(() => group?.querySelector<HTMLAnchorElement>(".nav-dropdown a")?.focus());
        }}>
        {item.label}<span aria-hidden="true">⌄</span>
      </button>
      {open === item.label ? <div className="nav-dropdown nav-dropdown-pulled is-open" id={`nav-${item.items[0].href.slice(1)}`}>
        <span className="nav-dropdown-handle" aria-hidden="true" />
        {item.items.map(link => <Link key={link.href} href={link.href} aria-current={current(link.href, pathname) ? "page" : undefined} onClick={close}>{link.label}<span aria-hidden="true">↗</span></Link>)}
      </div> : null}
    </div> : <Link key={item.href} href={item.href!} aria-current={current(item.href!, pathname) ? "page" : undefined}>{item.label}</Link>)}
  </nav>;
}

function current(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteFrame({ chrome, children }: { chrome: Chrome; children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultService, setConsultService] = useState<string | undefined>(undefined);
  const [consultOpen, setConsultOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const overlayOpen = menuOpen || consultOpen || privacyOpen;
  const overlayRef = useOverlay(overlayOpen, () => {
    setMenuOpen(false);
    setConsultOpen(false);
    setPrivacyOpen(false);
  });

  useEffect(() => {
    let previous = false;
    const onScroll = () => {
      const next = window.scrollY > 8;
      if (next !== previous) {
        previous = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 980) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function openConsult(service?: string) {
    setMenuOpen(false);
    setPrivacyOpen(false);
    setConsultService(service);
    setConsultOpen(true);
  }

  const overlayKind = menuOpen ? "menu" : consultOpen ? "consult" : privacyOpen ? "privacy" : null;

  return (
    <SiteUIContext.Provider value={{ openConsult }}>
      <div className="page">
        <a className="skip" href="#main">
          跳到主要内容
        </a>
        <header className={scrolled || pathname !== "/" ? "nav nav-refined scrolled" : "nav nav-refined"} aria-hidden={overlayOpen ? true : undefined}>
          <div className="wrap nav-inner">
            <NavMascot disabled={overlayOpen} />
            <Link className="brand" href="/" aria-label={`${chrome.brand.nameZh} ${chrome.brand.nameEn}`}>
              <img className="brand-logo" src="/brand/pandamobo-logo.png" alt="" width={148} height={52} />
            </Link>
            <DesktopNavigation pathname={pathname} />
            <button className="btn btn-primary nav-cta" type="button" onClick={() => openConsult()}>
              咨询出海方案 <span aria-hidden="true">↗</span>
            </button>
            <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? "关闭" : "菜单"}
            </button>
          </div>
        </header>
        <div aria-hidden={overlayOpen ? true : undefined}>{children}</div>
        <footer className="footer footer-refined" aria-hidden={overlayOpen ? true : undefined}>
          <div className="wrap footer-inner">
            <div className="footer-invitation">
              <div>
                <p className="footer-eyebrow"><span aria-hidden="true" />TOGETHER GO GLOBAL</p>
                <h2>下一站，让品牌走向全球</h2>
                <p className="footer-invitation-note">从一个想法开始，聊聊你的目标市场与增长计划</p>
              </div>
              <button className="footer-consult" type="button" onClick={() => openConsult()}>
                咨询出海方案<span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="footer-directory">
              <div className="footer-identity">
                <Link href="/" aria-label="PandaMobo 熊猫新媒首页">
                  <img className="footer-logo" src="/brand/pandamobo-logo.png" alt={`${chrome.brand.nameZh} ${chrome.brand.nameEn}`} width={160} height={56} />
                </Link>
                <p>以数据与传播双基因<br />连接中国品牌与全球市场</p>
                <span className="footer-brand-signature">PANDAMOBO / GO GLOBAL</span>
              </div>
              <nav className="footer-column" aria-label="页脚服务与方案">
                <h2>服务与方案</h2>
                <ul>
                  <li><Link href="/services/ad-asset-operations">优质媒介服务</Link></li>
                  <li><Link href="/services/media-operations">智能代投管家</Link></li>
                  <li><Link href="/services/global-brand-marketing">品牌出海全案</Link></li>
                  <li><Link href="/services/strategic-studio">全球商业智库</Link></li>
                  <li><Link href="/solutions">行业解决方案</Link></li>
                </ul>
              </nav>
              <nav className="footer-column" aria-label="页脚产品与技术">
                <h2>产品与技术</h2>
                <ul>
                  <li><Link href="/products">AI 产品矩阵</Link></li>
                  <li><Link href="/whatsapp">WhatsApp 商业解决方案</Link></li>
                </ul>
                <Link className="footer-all-products" href="/products">探索技术产品 <span aria-hidden="true">↗</span></Link>
              </nav>
              <nav className="footer-column" aria-label="页脚关于熊猫新媒">
                <h2>探索 PandaMobo</h2>
                <ul>
                  <li><Link href="/cases">客户案例</Link></li>
                  <li><Link href="/insights">出海资讯</Link></li>
                  <li><Link href="/about">关于我们</Link></li>
                  <li><Link href="/contact">联系我们</Link></li>
                </ul>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>PandaMobo 熊猫新媒</span>
              <div className="footer-legal">
                <Link href="/privacy">隐私政策</Link>
                <button type="button" onClick={() => setPrivacyOpen(true)}>隐私说明</button>
                <a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}>返回顶部 <span aria-hidden="true">↑</span></a>
              </div>
            </div>
          </div>
        </footer>
        {overlayKind ? (
          <div className={overlayKind === "menu" ? "backdrop" : "backdrop center"} onMouseDown={() => { setMenuOpen(false); setConsultOpen(false); setPrivacyOpen(false); }}>
            <div
              ref={overlayRef}
              id={overlayKind === "menu" ? "mobile-menu" : undefined}
              className={overlayKind === "menu" ? "mobile-menu" : "dialog"}
              role="dialog"
              aria-modal="true"
              aria-labelledby="site-overlay-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button className="btn btn-ghost close-button" type="button" onClick={() => { setMenuOpen(false); setConsultOpen(false); setPrivacyOpen(false); }}>
                关闭
              </button>
              {overlayKind === "menu" ? (
                <nav aria-label="移动端导航">
                  <h2 id="site-overlay-title">导航</h2>
                  {chrome.nav.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                  <button className="btn btn-primary" type="button" onClick={() => openConsult()}>
                    咨询出海方案
                  </button>
                </nav>
              ) : null}
              {overlayKind === "consult" ? (
                <div>
                  <h2 id="site-overlay-title">{chrome.contact.title}</h2>
                  <p>{chrome.contact.text}</p>
                  <ConsultForm idPrefix="dialog" serviceOptions={chrome.contact.serviceOptions} privacyText={chrome.contact.privacyText} initialService={consultService} />
                </div>
              ) : null}
              {overlayKind === "privacy" ? (
                <div>
                  <h2 id="site-overlay-title">隐私说明</h2>
                  <p>{chrome.contact.privacyText}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </SiteUIContext.Provider>
  );
}
