
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
        // Heritage palette (public redesign)
        parchment: '#F7F1E3',
        cream: '#FBF7EE',
        sand: '#EADFC8',
        forest: '#1F3D2B',
        'forest-deep': '#16301F',
        burgundy: '#6E1F2A',
        saffron: '#C89B3C',
        'saffron-soft': '#E4C878',
        charcoal: '#26221C',
        'char-soft': '#5A5245',
      },
    },
  },
  plugins: [],
};
