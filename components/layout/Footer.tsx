import Link from "next/link";
import Image from "next/image";
import { footerNav } from "@/content/navigation";
import { catalogs, company, contact, phoenixLocation, telHref } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`on-dark ${styles.footer}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image src="/brand/highland-logo-light.svg" alt="Highland Cabinetry Inc." width={132} height={60} unoptimized />
          <p className={styles.tag}>Wholesale kitchen and bath cabinetry for contractors, builders, remodelers and dealers.</p>
        </div>

        {footerNav.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className={styles.col}>
            <p className={`label ${styles.h}`}>{col.heading}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.col}>
          <p className={`label ${styles.h}`}>Contact</p>
          <address className={styles.addr}>
            <a href={telHref(contact.phone.value)}>{contact.phone.value}</a>
            <a href={`mailto:${contact.salesEmail.value}`}>{contact.salesEmail.value}</a>
            <span className={styles.loc}>
              {phoenixLocation.name}
              <br />
              {phoenixLocation.street}
              <br />
              {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
            </span>
          </address>
        </div>
      </div>

      <div className="container">
        <hr className="reveal-line" />
        <div className={styles.base}>
          <p>
            © {new Date().getFullYear()} {company.legalName.value} All rights reserved.
          </p>
          <ul className={styles.cats}>
            {catalogs.map((c) => (
              <li key={c.id}>
                <a href={c.href}>{c.title} (PDF)</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
