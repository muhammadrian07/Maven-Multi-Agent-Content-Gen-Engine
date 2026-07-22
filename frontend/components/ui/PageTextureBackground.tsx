import Image from "next/image";

/**
 * Shared soft wave photo used on landing and auth pages.
 * Uses a real <Image> layer so the asset always paints (CSS-only bg can look “missing”
 * when overlaid with the same light-blue wash as the photo itself).
 */
export const PAGE_TEXTURE_SRC = "/assets/pawel-czerwinski-9qfTn6zW7bQ-unsplash.jpg";
export const PAGE_TEXTURE_FALLBACK = "#E8F0FC";

type PageTextureBackgroundProps = {
  /** Auth: stronger soft wash for form contrast. Landing: minimal wash so waves stay visible. */
  intensity?: "landing" | "auth";
};

export function PageTextureBackground({
  intensity = "landing",
}: PageTextureBackgroundProps) {
  const overlayClass =
    intensity === "auth"
      ? "bg-white/45"
      : "bg-white/15";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: PAGE_TEXTURE_FALLBACK }}
    >
      <Image
        src={PAGE_TEXTURE_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
    </div>
  );
}
