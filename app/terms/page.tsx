const sections = [
  {
    title: "1. Acceptance",
    copy:
      "By accessing Focus Haven you agree to these Terms and our Privacy guidelines. We keep things human, compassionate, and transparent.",
  },
  {
    title: "2. Service",
    copy:
      "Focus Haven provides focus and cognition training experiences. We may update rituals, add new experiences, or pause features to improve quality.",
  },
  {
    title: "3. Accounts",
    copy:
      "Optional accounts may be offered for syncing data. Keep your credentials safe. You are responsible for any activity tied to your login.",
  },
  {
    title: "4. Data",
    copy:
      "We store only the minimum data needed to track your rituals. Metrics are anonymised and never sold. You can request deletion at any time.",
  },
  {
    title: "5. Conduct",
    copy:
      "Do not misuse the platform. No scraping, reverse engineering, or attempting to harm the experience for others.",
  },
  {
    title: "6. Disclaimer",
    copy:
      "Focus Haven is not medical advice. Consult professionals before beginning new mental health or wellness routines.",
  },
  {
    title: "7. Liability",
    copy:
      "We make no guarantees regarding results. We are not liable for indirect or consequential damages arising from use.",
  },
  {
    title: "8. Contact",
    copy:
      "Need help? Email care@focushaven.app. We'll respond within 48 hours.",
  },
];

export default function TermsPage() {
  return (
    <div className="section">
      <div className="mx-auto max-w-3xl">
        <span className="badge bg-calm-teal/20 text-calm-teal">Terms & Conditions</span>
        <h1 className="mt-6 text-4xl font-semibold text-deep-blue relaxed-heading">
          Staying focused comes with shared responsibilities.
        </h1>
        <p className="mt-4 text-lg text-night/70">
          We designed Focus Haven to be a safe, generous space for cognitive training. Please read our
          terms to understand yours and our commitments.
        </p>

        <div className="mt-12 space-y-6 text-sm text-night/65">
          {sections.map((section) => (
            <div key={section.title} className="rounded-3xl bg-white/80 p-6 shadow">
              <h2 className="text-lg font-semibold text-deep-blue">{section.title}</h2>
              <p className="mt-2">{section.copy}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-night/50">
          Updated {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.
        </p>
      </div>
    </div>
  );
}
