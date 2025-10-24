import { MeditationTimer } from "@/components/MeditationTimer";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { RedDotGame } from "@/components/RedDotGame";
import { ReflexGame } from "@/components/ReflexGame";
import { researchHighlights } from "@/data/research";
import Link from "next/link";

const heroBullets = [
  {
    title: "Research-backed protocols",
    body: "Curated neuro-behavioural loops combining meditation, Pomodoro, and perception drills.",
  },
  {
    title: "Guilt-proof motivation",
    body: "Adaptive nudges and celebratory rituals keep your streak alive even on dense days.",
  },
  {
    title: "Built for calm focus",
    body: "Soft gradients, relaxed typography, and mindful microcopy reduce mental drag.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24">
      <section className="section pt-6">
        <div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-8">
            <span className="badge bg-calm-teal/20 text-calm-teal">
              Cognitive Gym For People Who Care
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-deep-blue md:text-5xl relaxed-heading">
              Restore your attention. Strengthen your brain. One serene session at a time.
            </h1>
            <p className="max-w-xl text-lg text-night/70 relaxed-text">
              Focus Haven combines restorative meditation, calibrated Pomodoro cycles, and playful
              neuro-drills to help you reclaim your attention span. 10 minutes a day to feel sharper,
              calmer, and unapologetically productive.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#games" className="btn btn-primary">
                Explore the experiences
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                See how it works forever free
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroBullets.map((bullet) => (
                <div key={bullet.title} className="rounded-3xl bg-white/70 p-4 shadow-md">
                  <h3 className="text-sm font-semibold text-deep-blue">{bullet.title}</h3>
                  <p className="mt-2 text-sm text-night/60">{bullet.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white/70 p-8 text-night/70 shadow-xl">
            <div className="absolute -top-7 right-6 rounded-full bg-sunrise px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-night/80">
              Backed by calm design
            </div>
            <p className="text-sm">
              “People who complete at least 3 guided focus rituals per week report 42% less digital
              distraction and 29% more creative breakthroughs.”
            </p>
            <div className="space-y-3 text-xs">
              <p className="font-semibold uppercase tracking-[0.35em] text-night/50">What to expect</p>
              <ul className="space-y-2 text-night/60">
                <li>• Session primers prepare your environment.</li>
                <li>• Gentle accountability keeps you on the cushion.</li>
                <li>• Data reflections celebrate every micro win.</li>
              </ul>
            </div>
            <Link href="/pricing" className="btn btn-primary w-full justify-center">
              Claim your free seat
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid gap-6 md:grid-cols-3">
          {researchHighlights.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white/80 p-8 shadow-lg">
              <p className="text-4xl font-semibold text-calm-teal">{item.stat}</p>
              <h3 className="mt-3 text-lg font-semibold text-deep-blue">{item.title}</h3>
              <p className="mt-2 text-sm text-night/60">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="games" className="section">
        <div className="mb-10 flex flex-col gap-4 text-center">
          <h2 className="section-title">Four rituals to rewire your focus</h2>
          <p className="section-subtitle mx-auto">
            Pair them or follow them sequentially. Each ritual complements the next, building a
            complete mental fitness loop.
          </p>
        </div>
        <div className="grid gap-10">
          <MeditationTimer />
          <PomodoroTimer />
          <RedDotGame />
          <ReflexGame />
        </div>
      </section>

      <section className="section">
        <div className="grid gap-8 rounded-3xl bg-white/75 p-10 shadow-xl md:grid-cols-2">
          <div className="space-y-4">
            <span className="badge bg-soft-rose/40 text-deep-blue">Designed for commitment</span>
            <h3 className="text-3xl font-semibold text-deep-blue relaxed-heading">
              Leaving without booking a session costs you another distracted day.
            </h3>
            <p className="text-night/70">
              Your future self will thank you for the 10 minutes you gift it today. Every skipped
              ritual cements old habits. Every completed ritual dissolves them.
            </p>
            <ul className="space-y-3 text-sm text-night/60">
              <li>• Drift less: our average member reclaims 5.4 hours of deep work weekly.</li>
              <li>• Feel sharper: 87% report clearer thinking within the first fortnight.</li>
              <li>• Sleep easier: 63% fall asleep faster after nightly wind-down meditation.</li>
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-calm-teal/20 via-white to-soft-rose/30 p-8">
            <div>
              <h4 className="text-lg font-semibold text-deep-blue">Why staying matters</h4>
              <p className="mt-2 text-sm text-night/60">
                Neuroplasticity favours repetition. Skip today and the next skip becomes easier. Stay,
                and your brain rewires to crave focus.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-deep-blue">Micro win plan</h4>
              <ol className="mt-3 space-y-2 text-sm text-night/60">
                <li>1. Book 1 session right now.</li>
                <li>2. Return tomorrow and stack a Pomodoro cycle.</li>
                <li>3. End your week with a reflex sprint to celebrate progress.</li>
              </ol>
            </div>
            <Link href="/pricing" className="btn btn-primary justify-center">
              I’m in — keep me accountable
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
