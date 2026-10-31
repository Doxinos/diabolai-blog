const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f0ff",
          100: "#e0e1ff",
          200: "#c8c9ff",
          300: "#a9afff",
          400: "#888cff",
          500: "#6a6fff",
          600: "#5056ff",
          700: "#3f46ff",
          800: "#353ccc",
          900: "#3037a3",
          950: "#1b1f5f"
        },
        dark: {
          background: '#27292d'
        },
        gray: colors.neutral,
        westar: '#B8B49F',
        oxford: '#0A2843',
        orange: {
          DEFAULT: '#FF4F30',
          dark: '#E64528',
        },
        'near-black': '#111111',
      },
      fontFamily: {
        display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrains)', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        'lifted': '0 15px 30px rgba(0,0,0,0.2), 10px 10px 15px rgba(0,0,0,0.15), -10px 10px 15px rgba(0,0,0,0.15)',
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      },
      // Light-mode prose text on Westar: body near-black/80, muted near-black/70.
      // The default grays drop below 4.5:1 on #B8B49F. prose-invert (dark) is untouched.
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(17 17 17 / 0.8)",
            "--tw-prose-counters": "rgb(17 17 17 / 0.7)",
            "--tw-prose-bullets": "rgb(17 17 17 / 0.7)",
            "--tw-prose-captions": "rgb(17 17 17 / 0.7)"
          }
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography")]
};
