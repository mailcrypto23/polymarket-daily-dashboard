/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00E0FF",
        premium: "#8B5CF6",
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
};
