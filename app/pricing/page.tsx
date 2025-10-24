import Link from "next/link";

const benefits = [
  "Unlimited meditation, Pomodoro, and cognition drills",
  "Daily cycle tracking and celebratory nudges",
  "Scientific micro-lessons sourced from peer-reviewed journals",
  "Roadmap access — vote for the next brain training game",
  "Zero ads, zero upsells. Focus is sacred.",
];

const guarantee = [
  "If you don't feel calmer in 7 days, ping us — we'll design a custom ritual for you.",
  "If you skip three sessions, we'll send compassionate nudges and reboot your rhythm.",
  "If your streak hits 21 days, you unlock early access to new labs automatically.",
];

export default function PricingPage() {
  return (
    <div className="section">
      <div className="mx-auto max-w-4xl text-center">
        <span className="badge bg-calm-teal/20 text-calm-teal">Pricing</span>
        <h1 className="mt-6 text-4xl font-semibold text-deep-blue relaxed-heading">
          Keep your brain sharp for free, forever.
        </h1>
        <p className="mt-4 text-lg text-night/70">
          We believe focused humans change the world. That is why Focus Haven is a gift — not a trap.
          No hidden tiers, no credit cards.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl bg-white/80 p-10 shadow-xl">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-deep-blue">Free Ritual Pass</h2>
              <p className="mt-2 text-night/60">For focused humans ready to reclaim their hours.</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-semibold text-calm-teal">$0</p>
              <p className="text-sm text-night/50">forever</p>
            </div>
          </div>
          <ul className="mt-8 space-y-4 text-left text-sm text-night/70">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-calm-teal" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <Link href="/" className="btn btn-primary mt-10 w-full justify-center">
            Enter the focus studio
          </Link>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-calm-teal/15 via-white to-soft-rose/40 p-10">
          <h3 className="text-2xl font-semibold text-deep-blue">We invest in your persistence</h3>
          <p className="text-night/70">
            Focus guilt is real. That is why we designed rituals that make leaving harder than
            staying. No more tabs filled with wishful thinking.
          </p>
          <div className="rounded-2xl bg-white/70 p-6 text-left text-sm text-night/65">
            <h4 className="text-lg font-semibold text-deep-blue">Accountability pact</h4>
            <p className="mt-2">
              You commit to showing up. We commit to removing friction and celebrating each return.
            </p>
            <ul className="mt-4 space-y-3">
              {guarantee.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sunrise" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/70 p-6 text-left text-sm text-night/65">
            <h4 className="text-lg font-semibold text-deep-blue">Why free?</h4>
            <p className="mt-2">
              Focus is a public good. Our future revenue comes from optional corporate sponsorships of
              community sprints, not from you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
