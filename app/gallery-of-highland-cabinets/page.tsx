import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ClosingCta } from "@/components/home/Sections";
import { finishes, lineOrder, lines } from "@/content/collections";
import generated from "@/content/media.generated.json";
import { kindLabel, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Gallery — Highland Shaker, Nano and Euro Cabinets",
  description:
    "Kitchens and cabinets from Highland Cabinetry: renderings of every Shaker, Nano and Euro finish, product renderings of individual cabinets, and installed White Shaker projects.",
  path: "/gallery-of-highland-cabinets/",
  image: "/media/scene-euro-white-oak.jpg",
});

const ids = Object.keys(generated);
const skusFor = (finishId: string) => ids.filter((id) => id.startsWith(`sku-${finishId}-`));
const installed = ids.filter((id) => id.startsWith("project-white-shaker-"));

export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Gallery" title={<>Every finish, <em>in the room and up close.</em></>}>
        <p className="lead">
          Highland&rsquo;s renderings of each finish, product renderings of individual cabinets, and installed White Shaker kitchens. Every
          image is labelled with what it is.
        </p>
        <nav className={styles.jump} aria-label="Gallery sections">
          {lineOrder.map((l) => (
            <a key={l} href={`#${l}-style`}>
              {lines[l].name}
            </a>
          ))}
          <a href="#installed">Installed projects</a>
        </nav>
      </PageIntro>

      {lineOrder.map((l) => {
        const fs = finishes.filter((f) => f.line === l);
        return (
          <section key={l} id={`${l}-style`} className={`section ${styles.line}`} aria-labelledby={`${l}-title`}>
            <div className="container">
              <header className={styles.head}>
                <h2 id={`${l}-title`}>{lines[l].name}</h2>
                <p>{lines[l].short}</p>
              </header>
              <ul className={styles.rooms}>
                {fs.map((f) => {
                  const sceneId = f.id === "shaker-white" ? "scene-shaker-white" : f.media.scene;
                  const m = media(sceneId);
                  return (
                    <li key={f.id}>
                      <Link href={f.path} className={styles.room}>
                        <span className={styles.roomImg}>
                          <Image src={m.src} alt={m.alt} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} placeholder="blur" blurDataURL={m.blurDataURL} />
                        </span>
                        <span className={styles.roomCap}>
                          <span className={styles.roomName}>{f.name}</span>
                          <span className={styles.kind}>{kindLabel[m.kind]}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h3 className={styles.sub}>Cabinets up close</h3>
              <ul className={styles.cabs}>
                {fs.flatMap((f) =>
                  [f.media.render, ...skusFor(f.id)].map((id) => {
                    const m = media(id);
                    const label = id.startsWith("sku-") ? m.alt.split(" in ")[0] : "Base cabinet";
                    return (
                      <li key={id}>
                        <Link href={f.path} className={styles.cab}>
                          <span className={styles.cabImg}>
                            <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 700px) 45vw, 18vw" />
                          </span>
                          <span className={styles.cabName}>{f.name}</span>
                          <span className={styles.cabType}>{label}</span>
                        </Link>
                      </li>
                    );
                  }),
                )}
              </ul>
            </div>
          </section>
        );
      })}

      <section id="installed" className={`section ${styles.line}`} aria-labelledby="installed-title">
        <div className="container">
          <header className={styles.head}>
            <h2 id="installed-title">Installed projects</h2>
            <p>White Shaker as installed, photographed on site.</p>
          </header>
          <ul className={styles.photos}>
            {installed.map((id) => {
              const m = media(id);
              return (
                <li key={id}>
                  <figure className={styles.photo}>
                    <span className={styles.photoImg}>
                      <Image src={m.src} alt={m.alt} fill sizes="(max-width: 700px) 100vw, 33vw" style={{ objectFit: "cover" }} placeholder="blur" blurDataURL={m.blurDataURL} />
                    </span>
                    <figcaption className={styles.kind}>{kindLabel[m.kind]} · White Shaker</figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ClosingCta source="gallery" />
    </>
  );
}
