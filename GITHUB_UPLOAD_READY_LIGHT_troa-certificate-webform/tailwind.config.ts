import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        certificate: ["Gungsuh", "궁서", "Batang", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
