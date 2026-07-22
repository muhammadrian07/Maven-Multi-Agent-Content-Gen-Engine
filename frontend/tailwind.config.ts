import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#f3efe6",
        ink: "#1c2430",
        accent: "#c47b2c",
        sea: "#2f6f6a",
        danger: "#b42318",
        brand: "#2f6bff",
        navy: "#0b1b3a",
        partners: "#ececec",
        // Landing page full-bleed background
        landing: "rgb(56, 38, 106)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "Figtree", "sans-serif"],
        landing: ['"Times New Roman"', "Times", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
