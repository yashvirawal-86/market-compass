import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Stocketize AI" },
      { name: "description", content: "How Stocketize AI collects, uses, and protects the information of visitors and subscribers." },
      { property: "og:title", content: "Privacy Policy — Stocketize AI" },
      { property: "og:description", content: "Our commitment to your privacy and data protection." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
});

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 2026">
      <p>
        Stocketize AI ("we", "us", "our") respects your privacy. This Privacy Policy explains what we
        collect when you visit <strong>www.yr.stocketize.com</strong>, why we collect it, and how we handle it.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Contact details</strong> you submit voluntarily via sign-up, login or newsletter forms — name, email, mobile number, purpose of visit.</li>
        <li><strong>Usage data</strong> such as pages viewed, referring URL, browser type and approximate location (from IP), collected via standard analytics.</li>
        <li><strong>Cookies</strong> to remember preferences (e.g. theme) and to measure aggregate traffic.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To deliver the newsletter and market briefs you subscribed to.</li>
        <li>To respond to enquiries and improve the content and functionality of the site.</li>
        <li>To maintain security and prevent abuse.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal data. We may share limited data with trusted processors (e.g. email delivery,
        analytics providers) strictly to operate the service, under confidentiality obligations.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access, correction, or deletion of your personal data, and you can unsubscribe from any
        newsletter at any time. Contact <a href="mailto:yashvirawal86@gmail.com">yashvirawal86@gmail.com</a>.
      </p>

      <h2>Children</h2>
      <p>The site is not directed at children under 13; we do not knowingly collect data from them.</p>

      <h2>Changes</h2>
      <p>We may update this policy. The "Last updated" date at the top reflects the current version.</p>
    </LegalLayout>
  );
}
