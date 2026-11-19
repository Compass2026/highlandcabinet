"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav } from "@/content/navigation";
import { finishesByLine, lineOrder, lines } from "@/content/collections";
import { catalogs, contact, telHref } from "@/content/site";
import { media } from "@/lib/media";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Chevron, Close, Download, Phone } from "@/components/ui/icons";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [panel, setPanel] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const menuId = useId();
  const panelBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close everything on navigation (state reset during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPanel(false);
    setMenu(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape and outside click for the collections panel.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(false);
        panelBtn.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setPanel(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panel]);

  // Mobile menu: lock scroll, trap focus, Escape to close.
  useEffect(() => {
    if (!menu) return;
    const root = document.documentElement;
    // The menu sits directly under the header wherever it currently is (the preview bar can push it down).
    const top = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    menuRef.current?.style.setProperty("--menu-top", `${Math.round(top)}px`);
    root.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuBtn.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          menuBtn.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          menuBtn.current?.focus();
        } else if (!e.shiftKey && document.activeElement === menuBtn.current) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isCurrent = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <header ref={headerRef} className={styles.header} data-scrolled={scrolled || panel || menu ? "" : undefined}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} aria-label="Highland Cabinetry — home">
          <Image src="/brand/highland-logo.svg" alt="" width={97} height={44} priority unoptimized />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            <li>
              <button
                ref={panelBtn}
                type="button"
                className={styles.navBtn}
                aria-expanded={panel}
                aria-controls={panelId}
                onClick={() => setPanel((v) => !v)}
              >
                Collections <Chevron className={styles.chev} />
              </button>
            </li>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink} aria-current={isCurrent(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.phone} href={telHref(contact.phone.value)} aria-label={`Call Highland at ${contact.phone.value}`}>
            <Phone /> <span>{contact.phone.value}</span>
          </a>
          <QuoteButton source="header" className={`btn ${styles.quote}`} arrow={false}>
            <span className={styles.quoteLong}>Request a Quote</span>
            <span className={styles.quoteShort}>Quote</span>
          </QuoteButton>
          <button
            ref={menuBtn}
            type="button"
            className={styles.menuBtn}
            aria-expanded={menu}
            aria-controls={menuId}
            onClick={() => setMenu((v) => !v)}
          >
            <span className={styles.menuIcon} aria-hidden="true" data-open={menu ? "" : undefined}>
              <span />
              <span />
            </span>
            <span className="visually-hidden">{menu ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {/* Desktop collections panel — opens like a drawer, settles softly */}
      <div id={panelId} className={styles.panel} data-open={panel ? "" : undefined} hidden={!panel}>
        <div className={`container ${styles.panelInner}`}>
          {lineOrder.map((id) => (
            <div key={id} className={styles.panelCol}>
              <p className="label muted">
                {lines[id].name} · {lines[id].construction}
              </p>
              <ul className={styles.panelList}>
                {finishesByLine(id).map((f) => {
                  const chip = media(f.media.chip);
                  return (
                    <li key={f.id}>
                      <Link href={f.path} className={styles.panelLink} aria-current={isCurrent(f.path)}>
                        <Image src={chip.src} alt="" width={36} height={36} className={styles.panelChip} sizes="36px" />
                        <span>{f.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className={`${styles.panelCol} ${styles.panelAside}`}>
            <p className="label muted">Browse</p>
            <Link href="/products/" className="link-arrow">
              All collections
            </Link>
            <p className="label muted" style={{ marginTop: "1.5rem" }}>
              Catalogs
            </p>
            <ul className={styles.panelList}>
              {catalogs.map((c) => (
                <li key={c.id}>
                  <a href={c.href} className={styles.panelLink}>
                    <Download /> <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div id={menuId} ref={menuRef} className={styles.menu} data-open={menu ? "" : undefined} hidden={!menu}>
        <nav aria-label="Mobile" className={styles.menuInner}>
          <ul className={styles.menuPrimary}>
            <li>
              <Link href="/products/">Collections</Link>
            </li>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact-us/">Contact</Link>
            </li>
          </ul>
          <hr className="reveal-line" />
          <div className={styles.menuLines}>
            {lineOrder.map((id) => (
              <div key={id}>
                <p className="label muted">{lines[id].name}</p>
                <ul>
                  {finishesByLine(id).map((f) => (
                    <li key={f.id}>
                      <Link href={f.path}>{f.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <hr className="reveal-line" />
          <div className={styles.menuFoot}>
            <QuoteButton source="mobile-menu">Request a Quote</QuoteButton>
            <a className="btn btn--ghost" href={telHref(contact.phone.value)}>
              <Phone /> Call {contact.phone.value}
            </a>
          </div>
          <button type="button" className={styles.menuClose} onClick={() => { setMenu(false); menuBtn.current?.focus(); }}>
            <Close /> <span>Close menu</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
