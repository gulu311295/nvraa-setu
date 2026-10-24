import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a1628",
          900: "#0f2744",
          800: "#163a5f",
        },
        saffron: {
          400: "#f4a261",
          500: "#e76f51",
          600: "#d45d3a",
        },
        leaf: {
          500: "#2a9d8f",
          600: "#238276",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
