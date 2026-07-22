const PARTNERS = ["Stripe", "Google", "Deloitte", "Accenture", "Samsung"];

export function Partners() {
  return (
    <section id="partners" className="w-full bg-partners py-10">
      <p className="mb-6 text-center text-[14px] font-normal leading-normal tracking-wide text-black/45">
        Partners
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
        {PARTNERS.map((name) => (
          <span
            key={name}
            className="text-[18px] font-normal leading-normal tracking-tight text-black/35"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
