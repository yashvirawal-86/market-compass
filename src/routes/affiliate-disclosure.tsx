import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/affiliate-disclosure")({
  component: AffiliateDisclosure,
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure — Stocketize AI" },
      { name: "description", content: "How Stocketize AI earns revenue through advertisements, affiliate partnerships, sponsored content and referral links." },
      { property: "og:title", content: "Affiliate Disclosure — Stocketize AI" },
      { property: "og:description", content: "Transparency about how the site is funded." },
      { property: "og:url", content: "/affiliate-disclosure" },
    ],
    links: [{ rel: "canonical", href: "/affiliate-disclosure" }],
  }),
});

function AffiliateDisclosure() {
  return (
    <LegalLayout title="Affiliate Disclosure" updated="July 2026">
      <p>
        Stocketize AI (<strong>www.yr.stocketize.com</strong>) is an <strong>AI-generated, educational and informational
        platform</strong>. To keep the site free for readers, we earn revenue through:
      </p>
      <ul>
        <li><strong>Advertisements</strong> — display and contextual ads that may appear alongside content.</li>
        <li><strong>Affiliate partnerships</strong> — links to brokers, courses, books, tools and other services from which we may earn a commission when you click through and sign up or purchase.</li>
        <li><strong>Sponsored content</strong> — clearly-labelled articles or sections funded by third parties. Sponsorship never dictates our editorial framing on independent analysis pages.</li>
        <li><strong>Referral links</strong> — recommendations of products or services that we may be compensated for.</li>
      </ul>

      <h2>What this means for you</h2>
      <p>
        You never pay more when you use an affiliate or referral link — pricing is the same as visiting the partner
        directly. Commissions help fund the research, hosting and content on the site.
      </p>

      <h2>Not financial advice</h2>
      <p>
        Even where a partner is mentioned, nothing on the site is investment advice. Please read our{" "}
        <a href="/disclaimer">Disclaimer</a> and always do your own research before acting.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about a partnership or sponsorship? Email{" "}
        <a href="mailto:yashvirawal86@gmail.com">yashvirawal86@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
