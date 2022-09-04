/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["Fira Code", "Menlo", "Monaco", "Courier New", "monospace"],
        comicsans: ["Comic Sans MS", "Comic Sans", "cursive", "sans-serif"],
      },
    },
  },
  plugins: [],
};
