import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "mist": "#E8F1F5",
        "deep-blue": "#1E3D58",
        "calm-teal": "#4A8C8C",
        "soft-rose": "#F7E9E3",
        "sunrise": "#F9C784",
        "night": "#102027"
      },
      fontFamily: {
        display: ["'DM Sans'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
        relaxed: ["'Quicksand'", "sans-serif"],
      },
      boxShadow: {
        float: "0 18px 40px rgba(16, 32, 39, 0.15)",
      },
      animation: {
        pulseSlow: "pulse 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        }
      }
    },
  },
  plugins: [],
};

export default config;
