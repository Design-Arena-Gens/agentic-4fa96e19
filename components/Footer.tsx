import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/40 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-deep-blue">Focus Haven</h3>
          <p className="mt-2 max-w-md text-sm text-night/70">
            Neuro-friendly experiences backed by cognitive science, designed to
            help you reclaim attention and sharpen mental agility.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-night/70">
          <Link href="/about" className="hover:text-calm-teal">
            About
          </Link>
          <Link href="/pricing" className="hover:text-calm-teal">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-calm-teal">
            Terms
          </Link>
        </div>
        <span className="text-xs text-night/60">
          © {new Date().getFullYear()} Focus Haven Labs. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
