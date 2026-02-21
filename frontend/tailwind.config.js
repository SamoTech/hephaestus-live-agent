/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // FIX #3: define custom Hephaestus brand colors used in App.jsx
      colors: {
        'hephaestus-dark':   '#020205',
        'hephaestus-panel':  '#0d0d14',
        'hephaestus-orange': '#f97316',
      },
    },
  },
  plugins: [],
};
