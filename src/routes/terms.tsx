import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Stocketize AI" },
      { name: "description", content: "The rules that govern your use of the Stocketize AI website and its educational content." },
      { property: "og:title", content: "Terms & Conditions — Stocketize AI" },
      { property: "og:description", content: "Please read these terms carefully before using the site." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

function Terms() {
  return (
    <LegalLayout title="Terms & Conditions" updated="July 2026">
      <p>
        By accessing or using <strong>www.yr.stocketize.com</strong> ("the site"), you agree to be bound by these
        Terms & Conditions. If you do not agree, please do not use the site.
      </p>

      <h2>Educational use only</h2>
      <p>
        All content on Stocketize AI is provided for education and general information only. Nothing on the site
        constitutes investment, tax, legal or financial advice. You are solely responsible for your own decisions.
      </p>

      <h2>Account & accuracy</h2>
      <ul>
        <li>You agree to provide accurate contact details when signing up.</li>
        <li>You will not misuse the site, attempt to disrupt it, scrape it, or reverse-engineer it.</li>
        <li>We may suspend access for any conduct that violates these terms.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        Text, design, code and graphics on the site are owned by or licensed to Stocketize AI and may not be
        reproduced without permission, except for brief personal, non-commercial quoting with attribution.
      </p>

      <h2>Third-party links</h2>
      <p>
        The site links to third-party services (news sources, financial-data providers, learning resources). We are
        not responsible for the content or availability of those external sites.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Stocketize AI is not liable for any losses (financial or otherwise)
        arising from your use of, or reliance on, information published on the site.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms; continued use of the site constitutes acceptance of the updated terms.</p>
    </LegalLayout>
  );
}
