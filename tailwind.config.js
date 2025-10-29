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
        gray: colors.neutral
      },
      fontFamily: {
        // to change, update font in _document.js
        sans: ["var(--font-roboto)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-poppins)", ...defaultTheme.fontFamily.serif],
        stock: [defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        'lifted': '0 15px 30px rgba(0,0,0,0.2), 10px 10px 15px rgba(0,0,0,0.15), -10px 10px 15px rgba(0,0,0,0.15)',
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography")]
};
