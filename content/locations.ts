/**
 * Service-area URLs inherited from the previous site (49 state pages, ~150 city pages).
 *
 * These are areas the old site described as served — NOT physical locations. The only physical
 * location in the archive is the Phoenix showroom & warehouse (see content/site.ts). Coverage per
 * state still needs Highland confirmation, so these feed redirects and the service-area selector
 * rather than ~200 thin landing pages.
 */
export interface ServiceState { slug: string; name: string; cities: { slug: string; name: string }[] }

export const serviceStates: ServiceState[] = [
  { slug: "alabama", name: "Alabama", cities: [{ slug: "birmingham", name: "Birmingham" }, { slug: "huntsville", name: "Huntsville" }, { slug: "mobile", name: "Mobile" }, { slug: "montgomery", name: "Montgomery" }] },
  { slug: "alaska", name: "Alaska", cities: [{ slug: "anchorage", name: "Anchorage" }] },
  { slug: "arizona", name: "Arizona", cities: [{ slug: "buckeye", name: "Buckeye" }, { slug: "mesa", name: "Mesa" }, { slug: "phoenix", name: "Phoenix" }, { slug: "tempe", name: "Tempe" }, { slug: "tucson", name: "Tucson" }] },
  { slug: "arkansas", name: "Arkansas", cities: [{ slug: "little-rock", name: "Little Rock" }] },
  { slug: "california", name: "California", cities: [{ slug: "anaheim", name: "Anaheim" }, { slug: "fresno", name: "Fresno" }, { slug: "los-angeles", name: "Los Angeles" }, { slug: "orange-county", name: "Orange County" }, { slug: "sacramento", name: "Sacramento" }, { slug: "san-diego", name: "San Diego" }, { slug: "santa-ana", name: "Santa Ana" }] },
  { slug: "colorado", name: "Colorado", cities: [{ slug: "colorado-springs", name: "Colorado Springs" }, { slug: "denver", name: "Denver" }, { slug: "fort-collins", name: "Fort Collins" }] },
  { slug: "connecticut", name: "Connecticut", cities: [{ slug: "bridgeport", name: "Bridgeport" }, { slug: "hartford", name: "Hartford" }, { slug: "new-haven", name: "New Haven" }, { slug: "stamford", name: "Stamford" }] },
  { slug: "delaware", name: "Delaware", cities: [{ slug: "wilmington", name: "Wilmington" }] },
  { slug: "florida", name: "Florida", cities: [{ slug: "hialeah", name: "Hialeah" }, { slug: "jacksonville", name: "Jacksonville" }, { slug: "miami", name: "Miami" }, { slug: "naples", name: "Naples" }, { slug: "orlando", name: "Orlando" }, { slug: "st-petersburg", name: "St. Petersburg" }, { slug: "tampa", name: "Tampa" }] },
  { slug: "georgia", name: "Georgia", cities: [{ slug: "atlanta", name: "Atlanta" }, { slug: "augusta", name: "Augusta" }, { slug: "columbus", name: "Columbus" }, { slug: "savannah", name: "Savannah" }] },
  { slug: "hawaii", name: "Hawaii", cities: [{ slug: "honolulu", name: "Honolulu" }] },
  { slug: "idaho", name: "Idaho", cities: [{ slug: "boise-city", name: "Boise City" }, { slug: "meridian", name: "Meridian" }, { slug: "nampa", name: "Nampa" }] },
  { slug: "illinois", name: "Illinois", cities: [{ slug: "chicago", name: "Chicago" }, { slug: "rockford", name: "Rockford" }] },
  { slug: "indiana", name: "Indiana", cities: [{ slug: "evansville", name: "Evansville" }, { slug: "fort-wayne", name: "Fort Wayne" }, { slug: "indianapolis", name: "Indianapolis" }] },
  { slug: "iowa", name: "Iowa", cities: [{ slug: "cedar-rapids", name: "Cedar Rapids" }, { slug: "des-moines", name: "Des Moines" }] },
  { slug: "kansas", name: "Kansas", cities: [{ slug: "kansas-city", name: "Kansas City" }, { slug: "olathe", name: "Olathe" }, { slug: "overland-park", name: "Overland Park" }, { slug: "topeka", name: "Topeka" }, { slug: "wichita", name: "Wichita" }] },
  { slug: "kentucky", name: "Kentucky", cities: [{ slug: "corbin", name: "Corbin" }, { slug: "lexington", name: "Lexington" }, { slug: "louisville", name: "Louisville" }] },
  { slug: "louisiana", name: "Louisiana", cities: [{ slug: "baton-rouge", name: "Baton Rouge" }, { slug: "metairie", name: "Metairie" }, { slug: "new-orleans", name: "New Orleans" }, { slug: "shreveport", name: "Shreveport" }] },
  { slug: "maine", name: "Maine", cities: [] },
  { slug: "maryland", name: "Maryland", cities: [{ slug: "baltimore", name: "Baltimore" }] },
  { slug: "massachusetts", name: "Massachusetts", cities: [{ slug: "boston", name: "Boston" }, { slug: "springfield", name: "Springfield" }, { slug: "worcester", name: "Worcester" }] },
  { slug: "michigan", name: "Michigan", cities: [{ slug: "detroit", name: "Detroit" }, { slug: "grand-rapids", name: "Grand Rapids" }] },
  { slug: "minnesota", name: "Minnesota", cities: [{ slug: "minneapolis", name: "Minneapolis" }, { slug: "rochester", name: "Rochester" }, { slug: "st-paul", name: "St. Paul" }] },
  { slug: "mississippi", name: "Mississippi", cities: [{ slug: "jackson", name: "Jackson" }] },
  { slug: "missouri", name: "Missouri", cities: [{ slug: "kansas-city", name: "Kansas City" }, { slug: "st-louis", name: "St. Louis" }] },
  { slug: "montana", name: "Montana", cities: [{ slug: "billings", name: "Billings" }] },
  { slug: "nebraska", name: "Nebraska", cities: [{ slug: "lincoln", name: "Lincoln" }, { slug: "omaha", name: "Omaha" }] },
  { slug: "nevada", name: "Nevada", cities: [{ slug: "henderson", name: "Henderson" }, { slug: "las-vegas", name: "Las Vegas" }, { slug: "reno", name: "Reno" }] },
  { slug: "new-hampshire", name: "New Hampshire", cities: [{ slug: "manchester", name: "Manchester" }] },
  { slug: "new-jersey", name: "New Jersey", cities: [{ slug: "jersey-city", name: "Jersey City" }, { slug: "newark", name: "Newark" }] },
  { slug: "new-mexico", name: "New Mexico", cities: [{ slug: "albuquerque", name: "Albuquerque" }, { slug: "las-cruces", name: "Las Cruces" }, { slug: "rio-rancho", name: "Rio Rancho" }, { slug: "santa-fe", name: "Santa Fe" }] },
  { slug: "new-york", name: "New York", cities: [{ slug: "albany", name: "Albany" }, { slug: "buffalo", name: "Buffalo" }, { slug: "long-island", name: "Long Island" }, { slug: "new-york-city", name: "New York City" }, { slug: "rochester", name: "Rochester" }, { slug: "syracuse", name: "Syracuse" }] },
  { slug: "north-carolina", name: "North Carolina", cities: [{ slug: "charlotte", name: "Charlotte" }, { slug: "durham", name: "Durham" }, { slug: "greensboro", name: "Greensboro" }, { slug: "raleigh", name: "Raleigh" }, { slug: "winston-salem", name: "Winston Salem" }] },
  { slug: "north-dakota", name: "North Dakota", cities: [{ slug: "fargo", name: "Fargo" }] },
  { slug: "ohio", name: "Ohio", cities: [{ slug: "akron", name: "Akron" }, { slug: "cincinnati", name: "Cincinnati" }, { slug: "cleveland", name: "Cleveland" }, { slug: "columbus", name: "Columbus" }, { slug: "dayton", name: "Dayton" }, { slug: "toledo", name: "Toledo" }] },
  { slug: "oklahoma", name: "Oklahoma", cities: [{ slug: "norman", name: "Norman" }, { slug: "oklahoma-city", name: "Oklahoma City" }, { slug: "tulsa", name: "Tulsa" }] },
  { slug: "oregon", name: "Oregon", cities: [{ slug: "eugene", name: "Eugene" }, { slug: "portland", name: "Portland" }, { slug: "salem", name: "Salem" }] },
  { slug: "pennsylvania", name: "Pennsylvania", cities: [{ slug: "allentown", name: "Allentown" }, { slug: "philadelphia", name: "Philadelphia" }, { slug: "pittsburgh", name: "Pittsburgh" }] },
  { slug: "rhode-island", name: "Rhode Island", cities: [{ slug: "providence", name: "Providence" }] },
  { slug: "south-carolina", name: "South Carolina", cities: [{ slug: "charleston", name: "Charleston" }] },
  { slug: "south-dakota", name: "South Dakota", cities: [{ slug: "sioux-falls", name: "Sioux Falls" }] },
  { slug: "tennessee", name: "Tennessee", cities: [{ slug: "chattanooga", name: "Chattanooga" }, { slug: "clarksville", name: "Clarksville" }, { slug: "knoxville", name: "Knoxville" }, { slug: "memphis", name: "Memphis" }, { slug: "murfreesboro", name: "Murfreesboro" }, { slug: "nashville", name: "Nashville" }] },
  { slug: "texas", name: "Texas", cities: [{ slug: "austin", name: "Austin" }, { slug: "dallas", name: "Dallas" }, { slug: "houston", name: "Houston" }, { slug: "san-antonio", name: "San Antonio" }] },
  { slug: "utah", name: "Utah", cities: [{ slug: "orem", name: "Orem" }, { slug: "provo", name: "Provo" }, { slug: "salt-lake-city", name: "Salt Lake City" }, { slug: "west-jordan", name: "West Jordan" }, { slug: "west-valley-city", name: "West Valley City" }] },
  { slug: "vermont", name: "Vermont", cities: [] },
  { slug: "virginia", name: "Virginia", cities: [{ slug: "alexandria", name: "Alexandria" }, { slug: "arlington", name: "Arlington" }, { slug: "chesapeake", name: "Chesapeake" }, { slug: "newport-news", name: "Newport News" }, { slug: "norfolk", name: "Norfolk" }, { slug: "richmond", name: "Richmond" }, { slug: "virginia-beach", name: "Virginia Beach" }] },
  { slug: "washington", name: "Washington", cities: [{ slug: "seattle", name: "Seattle" }, { slug: "spokane", name: "Spokane" }, { slug: "tacoma", name: "Tacoma" }, { slug: "vancouver", name: "Vancouver" }] },
  { slug: "west-virginia", name: "West Virginia", cities: [] },
  { slug: "wisconsin", name: "Wisconsin", cities: [{ slug: "green-bay", name: "Green Bay" }, { slug: "madison", name: "Madison" }, { slug: "milwaukee", name: "Milwaukee" }] },
  { slug: "wyoming", name: "Wyoming", cities: [{ slug: "casper", name: "Casper" }, { slug: "cheyenne", name: "Cheyenne" }, { slug: "gillette", name: "Gillette" }, { slug: "laramie", name: "Laramie" }] },
];

/** Legacy oddities in the old sitemap that also need redirects. */
export const legacyLocationPaths = ["/wholesale-cabinets/wisconsin-old/madison-old/"];
