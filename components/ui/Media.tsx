import Image from "next/image";
import { kindLabel, media } from "@/lib/media";
import styles from "./Media.module.css";

interface Props {
  id: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Crop to fill the parent box (parent must have a size). */
  fill?: boolean;
  caption?: string | false;
  /** Override alt (e.g. empty for decorative duplicates). */
  alt?: string;
  objectPosition?: string;
}

/**
 * Every image on the site goes through here so its provenance travels with it:
 * renderings are labelled as renderings, installed work as installed work.
 */
export function Media({ id, sizes, priority, className, fill, caption, alt, objectPosition }: Props) {
  const m = media(id);
  const img = fill ? (
    <Image
      src={m.src}
      alt={alt ?? m.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={m.blurDataURL ? "blur" : "empty"}
      blurDataURL={m.blurDataURL}
      style={{ objectFit: "cover", objectPosition }}
    />
  ) : (
    <Image
      src={m.src}
      alt={alt ?? m.alt}
      width={m.width}
      height={m.height}
      sizes={sizes}
      priority={priority}
      placeholder={m.blurDataURL ? "blur" : "empty"}
      blurDataURL={m.blurDataURL}
    />
  );

  if (caption === false) return <div className={`${styles.frame} ${className ?? ""}`} data-fill={fill ? "" : undefined}>{img}</div>;

  return (
    <figure className={`${styles.figure} ${className ?? ""}`}>
      <div className={styles.frame} data-fill={fill ? "" : undefined}>
        {img}
      </div>
      <figcaption className={styles.caption}>
        <span className="label">{kindLabel[m.kind]}</span>
        {caption ? <span>{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
