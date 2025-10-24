import Link from "next/link";

const pillars = [
  {
    title: "Science-first rituals",
    description:
      "We translate peer-reviewed research into friendly protocols. Meditation priming, rhythmic focus, perceptual drills — all layered with behavioural science.",
  },
  {
    title: "Compassionate accountability",
    description:
      "Habits break when shame enters the room. We replace shame with celebration, reflection, and future-self storytelling.",
  },
  {
    title: "Calm craftsmanship",
    description:
      "We sweat typography, color ratios, and motion curves to keep cortisol down. A focus tool should calm you by default.",
  },
];

const founders = [
  {
    name: "Elena Kaur",
    role: "Neuroscience & Ritual Design",
    bio: "Neuropsychologist and meditation teacher. Formerly led focus labs at The Attention Institute.",
  },
  {
    name: "Maxwell Storm",
    role: "Experience Strategy",
    bio: "Product strategist who rebuilt his attention span after burnout. Previously at mindful productivity startup DeepDive.",
  },
  {
    name: "Simi Obiora",
    role: "Engineering & Biofeedback",
    bio: "Full-stack engineer and wearable tinkerer. Embeds physiological insight into each interaction.",
  },
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="mx-auto max-w-4xl text-center">
        <span className="badge bg-soft-rose/40 text-deep-blue">About Focus Haven</span>
        <h1 className="mt-6 text-4xl font-semibold text-deep-blue relaxed-heading">
          We rebuild attention for the humans who refuse to settle.
        </h1>
        <p className="mt-4 text-lg text-night/70">
          Focus Haven is a small studio of neuroscientists, meditation guides, and designers who believe
          attention is a muscle. We built a home for those who crave more presence, more sharpness, and
          more intentional days.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-3xl bg-white/80 p-8 text-left shadow-xl">
            <h3 className="text-xl font-semibold text-deep-blue">{pillar.title}</h3>
            <p className="mt-3 text-sm text-night/60">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-white/75 p-10 shadow-xl">
        <h2 className="text-3xl font-semibold text-deep-blue">Meet the minds behind the rituals</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {founders.map((founder) => (
            <div key={founder.name} className="rounded-3xl bg-white/80 p-6 shadow">
              <h3 className="text-lg font-semibold text-deep-blue">{founder.name}</h3>
              <p className="text-sm text-calm-teal">{founder.role}</p>
              <p className="mt-4 text-sm text-night/60">{founder.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl bg-gradient-to-br from-calm-teal/15 via-white to-soft-rose/30 p-10">
          <h3 className="text-2xl font-semibold text-deep-blue">Our manifesto</h3>
          <ul className="mt-6 space-y-3 text-sm text-night/65">
            <li>• Focus is not force — it is safety, curiosity, and rhythm.</li>
            <li>• Play beats punishment. Wonder beats willpower.</li>
            <li>• Calm technology should feel like a deep breath, not another dashboard.</li>
            <li>• Every brain is welcomed. Neurodiversity informs our defaults.</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-white/80 p-10 shadow-xl">
          <h3 className="text-2xl font-semibold text-deep-blue">Roadmap highlights</h3>
          <ul className="mt-6 space-y-4 text-sm text-night/65">
            <li>
              <span className="font-semibold text-deep-blue">Biofeedback loops</span>
              <p>Sync Apple Watch or Oura data to adapt difficulty in real-time.</p>
            </li>
            <li>
              <span className="font-semibold text-deep-blue">Soundscape composer</span>
              <p>Generate focus-friendly ambient mixes with heart-rate coherence.</p>
            </li>
            <li>
              <span className="font-semibold text-deep-blue">Community sprints</span>
              <p>7-day group rituals to rewire habits in good company.</p>
            </li>
          </ul>
          <Link href="/" className="btn btn-primary mt-8 inline-flex">
            Join the beta list
          </Link>
        </div>
      </div>
    </div>
  );
}
