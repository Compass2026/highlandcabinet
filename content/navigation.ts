/** Primary navigation. Kept deliberately small even though the archive holds ~300 URLs. */
export const primaryNav = [
  { label: "For the Trade", href: "/wholesale-cabinets-for-contractors/" },
  { label: "Become a Dealer", href: "/become-a-dealer/" },
  { label: "Service Areas", href: "/wholesale-cabinets/" },
  { label: "Find a Dealer", href: "/find-a-dealer/" },
] as const;

export const footerNav = [
  {
    heading: "Collections",
    links: [
      { label: "All collections", href: "/products/" },
      { label: "Shaker", href: "/products/#line-shaker" },
      { label: "Nano", href: "/products/#line-nano" },
      { label: "Euro", href: "/products/#line-euro" },
      { label: "Catalogs", href: "/products/#catalogs" },
    ],
  },
  {
    heading: "Work with Highland",
    links: [
      { label: "Contractors & builders", href: "/wholesale-cabinets-for-contractors/" },
      { label: "Become a dealer", href: "/become-a-dealer/" },
      { label: "Request a quote", href: "/request-a-quote/" },
      { label: "Service areas", href: "/wholesale-cabinets/" },
    ],
  },
  {
    heading: "Homeowners",
    links: [
      { label: "Find a dealer", href: "/find-a-dealer/" },
      { label: "Contact us", href: "/contact-us/" },
    ],
  },
] as const;
