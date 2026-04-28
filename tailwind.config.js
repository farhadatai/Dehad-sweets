
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      colors: {
        background: '#000000',
        card: '#1a1a1a',
        gold: '#D4AF37',
        'off-white': '#F5F5DC',
        'dark-brown': '#3E2723',
        'input-bg': '#0a0a0a',
      },
    },
  },
  plugins: [],
};
