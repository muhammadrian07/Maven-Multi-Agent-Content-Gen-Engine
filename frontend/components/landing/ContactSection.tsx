"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function ContactIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-md"
      aria-hidden
    >
      <rect x="90" y="160" width="180" height="110" rx="8" stroke="#fff" strokeWidth="2" />
      <path d="M90 190h180" stroke="#fff" strokeWidth="1.5" />
      <circle cx="200" cy="110" r="28" stroke="#fff" strokeWidth="2" />
      <path
        d="M160 220c10-28 70-28 80 0v50H160v-50Z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path d="M140 200c20 12 90 14 120 0" stroke="#fff" strokeWidth="2" />
      <rect x="300" y="70" width="54" height="40" rx="8" stroke="#fff" strokeWidth="1.8" />
      <path d="M318 90l8 8 14-16" stroke="#fff" strokeWidth="1.8" />
      <rect x="310" y="140" width="70" height="48" rx="8" stroke="#fff" strokeWidth="1.8" />
      <circle cx="328" cy="158" r="6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="348" cy="158" r="6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="368" cy="158" r="6" stroke="#fff" strokeWidth="1.5" />
      <path d="M70 80h40M70 92h28" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export function ContactSection() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  return (
    <section id="contact" className="w-full bg-navy">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex justify-center lg:justify-start">
          <ContactIllustration />
        </div>

        <div>
          <h2 className="text-[32px] font-normal leading-normal text-white sm:text-[36px]">
            Contact us
          </h2>
          <p className="mt-3 max-w-md text-[16px] font-normal leading-normal text-white/70">
            Tell us a little about your team and we&apos;ll help you get started
            with maven.ai.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              // Capture intent then continue into auth flow.
              void name;
              void email;
              void company;
              router.push("/signup");
            }}
          >
            <label className="block">
              <span className="sr-only">Name</span>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-[#1a2b4d] px-4 text-[16px] font-normal leading-normal text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-brand"
              />
            </label>
            <label className="block">
              <span className="sr-only">Business email</span>
              <input
                type="email"
                name="email"
                placeholder="Business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-[#1a2b4d] px-4 text-[16px] font-normal leading-normal text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-brand"
              />
            </label>
            <label className="block">
              <span className="sr-only">Company</span>
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-[#1a2b4d] px-4 text-[16px] font-normal leading-normal text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-brand"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-[16px] font-normal leading-normal text-white transition hover:bg-[#2557e0] sm:w-auto sm:px-10"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
