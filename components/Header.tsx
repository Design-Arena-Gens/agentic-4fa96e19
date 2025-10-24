"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/#games", label: "Experiences" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 glass-panel backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-deep-blue">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-calm-teal/20">
            <span className="h-3 w-3 animate-ping rounded-full bg-calm-teal/80" />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-calm-teal" />
          </span>
          <span className="text-xl font-semibold relaxed-heading">Focus Haven</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-deep-blue md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "transition-colors hover:text-calm-teal",
                pathname === link.href && "text-calm-teal"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/pricing"
          className="btn btn-primary hidden md:inline-flex"
        >
          Start Training
        </Link>
      </div>
    </header>
  );
}
