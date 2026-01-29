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
        primary: {
          DEFAULT: "#D4AF37",
          dark: "#B8941F",
        },
        dark: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          lighter: "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
