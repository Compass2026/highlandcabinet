import { PageIntro } from "@/components/ui/PageIntro";
import { ContentBody } from "@/components/content/ContentPage";
import { contact, phoenixLocation } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Highland Cabinetry Inc. collects, uses and protects information submitted through highlandcabinetry.com.",
  path: "/privacy-policy/",
});

const L = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

/** Text carried over from the previous site's policy (last modified 18 February 2026); contact placeholders filled. */
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Privacy Policy", href: "/privacy-policy/" }]} eyebrow="Legal" title="Privacy Policy">
        <p className="lead">Last updated February 18, 2026.</p>
      </PageIntro>
      <ContentBody review="Carried over from the previous site’s policy. Its contact lines were unfilled placeholders and listed a different phone number (866-210-8560); they now use the site’s confirmed contact details. Highland should have counsel review this policy — including how quote and dealer forms are stored and which analytics run — before launch.">
        <p>
          Highland Cabinetry Inc. (“Highland Cabinetry,” “Company,” “we,” “our,” or “us”) respects your privacy and is committed to protecting
          the information you provide when visiting HighlandCabinetry.com (the “Website”). This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information.
        </p>
        <h2>1. Information we collect</h2>
        <h3>A. Personal information</h3>
        <p>Information you voluntarily provide, including:</p>
        <L items={["Full name", "Email address", "Phone number", "Business name", "Billing or shipping address", "Project details or showroom inquiries", "Account registration information", "Payment information when applicable"]} />
        <h3>B. Business information</h3>
        <p>If you are a contractor, distributor, or trade partner, we may collect:</p>
        <L items={["Company credentials", "Licensing details", "Tax ID information", "Purchase history", "Credit application data"]} />
        <h3>C. Automatically collected information</h3>
        <p>When you visit our Website, we may automatically collect:</p>
        <L items={["IP address", "Browser type", "Device information", "Pages visited", "Referring website", "Time spent on pages", "Interaction data"]} />
        <p>This data may be collected through cookies, analytics tools, and tracking technologies.</p>
        <h2>2. How we use your information</h2>
        <p>We use collected information to:</p>
        <L items={["Respond to inquiries and provide customer support", "Process orders and payments", "Manage contractor and distributor accounts", "Improve website functionality and user experience", "Analyze traffic and marketing effectiveness", "Send relevant updates, promotions, or announcements", "Comply with legal obligations", "Protect against fraud or unauthorized activity"]} />
        <p>
          <strong>We do not sell your personal information.</strong>
        </p>
        <h2>3. Cookies and tracking technologies</h2>
        <p>HighlandCabinetry.com may use cookies, pixels, and similar technologies to:</p>
        <L items={["Improve website performance", "Store user preferences", "Track marketing campaign performance", "Enable analytics tools such as Google Analytics"]} />
        <p>You may disable cookies in your browser settings; however, some features of the Website may not function properly.</p>
        <h2>4. Sharing of information</h2>
        <p>We may share your information with:</p>
        <L items={["Payment processors", "CRM or ERP systems", "Marketing platforms", "Shipping and logistics partners", "Website hosting providers", "Analytics providers"]} />
        <p>
          These third parties are required to maintain appropriate data security measures. We may also disclose information if required by law or
          to protect our rights, safety, or property.
        </p>
        <h2>5. Data security</h2>
        <p>
          We implement reasonable administrative, technical, and physical safeguards designed to protect your information. However, no online
          transmission is completely secure, and we cannot guarantee absolute security.
        </p>
        <h2>6. Your privacy rights</h2>
        <p>Depending on your state of residence, including California under the California Consumer Privacy Act (CCPA), you may have the right to:</p>
        <L items={["Request access to your personal data", "Request correction of inaccurate information", "Request deletion of your personal information", "Opt out of certain data processing"]} />
        <p>
          To exercise these rights, contact us at <a href={`mailto:${contact.salesEmail.value}`}>{contact.salesEmail.value}</a> or{" "}
          {contact.phone.value}.
        </p>
        <h2>7. Third-party links</h2>
        <p>Our Website may contain links to external websites. We are not responsible for the privacy practices of third-party sites.</p>
        <h2>8. Children’s privacy</h2>
        <p>HighlandCabinetry.com is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
        <h2>9. Data retention</h2>
        <p>We retain information for as long as necessary to:</p>
        <L items={["Fulfill business purposes", "Maintain accounting records", "Comply with legal obligations", "Resolve disputes"]} />
        <h2>10. Changes to this policy</h2>
        <p>We may update this Privacy Policy periodically. Updates will be posted on this page with a revised effective date.</p>
        <h2>11. Contact information</h2>
        <address>
          Highland Cabinetry Inc.
          <br />
          {phoenixLocation.street}
          <br />
          {phoenixLocation.locality}, {phoenixLocation.region} {phoenixLocation.postalCode}
          <br />
          Email: <a href={`mailto:${contact.salesEmail.value}`}>{contact.salesEmail.value}</a>
          <br />
          Phone: {contact.phone.value}
        </address>
      </ContentBody>
    </>
  );
}
