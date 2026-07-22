import Link from "next/link";

type GetStartedButtonProps = {
  className?: string;
  fullWidth?: boolean;
};

/** Primary CTA used across the landing page — routes into auth. */
export function GetStartedButton({
  className = "",
  fullWidth = false,
}: GetStartedButtonProps) {
  return (
    <Link
      href="/signup"
      className={`inline-flex items-center justify-center rounded-full bg-brand px-7 py-2.5 text-[16px] font-normal leading-normal text-white transition hover:bg-[#2557e0] ${fullWidth ? "w-full" : ""} ${className}`}
    >
      Get Started
    </Link>
  );
}
