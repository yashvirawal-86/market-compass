import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/disclaimer")({
  component: Disclaimer,
  head: () => ({
    meta: [
      { title: "Disclaimer — Stocketize AI" },
      { name: "description", content: "Stocketize AI is an AI-generated educational platform. It is not financial advice." },
      { property: "og:title", content: "Disclaimer — Stocketize AI" },
      { property: "og:description", content: "Important information about the content on this site." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
});

function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" updated="July 2026">
      <p>
        <strong>Stocketize AI is an AI-generated website.</strong> All content — including market summaries,
        company profiles, ratios, news snippets and educational material — is produced or assisted by artificial
        intelligence and is provided <strong>for educational and informational purposes only</strong>.
      </p>

      <h2>Not financial advice</h2>
      <p>
        Nothing on <strong>www.yr.stocketize.com</strong> should be interpreted as investment, trading, tax, legal
        or financial advice, recommendation, solicitation or endorsement of any security, strategy or product.
        Always do your own research and consult a SEBI-registered / qualified financial advisor before making any
        investment decision.
      </p>

      <h2>Data accuracy</h2>
      <ul>
        <li>Market data, prices, ratios and news items may be delayed, incomplete, simulated for demo, or contain errors.</li>
        <li>Real-time and historical figures should always be verified against official exchange sources (NSE, BSE) and the company's own filings before use.</li>
        <li>Past performance is not indicative of future results. Markets involve risk of loss.</li>
      </ul>

      <h2>Revenue disclosure</h2>
      <p>
        Stocketize AI earns revenue through <strong>advertisements, affiliate partnerships, sponsored content and
        referral links</strong>. See our <a href="/affiliate-disclosure">Affiliate Disclosure</a> for details.
      </p>

      <h2>No liability</h2>
      <p>
        By using this site you acknowledge that Stocketize AI, its owner and contributors accept no liability for
        any loss or damage arising from reliance on the information published here.
      </p>
    </LegalLayout>
  );
}
