/** Line-art hero illustration approximating the reference lab scientist scene. */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-lg"
      aria-hidden
    >
      {/* Soft background blobs */}
      <circle cx="390" cy="90" r="70" fill="#ffffff" opacity="0.12" />
      <circle cx="120" cy="320" r="90" fill="#ffffff" opacity="0.08" />
      <circle cx="430" cy="200" r="42" fill="#FF6B5B" opacity="0.9" />
      <circle
        cx="430"
        cy="200"
        r="58"
        stroke="url(#ring)"
        strokeWidth="10"
        fill="none"
        opacity="0.85"
      />

      {/* Monitor */}
      <rect x="150" y="70" width="220" height="150" rx="8" stroke="#fff" strokeWidth="2.2" />
      <rect x="165" y="88" width="90" height="70" rx="4" stroke="#fff" strokeWidth="1.6" />
      <path d="M180 145h60M180 132h40M180 119h50" stroke="#fff" strokeWidth="1.4" />
      <circle cx="300" cy="120" r="28" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M288 120c4-10 20-10 24 0-4 10-20 10-24 0Z"
        stroke="#fff"
        strokeWidth="1.4"
      />
      <path d="M292 108l8 8 12-14" stroke="#fff" strokeWidth="1.4" />
      <rect x="230" y="175" width="70" height="28" rx="3" stroke="#fff" strokeWidth="1.4" />
      <path d="M240 185h50M240 193h35" stroke="#fff" strokeWidth="1.2" />

      {/* Scientist */}
      <circle cx="250" cy="250" r="22" stroke="#fff" strokeWidth="2" />
      <path d="M236 248h8M256 248h8" stroke="#fff" strokeWidth="1.5" />
      <path d="M242 258c5 4 11 4 16 0" stroke="#fff" strokeWidth="1.5" />
      <path
        d="M220 290c8-22 52-22 60 0v70H220V290Z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path d="M220 310h60" stroke="#fff" strokeWidth="1.4" />
      <path d="M200 300c20 8 40 10 70-2" stroke="#fff" strokeWidth="2" />
      <path d="M185 295h20l8 40h-28l0-40Z" stroke="#fff" strokeWidth="1.8" />

      {/* Lab glassware */}
      <path
        d="M70 300h40l-6 70H76l-6-70Z"
        stroke="#fff"
        strokeWidth="1.8"
      />
      <path d="M78 300v-18h24v18" stroke="#fff" strokeWidth="1.8" />
      <path
        d="M130 310c0-20 36-20 36 0v60H130v-60Z"
        stroke="#fff"
        strokeWidth="1.8"
      />
      <ellipse cx="148" cy="310" rx="18" ry="6" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M400 310c12-30 48-28 48 8v52H400v-60Z"
        stroke="#fff"
        strokeWidth="1.8"
      />
      <path d="M455 300h30v70h-18l-12-70Z" stroke="#fff" strokeWidth="1.8" />

      <defs>
        <linearGradient id="ring" x1="370" y1="140" x2="490" y2="260">
          <stop stopColor="#7B6CFF" />
          <stop offset="1" stopColor="#2F6BFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
