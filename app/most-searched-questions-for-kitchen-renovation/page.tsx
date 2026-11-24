import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContentBody } from "@/components/content/ContentPage";
import { ClosingCta } from "@/components/home/Sections";
import { jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Most Searched Questions for Kitchen Renovation, Answered",
  description:
    "Budget, contractors, design trends, small-kitchen storage, cabinet materials and finishes, and renovation timelines — common kitchen renovation questions answered by Highland Cabinetry.",
  path: "/most-searched-questions-for-kitchen-renovation/",
});

type QA = { q: string; items: [string, string][] };

/**
 * Restored from the previous site (first published October 15, 2023). Answers are kept as written except
 * where they conflicted with Highland's June 2025 catalogs: inventory/lead-time figures, door and back-panel
 * materials, coat counts and OEM customisation were replaced with catalog-supported statements.
 */
const faqs: QA[] = [
  {
    q: "What should I consider before starting a kitchen renovation?",
    items: [
      ["Budget", "Understand how much you can realistically afford to spend. Consider both bottom and top-dollar budgets and what you would imagine the finished remodel would look like for each."],
      ["Needs vs. wants", "List all your needs (essentials) and wants (luxury items) to guide your spending. Consider practicality; customers frequently overlook their daily routine’s necessities while envisioning endless possibilities."],
      ["Design", "Think about the layout and functionality of your kitchen. How do you use your kitchen? What changes would make it more practical?"],
      ["Contractor selection", "Choose a reputable contractor who understands your vision and can deliver within your budget. Highland sells through the trade and can point homeowners to contractors and dealers it works with."],
      ["Time frame", "Consider the best time to start your renovation, keeping in mind any significant dates or events you might be hosting in your home. It’s important to factor in extra time for unforeseen delays at the end of your project. I’ve personally witnessed many instances where projects were postponed due to unexpected circumstances."],
    ],
  },
  {
    q: "How do I choose the right contractor for my kitchen renovation?",
    items: [
      ["Credentials and experience", "Look for a contractor with strong references, ample experience, and necessary certifications."],
      ["Portfolio", "Review their past projects to assess their craftsmanship and style compatibility."],
      ["Quotes", "Get detailed quotes from at least three contractors to compare prices and scope of work."],
      ["Communication", "Make sure they communicate well and understand your expectations. Think about drafting a written list to avoid relying on memory for expectations communicated verbally. Having a document for reference is crucial for adhering to the initial plan."],
    ],
  },
  {
    q: "What are the latest trends in kitchen design?",
    items: [
      ["Open shelving", "This design choice adds depth to your kitchen and is popular for displaying dishes and glassware."],
      ["Two-tone cabinets", "Mixing colors, usually a darker lower cabinet with a lighter upper, adds visual interest and depth. Two of our most requested looks pair Highland’s Onyx Black on base and island cabinets with White Shaker uppers — a “tuxedo” kitchen."],
      ["Smart kitchens", "Embracing technology through smart appliances and fixtures can enhance kitchen functionality. Internal LED strip lighting can change the whole feel of a project with minimal effort."],
      ["Eco-friendly materials", "Sustainable materials like bamboo for flooring or recycled glass for countertops are becoming increasingly popular."],
    ],
  },
  {
    q: "How can I maximize the space in a small kitchen?",
    items: [
      ["Storage solutions", "Pull-out drawers, corner cabinets, and overhead storage help use every square inch."],
      ["Minimalist design", "Keeping the countertop clutter-free and the design elements minimal helps the space feel larger."],
      ["Light colors", "Light colors for walls, cabinets, and floors make the space appear bigger and more open."],
      ["Mirrored backsplashes", "Reflecting light can visually expand the space and add a modern touch."],
    ],
  },
  {
    q: "What should I know about the materials and finishes for kitchen cabinets?",
    items: [
      ["Material choices", "Highland’s Shaker and Nano cabinets are built on a cabinet-grade plywood box — ⅝″ backs and ½″ end panels — with ¾″ full-overlay doors and L-bracket reinforcement for heavy stone tops. Euro cabinets use a ¾″ engineered furniture-board case."],
      ["Finishes", "Choose a finish that complements the overall design of your kitchen. Matte and gloss finishes both have their places, depending on the style you are going for. Highland’s Shaker and Nano cabinets carry a clear-coat UV finish throughout."],
      ["Hardware", "The right knobs, pulls, and handles can significantly enhance the overall look of your cabinets."],
    ],
  },
  {
    q: "How long does a typical kitchen renovation take?",
    items: [
      ["Planning and design", "1–2 months, depending on the complexity of the project."],
      ["Ordering and shipping materials", "1–3 months, influenced by the availability and origin of materials. Highland processes orders placed by 3 PM Arizona time the same business day, and your account manager confirms lead times for each order."],
      ["Construction", "1–3 months; this phase can vary greatly based on the scope of work and unforeseen challenges."],
    ],
  },
];

const tips: [string, string][] = [
  ["Stay flexible", "Be prepared for unexpected issues or delays. A flexible mindset helps reduce stress throughout the renovation."],
  ["Keep resale in mind", "If you plan to sell your house in the future, consider which improvements will increase your home’s market value."],
  ["Regular updates", "Keep open lines of communication with your contractor so the project stays on track and within budget."],
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.items.map(([k, v]) => `${k}: ${v}`).join(" ") } })),
  };
  return (
    <>
      <PageIntro eyebrow="Kitchen renovation FAQ" title={<>The most searched questions <em>for kitchen renovation.</em></>}>
        <p className="lead">
          Answered by James McAllister, president of Highland Cabinetry Inc. First published October 15, 2023.
        </p>
      </PageIntro>
      <ContentBody review="Restored from the previous site. Answers that conflicted with the June 2025 catalogs were corrected: the “20,000 kitchens… around one week” lead time, “MDF door… furniture board backing”, “three coats of primer and two coats of top finish” and “OEM… customize wood options”. Confirm the byline is still current.">
        <p>
          Renovating your kitchen can be an overwhelming process. Whether you’re overhauling the space, restoring historical features, or simply
          giving your kitchen a fresh look, there are many considerations to keep in mind. To help, here are the questions we hear most often.
        </p>
        {faqs.map((f, i) => (
          <div key={f.q}>
            <h2>
              {i + 1}. {f.q}
            </h2>
            <ul>
              {f.items.map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h2>Additional tips for a successful kitchen renovation</h2>
        <ul>
          {tips.map(([k, v]) => (
            <li key={k}>
              <strong>{k}:</strong> {v}
            </li>
          ))}
        </ul>
        <p>
          Planning cabinets for a project? <Link href="/products/">Browse the collections</Link>, read more on the <Link href="/blog/">blog</Link>, or{" "}
          <Link href="/request-a-quote/">request a quote</Link>.
        </p>
      </ContentBody>
      <ClosingCta source="faq" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
    </>
  );
}
