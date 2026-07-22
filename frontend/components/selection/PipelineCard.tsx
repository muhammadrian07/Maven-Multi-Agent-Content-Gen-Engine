import Image from "next/image";
import Link from "next/link";

type PipelineCardProps = {
  title: string;
  iconSrc: string;
  href: string;
  bullets: readonly string[];
};

/** Single pipeline choice card on the user-selection screen. */
export function PipelineCard({ title, iconSrc, href, bullets }: PipelineCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-white/50 bg-white/85 p-5 shadow-[0_12px_40px_rgba(30,60,120,0.12)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_50px_rgba(30,60,120,0.18)] sm:p-6"
    >
      <div className="mb-4 flex justify-center">
        <Image
          src={iconSrc}
          alt=""
          width={64}
          height={64}
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"
        />
      </div>

      <h2 className="text-center text-lg font-semibold text-black sm:text-xl">
        {title}
      </h2>

      <ul className="mt-4 flex-1 space-y-2">
        {bullets.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-snug text-black/75 sm:text-[15px]"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <span className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#2557e0]">
        Select
      </span>
    </Link>
  );
}
