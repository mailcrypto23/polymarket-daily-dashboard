/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        premiumDark: "#0b1220",
        premiumCard: "#131b2e",
        premiumText: "#e2e8f0",
      }
    },
  },
  plugins: [],
};
