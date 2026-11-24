import { queryOf } from "@/lib/params";
import { AreaChecker } from "@/components/ui/AreaChecker";
import { PageIntro } from "@/components/ui/PageIntro";
import { Media } from "@/components/ui/Media";
import { orderPolicy, phoenixLocation } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { citiesIn, stateAreas } from "@/lib/serviceAreas";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Wholesale Cabinets Near You — Service Areas from Phoenix, AZ",
  description:
    "Highland Cabinetry's showroom and warehouse are in Phoenix, Arizona. See how Highland supplies trade customers and dealers in other states.",
  path: "/wholesale-cabinets/",
});

export default async function ServiceAreasPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await queryOf(searchParams);
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Service Areas", href: "/wholesale-cabinets/" }]}
        aside={<Media id="scene-shaker-grey" sizes="(max-width: 900px) 100vw, 40vw" caption="Grey Shaker" />} eyebrow="Service areas" title={<>Based in Phoenix. <em>Supplying the trade beyond it.</em></>}>
        <p className="lead">
          Highland&rsquo;s showroom and warehouse are in Phoenix, Arizona. Other cities and states are areas we supply by delivery and freight —
          not branch locations.
        </p>
      </PageIntro>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.loc}>
            <p className="label muted">Physical location</p>
            <h2 className={styles.h2}>{phoenixLocation.name}</h2>
            <address className={styles.addr}>
              {phoenixLocation.street}
              <br />
              {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
            </address>
            <dl className={styles.dl}>
              <div>
                <dt className="label">Warehouse pickup</dt>
                <dd>{phoenixLocation.pickupHours.value}</dd>
              </div>
              <div>
                <dt className="label">Same-day processing</dt>
                <dd>{orderPolicy.cutoff.value}</dd>
              </div>
              <div>
                <dt className="label">Delivery options</dt>
                <dd>
                  <ul>
                    {orderPolicy.deliveryOptions.value.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <AreaChecker initial={state} />
            <p className={styles.note}>
              Every state and city below is an area Highland supplies by delivery and freight; Phoenix is the showroom and warehouse.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="all-areas">
        <div className="container">
          <h2 id="all-areas" className={styles.h2}>
            All service areas
          </h2>
          <ul className={styles.states}>
            {stateAreas
              .slice()
              .sort((a, b) => a.stateName.localeCompare(b.stateName))
              .map((st) => {
                const cities = citiesIn(st.state);
                return (
                  <li key={st.path}>
                    <Link href={st.path} className={styles.stateLink}>
                      {st.stateName}
                    </Link>
                    {cities.length ? (
                      <p className={styles.cities}>
                        {cities.map((c, i) => (
                          <span key={c.path}>
                            <Link href={c.path}>{c.cityName}</Link>
                            {i < cities.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
    </>
  );
}
