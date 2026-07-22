const PARTNERS = ["Stripe", "Google", "Deloitte", "Accenture", "Samsung"];

/**
 * Soft light-blue band between purple and white sections.
 * Tint sits between landing purple and white so the transition feels natural.
 */
export function Partners() {
  return (
    <section
      id="partners"
      className="w-full border-y border-[rgb(56,38,106)]/8 bg-[rgb(232,240,252)] py-10"
    >
      <p className="mb-6 text-center text-[14px] font-normal leading-normal tracking-wide text-[rgb(56,38,106)]/45">
        Partners
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
        {PARTNERS.map((name) => (
          <span
            key={name}
            className="text-[18px] font-normal leading-normal tracking-tight text-[rgb(56,38,106)]/40"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
