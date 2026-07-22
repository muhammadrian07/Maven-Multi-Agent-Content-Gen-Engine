import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Cookies", href: "#" },
  { label: "Methodology", href: "#how-it-works" },
  { label: "Term", href: "#" },
  { label: "Partners", href: "#partners" },
  { label: "Blog", href: "#contact" },
];

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-black/5 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="text-[16px] font-normal leading-normal text-black">
            maven.ai
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {FOOTER_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[16px] font-normal leading-normal text-black/70 transition hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-black/5 pt-6 text-[14px] font-normal leading-normal text-black/45 sm:flex-row">
          <p>© {new Date().getFullYear()} maven.ai. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-black">
              Privacy policy
            </a>
            <a href="#" className="hover:text-black">
              Terms and conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
