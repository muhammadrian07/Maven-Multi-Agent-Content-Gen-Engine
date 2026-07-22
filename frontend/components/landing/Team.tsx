const TEAM = [
  { name: "Usama Ahmad", role: "Lead Instructor", initials: "UA" },
  {
    name: "Muhammad Rian",
    role: "Lead Full Stack AI Engineer",
    initials: "MR",
  },
  { name: "Ali", role: "System Architecture", initials: "A" },
  { name: "Hasnain", role: "xyz", initials: "H" },
  { name: "Tayyab", role: "xyz", initials: "T" },
] as const;

/**
 * Team band — name + small role under each member.
 * Initials avatars keep the row polished without photo assets.
 */
export function Team() {
  return (
    <section
      id="team"
      className="w-full border-y border-black/5 bg-white/30 py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <h2 className="mb-10 text-center text-[28px] font-normal leading-normal text-black sm:mb-12 sm:text-[32px]">
          Team
        </h2>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {TEAM.map((member) => (
            <li
              key={member.name}
              className="flex flex-col items-center text-center"
            >
              <span
                aria-hidden
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-landing text-[15px] font-normal tracking-wide text-white shadow-sm"
              >
                {member.initials}
              </span>
              <p className="text-[17px] font-normal leading-normal text-black">
                {member.name}
              </p>
              <p className="mt-1 max-w-[11rem] text-[13px] font-normal leading-snug text-black/55">
                {member.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
