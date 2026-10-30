import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#FAF7F5",
        lime: "#CCFF00",
        ink: "#0A0A0A",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        "brutal-sm": "3px 3px 0 #0A0A0A",
        brutal: "6px 6px 0 #0A0A0A",
        "brutal-lg": "10px 10px 0 #0A0A0A",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
