import type { Metadata, Viewport } from "next";
import "./globals.css";
import { monaSans } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PreviewBar } from "@/components/layout/PreviewBar";
import { QuoteProvider } from "@/components/quote/QuoteContext";
import { indexingEnabled, siteUrl } from "@/content/site";
import { jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Highland Cabinetry — Wholesale Kitchen & Bath Cabinets", template: "%s | Highland Cabinetry" },
  description:
    "Wholesale Shaker, Nano and Euro kitchen and bath cabinetry for contractors, builders, remodelers and dealers, from Highland Cabinetry in Phoenix, Arizona.",
  robots: indexingEnabled ? undefined : { index: false, follow: false, nocache: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Highland Cabinetry",
  url: siteUrl,
  logo: `${siteUrl}/brand/highland-logo.svg`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={monaSans.variable} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <QuoteProvider>
          <PreviewBar />
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </QuoteProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organization)} />
      </body>
    </html>
  );
}
