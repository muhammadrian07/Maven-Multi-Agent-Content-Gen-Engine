import Link from "next/link";
import { GetStartedButton } from "@/components/landing/GetStartedButton";

const NAV = [
  { label: "Products", href: "#how-it-works" },
  { label: "Solutions", href: "#how-it-works" },
  { label: "Team", href: "#team" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Blog", href: "#contact" },
];

export function LandingHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
      <Link
        href="/"
        className="text-[16px] font-normal leading-normal text-white"
        aria-label="maven.ai home"
      >
        maven.ai
      </Link>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
        {NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[16px] font-normal leading-normal text-white/90 transition hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden text-[16px] font-normal leading-normal text-white/90 transition hover:text-white sm:inline"
        >
          Login
        </Link>
        <GetStartedButton />
      </div>
    </header>
  );
}
