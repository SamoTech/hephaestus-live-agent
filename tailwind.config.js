/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hephaestus-orange': '#ea580c',
        'hephaestus-dark': '#020205',
        'hephaestus-panel': '#0a0a12',
      },
    },
  },
  plugins: [],
}