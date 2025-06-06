/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          blue: '#003f7f',
          yellow: '#ffd700',
          green: '#228b22'
        }
      },
      fontFamily: {
        'scout': ['Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}