const MILESTONES = [
  { title: "Maven Builder", date: "May 2019", align: "top" as const },
  { title: "Maven Analyst", date: "September 2019", align: "bottom" as const },
  { title: "Maven Architect", date: "December 2019", align: "top" as const },
];

/** White roadmap band — text uses landing purple for contrast on rgb(255,255,255). */
export function Roadmap() {
  return (
    <section id="roadmap" className="w-full bg-white text-[rgb(56,38,106)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
        <h2 className="text-center text-[32px] font-normal leading-normal text-[rgb(56,38,106)] sm:text-[36px]">
          Product development roadmap
        </h2>

        <div className="relative mt-20">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-[rgb(56,38,106)]/35"
          />

          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-4">
            {MILESTONES.map((item, index) => (
              <li key={item.title} className="relative flex flex-col items-center">
                {item.align === "top" ? (
                  <div className="mb-6 min-h-[4.5rem] text-center">
                    <p className="text-[16px] font-normal leading-normal text-[rgb(56,38,106)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[14px] font-normal leading-normal text-[rgb(56,38,106)]/60">
                      {item.date}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 hidden min-h-[4.5rem] sm:block" />
                )}

                <span
                  className={`relative z-10 block h-4 w-4 rounded-full border-2 border-brand bg-white ${
                    index === 1 ? "h-5 w-5 bg-brand" : ""
                  }`}
                />

                {item.align === "bottom" ? (
                  <div className="mt-6 text-center">
                    <p className="text-[16px] font-normal leading-normal text-[rgb(56,38,106)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[14px] font-normal leading-normal text-[rgb(56,38,106)]/60">
                      {item.date}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 hidden min-h-[4.5rem] sm:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
